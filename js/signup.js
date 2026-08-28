document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');
  const password = document.getElementById('password');
  const toggle = document.getElementById('togglePassword');
  const message = document.getElementById('formMessage');
  const loginLink = document.getElementById('loginLink');

  const showMessage = (text, ok = true) => {
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

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const fullName = String(data.get('fullName') || '').trim();
    const email = String(data.get('email') || '').trim().toLowerCase();
    const passwordValue = String(data.get('password') || '');

    if (fullName.length < 2) return showMessage('Enter your full name.', false);
    if (!/^\S+@\S+\.\S+$/.test(email)) return showMessage('Enter a valid email.', false);
    if (passwordValue.length < 8) return showMessage('Password must be at least 8 characters.', false);

    localStorage.setItem('indospeed.user', JSON.stringify({ fullName, email, createdAt: new Date().toISOString() }));
    localStorage.removeItem('indospeed.session');
    showMessage('Account created successfully.');
    window.setTimeout(() => { window.location.href = './login.html'; }, 350);
  });

  loginLink?.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.assign('./login.html');
  });
});
