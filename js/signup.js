document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');
  const password = document.getElementById('password');
  const toggle = document.getElementById('togglePassword');
  const message = document.getElementById('formMessage');
  const loginLink = document.getElementById('loginLink');
  const signupButton = document.getElementById('signupButton');
  const otpPanel = document.getElementById('otpPanel');
  const otpEmail = document.getElementById('otpEmail');
  const otpInput = document.getElementById('signupOtp');
  const verifyButton = document.getElementById('verifyOtpButton');
  const resendButton = document.getElementById('resendOtpButton');
  const API_BASE = 'https://indoverification-production.up.railway.app';
  const APP_NAME = 'Indomark';
  const firebaseAuth = window.IndomarkFirebase?.auth;
  let pending = null;

  const showMessage = (text, ok = true) => {
    if (message) { message.textContent = text; message.style.color = ok ? '#69e7aa' : '#ff8297'; }
  };
  const api = (path, options = {}) => fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', 'X-Indo-App-Name': APP_NAME, ...(options.headers || {}) },
  });

  toggle?.addEventListener('click', () => {
    const visible = password.type === 'text'; password.type = visible ? 'password' : 'text';
    toggle.setAttribute('aria-label', visible ? 'Show password' : 'Hide password');
    toggle.setAttribute('aria-pressed', String(!visible)); toggle.textContent = visible ? '◉' : '◌';
  });

  async function sendOtp() {
    const data = new FormData(form);
    const fullName = String(data.get('fullName') || '').trim();
    const email = String(data.get('email') || '').trim().toLowerCase();
    const passwordValue = String(data.get('password') || '');
    if (!firebaseAuth) return showMessage('Firebase Authentication is unavailable.', false);
    if (fullName.length < 2) return showMessage('Enter your full name.', false);
    if (!/^\S+@\S+\.\S+$/.test(email)) return showMessage('Enter a valid email.', false);
    if (passwordValue.length < 5) return showMessage('Password must be at least 5 characters.', false);
    if (signupButton) signupButton.disabled = true;
    showMessage('Sending OTP…', true);
    try {
      const response = await api('/api/auth/signup/request-otp', { method: 'POST', body: JSON.stringify({ name: fullName, email }) });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || 'Unable to send OTP.');
      pending = { fullName, email, passwordValue };
      if (otpEmail) otpEmail.textContent = email;
      if (otpPanel) otpPanel.hidden = false;
      showMessage('OTP sent. Check your email.', true); otpInput?.focus();
    } catch (error) { showMessage(error?.message || 'Unable to send OTP.', false); }
    finally { if (signupButton) signupButton.disabled = false; }
  }

  form?.addEventListener('submit', async (event) => { event.preventDefault(); await sendOtp(); });

  verifyButton?.addEventListener('click', async () => {
    if (!pending) return showMessage('Please request an OTP first.', false);
    const otp = String(otpInput?.value || '').trim();
    if (!/^\d{6}$/.test(otp)) return showMessage('Enter the 6-digit OTP.', false);
    verifyButton.disabled = true; if (resendButton) resendButton.disabled = true; showMessage('Verifying OTP…', true);
    try {
      const response = await api('/api/auth/signup/verify-otp', { method: 'POST', body: JSON.stringify({ name: pending.fullName, email: pending.email, otp }) });
      const result = await response.json();
      if (!response.ok || !result.ok || !result.verified) throw new Error(result.error || 'OTP verification failed.');
      let userCredential;
      try { userCredential = await firebaseAuth.createUserWithEmailAndPassword(pending.email, pending.passwordValue); }
      catch (firebaseError) {
        if (String(firebaseError?.code || '') === 'auth/email-already-in-use') throw new Error('Account already exists in Firebase. Please login.');
        throw new Error(firebaseError?.message || 'Firebase account creation failed.');
      }
      const user = userCredential.user;
      await user.updateProfile({ displayName: pending.fullName });
      const profile = { id: user.uid, fullName: pending.fullName, email: user.email || pending.email, active: true, createdAt: new Date().toISOString() };
      try { if (window.IndomarkFirebase?.database && user.uid) await window.IndomarkFirebase.database.ref(`users/${user.uid}/profile`).set(profile); }
      catch (dbError) { console.warn('Firebase profile write failed:', dbError); }
      localStorage.setItem('indomark.firebaseUser', JSON.stringify(profile)); localStorage.setItem('indomark.session', 'signed-in'); localStorage.setItem('indomark.loginEmail', profile.email); localStorage.removeItem('indomark.pendingName');
      showMessage('Account created successfully.', true); window.setTimeout(() => { window.location.href = './home.html'; }, 400);
    } catch (error) { showMessage(error?.message || 'Account creation failed.', false); }
    finally { verifyButton.disabled = false; if (resendButton) resendButton.disabled = false; }
  });

  resendButton?.addEventListener('click', async () => {
    if (!pending) return; resendButton.disabled = true;
    try {
      const response = await api('/api/auth/resend-otp', { method: 'POST', body: JSON.stringify({ email: pending.email, purpose: 'signup' }) });
      const result = await response.json(); if (!response.ok || !result.ok) throw new Error(result.error || 'Unable to resend OTP.');
      showMessage('New OTP sent to your email.', true); otpInput?.focus();
    } catch (error) { showMessage(error?.message || 'Unable to resend OTP.', false); }
    finally { resendButton.disabled = false; }
  });

  loginLink?.addEventListener('click', (event) => { event.preventDefault(); window.location.assign('./login.html'); });
});
