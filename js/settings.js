(function(){
  const KEY='indospeed_settings_theme';
  const ACCOUNT_STATUS_KEY='indospeed_account_status_v1';
  const GLOBAL_CSS='../css/global-theme.css?v=2';
  const ALLOWED_WHEN_INACTIVE=new Set(['profile.html','login.html','signup.html','index.html','']);

  function ensureGlobalCss(){
    if(document.querySelector('link[data-indospeed-theme]')) return;
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href=GLOBAL_CSS;
    link.dataset.indospeedTheme='true';
    document.head.appendChild(link);
  }

  function applyTheme(theme){
    ensureGlobalCss();
    const root=document.documentElement;
    root.dataset.theme=theme==='light'?'light':'dark';
    root.style.colorScheme=theme==='light'?'light':'dark';
  }

  function getAccountStatus(){
    return localStorage.getItem(ACCOUNT_STATUS_KEY)==='inactive'?'inactive':'active';
  }

  function currentPage(){
    return (location.pathname.split('/').pop()||'').toLowerCase();
  }

  function isAllowedPage(){
    return ALLOWED_WHEN_INACTIVE.has(currentPage());
  }

  function installInactiveStyles(){
    if(document.getElementById('accountInactiveStyles')) return;
    const style=document.createElement('style');
    style.id='accountInactiveStyles';
    style.textContent=`#accountInactiveOverlay{position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;padding:20px;background:rgba(4,7,17,.82);backdrop-filter:blur(7px);font-family:Inter,Arial,Helvetica,sans-serif}#accountInactiveOverlay .account-inactive-box{width:min(420px,100%);padding:24px;border:1px solid var(--line,#273246);border-radius:20px;background:var(--panel,#0b1220);color:var(--text,#fff);text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.45)}#accountInactiveOverlay .account-inactive-icon{font-size:28px;margin-bottom:8px}#accountInactiveOverlay h2{margin:0;font-size:20px}#accountInactiveOverlay p{margin:9px 0 16px;color:var(--muted,#aeb9c8);font-size:12px;line-height:1.5}#accountInactiveOverlay .account-inactive-link{display:inline-flex;align-items:center;justify-content:center;min-height:40px;padding:0 16px;border-radius:10px;background:#5f35e8;color:#fff;text-decoration:none;font-size:11px;font-weight:900}html.account-inactive body>*:not(#accountInactiveOverlay){filter:grayscale(.25);}`;
    document.head.appendChild(style);
  }

  function removeInactiveLock(){
    document.documentElement.classList.remove('account-inactive');
    document.getElementById('accountInactiveOverlay')?.remove();
  }

  function lockInactivePage(){
    if(isAllowedPage()){removeInactiveLock();return;}
    installInactiveStyles();
    document.documentElement.classList.add('account-inactive');
    if(document.getElementById('accountInactiveOverlay')) return;

    const overlay=document.createElement('div');
    overlay.id='accountInactiveOverlay';
    overlay.setAttribute('role','alertdialog');
    overlay.setAttribute('aria-modal','true');
    overlay.innerHTML='<div class="account-inactive-box"><div class="account-inactive-icon">⏸</div><h2>Account inactive</h2><p>Your account is currently inactive. App features are unavailable until you activate your account again.</p><a href="profile.html" class="account-inactive-link">Go to Profile</a></div>';
    const mount=()=>{if(!document.body)return false;document.body.appendChild(overlay);return true;};
    if(!mount()) document.addEventListener('DOMContentLoaded',mount,{once:true});
  }

  function updateAccountStatus(status){
    const next=status==='inactive'?'inactive':'active';
    localStorage.setItem(ACCOUNT_STATUS_KEY,next);
    if(next==='inactive') lockInactivePage();
    else removeInactiveLock();
    window.dispatchEvent(new CustomEvent('indospeed-account-status-change',{detail:{status:next}}));
    return next;
  }

  const saved=localStorage.getItem(KEY)||'dark';
  applyTheme(saved);

  window.IndoSpeedSettings={
    getTheme:()=>localStorage.getItem(KEY)||'dark',
    setTheme:(theme)=>{const next=theme==='light'?'light':'dark';localStorage.setItem(KEY,next);applyTheme(next);return next;},
    applyTheme,
    getAccountStatus,
    setAccountStatus:updateAccountStatus,
    isAccountActive:()=>getAccountStatus()==='active'
  };

  const check=()=>{if(getAccountStatus()==='inactive')lockInactivePage();else removeInactiveLock();};
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',check,{once:true});
  else check();
  window.addEventListener('storage',(event)=>{if(event.key===ACCOUNT_STATUS_KEY)check();});
})();
