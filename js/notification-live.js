(function () {
  'use strict';

  const GLOBAL_KEY = 'indomark_notification_global_read';
  const MAX_ITEMS = 100;

  function database() {
    return window.IndomarkFirebase?.database || null;
  }

  function currentUid() {
    return window.IndomarkFirebase?.auth?.currentUser?.uid ||
      (() => { try { return JSON.parse(localStorage.getItem('indomark.user') || 'null')?.id || ''; } catch { return ''; } })();
  }

  function globalReadMap() {
    try { return JSON.parse(localStorage.getItem(GLOBAL_KEY) || '{}') || {}; } catch { return {}; }
  }

  function saveGlobalReadMap(map) {
    localStorage.setItem(GLOBAL_KEY, JSON.stringify(map));
  }

  function normalize(raw, source) {
    const id = String(raw?.id || '').trim();
    if (!id) return null;
    return {
      id,
      type: ['alerts', 'updates', 'system'].includes(raw.type) ? raw.type : 'system',
      title: String(raw.title || 'Notification'),
      text: String(raw.text || ''),
      time: raw.createdAt ? new Date(Number(raw.createdAt)).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }) : String(raw.time || 'Now'),
      createdAt: Number(raw.createdAt || 0),
      unread: source === 'global'
        ? !globalReadMap()[id]
        : raw.read !== true,
      icon: String(raw.icon || (raw.type === 'alerts' ? 'market' : 'announce')),
      source,
      pathId: id
    };
  }

  function watch(callback) {
    const db = database();
    if (!db) return () => {};

    const refs = [];
    const globalRef = db.ref('notifications/global').limitToLast(MAX_ITEMS);
    refs.push(globalRef);
    const uid = currentUid();
    if (uid) refs.push(db.ref(`notifications/users/${uid}`).limitToLast(MAX_ITEMS));

    const snapshots = new Map();
    const render = () => {
      const merged = new Map();
      const globalSnap = snapshots.get('global');
      if (globalSnap) globalSnap.forEach(child => {
        const item = normalize({ id: child.key, ...child.val() }, 'global');
        if (item) merged.set(item.id, item);
      });
      const userSnap = snapshots.get('user');
      if (userSnap) userSnap.forEach(child => {
        const item = normalize({ id: child.key, ...child.val() }, 'user');
        if (item) merged.set(item.id, item);
      });
      callback([...merged.values()].sort((a, b) => b.createdAt - a.createdAt).slice(0, MAX_ITEMS));
    };

    refs.forEach((ref, index) => {
      ref.on('value', snap => {
        snapshots.set(index === 0 ? 'global' : 'user', snap);
        render();
      }, error => console.warn('Notification listener failed:', error));
    });

    return () => refs.forEach(ref => ref.off('value'));
  }

  async function markRead(item) {
    const db = database();
    const uid = currentUid();
    if (!item) return;
    if (item.source === 'global') {
      const map = globalReadMap();
      map[item.id] = Date.now();
      saveGlobalReadMap(map);
      return;
    }
    if (!db || !uid) return;
    await db.ref(`notifications/users/${uid}/${item.id}/read`).set(true);
  }

  async function markAllRead(items) {
    const db = database();
    const uid = currentUid();
    const globals = globalReadMap();
    const updates = {};
    (items || []).forEach(item => {
      if (!item?.id) return;
      if (item.source === 'global') globals[item.id] = Date.now();
      else if (uid) updates[`notifications/users/${uid}/${item.id}/read`] = true;
    });
    saveGlobalReadMap(globals);
    if (db && Object.keys(updates).length) await db.ref().update(updates);
  }

  window.IndomarkNotifications = { watch, markRead, markAllRead };
})();
