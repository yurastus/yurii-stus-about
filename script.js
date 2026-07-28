const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const sections = document.querySelectorAll('main section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');
const yearLabel = document.getElementById('year');

if (yearLabel) {
  yearLabel.textContent = new Date().getFullYear();
}

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navAnchors.forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navAnchors.forEach((link) => {
          const href = link.getAttribute('href');
          link.classList.toggle('active', href === `#${entry.target.id}`);
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach((section) => observer.observe(section));

(function setupEmailModal() {
  const modal = document.getElementById('emailModal');
  const triggers = document.querySelectorAll('[data-email-trigger]');
  if (!modal || !triggers.length) return;

  const address = 'stusyura@gmail.com';
  const subject = "Let's connect — opportunity to discuss";
  const body = 'Hi Yurii,\n\n';
  const enc = encodeURIComponent;

  const dialog = modal.querySelector('.email-modal__dialog');
  const copyBtn = modal.querySelector('[data-email-copy]');
  const gmailLink = modal.querySelector('[data-email-gmail]');
  const outlookLink = modal.querySelector('[data-email-outlook]');
  const defaultLink = modal.querySelector('[data-email-default]');

  gmailLink.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${enc(address)}&su=${enc(subject)}&body=${enc(body)}`;
  outlookLink.href = `https://outlook.office.com/mail/deeplink/compose?to=${enc(address)}&subject=${enc(subject)}&body=${enc(body)}`;
  defaultLink.href = `mailto:${address}?subject=${enc(subject)}&body=${enc(body)}`;

  let lastFocused = null;

  const openModal = (event) => {
    if (event) event.preventDefault();
    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => modal.classList.add('is-open'));
    gmailLink.focus();
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    const finish = () => {
      modal.hidden = true;
      dialog.removeEventListener('transitionend', finish);
    };
    dialog.addEventListener('transitionend', finish);
    setTimeout(finish, 250);
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  };

  triggers.forEach((trigger) => trigger.addEventListener('click', openModal));

  modal.querySelectorAll('[data-email-close]').forEach((el) => el.addEventListener('click', closeModal));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) closeModal();
  });

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(address);
    } catch (err) {
      const temp = document.createElement('input');
      temp.value = address;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand('copy');
      document.body.removeChild(temp);
    }
    const original = copyBtn.textContent;
    copyBtn.textContent = 'Copied!';
    copyBtn.classList.add('is-copied');
    setTimeout(() => {
      copyBtn.textContent = original;
      copyBtn.classList.remove('is-copied');
    }, 1600);
  });
})();
