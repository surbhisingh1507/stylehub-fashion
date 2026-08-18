/* StyleHub — core app: storage, layout, cart/wishlist state, UI helpers */
const KEYS = {
  cart: 'stylehub_cart', users: 'stylehub_users', user: 'stylehub_current_user',
  orders: 'stylehub_orders', wishlist: 'stylehub_wishlist',
  addresses: 'stylehub_addresses', prefs: 'stylehub_preferences',
};
const Store = {
  get(k, fb) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch { return fb; } },
  set(k, v) { localStorage.setItem(k, JSON.stringify(v)); },
  del(k) { localStorage.removeItem(k); },
};
const money = n => '₹' + Number(n).toLocaleString('en-IN');
const priceOf = p => p.discountPrice || p.price;
const discountPct = p => p.discountPrice ? Math.round((1 - p.discountPrice / p.price) * 100) : 0;
const byId = id => PRODUCTS.find(p => p.id === Number(id));
const qs = (k) => new URLSearchParams(location.search).get(k);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ---------- Toast ---------- */
function toast(msg, type = 'ok') {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('role', 'status'); wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const el = document.createElement('div');
  el.className = 'toast ' + type;
  el.textContent = msg;
  wrap.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateY(10px)'; setTimeout(() => el.remove(), 300); }, 2800);
}

/* ---------- Auth ---------- */
const Auth = {
  current: () => Store.get(KEYS.user, null),
  users: () => Store.get(KEYS.users, []),
  saveUsers: u => Store.set(KEYS.users, u),
  register(data) {
    const users = Auth.users();
    if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) return { ok: false, msg: 'An account with this email already exists.' };
    const user = { id: 'U' + Date.now(), name: data.name, email: data.email, phone: data.phone, password: btoa(data.password), joined: new Date().toISOString() };
    users.push(user); Auth.saveUsers(users);
    return { ok: true, user };
  },
  login(email, password) {
    const user = Auth.users().find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user || user.password !== btoa(password)) return { ok: false, msg: 'Invalid email or password.' };
    Store.set(KEYS.user, { id: user.id, name: user.name, email: user.email, phone: user.phone });
    return { ok: true, user };
  },
  logout() { Store.del(KEYS.user); },
};

/* ---------- Cart ---------- */
const Cart = {
  all: () => Store.get(KEYS.cart, []),
  save(items) { Store.set(KEYS.cart, items); updateCounts(); },
  add(productId, size, color, qty = 1) {
    const items = Cart.all();
    const found = items.find(i => i.id === productId && i.size === size && i.color === color);
    if (found) found.qty += qty; else items.push({ id: productId, size, color, qty });
    Cart.save(items);
    const b = document.querySelector('[data-cart-count]'); if (b) { b.classList.add('bump'); setTimeout(() => b.classList.remove('bump'), 420); }
  },
  setQty(index, qty) { const items = Cart.all(); if (!items[index]) return; items[index].qty = Math.max(1, Math.min(10, qty)); Cart.save(items); },
  remove(index) { const items = Cart.all(); items.splice(index, 1); Cart.save(items); },
  clear() { Cart.save([]); },
  count: () => Cart.all().reduce((s, i) => s + i.qty, 0),
  totals(couponPct = 0) {
    const items = Cart.all();
    let subtotal = 0, saved = 0;
    items.forEach(i => { const p = byId(i.id); if (!p) return; subtotal += p.price * i.qty; saved += (p.price - priceOf(p)) * i.qty; });
    const afterProductDiscount = subtotal - saved;
    const coupon = Math.round(afterProductDiscount * couponPct / 100);
    const taxable = afterProductDiscount - coupon;
    const shipping = taxable === 0 ? 0 : (taxable >= 2999 ? 0 : 149);
    const tax = Math.round(taxable * 0.05);
    return { subtotal, saved, coupon, shipping, tax, total: taxable + shipping + tax };
  },
};

