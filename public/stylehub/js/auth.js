/* Login & registration simulation */
document.addEventListener('DOMContentLoaded', () => {
  const login = document.getElementById('loginForm');
  const reg = document.getElementById('registerForm');

  if (login) {
    document.getElementById('forgot').onclick = () =>
      toast('Password reset link sent (simulated) — check your inbox.', 'info');
    login.addEventListener('submit', e => {
      e.preventDefault();
      const msg = document.getElementById('loginMsg');
      msg.style.display = 'none';
      const ok = validate(login, { email: isEmail, password: v => v.length >= 6 || 'Password must be at least 6 characters' });
      if (!ok) { toast('Please check your details', 'err'); return; }
      const res = Auth.login(login.elements.email.value.trim(), login.elements.password.value);
      if (!res.ok) { msg.className = 'note note--err'; msg.style.display = 'block'; msg.textContent = res.msg; toast('Invalid login', 'err'); return; }
      if (login.elements.remember.checked) localStorage.setItem('stylehub_remember', res.user.email);
      toast(`Welcome back, ${res.user.name.split(' ')[0]}`, 'ok');
      setTimeout(() => location.href = 'account.html', 700);
    });
    const remembered = localStorage.getItem('stylehub_remember');
    if (remembered) { login.elements.email.value = remembered; login.elements.remember.checked = true; }
  }

  if (reg) {
    reg.addEventListener('submit', e => {
      e.preventDefault();
      const msg = document.getElementById('registerMsg');
      msg.style.display = 'none';
      const ok = validate(reg, {
        name: v => v.length >= 3 || 'Enter your full name',
        email: isEmail, phone: isPhone,
        password: v => v.length >= 6 || 'Use at least 6 characters',
        confirm: (v, f) => v === f.elements.password.value.trim() && v.length > 0 || 'Passwords do not match',
        terms: v => v === true || 'Please accept the terms to continue',
      });
      if (!ok) { toast('Please fix the highlighted fields', 'err'); return; }
      const res = Auth.register({
        name: reg.elements.name.value.trim(), email: reg.elements.email.value.trim(),
        phone: reg.elements.phone.value.trim(), password: reg.elements.password.value,
      });
      if (!res.ok) { msg.className = 'note note--err'; msg.style.display = 'block'; msg.textContent = res.msg; toast(res.msg, 'err'); return; }
      Auth.login(res.user.email, reg.elements.password.value);
      toast('Account created — welcome to StyleHub', 'ok');
      setTimeout(() => location.href = 'account.html', 800);
    });
  }
});
