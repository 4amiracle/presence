document.querySelectorAll('.signup-form').forEach(form => {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validateForm(form)) return;

    const btn = form.querySelector('button[type="submit"]');
    const wrapper = form.closest('.form-wrapper');
    const successEl = wrapper.querySelector('.form-success');

    form.classList.add('is-loading');
    btn.disabled = true;

    try {
      await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        mode: 'no-cors',
      });
        form.style.display = 'none';
        if (successEl) { successEl.classList.add('is-visible'); successEl.focus(); }
    } catch {
      form.classList.remove('is-loading');
      btn.disabled = false;
      showFormError(form, 'Something went wrong. Please email us directly at mirarlshane@gmail.com');
    }
  });
});

function validateForm(form) {
  clearErrors(form);
  let valid = true, firstInvalid = null;
  const name = form.querySelector('input[name="name"]');
  const email = form.querySelector('input[name="email"]');
  if (name && !name.value.trim()) { setError(name, 'Please enter your name.'); firstInvalid = firstInvalid || name; valid = false; }
  if (email) {
    const v = email.value.trim();
    if (!v) { setError(email, 'Please enter your email address.'); firstInvalid = firstInvalid || email; valid = false; }
    else if (!validEmail(v)) { setError(email, 'Please enter a valid email address.'); firstInvalid = firstInvalid || email; valid = false; }
  }
  if (firstInvalid) firstInvalid.focus();
  return valid;
}

function setError(input, message) {
  input.setAttribute('aria-invalid', 'true');
  const el = document.getElementById(input.getAttribute('aria-describedby'));
  if (el) el.textContent = message;
}

function clearErrors(form) {
  form.querySelectorAll('input, textarea').forEach(el => el.removeAttribute('aria-invalid'));
  form.querySelectorAll('.field-error').forEach(el => { el.textContent = ''; });
}

function showFormError(form, message) {
  let el = form.querySelector('.form-general-error');
  if (!el) {
    el = document.createElement('p');
    el.className = 'form-general-error';
    el.style.cssText = 'color:var(--color-error);font-size:.9rem;margin-top:.5rem;font-weight:500;';
    el.setAttribute('role', 'alert');
    form.appendChild(el);
  }
  el.textContent = message;
}

function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
