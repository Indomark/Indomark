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
    if (!firebaseAuth) return showMessage('Firebase Authentication is unavailable.');
    if (!/^\S+@\S+\.\S+$/.test(email)) return showMessage('Enter a valid email.');
    if (!passwordValue) return showMessage('Enter your password.');
    if (loginButton) loginButton.disabled = true;
    showMessage('Checking account…', true);
    try {
      const credential = await firebaseAuth.signInWithEmailAndPassword(email, passwordValue);
      const displayName = credential.user.displayName || 'Investor';
      await firebaseAuth.signOut();

      const response = await api('/api/auth/login/request-otp', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || 'Unable to send OTP.');
      pending = { email, passwordValue, name: displayName };
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
      if (!response.ok || !result.ok || !result.verified) throw new Error(result.error || 'OTP verification failed.');

      const credential = await firebaseAuth.signInWithEmailAndPassword(pending.email, pending.passwordValue);
      const user = credential.user;
      const profile = {
        id: user.uid,
        fullName: user.displayName || pending.name || 'Investor',
        email: user.email || pending.email,
        active: true,
      };

      try {
        if (window.IndomarkFirebase?.database && user.uid) {
          await window.IndomarkFirebase.database.ref(`users/${user.uid}/profile`).set(profile);
        }
      } catch (dbError) {
        console.warn('Firebase profile sync failed:', dbError);
      }

      localStorage.setItem('indomark.firebaseUser', JSON.stringify(profile));
      localStorage.setItem('indomark.session', 'signed-in');
      localStorage.setItem('indomark.loginEmail', profile.email);
      localStorage.removeItem('indomark.pendingName');
      showMessage('Login successful.', true);
      window.location.assign('./home.html');
    } catch (error) {
      showMessage(error?.message || 'OTP verification failed.', false);
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
