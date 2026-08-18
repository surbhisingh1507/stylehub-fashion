/* Account dashboard: profile, orders, addresses, wishlist, size preferences */
document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('acctRoot');
  const user = Auth.current();

  if (!user) {
    root.innerHTML = `<div class="empty"><h3>You're not signed in</h3>
      <p class="muted">Sign in to view your orders, wishlist and saved addresses.</p>
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
        <a class="btn btn--pink" href="login.html">Login</a><a class="btn btn--ghost" href="register.html">Create Account</a></div></div>`;
    return;
  }
  document.getElementById('acctHeading').textContent = `Hello, ${user.name.split(' ')[0]}`;
  document.getElementById('acctSub').textContent = user.email;

  const TABS = [['profile', 'Profile'], ['orders', 'Order History'], ['addresses', 'Saved Addresses'], ['wishlist', 'Wishlist'], ['prefs', 'Size Preferences']];
  root.innerHTML = `
  <div class="acct">
    <aside class="panel">
      <div class="acct-nav">${TABS.map(([k, l], i) => `<button data-tab="${k}" class="${i === 0 ? 'active' : ''}">${l}</button>`).join('')}</div>
      <button class="btn btn--ghost btn--block btn--sm" id="logoutBtn" style="margin-top:14px">Logout</button>
    </aside>
    <div>
      <section class="tab active panel" id="tab-profile"></section>
      <section class="tab" id="tab-orders"></section>
      <section class="tab" id="tab-addresses"></section>
      <section class="tab" id="tab-wishlist"></section>
      <section class="tab panel" id="tab-prefs"></section>
    </div>
  </div>`;

  const show = key => {
    document.querySelectorAll('.acct-nav button').forEach(b => b.classList.toggle('active', b.dataset.tab === key));
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.id === 'tab-' + key));
    history.replaceState({}, '', '#' + key);
  };
  root.querySelector('.acct-nav').addEventListener('click', e => {
    const b = e.target.closest('[data-tab]'); if (b) show(b.dataset.tab);
  });
  document.getElementById('logoutBtn').onclick = () => { Auth.logout(); toast('Logged out', 'info'); setTimeout(() => location.href = 'index.html', 600); };

  /* Profile */
  function renderProfile() {
    document.getElementById('tab-profile').innerHTML = `
      <h3 style="font-family:var(--body);font-size:1rem">Profile</h3>
      <form id="profileForm" novalidate>
        <div class="row-2">
          <div class="field"><label for="pname">Name</label><input id="pname" name="name" value="${esc(user.name)}"><span class="err"></span></div>
          <div class="field"><label for="pemail">Email</label><input id="pemail" name="email" value="${esc(user.email)}"><span class="err"></span></div>
        </div>
        <div class="field"><label for="pphone">Phone</label><input id="pphone" name="phone" value="${esc(user.phone || '')}"><span class="err"></span></div>
        <button class="btn btn--pink" type="submit">Save Changes</button>
      </form>`;
    const f = document.getElementById('profileForm');
    f.onsubmit = e => {
      e.preventDefault();
      if (!validate(f, { name: v => v.length >= 3 || 'Enter your full name', email: isEmail, phone: isPhone })) { toast('Please fix the highlighted fields', 'err'); return; }
      const updated = { ...user, name: f.elements.name.value.trim(), email: f.elements.email.value.trim(), phone: f.elements.phone.value.trim() };
      Store.set(KEYS.user, updated);
      const users = Auth.users().map(u => u.id === user.id ? { ...u, ...updated } : u);
      Auth.saveUsers(users);
      toast('Profile updated', 'ok');
      setTimeout(() => location.reload(), 600);
    };
  }

  /* Orders */
  function renderOrders() {
    const orders = Store.get(KEYS.orders, []);
    document.getElementById('tab-orders').innerHTML = orders.length ? `
      <h3 style="font-family:var(--body);font-size:1rem">Order History</h3>
      ${orders.map(o => `
        <div class="order-card">
          <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:center">
            <div><b>${o.id}</b><br><span class="muted" style="font-size:.86rem">${new Date(o.date).toDateString()} · ${o.items.length} item(s)</span></div>
            <span class="status ${o.status.toLowerCase()}">${o.status}</span>
          </div>
          <div style="display:flex;gap:10px;margin:14px 0;flex-wrap:wrap">
            ${o.items.map(i => `<img src="${i.image}" alt="${esc(i.name)}" style="width:56px;height:70px;object-fit:cover;border-radius:8px" title="${esc(i.name)} × ${i.qty}">`).join('')}
          </div>
          <div class="summary-row" style="border-top:1px solid var(--line);padding-top:10px"><span>Total</span><b>${money(o.totals.total)}</b></div>
          <div class="summary-row"><span class="muted">Delivery estimate</span><span class="muted">${esc(o.delivery)}</span></div>
          <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">
            ${['Processing', 'Shipped', 'Delivered'].map(s => `<button class="chip ${o.status === s ? 'active' : ''}" data-status="${s}" data-order="${o.id}">${s}</button>`).join('')}
          </div>
        </div>`).join('')}`
      : `<div class="empty"><h3>No orders yet</h3><p class="muted">Once you place an order it will appear here.</p><a class="btn btn--pink" href="products.html">Start shopping</a></div>`;

    document.getElementById('tab-orders').onclick = e => {
      const b = e.target.closest('[data-status]'); if (!b) return;
      const orders = Store.get(KEYS.orders, []).map(o => o.id === b.dataset.order ? { ...o, status: b.dataset.status } : o);
      Store.set(KEYS.orders, orders);
      toast(`Order ${b.dataset.order} marked ${b.dataset.status}`, 'info');
      renderOrders();
    };
  }

  /* Addresses */
  function renderAddresses() {
    const list = Store.get(KEYS.addresses, []);
    document.getElementById('tab-addresses').innerHTML = `
      <div class="panel">
        <h3 style="font-family:var(--body);font-size:1rem">Saved Addresses</h3>
        ${list.length ? list.map(a => `
          <div class="order-card">
            <b>${esc(a.label || 'Address')}</b>
            <p class="muted" style="margin:6px 0">${esc(a.name)} · ${esc(a.phone || '')}<br>${esc(a.address)}, ${esc(a.city)}, ${esc(a.state)} ${esc(a.zip)}<br>${esc(a.country || 'India')}</p>
            <button class="btn btn--ghost btn--sm" data-edit="${a.id}">Edit</button>
            <button class="btn btn--ghost btn--sm" data-delete="${a.id}">Delete</button>
          </div>`).join('') : '<p class="muted">No addresses saved yet.</p>'}
      </div>
      <div class="panel">
        <h3 style="font-family:var(--body);font-size:1rem" id="addrTitle">Add New Address</h3>
        <form id="addrForm" novalidate>
          <input type="hidden" name="id">
          <div class="row-2">
            <div class="field"><label for="alabel">Label</label><input id="alabel" name="label" placeholder="Home / Office"><span class="err"></span></div>
            <div class="field"><label for="aname">Full Name</label><input id="aname" name="name"><span class="err"></span></div>
          </div>
          <div class="field"><label for="aaddress">Address</label><input id="aaddress" name="address"><span class="err"></span></div>
          <div class="row-2">
            <div class="field"><label for="acity">City</label><input id="acity" name="city"><span class="err"></span></div>
            <div class="field"><label for="astate">State</label><input id="astate" name="state"><span class="err"></span></div>
          </div>
          <div class="row-2">
            <div class="field"><label for="azip">ZIP</label><input id="azip" name="zip"><span class="err"></span></div>
            <div class="field"><label for="aphone">Phone</label><input id="aphone" name="phone"><span class="err"></span></div>
          </div>
          <button class="btn btn--pink" type="submit">Save Address</button>
        </form>
      </div>`;

    const f = document.getElementById('addrForm');
    f.onsubmit = e => {
      e.preventDefault();
      const rules = { label: required('Label'), name: required('Name'), address: required('Address'), city: required('City'), state: required('State'), zip: v => /^[0-9A-Za-z\s-]{4,10}$/.test(v) || 'Enter a valid ZIP', phone: isPhone };
      if (!validate(f, rules)) { toast('Please fix the highlighted fields', 'err'); return; }
      const data = Object.fromEntries(new FormData(f).entries());
      let list = Store.get(KEYS.addresses, []);
      if (data.id) list = list.map(a => a.id === data.id ? { ...a, ...data } : a);
      else list.push({ ...data, id: 'A' + Date.now() });
      Store.set(KEYS.addresses, list);
      toast(data.id ? 'Address updated' : 'Address added', 'ok');
      renderAddresses();
    };
    document.getElementById('tab-addresses').addEventListener('click', e => {
      const del = e.target.closest('[data-delete]'), ed = e.target.closest('[data-edit]');
      if (del) {
        Store.set(KEYS.addresses, Store.get(KEYS.addresses, []).filter(a => a.id !== del.dataset.delete));
        toast('Address deleted', 'info'); renderAddresses();
      } else if (ed) {
        const a = Store.get(KEYS.addresses, []).find(x => x.id === ed.dataset.edit);
        Object.entries(a).forEach(([k, v]) => { if (f.elements[k]) f.elements[k].value = v; });
        document.getElementById('addrTitle').textContent = 'Edit Address';
        f.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  /* Wishlist */
  function renderWishlist() {
    const ids = Wishlist.all();
    const host = document.getElementById('tab-wishlist');
    host.innerHTML = ids.length
      ? `<h3 style="font-family:var(--body);font-size:1rem">Wishlist (${ids.length})</h3>
         <div class="product-grid">${ids.map(byId).filter(Boolean).map(p => `
           <article class="product-card">
             <div class="product-card__media"><a href="product-detail.html?id=${p.id}"><img src="${p.image}" alt="${esc(p.name)}" loading="lazy"></a></div>
             <div class="product-card__body">
               <span class="brand">${esc(p.brand)}</span>
               <h3><a href="product-detail.html?id=${p.id}">${esc(p.name)}</a></h3>
               <div class="price"><b>${money(priceOf(p))}</b>${p.discountPrice ? `<s>${money(p.price)}</s>` : ''}</div>
               <button class="btn btn--pink btn--sm" data-wadd="${p.id}">Add to Cart</button>
               <button class="btn btn--ghost btn--sm" data-wremove="${p.id}">Remove</button>
             </div></article>`).join('')}</div>`
      : `<div class="empty"><h3>Your wishlist is empty</h3><p class="muted">Tap the heart on any product to save it here.</p><a class="btn btn--pink" href="products.html">Browse products</a></div>`;
    host.onclick = e => {
      const add = e.target.closest('[data-wadd]'), rm = e.target.closest('[data-wremove]');
      if (add) {
        const p = byId(add.dataset.wadd);
        if (p.sizes.length > 1 || p.colors.length > 1) { location.href = `product-detail.html?id=${p.id}`; return; }
        Cart.add(p.id, p.sizes[0], p.colors[0], 1); toast('Added to bag', 'ok');
      } else if (rm) { Wishlist.remove(rm.dataset.wremove); toast('Removed from wishlist', 'info'); renderWishlist(); }
    };
  }

  /* Size preferences */
  function renderPrefs() {
    const prefs = Store.get(KEYS.prefs, { shirt: '', pants: '', shoe: '' });
    document.getElementById('tab-prefs').innerHTML = `
      <h3 style="font-family:var(--body);font-size:1rem">Size Preferences</h3>
      <p class="muted">Save your sizes so we can highlight the right fit for you.</p>
      <form id="prefForm">
        <div class="row-2">
          <div class="field"><label for="shirt">Shirt Size</label><select id="shirt" name="shirt">${['', ...APPAREL_SIZES].map(s => `<option ${prefs.shirt === s ? 'selected' : ''}>${s}</option>`).join('')}</select></div>
          <div class="field"><label for="pants">Pants Size</label><select id="pants" name="pants">${['', '28', '30', '32', '34', '36', '38'].map(s => `<option ${prefs.pants === s ? 'selected' : ''}>${s}</option>`).join('')}</select></div>
        </div>
        <div class="field"><label for="shoe">Shoe Size (UK)</label><select id="shoe" name="shoe">${['', ...SHOE_SIZES].map(s => `<option ${prefs.shoe === s ? 'selected' : ''}>${s}</option>`).join('')}</select></div>
        <button class="btn btn--pink" type="submit">Save Preferences</button>
      </form>`;
    document.getElementById('prefForm').onsubmit = e => {
      e.preventDefault();
      Store.set(KEYS.prefs, Object.fromEntries(new FormData(e.target).entries()));
      toast('Size preferences saved', 'ok');
    };
  }

  renderProfile(); renderOrders(); renderAddresses(); renderWishlist(); renderPrefs();
  document.addEventListener('wishlist:change', renderWishlist);
  const hash = location.hash.replace('#', '');
  if (TABS.some(([k]) => k === hash)) show(hash);
});
