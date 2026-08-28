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
  let pending = null;

  const showMessage = (text, ok = false) => {
    if (message) {
      message.textContent = text;
      message.style.color = ok ? '#69e7aa' : '#ff8297';
    }
  };
  const api = (path, options = {}) => fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Indo-App-Name': APP_NAME,
      ...(options.headers || {}),
    },
  });

  toggle?.addEventListener('click', () => {
    const visible = password.type === 'text';
    password.type = visible ? 'password' : 'text';
    toggle.setAttribute('aria-label', visible ? 'Show password' : 'Hide password');
    toggle.setAttribute('aria-pressed', String(!visible));
    toggle.textContent = visible ? '◉' : '◌';
  });

  async function beginLogin() {
    const data = new FormData(form);
    const email = String(data.get('email') || '').trim().toLowerCase();
    const passwordValue = String(data.get('password') || '');
    if (!email || !passwordValue) return showMessage('Enter email and password.');
    if (loginButton) loginButton.disabled = true;
    showMessage('Checking account…', true);
    try {
      const response = await api('/api/auth/login/request-otp', {
        method: 'POST',
        body: JSON.stringify({ email, password: passwordValue }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || 'Invalid email or password.');
      pending = { email };
      if (otpEmail) otpEmail.textContent = email;
      if (otpPanel) otpPanel.hidden = false;
      showMessage('OTP sent. Check your email to finish login.', true);
      otpInput?.focus();
    } catch (error) {
      showMessage(error?.message || 'Login failed.');
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
    const otp = String(otpInput?.value || '').trim();
    if (!/^\d{6}$/.test(otp)) return showMessage('Enter the 6-digit OTP.');
    verifyButton.disabled = true;
    if (resendButton) resendButton.disabled = true;
    showMessage('Verifying OTP…', true);
    try {
      const response = await api('/api/auth/login/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email: pending.email, otp }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok || !result.token || !result.user) {
        throw new Error(result.error || 'OTP verification failed.');
      }

      const user = result.user;
      const profile = {
        id: user.id,
        fullName: user.name || 'Investor',
        email: user.email || pending.email,
        active: user.active !== false,
      };

      // Firebase is DATA ONLY. IndoVerification owns authentication/session.
      try {
        if (window.IndomarkFirebase?.database && user.id) {
          await window.IndomarkFirebase.database.ref(`users/${user.id}/profile`).set(profile);
        }
      } catch (dbError) {
        console.warn('Firebase profile sync failed:', dbError);
      }

      localStorage.setItem('indomark.token', result.token);
      localStorage.setItem('indomark.session', 'signed-in');
      localStorage.setItem('indomark.loginEmail', profile.email);
      localStorage.setItem('indomark.user', JSON.stringify(profile));
      localStorage.removeItem('indomark.pendingName');
      showMessage('Login verified successfully.', true);
      window.location.assign('./home.html');
    } catch (error) {
      showMessage(error?.message || 'OTP verification failed.');
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
      showMessage('New OTP sent to your email.', true);
      otpInput?.focus();
    } catch (error) {
      showMessage(error?.message || 'Unable to resend OTP.');
    } finally {
      resendButton.disabled = false;
    }
  });

  signupLink?.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.assign('./signup.html');
  });
});
