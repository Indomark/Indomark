document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');
  const password = document.getElementById('password');
  const toggle = document.getElementById('togglePassword');
  const message = document.getElementById('formMessage');
  const loginLink = document.getElementById('loginLink');
  const showMessage = (text, ok = true) => { if (message) { message.textContent = text; message.style.color = ok ? '#69e7aa' : '#ff8297'; } };
  toggle?.addEventListener('click', () => { const visible = password.type === 'text'; password.type = visible ? 'password' : 'text'; toggle.setAttribute('aria-label', visible ? 'Show password' : 'Hide password'); toggle.setAttribute('aria-pressed', String(!visible)); toggle.textContent = visible ? '◉' : '◌'; });
  form?.addEventListener('submit', async (event) => {
    event.preventDefault(); const data = new FormData(form);
    const fullName = String(data.get('fullName') || '').trim(); const email = String(data.get('email') || '').trim().toLowerCase(); const passwordValue = String(data.get('password') || '');
    if (fullName.length < 2) return showMessage('Enter your full name.', false);
    if (!/^\S+@\S+\.\S+$/.test(email)) return showMessage('Enter a valid email.', false);
    if (passwordValue.length < 8) return showMessage('Password must be at least 8 characters.', false);
    if (!window.IndomarkFirebase?.auth) return showMessage('Firebase is not available. Refresh and try again.', false);
    const button = form.querySelector('button[type="submit"]'); if (button) button.disabled = true; showMessage('Creating your account…', true);
    try {
      const credential = await window.IndomarkFirebase.auth.createUserWithEmailAndPassword(email, passwordValue); const user = credential.user; await user.updateProfile({ displayName: fullName });
      const profile = { uid: user.uid, fullName, email: user.email || email, createdAt: new Date().toISOString() };
      try { await window.IndomarkFirebase.database.ref(`users/${user.uid}/profile`).set(profile); } catch (dbError) { console.warn('Profile database write failed:', dbError); }
      localStorage.setItem('indomark.user', JSON.stringify(profile)); localStorage.setItem('indomark.session', 'signed-in'); localStorage.setItem('indomark.loginEmail', user.email || email);
      showMessage('Account created successfully.', true); window.setTimeout(() => { window.location.href = './home.html'; }, 400);
    } catch (error) {
      const code = error?.code || ''; const text = code === 'auth/email-already-in-use' ? 'An account with this email already exists.' : code === 'auth/weak-password' ? 'Password must be at least 6 characters.' : error?.message || 'Account creation failed.'; showMessage(text, false); if (button) button.disabled = false;
    }
  });
  loginLink?.addEventListener('click', (event) => { event.preventDefault(); window.location.assign('./login.html'); });
});
