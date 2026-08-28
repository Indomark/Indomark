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
  let pending = null;
  const showMessage = (text, ok = true) => { if (message) { message.textContent = text; message.style.color = ok ? '#69e7aa' : '#ff8297'; } };
  const api = (path, options = {}) => fetch(path, { ...options, headers: { 'Content-Type': 'application/json', ...(options.headers || {}) } });
  toggle?.addEventListener('click', () => { const visible = password.type === 'text'; password.type = visible ? 'password' : 'text'; toggle.setAttribute('aria-label', visible ? 'Show password' : 'Hide password'); toggle.setAttribute('aria-pressed', String(!visible)); toggle.textContent = visible ? '◉' : '◌'; });

  async function sendOtp() {
    const data = new FormData(form);
    const fullName = String(data.get('fullName') || '').trim();
    const email = String(data.get('email') || '').trim().toLowerCase();
    const passwordValue = String(data.get('password') || '');
    if (fullName.length < 2) return showMessage('Enter your full name.', false);
    if (!/^\S+@\S+\.\S+$/.test(email)) return showMessage('Enter a valid email.', false);
    if (passwordValue.length < 8) return showMessage('Password must be at least 8 characters.', false);
    const button = signupButton; if (button) button.disabled = true; showMessage('Sending OTP…', true);
    try {
      const response = await api('/api/otp/send', { method: 'POST', body: JSON.stringify({ email, purpose: 'signup' }) });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || 'Unable to send OTP.');
      pending = { fullName, email, passwordValue, token: result.token };
      if (otpEmail) otpEmail.textContent = email;
      if (otpPanel) otpPanel.hidden = false;
      showMessage('OTP sent. Check your email.', true);
      otpInput?.focus();
    } catch (error) {
      showMessage(error?.message || 'Unable to send OTP.', false);
    } finally { if (button) button.disabled = false; }
  }

  form?.addEventListener('submit', async (event) => { event.preventDefault(); await sendOtp(); });

  verifyButton?.addEventListener('click', async () => {
    if (!pending) return showMessage('Please request an OTP first.', false);
    const otp = String(otpInput?.value || '').trim();
    if (!/^\d{6}$/.test(otp)) return showMessage('Enter the 6-digit OTP.', false);
    verifyButton.disabled = true; resendButton.disabled = true; showMessage('Verifying OTP…', true);
    try {
      const verifyResponse = await api('/api/otp/verify', { method: 'POST', body: JSON.stringify({ email: pending.email, purpose: 'signup', otp, token: pending.token }) });
      const verifyResult = await verifyResponse.json();
      if (!verifyResponse.ok || !verifyResult.ok) throw new Error(verifyResult.error || 'OTP verification failed.');
      if (!window.IndomarkFirebase?.auth) throw new Error('Firebase is not available. Refresh and try again.');
      showMessage('Email verified. Creating your account…', true);
      const credential = await window.IndomarkFirebase.auth.createUserWithEmailAndPassword(pending.email, pending.passwordValue);
      const user = credential.user;
      await user.updateProfile({ displayName: pending.fullName });
      const profile = { uid: user.uid, fullName: pending.fullName, email: user.email || pending.email, createdAt: new Date().toISOString() };
      try { await window.IndomarkFirebase.database.ref(`users/${user.uid}/profile`).set(profile); } catch (dbError) { console.warn('Profile database write failed:', dbError); }
      localStorage.setItem('indomark.user', JSON.stringify(profile)); localStorage.setItem('indomark.session', 'signed-in'); localStorage.setItem('indomark.loginEmail', user.email || pending.email);
      showMessage('Account created successfully.', true); window.setTimeout(() => { window.location.href = './home.html'; }, 400);
    } catch (error) { showMessage(error?.message || 'Account creation failed.', false); }
    finally { verifyButton.disabled = false; resendButton.disabled = false; }
  });

  resendButton?.addEventListener('click', async () => { if (!pending) return; resendButton.disabled = true; try { const response = await api('/api/otp/send', { method: 'POST', body: JSON.stringify({ email: pending.email, purpose: 'signup' }) }); const result = await response.json(); if (!response.ok || !result.ok) throw new Error(result.error || 'Unable to resend OTP.'); pending.token = result.token; showMessage('New OTP sent to your email.', true); otpInput?.focus(); } catch (error) { showMessage(error?.message || 'Unable to resend OTP.', false); } finally { resendButton.disabled = false; } });
  loginLink?.addEventListener('click', (event) => { event.preventDefault(); window.location.assign('./login.html'); });
});
