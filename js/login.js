document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const password = document.getElementById('password');
  const toggle = document.getElementById('togglePassword');
  const message = document.getElementById('formMessage');
  const signupLink = document.getElementById('signupLink');
  const loginButton = document.getElementById('loginButton');
  const otpPanel = document.getElementById('otpPanel');
  const otpEmail = document.getElementById('otpEmail');
  const otpInput = document.getElementById('loginOtp');
  const verifyButton = document.getElementById('verifyOtpButton');
  const resendButton = document.getElementById('resendOtpButton');
  let pending = null;
  const showMessage = (text, ok = false) => { if (message) { message.textContent = text; message.style.color = ok ? '#69e7aa' : '#ff8297'; } };
  const api = (path, options = {}) => fetch(path, { ...options, headers: { 'Content-Type': 'application/json', ...(options.headers || {}) } });
  toggle?.addEventListener('click', () => { const visible = password.type === 'text'; password.type = visible ? 'password' : 'text'; toggle.setAttribute('aria-label', visible ? 'Show password' : 'Hide password'); toggle.setAttribute('aria-pressed', String(!visible)); toggle.textContent = visible ? '◉' : '◌'; });

  async function beginLogin() {
    const data = new FormData(form);
    const email = String(data.get('email') || '').trim().toLowerCase();
    const passwordValue = String(data.get('password') || '');
    if (!email || !passwordValue) return showMessage('Enter email and password.');
    if (!window.IndomarkFirebase?.auth) return showMessage('Firebase is not available. Refresh and try again.');
    if (loginButton) loginButton.disabled = true; showMessage('Checking account…', true);
    try {
      const credential = await window.IndomarkFirebase.auth.signInWithEmailAndPassword(email, passwordValue);
      const user = credential.user;
      const response = await api('/api/otp/send', { method: 'POST', body: JSON.stringify({ email: user.email || email, purpose: 'login' }) });
      const result = await response.json();
      if (!response.ok || !result.ok) { try { await window.IndomarkFirebase.auth.signOut(); } catch {} throw new Error(result.error || 'Unable to send login OTP.'); }
      pending = { email: user.email || email, token: result.token };
      if (otpEmail) otpEmail.textContent = pending.email;
      if (otpPanel) otpPanel.hidden = false;
      showMessage('OTP sent. Check your email to finish login.', true);
      otpInput?.focus();
    } catch (error) {
      const code = error?.code || '';
      const text = code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found' ? 'Invalid email or password.' : code === 'auth/too-many-requests' ? 'Too many attempts. Please try again later.' : error?.message || 'Login failed.';
      showMessage(text);
    } finally { if (loginButton) loginButton.disabled = false; }
  }

  form?.addEventListener('submit', async (event) => { event.preventDefault(); await beginLogin(); });

  verifyButton?.addEventListener('click', async () => {
    if (!pending) return showMessage('Please login first.', false);
    const otp = String(otpInput?.value || '').trim();
    if (!/^\d{6}$/.test(otp)) return showMessage('Enter the 6-digit OTP.', false);
    verifyButton.disabled = true; resendButton.disabled = true; showMessage('Verifying OTP…', true);
    try {
      const response = await api('/api/otp/verify', { method: 'POST', body: JSON.stringify({ email: pending.email, purpose: 'login', otp, token: pending.token }) });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || 'OTP verification failed.');
      const user = window.IndomarkFirebase.auth.currentUser;
      if (!user) throw new Error('Login session expired. Please login again.');
      localStorage.setItem('indomark.session', 'signed-in');
      localStorage.setItem('indomark.loginEmail', user.email || pending.email);
      localStorage.setItem('indomark.user', JSON.stringify({ uid: user.uid, fullName: user.displayName || localStorage.getItem('indomark.pendingName') || 'Investor', email: user.email || pending.email }));
      localStorage.removeItem('indomark.pendingName');
      showMessage('Login verified successfully.', true); window.location.assign('./home.html');
    } catch (error) {
      showMessage(error?.message || 'OTP verification failed.', false);
      if (error?.message?.toLowerCase().includes('session')) { try { await window.IndomarkFirebase.auth.signOut(); } catch {} }
    } finally { verifyButton.disabled = false; resendButton.disabled = false; }
  });

  resendButton?.addEventListener('click', async () => { if (!pending) return; resendButton.disabled = true; try { const response = await api('/api/otp/send', { method: 'POST', body: JSON.stringify({ email: pending.email, purpose: 'login' }) }); const result = await response.json(); if (!response.ok || !result.ok) throw new Error(result.error || 'Unable to resend OTP.'); pending.token = result.token; showMessage('New OTP sent to your email.', true); otpInput?.focus(); } catch (error) { showMessage(error?.message || 'Unable to resend OTP.', false); } finally { resendButton.disabled = false; } });
  signupLink?.addEventListener('click', (event) => { event.preventDefault(); window.location.assign('./signup.html'); });
});
