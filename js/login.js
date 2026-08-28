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
  const API_BASE = 'https://indoverification-production.up.railway.app';
  const APP_NAME = 'Indomark';
  const firebaseAuth = window.IndomarkFirebase?.auth;
  let pending = null;

  const showMessage = (text, ok = false) => {
    if (message) {
      message.textContent = text;
      message.style.color = ok ? '#69e7aa' : '#ff8297';
    }
  };

  const normalizeOtp = (value) => String(value || '')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/[^0-9]/g, '')
    .slice(0, 6);

  const withTimeout = (promise, ms, label) => Promise.race([
    promise,
    new Promise((_, reject) => window.setTimeout(() => reject(new Error(`${label} timed out. Please try again.`)), ms)),
  ]);

  const api = (path, options = {}) => withTimeout(fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Indo-App-Name': APP_NAME,
      ...(options.headers || {}),
    },
  }), 15000, 'Server request');

  const setSession = (profile) => {
    localStorage.setItem('indomark.firebaseUser', JSON.stringify(profile));
    localStorage.setItem('indomark.user', JSON.stringify(profile));
    localStorage.setItem('indomark.session', 'signed-in');
    localStorage.setItem('indomark.loginEmail', profile.email);
    localStorage.removeItem('indomark.pendingName');
  };

  const syncProfile = (profile) => {
    try {
      const database = window.IndomarkFirebase?.database;
      if (!database || !profile?.id) return;
      withTimeout(database.ref(`users/${profile.id}/profile`).set(profile), 5000, 'Profile sync')
        .catch((error) => console.warn('Firebase profile sync failed:', error));
    } catch (error) {
      console.warn('Firebase profile sync setup failed:', error);
    }
  };

  toggle?.addEventListener('click', () => {
    const visible = password.type === 'text';
    password.type = visible ? 'password' : 'text';
    toggle.setAttribute('aria-label', visible ? 'Show password' : 'Hide password');
    toggle.setAttribute('aria-pressed', String(!visible));
    toggle.textContent = visible ? '◉' : '◌';
  });

  otpInput?.addEventListener('input', () => {
    const normalized = normalizeOtp(otpInput.value);
    if (otpInput.value !== normalized) otpInput.value = normalized;
  });

  async function beginLogin() {
    const data = new FormData(form);
    const email = String(data.get('email') || '').trim().toLowerCase();
    const passwordValue = String(data.get('password') || '');
    if (!firebaseAuth) return showMessage('Firebase Authentication is unavailable.');
    if (!/^\S+@\S+\.\S+$/.test(email)) return showMessage('Enter a valid email.');
    if (!passwordValue) return showMessage('Enter your password.');
    if (loginButton) loginButton.disabled = true;
    showMessage('Checking account…', true);
    try {
      const credential = await withTimeout(
        firebaseAuth.signInWithEmailAndPassword(email, passwordValue),
        15000,
        'Firebase login'
      );
      const displayName = credential.user.displayName || 'Investor';
      pending = { email, passwordValue, name: displayName, user: credential.user };

      const response = await api('/api/auth/login/request-otp', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || 'Unable to send OTP.');
      if (otpEmail) otpEmail.textContent = email;
      if (otpPanel) otpPanel.hidden = false;
      showMessage('OTP sent. Check your email to finish login.', true);
      otpInput?.focus();
    } catch (error) {
      const code = String(error?.code || '');
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        showMessage('Invalid email or password.');
      } else {
        showMessage(error?.message || 'Login failed.');
      }
    } finally {
      if (loginButton) loginButton.disabled = false;
    }
  }

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    await beginLogin();
  });

  verifyButton?.addEventListener('click', async () => {
    if (!pending) return showMessage('Please login first.');
    const otp = normalizeOtp(otpInput?.value);
    if (!/^\d{6}$/.test(otp)) return showMessage('Enter the 6-digit OTP.', false);
    if (otpInput) otpInput.value = otp;
    verifyButton.disabled = true;
    if (resendButton) resendButton.disabled = true;
    showMessage('Verifying OTP…', true);
    try {
      const response = await api('/api/auth/login/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email: pending.email, otp, name: pending.name }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok || !result.verified) {
        throw new Error(result.error || 'OTP verification failed.');
      }

      showMessage('OTP verified. Completing login…', true);
      const user = pending.user;
      if (!user) throw new Error('Login session expired. Please login again.');

      const profile = {
        id: user.uid,
        fullName: user.displayName || pending.name || 'Investor',
        email: user.email || pending.email,
        active: true,
      };

      setSession(profile);
      syncProfile(profile);
      showMessage('Login successful. Welcome email sent.', true);
      window.setTimeout(() => window.location.assign('./home.html'), 350);
    } catch (error) {
      console.error('Login verification flow failed:', error);
      showMessage(error?.message || 'Login failed.', false);
    } finally {
      verifyButton.disabled = false;
      if (resendButton) resendButton.disabled = false;
    }
  });

  resendButton?.addEventListener('click', async () => {
    if (!pending) return;
    resendButton.disabled = true;
    try {
      const response = await api('/api/auth/resend-otp', {
        method: 'POST',
        body: JSON.stringify({ email: pending.email, purpose: 'login' }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || 'Unable to resend OTP.');
      if (otpInput) otpInput.value = '';
      showMessage('New OTP sent to your email.', true);
      otpInput?.focus();
    } catch (error) {
      showMessage(error?.message || 'Unable to resend OTP.', false);
    } finally {
      resendButton.disabled = false;
    }
  });

  signupLink?.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.assign('./signup.html');
  });
});
