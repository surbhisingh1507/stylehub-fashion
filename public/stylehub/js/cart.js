/* Shopping bag page */
document.addEventListener('DOMContentLoaded', () => {
  const layout = document.getElementById('cartLayout');

  function render() {
    const items = Cart.all();
    if (!items.length) {
      layout.innerHTML = `<div class="empty" style="grid-column:1/-1">
        <h3>Your bag is empty</h3>
        <p class="muted">Nothing here yet — explore the new season edit and find something you love.</p>
        <a class="btn btn--pink" href="products.html">Continue Shopping</a></div>`;
      return;
    }
    layout.innerHTML = `<div class="panel" id="cartItems"></div><aside class="panel" id="cartSummary"></aside>`;
    document.getElementById('cartItems').innerHTML = items.map((it, i) => {
      const p = byId(it.id); if (!p) return '';
      return `<div class="cart-item">
        <a href="product-detail.html?id=${p.id}"><img src="${p.image}" alt="${esc(p.name)}"></a>
        <div>
          <span class="brand">${esc(p.brand)}</span>
          <h3 style="font-family:var(--body);font-size:1.02rem;margin:2px 0 4px"><a href="product-detail.html?id=${p.id}">${esc(p.name)}</a></h3>
          <p class="meta" style="margin:0">Size: <b>${esc(it.size)}</b> · Colour: <b>${esc(it.color)}</b></p>
          <div class="price" style="margin:6px 0"><b>${money(priceOf(p))}</b>${p.discountPrice ? `<s>${money(p.price)}</s>` : ''}</div>
          <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
            <div class="qty"><button data-dec="${i}" aria-label="Decrease quantity">−</button><span>${it.qty}</span><button data-inc="${i}" aria-label="Increase quantity">+</button></div>
            <button class="btn btn--ghost btn--sm" data-move="${i}">Move to Wishlist</button>
            <button class="btn btn--ghost btn--sm" data-del="${i}">Remove</button>
          </div>
        </div>
        <div style="text-align:right;font-weight:600">${money(priceOf(p) * it.qty)}</div>
      </div>`;
    }).join('');

    const t = Cart.totals(0);
    document.getElementById('cartSummary').innerHTML = `
      <h3 style="font-family:var(--body);font-size:1rem">Order Summary</h3>
      <div class="summary-row"><span>Subtotal (${Cart.count()} items)</span><span>${money(t.subtotal)}</span></div>
      <div class="summary-row"><span>Discount</span><span style="color:var(--pink)">− ${money(t.saved)}</span></div>
      <div class="summary-row"><span>Shipping</span><span>${t.shipping ? money(t.shipping) : 'Free'}</span></div>
      <div class="summary-row"><span>Tax (5% GST)</span><span>${money(t.tax)}</span></div>
      <div class="summary-row total"><span>Total</span><span>${money(t.total)}</span></div>
      <a class="btn btn--pink btn--block" style="margin-top:16px" href="checkout.html">Proceed to Checkout</a>
      <a class="btn btn--ghost btn--block" style="margin-top:10px" href="products.html">Continue Shopping</a>
      <p class="muted" style="font-size:.84rem;margin-top:14px">Have a coupon? Apply it at checkout — try STYLE10, WELCOME20 or FASHION30.</p>`;
  }

  layout.addEventListener('click', e => {
    const inc = e.target.closest('[data-inc]'), dec = e.target.closest('[data-dec]');
    const del = e.target.closest('[data-del]'), mv = e.target.closest('[data-move]');
    if (inc) { const i = +inc.dataset.inc; Cart.setQty(i, Cart.all()[i].qty + 1); render(); }
    else if (dec) { const i = +dec.dataset.dec; Cart.setQty(i, Cart.all()[i].qty - 1); render(); }
    else if (del) { Cart.remove(+del.dataset.del); toast('Item removed from bag', 'info'); render(); }
    else if (mv) {
      const i = +mv.dataset.move, item = Cart.all()[i];
      if (!Wishlist.has(item.id)) Wishlist.toggle(item.id); else toast('Already in wishlist', 'info');
      Cart.remove(i); render();
    }
  });

  render();
});
