document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const password = document.getElementById('password');
  const toggle = document.getElementById('togglePassword');
  const message = document.getElementById('formMessage');
  const signupLink = document.getElementById('signupLink');

  toggle?.addEventListener('click', () => {
    const visible = password.type === 'text';
    password.type = visible ? 'password' : 'text';
    toggle.setAttribute('aria-label', visible ? 'Show password' : 'Hide password');
    toggle.setAttribute('aria-pressed', String(!visible));
    toggle.textContent = visible ? '◉' : '◌';
  });

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const email = String(data.get('email') || '').trim().toLowerCase();
    const passwordValue = String(data.get('password') || '');

    if (!email || !passwordValue) {
      if (message) {
        message.textContent = 'Enter email and password.';
        message.style.color = '#ff8297';
      }
      return;
    }

    localStorage.setItem('indospeed.session', 'signed-in');
    localStorage.setItem('indospeed.loginEmail', email);
    window.location.assign('./home.html');
  });

  signupLink?.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.assign('./signup.html');
  });
});
