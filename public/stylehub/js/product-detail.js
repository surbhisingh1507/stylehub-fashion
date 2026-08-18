/* Product detail page */
document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('pdRoot');
  const p = byId(qs('id'));
  if (!p) {
    root.innerHTML = `<div class="empty"><h3>Product not found</h3><p class="muted">This piece may have sold out or moved.</p><a class="btn btn--pink" href="products.html">Back to collection</a></div>`;
    return;
  }
  document.title = `${p.name} — ${p.brand} | StyleHub`;
  const sel = { size: null, color: null, qty: 1 };
  const wished = () => Wishlist.has(p.id);
  const needsSize = p.sizes.length > 1 || p.sizes[0] !== 'One Size';

  root.innerHTML = `
  <p class="crumbs" style="color:var(--muted)"><a href="index.html">Home</a> / <a href="products.html?category=${p.category}">${p.category}</a> / <a href="products.html?subcategory=${encodeURIComponent(p.subcategory)}">${esc(p.subcategory)}</a> / ${esc(p.name)}</p>
  <div class="pd">
    <div>
      <div class="pd__main"><img id="mainImg" src="${p.gallery[0]}" alt="${esc(p.name)} — main view"></div>
      <div class="thumbs" role="tablist" aria-label="Product images">
        ${p.gallery.map((g, i) => `<button class="${i === 0 ? 'active' : ''}" data-thumb="${i}" aria-label="View image ${i + 1}"><img src="${g}" alt="${esc(p.name)} view ${i + 1}"></button>`).join('')}
      </div>
    </div>
    <div>
      <span class="brand">${esc(p.brand)}</span>
      <h1 style="font-size:2.1rem;margin:6px 0 8px">${esc(p.name)}</h1>
      <p class="rating"><span class="star">★</span> ${p.rating} · <span class="muted">${p.reviews} reviews</span> · <span class="muted">${esc(p.subcategory)}</span></p>
      <div class="price" style="margin:14px 0"><b style="font-size:1.7rem">${money(priceOf(p))}</b>
        ${p.discountPrice ? `<s>${money(p.price)}</s><span class="off">${discountPct(p)}% off</span>` : ''}</div>
      <p class="muted">${esc(p.description)}</p>

      <div style="margin-top:22px">
        <h4 style="font-family:var(--body);font-size:.82rem;letter-spacing:.18em;text-transform:uppercase;color:var(--muted)">Colour ${p.colors.length > 1 ? '<span style="color:var(--pink)">*</span>' : ''}</h4>
        <div class="chips" id="colorPick">
          ${p.colors.map(c => `<button class="chip" data-color="${c}" aria-pressed="false"><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${COLOR_HEX[c] || '#ddd'};border:1px solid var(--line);margin-right:6px"></span>${c}</button>`).join('')}
        </div>
      </div>

      <div style="margin-top:18px">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <h4 style="font-family:var(--body);font-size:.82rem;letter-spacing:.18em;text-transform:uppercase;color:var(--muted)">Available Sizes ${needsSize ? '<span style="color:var(--pink)">*</span>' : ''}</h4>
          <span class="muted" style="font-size:.84rem">${esc(p.fit)}</span>
        </div>
        <div class="chips" id="sizePick">
          ${p.sizes.map(s => `<button class="chip" data-size="${s}" aria-pressed="false">${s}</button>`).join('')}
        </div>
      </div>

      <div style="display:flex;gap:14px;align-items:center;margin-top:22px;flex-wrap:wrap">
        <div class="qty"><button id="qMinus" aria-label="Decrease quantity">−</button><span id="qVal" aria-live="polite">1</span><button id="qPlus" aria-label="Increase quantity">+</button></div>
        <button class="btn btn--pink" id="addCart">Add to Cart</button>
        <button class="btn" id="buyNow">Buy Now</button>
        <button class="btn btn--ghost" id="wishBtn">${wished() ? '♥ In Wishlist' : '♡ Wishlist'}</button>
      </div>
      <p class="note note--err" id="pdMsg" style="display:none"></p>

      <div class="accordion" style="margin-top:30px">
        <details open><summary>Product Information</summary>
          <ul class="muted" style="margin:10px 0 0;padding-left:18px">
            <li><b>Material:</b> ${esc(p.material)}</li>
            <li><b>Fit:</b> ${esc(p.fit)}</li>
            <li><b>Care:</b> ${esc(p.care)}</li>
            <li><b>Brand:</b> ${esc(p.brand)}</li>
          </ul></details>
        <details><summary>Shipping Information</summary>
          <p class="muted" style="margin-top:10px">Free express shipping on orders over ₹2,999. Standard delivery in 3–5 business days, express in 24–48 hours across metro cities. Every order is tracked end-to-end.</p></details>
        <details><summary>Return Policy</summary>
          <p class="muted" style="margin-top:10px">30-day easy returns and free exchanges on unworn items with tags attached. Refunds are processed within 5 working days of pickup.</p></details>
      </div>
    </div>
  </div>`;

  const msg = document.getElementById('pdMsg');
  const showMsg = (text, ok = false) => { msg.textContent = text; msg.className = 'note ' + (ok ? 'note--ok' : 'note--err'); msg.style.display = 'block'; };

  root.querySelector('.thumbs').addEventListener('click', e => {
    const b = e.target.closest('[data-thumb]'); if (!b) return;
    root.querySelectorAll('.thumbs button').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    document.getElementById('mainImg').src = p.gallery[Number(b.dataset.thumb)];
  });
  const pick = (containerId, key) => document.getElementById(containerId).addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    document.querySelectorAll(`#${containerId} .chip`).forEach(c => { c.classList.remove('active'); c.setAttribute('aria-pressed', 'false'); });
    b.classList.add('active'); b.setAttribute('aria-pressed', 'true');
    sel[key] = b.dataset[key];
    msg.style.display = 'none';
  });
  pick('colorPick', 'color'); pick('sizePick', 'size');

  document.getElementById('qMinus').onclick = () => { sel.qty = Math.max(1, sel.qty - 1); document.getElementById('qVal').textContent = sel.qty; };
  document.getElementById('qPlus').onclick = () => { sel.qty = Math.min(10, sel.qty + 1); document.getElementById('qVal').textContent = sel.qty; };

  function tryAdd() {
    if (!sel.color && p.colors.length >= 1) { showMsg('Please select a colour before adding this item to your bag.'); return false; }
    if (needsSize && !sel.size) { showMsg('Please select a size before adding this item to your bag.'); return false; }
    Cart.add(p.id, sel.size || p.sizes[0], sel.color, sel.qty);
    showMsg(`Added ${sel.qty} × ${p.name} (${sel.size || p.sizes[0]} / ${sel.color}) to your bag.`, true);
    toast('Added to bag', 'ok');
    return true;
  }
  document.getElementById('addCart').onclick = tryAdd;
  document.getElementById('buyNow').onclick = () => { if (tryAdd()) location.href = 'checkout.html'; };
  document.getElementById('wishBtn').onclick = e => {
    const on = Wishlist.toggle(p.id);
    e.currentTarget.textContent = on ? '♥ In Wishlist' : '♡ Wishlist';
  };

  const related = PRODUCTS.filter(r => r.id !== p.id && (r.subcategory === p.subcategory || r.category === p.category)).slice(0, 4);
  document.getElementById('related').innerHTML = related.map(productCard).join('');
  revealNew();
});
