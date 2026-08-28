document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const password = document.getElementById('password');
  const toggle = document.getElementById('togglePassword');
  const message = document.getElementById('formMessage');
  const signupLink = document.getElementById('signupLink');

  const showMessage = (text, ok = false) => {
    if (!message) return;
    message.textContent = text;
    message.style.color = ok ? '#69e7aa' : '#ff8297';
  };

  toggle?.addEventListener('click', () => {
    const visible = password.type === 'text';
    password.type = visible ? 'password' : 'text';
    toggle.setAttribute('aria-label', visible ? 'Show password' : 'Hide password');
    toggle.setAttribute('aria-pressed', String(!visible));
    toggle.textContent = visible ? '◉' : '◌';
  });

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const email = String(data.get('email') || '').trim().toLowerCase();
    const passwordValue = String(data.get('password') || '');
    if (!email || !passwordValue) return showMessage('Enter email and password.');
    if (!window.IndoSpeedFirebase?.auth) return showMessage('Firebase is not available. Refresh and try again.');
    const button = form.querySelector('button[type="submit"]');
    if (button) button.disabled = true;
    showMessage('Signing in…', true);
    try {
      const credential = await window.IndoSpeedFirebase.auth.signInWithEmailAndPassword(email, passwordValue);
      const user = credential.user;
      localStorage.setItem('indospeed.session', 'signed-in');
      localStorage.setItem('indospeed.loginEmail', user.email || email);
      localStorage.setItem('indospeed.user', JSON.stringify({ uid: user.uid, fullName: user.displayName || localStorage.getItem('indospeed.pendingName') || 'Investor', email: user.email || email }));
      localStorage.removeItem('indospeed.pendingName');
      window.location.assign('./home.html');
    } catch (error) {
      const code = error?.code || '';
      const text = code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found' ? 'Invalid email or password.' : code === 'auth/too-many-requests' ? 'Too many attempts. Please try again later.' : error?.message || 'Login failed.';
      showMessage(text);
      if (button) button.disabled = false;
    }
  });

  signupLink?.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.assign('./signup.html');
  });
});
