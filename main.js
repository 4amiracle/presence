const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzP2RG3xzkW8JOGxyNbwwtEwwYWtTvN9eNEyrGHN6KydNmrSSi_I3P71MV7KCH18pJf/exec';
const TOTAL_SPOTS = 15;
const WORKSHOP_KEYS = {
  virtual: 'Finding Your Voice (Virtual – August 19)',
  park: 'Ground & Voice (Prospect Park – August 22)'
};

async function updateSpotCounts() {
  try {
    const res = await fetch(SCRIPT_URL);
    const counts = await res.json();
    document.querySelectorAll('.spots-count').forEach(el => {
      const key = el.dataset.workshop;
      const taken = counts[WORKSHOP_KEYS[key]] || 0;
      const remaining = Math.max(0, TOTAL_SPOTS - taken);
      el.textContent = remaining === 0 ? 'Sold out' : `${remaining} spot${remaining === 1 ? '' : 's'} available`;
      if (remaining === 0) {
        const btn = el.closest('article')?.querySelector('.btn-workshop');
        if (btn) { btn.textContent = 'Sold out'; btn.style.opacity = '0.5'; btn.style.pointerEvents = 'none'; }
      }
    });
  } catch {
    // silently fail — static counts stay visible
  }
}

document.querySelectorAll('.signup-form').forEach(form => {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validateForm(form)) return;

    const btn = form.querySelector('button[type="submit"]');
    const wrapper = form.closest('.form-wrapper');
    const successEl = wrapper.querySelector('.form-success');
    const workshopKey = form.querySelector('input[name="workshop"]')?.value.includes('Virtual') ? 'virtual' : 'park';

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
      // optimistically decrement the spot count
      const spotEl = document.querySelector(`.spots-count[data-workshop="${workshopKey}"]`);
      if (spotEl && !spotEl.textContent.includes('Sold out')) {
        const current = parseInt(spotEl.textContent) || TOTAL_SPOTS;
        const remaining = Math.max(0, current - 1);
        spotEl.textContent = remaining === 0 ? 'Sold out' : `${remaining} spot${remaining === 1 ? '' : 's'} available`;
      }
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

updateSpotCounts();