/* ---------- Wishlist ---------- */
const Wishlist = {
  all: () => Store.get(KEYS.wishlist, []),
  has: id => Wishlist.all().includes(Number(id)),
  toggle(id) {
    id = Number(id);
    const list = Wishlist.all();
    const i = list.indexOf(id);
    if (i > -1) { list.splice(i, 1); Store.set(KEYS.wishlist, list); updateCounts(); toast('Removed from wishlist', 'info'); return false; }
    list.push(id); Store.set(KEYS.wishlist, list); updateCounts(); toast('Added to wishlist', 'ok'); return true;
  },
  remove(id) { Store.set(KEYS.wishlist, Wishlist.all().filter(x => x !== Number(id))); updateCounts(); },
};

/* ---------- Icons ---------- */
const ICON = {
  search: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  heart: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24"><path d="M20.8 8.6c0 5-8.8 10.2-8.8 10.2S3.2 13.6 3.2 8.6a4.6 4.6 0 0 1 8.8-1.8 4.6 4.6 0 0 1 8.8 1.8Z"/></svg>',
  heartFill: '<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M20.8 8.6c0 5-8.8 10.2-8.8 10.2S3.2 13.6 3.2 8.6a4.6 4.6 0 0 1 8.8-1.8 4.6 4.6 0 0 1 8.8 1.8Z"/></svg>',
  bag: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24"><path d="M5 7h14l1 13H4L5 7Z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>',
  user: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.5"/><path d="M4.5 20c1.2-3.6 4-5.5 7.5-5.5s6.3 1.9 7.5 5.5"/></svg>',
  menu: '<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  close: '<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg>',
  star: '★',
  check: '<svg width="46" height="46" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.5 2.5L16 9.5"/></svg>',
};

const NAV = [
  ['Home', 'index.html', null],
  ['Men', 'products.html?category=Men', null],
  ['Women', 'products.html?category=Women', null],
  ['Kids', 'products.html?category=Kids', null],
  ['Collections', 'products.html', null],
  ['About', 'about.html', null],
  ['Contact', 'contact.html', null],
];

