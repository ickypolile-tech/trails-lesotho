document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('lesotho-theme');
  if (savedTheme) root.dataset.theme = savedTheme;
  document.querySelectorAll('[data-theme-toggle]').forEach(button => {
    button.addEventListener('click', () => {
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      if (next === 'light') delete root.dataset.theme; else root.dataset.theme = next;
      localStorage.setItem('lesotho-theme', next);
      button.setAttribute('aria-label', next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
  });

  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const feedback = form.nextElementSibling;
      feedback.textContent = 'You are on the list. See you on the road.';
      form.reset();
    });
  });

  const search = document.querySelector('[data-search]');
  const cards = [...document.querySelectorAll('[data-card]')];
  const filters = [...document.querySelectorAll('[data-filter]')];
  const filterCards = () => {
    const query = (search?.value || '').toLowerCase();
    const category = document.querySelector('[data-filter].active')?.dataset.filter || 'all';
    cards.forEach(card => {
      const matchesText = card.textContent.toLowerCase().includes(query);
      const matchesCategory = category === 'all' || card.dataset.category === category;
      card.closest('[data-card-wrap]').hidden = !(matchesText && matchesCategory);
    });
  };
  search?.addEventListener('input', filterCards);
  filters.forEach(filter => filter.addEventListener('click', () => { filters.forEach(item => item.classList.remove('active')); filter.classList.add('active'); filterCards(); }));

  const galleryModal = document.querySelector('#galleryModal');
  document.querySelectorAll('[data-gallery-image]').forEach(item => item.addEventListener('click', () => {
    const image = galleryModal?.querySelector('img');
    if (image) { image.src = item.dataset.galleryImage; image.alt = item.dataset.galleryAlt || ''; }
  }));

  const bookingForm = document.querySelector('#booking-form');
  bookingForm?.addEventListener('submit', event => {
    event.preventDefault();
    if (!bookingForm.checkValidity()) { bookingForm.classList.add('was-validated'); return; }
    const feedback = bookingForm.querySelector('.form-feedback');
    feedback.textContent = 'Your request is ready. We will be in touch within one working day.';
    bookingForm.reset();
  });
  const contactForm = document.querySelector('#contact-form');
  contactForm?.addEventListener('submit', event => {
    event.preventDefault();
    if (!contactForm.checkValidity()) { contactForm.classList.add('was-validated'); return; }
    contactForm.querySelector('.form-feedback').textContent = 'Message sent. Thank you for reaching out.';
    contactForm.reset();
  });

  const calculator = document.querySelector('#trip-calculator');
  calculator?.addEventListener('input', () => {
    const nights = Number(calculator.querySelector('[name=nights]').value) || 0;
    const people = Number(calculator.querySelector('[name=people]').value) || 1;
    const rate = Number(calculator.querySelector('[name=style]').value);
    const total = nights * people * rate + 85;
    calculator.querySelector('[data-total]').textContent = `M${total.toLocaleString()}`;
  });

  let cart = JSON.parse(localStorage.getItem('lesotho-cart') || '[]');
  const updateCart = () => { document.querySelectorAll('[data-cart-count]').forEach(item => item.textContent = cart.length); localStorage.setItem('lesotho-cart', JSON.stringify(cart)); };
  document.querySelectorAll('[data-add-cart]').forEach(button => button.addEventListener('click', () => { cart.push(button.dataset.addCart); updateCart(); const toast = document.querySelector('.toast-message'); if (toast) { toast.textContent = `${button.dataset.addCart} added to your trip`; toast.hidden = false; setTimeout(() => toast.hidden = true, 2500); } }));
  updateCart();
});