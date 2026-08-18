/* Checkout: shipping, payment simulation, coupons, order creation */
document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('checkoutRoot');
  let coupon = null, method = 'card';

  if (!Cart.all().length) {
    root.innerHTML = `<div class="empty"><h3>Your bag is empty</h3><p class="muted">Add a few pieces before checking out.</p><a class="btn btn--pink" href="products.html">Shop the collection</a></div>`;
    return;
  }

  const user = Auth.current();
  const saved = Store.get(KEYS.addresses, [])[0] || {};

  root.innerHTML = `
  <p class="steps">Bag › <b>Details &amp; Payment</b> › Confirmation</p>
  <div class="cart-layout">
    <form class="panel" id="checkoutForm" novalidate>
      <h3 style="font-family:var(--body);font-size:1rem">Shipping Information</h3>
      <div class="row-2">
        <div class="field"><label for="name">Full Name</label><input id="name" name="name" value="${esc(user?.name || saved.name || '')}"><span class="err"></span></div>
        <div class="field"><label for="email">Email</label><input id="email" name="email" type="email" value="${esc(user?.email || saved.email || '')}"><span class="err"></span></div>
      </div>
      <div class="row-2">
        <div class="field"><label for="phone">Phone</label><input id="phone" name="phone" value="${esc(user?.phone || saved.phone || '')}"><span class="err"></span></div>
        <div class="field"><label for="city">City</label><input id="city" name="city" value="${esc(saved.city || '')}"><span class="err"></span></div>
      </div>
      <div class="field"><label for="address">Address</label><input id="address" name="address" value="${esc(saved.address || '')}"><span class="err"></span></div>
      <div class="row-2">
        <div class="field"><label for="state">State</label><input id="state" name="state" value="${esc(saved.state || '')}"><span class="err"></span></div>
        <div class="field"><label for="zip">ZIP / Postal Code</label><input id="zip" name="zip" value="${esc(saved.zip || '')}"><span class="err"></span></div>
      </div>
      <div class="field"><label for="country">Country</label>
        <select id="country" name="country">${['India','United States','United Kingdom','United Arab Emirates','Singapore','Australia'].map(c => `<option ${saved.country === c ? 'selected' : ''}>${c}</option>`).join('')}</select></div>

      <h3 style="font-family:var(--body);font-size:1rem;margin-top:26px">Payment Method</h3>
      <div class="pay-methods">
        <label class="pay-option active" data-pay="card"><input type="radio" name="pay" value="card" checked> <span><b>Credit / Debit Card</b><br><span class="muted" style="font-size:.86rem">Visa, Mastercard, Amex — simulated</span></span></label>
        <label class="pay-option" data-pay="upi"><input type="radio" name="pay" value="upi"> <span><b>UPI</b><br><span class="muted" style="font-size:.86rem">Pay with any UPI app — simulated</span></span></label>
        <label class="pay-option" data-pay="cod"><input type="radio" name="pay" value="cod"> <span><b>Cash on Delivery</b><br><span class="muted" style="font-size:.86rem">Pay in cash when your order arrives</span></span></label>
      </div>

      <div id="payCard" class="pay-panel" style="margin-top:18px">
        <div class="field"><label for="cardNumber">Card Number</label><input id="cardNumber" name="cardNumber" inputmode="numeric" placeholder="4242 4242 4242 4242"><span class="err"></span></div>
        <div class="row-2">
          <div class="field"><label for="expiry">Expiry Date</label><input id="expiry" name="expiry" placeholder="MM/YY"><span class="err"></span></div>
          <div class="field"><label for="cvv">CVV</label><input id="cvv" name="cvv" inputmode="numeric" placeholder="123"><span class="err"></span></div>
        </div>
        <div class="field"><label for="cardName">Card Holder Name</label><input id="cardName" name="cardName"><span class="err"></span></div>
      </div>
      <div id="payUpi" class="pay-panel" style="display:none;margin-top:18px">
        <div class="field"><label for="upi">UPI ID</label><input id="upi" name="upi" placeholder="yourname@bank"><span class="err"></span></div>
      </div>
      <div id="payCod" class="pay-panel" style="display:none;margin-top:18px">
        <p class="note note--ok" style="display:block">Pay ₹ in cash to the courier on delivery. Please keep exact change handy.</p>
      </div>

      <button class="btn btn--pink btn--block" style="margin-top:22px" type="submit">Place Order</button>
    </form>

    <aside class="panel">
      <h3 style="font-family:var(--body);font-size:1rem">Order Summary</h3>
      <div id="summaryItems"></div>
      <div class="field" style="margin-top:14px"><label for="couponCode">Coupon Code</label>
        <div class="coupon-form"><input id="couponCode" placeholder="STYLE10"><button class="btn btn--sm" id="applyCoupon" type="button">Apply</button></div>
        <p class="note" id="couponMsg" style="display:none"></p>
      </div>
      <div id="totals"></div>
    </aside>
  </div>`;

  const form = document.getElementById('checkoutForm');

  function renderSummary() {
    document.getElementById('summaryItems').innerHTML = Cart.all().map(it => {
      const p = byId(it.id);
      return `<div class="summary-row"><span>${esc(p.name)} <span class="muted">× ${it.qty} · ${esc(it.size)}/${esc(it.color)}</span></span><span>${money(priceOf(p) * it.qty)}</span></div>`;
    }).join('');
    const t = Cart.totals(coupon ? COUPONS[coupon] : 0);
    document.getElementById('totals').innerHTML = `
      <div class="summary-row"><span>Subtotal</span><span>${money(t.subtotal)}</span></div>
      <div class="summary-row"><span>Product discount</span><span style="color:var(--pink)">− ${money(t.saved)}</span></div>
      <div class="summary-row"><span>Coupon ${coupon ? '(' + coupon + ')' : ''}</span><span style="color:var(--pink)">− ${money(t.coupon)}</span></div>
      <div class="summary-row"><span>Shipping</span><span>${t.shipping ? money(t.shipping) : 'Free'}</span></div>
      <div class="summary-row"><span>Tax (5% GST)</span><span>${money(t.tax)}</span></div>
      <div class="summary-row total"><span>Total</span><span>${money(t.total)}</span></div>`;
  }
  renderSummary();

  document.getElementById('applyCoupon').onclick = () => {
    const code = document.getElementById('couponCode').value.trim().toUpperCase();
    const msg = document.getElementById('couponMsg');
    msg.style.display = 'block';
    if (COUPONS[code]) {
      coupon = code;
      msg.className = 'note note--ok';
      msg.textContent = `Coupon ${code} applied — ${COUPONS[code]}% off your order.`;
      toast('Coupon applied', 'ok');
    } else {
      coupon = null;
      msg.className = 'note note--err';
      msg.textContent = 'Invalid coupon code. Try STYLE10, WELCOME20 or FASHION30.';
      toast('Invalid coupon', 'err');
    }
    renderSummary();
  };

  form.addEventListener('change', e => {
    if (e.target.name !== 'pay') return;
    method = e.target.value;
    document.querySelectorAll('.pay-option').forEach(o => o.classList.toggle('active', o.dataset.pay === method));
    document.getElementById('payCard').style.display = method === 'card' ? 'block' : 'none';
    document.getElementById('payUpi').style.display = method === 'upi' ? 'block' : 'none';
    document.getElementById('payCod').style.display = method === 'cod' ? 'block' : 'none';
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const rules = {
      name: v => v.length >= 3 || 'Enter your full name',
      email: isEmail, phone: isPhone,
      address: v => v.length >= 6 || 'Enter your street address',
      city: required('City'), state: required('State'),
      zip: v => /^[0-9A-Za-z\s-]{4,10}$/.test(v) || 'Enter a valid ZIP / postal code',
    };
    if (method === 'card') Object.assign(rules, {
      cardNumber: v => /^[0-9\s]{12,19}$/.test(v) || 'Enter a valid card number',
      expiry: v => /^(0[1-9]|1[0-2])\/\d{2}$/.test(v) || 'Use MM/YY format',
      cvv: v => /^\d{3,4}$/.test(v) || 'Enter a valid CVV',
      cardName: required('Card holder name'),
    });
    if (method === 'upi') rules.upi = v => /^[\w.\-]{2,}@[a-z]{2,}$/i.test(v) || 'Enter a valid UPI ID';

    if (!validate(form, rules)) { toast('Please fix the highlighted fields', 'err'); return; }

    const t = Cart.totals(coupon ? COUPONS[coupon] : 0);
    const d = new Date(Date.now() + 4 * 864e5);
    const order = {
      id: 'SH' + Date.now().toString().slice(-8),
      date: new Date().toISOString(),
      items: Cart.all().map(i => { const p = byId(i.id); return { id: p.id, name: p.name, brand: p.brand, image: p.image, size: i.size, color: i.color, qty: i.qty, price: priceOf(p) }; }),
      totals: t, coupon, method,
      status: 'Processing',
      email: form.elements.email.value.trim(),
      delivery: d.toDateString(),
      shipping: { name: form.elements.name.value.trim(), address: form.elements.address.value.trim(), city: form.elements.city.value.trim(), state: form.elements.state.value.trim(), zip: form.elements.zip.value.trim(), country: form.elements.country.value, phone: form.elements.phone.value.trim() },
    };
    const orders = Store.get(KEYS.orders, []);
    orders.unshift(order); Store.set(KEYS.orders, orders);

    const addrs = Store.get(KEYS.addresses, []);
    if (!addrs.length) { Store.set(KEYS.addresses, [{ id: 'A' + Date.now(), label: 'Home', ...order.shipping, email: order.email }]); }

    Cart.clear();
    root.innerHTML = `
      <div class="panel center" style="max-width:640px;margin:0 auto;padding:52px 28px">
        <div class="confirm-icon" style="color:var(--pink)">${ICON.check}</div>
        <p class="eyebrow" style="margin-top:12px">Order confirmed</p>
        <h2>Thank you, ${esc(order.shipping.name.split(' ')[0])}!</h2>
        <p class="muted">Your StyleHub order has been placed successfully. A confirmation email is on its way to ${esc(order.email)}.</p>
        <div class="panel" style="text-align:left;margin-top:20px">
          <div class="summary-row"><span>Order ID</span><b>${order.id}</b></div>
          <div class="summary-row"><span>Payment</span><span>${method === 'cod' ? 'Cash on Delivery' : method === 'upi' ? 'UPI' : 'Card (simulated)'}</span></div>
          <div class="summary-row"><span>Estimated delivery</span><span>${order.delivery}</span></div>
          <div class="summary-row total"><span>Order total</span><span>${money(t.total)}</span></div>
        </div>
        <div style="display:flex;gap:12px;justify-content:center;margin-top:22px;flex-wrap:wrap">
          <a class="btn btn--pink" href="products.html">Continue Shopping</a>
          <a class="btn btn--ghost" href="account.html#orders">View Order History</a>
        </div>
      </div>`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast('Order placed successfully', 'ok');
  });
});