/* ---------- Layout ---------- */
function renderHeader() {
  const host = document.querySelector('[data-header]');
  if (!host) return;
  const page = location.pathname.split('/').pop() || 'index.html';
  const cat = qs('category');
  const isActive = (href) => {
    const [file, query] = href.split('?');
    if (file !== page) return false;
    if (!query) return !cat || page !== 'products.html';
    return query.includes(cat || '');
  };
  const user = Auth.current();
  host.innerHTML = `
  <div class="topbar">Free express shipping on orders over ₹2,999 · <b>New Season — up to 40% off</b></div>
  <div class="container">
    <nav class="nav" aria-label="Main navigation">
      <a class="logo" href="index.html">Style<span>Hub</span></a>
      <ul class="nav-links">
        ${NAV.map(([label, href]) => `<li><a href="${href}" class="${isActive(href) ? 'active' : ''}">${label}</a></li>`).join('')}
      </ul>
      <div class="nav-actions">
        <button class="icon-btn" id="searchToggle" aria-label="Search products">${ICON.search}</button>
        <a class="icon-btn" href="account.html#wishlist" aria-label="Wishlist">${ICON.heart}<span class="badge is-zero" data-wish-count>0</span></a>
        <a class="icon-btn" href="cart.html" aria-label="Shopping bag">${ICON.bag}<span class="badge is-zero" data-cart-count>0</span></a>
        <a class="icon-btn" href="${user ? 'account.html' : 'login.html'}" aria-label="${user ? 'My account' : 'Login'}" title="${user ? user.name : 'Login'}">${ICON.user}</a>
        <button class="icon-btn hamburger" id="menuToggle" aria-label="Open menu" aria-expanded="false">${ICON.menu}</button>
      </div>
    </nav>
    <div class="search-bar" id="searchBar">
      <form role="search" action="products.html" method="get">
        <label class="sr-only" for="globalSearch" style="position:absolute;left:-9999px">Search products</label>
        <input id="globalSearch" name="q" type="search" placeholder="Search for dresses, sneakers, blazers…" value="${esc(qs('q') || '')}">
        <button class="btn btn--pink" type="submit">Search</button>
      </form>
    </div>
  </div>`;

  const drawer = document.createElement('aside');
  drawer.className = 'drawer';
  drawer.id = 'mobileDrawer';
  drawer.setAttribute('aria-label', 'Mobile navigation');
  drawer.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center">
      <span class="logo">Style<span style="color:var(--pink)">Hub</span></span>
      <button class="icon-btn" id="drawerClose" aria-label="Close menu">${ICON.close}</button>
    </div>
    <ul>${NAV.map(([l, h]) => `<li><a href="${h}">${l}</a></li>`).join('')}
      <li><a href="cart.html">Shopping Bag</a></li>
      <li><a href="${user ? 'account.html' : 'login.html'}">${user ? 'My Account' : 'Login / Register'}</a></li>
    </ul>`;
  const overlay = document.createElement('div');
  overlay.className = 'overlay'; overlay.id = 'navOverlay';
  document.body.append(drawer, overlay);

  const openMenu = (open) => {
    drawer.classList.toggle('open', open);
    overlay.classList.toggle('open', open);
    document.getElementById('menuToggle').setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };
  document.getElementById('menuToggle').onclick = () => openMenu(true);
  document.getElementById('drawerClose').onclick = () => openMenu(false);
  overlay.onclick = () => openMenu(false);
  document.getElementById('searchToggle').onclick = () => {
    const bar = document.getElementById('searchBar');
    bar.classList.toggle('open');
    if (bar.classList.contains('open')) document.getElementById('globalSearch').focus();
  };
  const header = host.closest('.header') || host;
  window.addEventListener('scroll', () => header.classList.toggle('is-scrolled', window.scrollY > 10));
}

function renderFooter() {
  const host = document.querySelector('[data-footer]');
  if (!host) return;
  const social = ['Instagram', 'Facebook', 'Pinterest', 'YouTube'];
  host.innerHTML = `
  <div class="container">
    <div class="footer-grid">
      <div>
        <a class="logo" href="index.html">Style<span>Hub</span></a>
        <p style="margin-top:14px;max-width:280px">Accessible luxury for the modern wardrobe. Thoughtfully designed, responsibly made, delivered worldwide since 2016.</p>
        <div class="socials">${social.map(s => `<a href="#" aria-label="${s}" title="${s}">${s[0]}</a>`).join('')}</div>
      </div>
      <div><h4>Quick Links</h4><ul>
        <li><a href="index.html">Home</a></li><li><a href="products.html">Shop All</a></li>
        <li><a href="about.html">About Us</a></li><li><a href="contact.html">Contact</a></li>
        <li><a href="account.html">My Account</a></li></ul></div>
      <div><h4>Customer Service</h4><ul>
        <li><a href="contact.html">Help Centre</a></li><li><a href="contact.html">Shipping Info</a></li>
        <li><a href="contact.html">Returns &amp; Exchanges</a></li><li><a href="contact.html">Size Guide</a></li>
        <li><a href="contact.html">Track Order</a></li></ul></div>
      <div><h4>Categories</h4><ul>
        <li><a href="products.html?category=Men">Men</a></li><li><a href="products.html?category=Women">Women</a></li>
        <li><a href="products.html?category=Kids">Kids</a></li><li><a href="products.html?subcategory=Footwear">Footwear</a></li>
        <li><a href="products.html?subcategory=Accessories">Accessories</a></li></ul></div>
      <div><h4>Get in Touch</h4><ul>
        <li>12 Linden Boulevard, Bandra West,<br>Mumbai 400050, India</li>
        <li><a href="tel:+912244881200">+91 22 4488 1200</a></li>
        <li><a href="mailto:hello@stylehub.com">hello@stylehub.com</a></li>
        <li>Mon–Sat · 10:00 – 20:00</li></ul></div>
    </div>
    <div class="footer-bottom"><span>© ${new Date().getFullYear()} StyleHub. All rights reserved.</span><span>Privacy Policy · Terms of Service · Internship Task WD-EC-002</span></div>
  </div>`;
}

function updateCounts() {
  const c = Cart.count(), w = Wishlist.all().length;
  document.querySelectorAll('[data-cart-count]').forEach(e => { e.textContent = c; e.classList.toggle('is-zero', c === 0); });
  document.querySelectorAll('[data-wish-count]').forEach(e => { e.textContent = w; e.classList.toggle('is-zero', w === 0); });
}

/* ---------- Product card ---------- */
function productCard(p) {
  const wished = Wishlist.has(p.id);
  const pct = discountPct(p);
  return `
  <article class="product-card reveal">
    <div class="product-card__media">
      <a href="product-detail.html?id=${p.id}" aria-label="${esc(p.name)}">
        <img src="${p.image}" alt="${esc(p.name)} by ${esc(p.brand)}" loading="lazy">
      </a>
      ${pct ? `<span class="tag">-${pct}%</span>` : ''}
      ${p.trending ? '<span class="tag tag--gold">Trending</span>' : ''}
      <button class="wish-btn ${wished ? 'active' : ''}" data-wish="${p.id}" aria-label="Add ${esc(p.name)} to wishlist" aria-pressed="${wished}">${wished ? ICON.heartFill : ICON.heart}</button>
    </div>
    <div class="product-card__body">
      <span class="brand">${esc(p.brand)}</span>
      <h3><a href="product-detail.html?id=${p.id}">${esc(p.name)}</a></h3>
      <span class="sub">${esc(p.category)} · ${esc(p.subcategory)}</span>
      <span class="rating"><span class="star">★</span> ${p.rating} <span>(${p.reviews})</span></span>
      <div class="price"><b>${money(priceOf(p))}</b>${p.discountPrice ? `<s>${money(p.price)}</s><span class="off">${pct}% off</span>` : ''}</div>
      <button class="btn btn--pink btn--sm" data-add="${p.id}">Add to Cart</button>
    </div>
  </article>`;
}

/* Quick add: picks first size/colour for grid adds, detail page enforces selection */
function bindProductGrid(root = document) {
  root.addEventListener('click', e => {
    const wishBtn = e.target.closest('[data-wish]');
    if (wishBtn) {
      const on = Wishlist.toggle(wishBtn.dataset.wish);
      wishBtn.classList.toggle('active', on);
      wishBtn.setAttribute('aria-pressed', String(on));
      wishBtn.innerHTML = on ? ICON.heartFill : ICON.heart;
      document.dispatchEvent(new CustomEvent('wishlist:change'));
      return;
    }
    const addBtn = e.target.closest('[data-add]');
    if (addBtn) {
      const p = byId(addBtn.dataset.add);
      if (!p) return;
      if (p.sizes.length > 1 || p.colors.length > 1) {
        location.href = `product-detail.html?id=${p.id}`;
        return;
      }
      Cart.add(p.id, p.sizes[0], p.colors[0], 1);
      toast(`${p.name} added to bag`, 'ok');
    }
  });
}

/* ---------- Reveal animations ---------- */
function initReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}
function revealNew() { initReveal(); }

/* ---------- Newsletter ---------- */
function initNewsletter() {
  document.querySelectorAll('[data-newsletter]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('input[type=email]');
      const msg = form.parentElement.querySelector('[data-newsletter-msg]');
      if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(input.value.trim())) {
        toast('Please enter a valid email address', 'err'); return;
      }
      if (msg) { msg.textContent = `Thank you! ${input.value.trim()} is now subscribed to StyleHub updates.`; msg.style.display = 'block'; }
      toast('Subscribed successfully — welcome to StyleHub', 'ok');
      form.reset();
    });
  });
}

/* ---------- Form validation helper ---------- */
function validate(form, rules) {
  let ok = true;
  Object.entries(rules).forEach(([name, test]) => {
    const input = form.elements[name];
    if (!input) return;
    const field = input.closest('.field') || input.parentElement;
    const value = input.type === 'checkbox' ? input.checked : input.value.trim();
    const res = test(value, form);
    const valid = res === true;
    field.classList.toggle('invalid', !valid);
    const err = field.querySelector('.err');
    if (err && !valid) err.textContent = res;
    if (!valid) ok = false;
  });
  return ok;
}
const isEmail = v => /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(v) || 'Enter a valid email address';
const isPhone = v => /^[0-9+\-\s]{8,15}$/.test(v) || 'Enter a valid phone number';
const required = (label) => v => (v && String(v).length > 0) || `${label} is required`;

document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderFooter();
  updateCounts();
  initReveal();
  initNewsletter();
  bindProductGrid(document);
});
