/* Product listing: filtering, search, sorting */
document.addEventListener('DOMContentLoaded', () => {
  const state = {
    categories: qs('category') ? [qs('category')] : [],
    subs: qs('subcategory') ? [qs('subcategory')] : [],
    brands: [], sizes: [], colors: [],
    maxPrice: 14000,
    q: qs('q') || '',
    sort: qs('sort') || 'popular',
  };

  const el = id => document.getElementById(id);
  el('listSearch').value = state.q;
  el('sortBy').value = state.sort;

  if (state.categories.length) {
    el('listTitle').textContent = `${state.categories[0]}'s Collection`;
    el('crumbLabel').textContent = state.categories[0];
    el('listSubtitle').textContent = `Everything new in ${state.categories[0].toLowerCase()}'s fashion, footwear and accessories.`;
  } else if (state.subs.length) {
    el('listTitle').textContent = state.subs[0];
    el('crumbLabel').textContent = state.subs[0];
  }

  const uniq = arr => [...new Set(arr)];
  const allBrands = uniq(PRODUCTS.map(p => p.brand)).sort();
  const allSizes = uniq(PRODUCTS.flatMap(p => p.sizes));
  const allColors = uniq(PRODUCTS.flatMap(p => p.colors)).sort();

  const checkbox = (group, value, checked) =>
    `<label class="check"><input type="checkbox" data-group="${group}" value="${esc(value)}" ${checked ? 'checked' : ''}> ${esc(value)}</label>`;

  function renderFilters() {
    el('fCategory').innerHTML = Object.keys(CATEGORY_TREE).map(c => checkbox('categories', c, state.categories.includes(c))).join('');
    const subs = state.categories.length ? state.categories.flatMap(c => CATEGORY_TREE[c]) : uniq(Object.values(CATEGORY_TREE).flat());
    el('fSub').innerHTML = uniq(subs).map(s => checkbox('subs', s, state.subs.includes(s))).join('');
    el('fBrand').innerHTML = allBrands.map(b => checkbox('brands', b, state.brands.includes(b))).join('');
    el('fSize').innerHTML = allSizes.map(s => `<button class="chip ${state.sizes.includes(s) ? 'active' : ''}" data-size="${s}" aria-pressed="${state.sizes.includes(s)}">${s}</button>`).join('');
    el('fColor').innerHTML = allColors.map(c => `<button class="swatch ${state.colors.includes(c) ? 'active' : ''}" data-color="${c}" title="${c}" aria-label="Filter by ${c}" aria-pressed="${state.colors.includes(c)}" style="background:${COLOR_HEX[c] || '#ddd'}"></button>`).join('');
    el('priceLabel').textContent = money(state.maxPrice);
    el('fPrice').value = state.maxPrice;
  }

  function apply() {
    let list = PRODUCTS.filter(p => {
      if (state.categories.length && !state.categories.includes(p.category)) return false;
      if (state.subs.length && !state.subs.includes(p.subcategory)) return false;
      if (state.brands.length && !state.brands.includes(p.brand)) return false;
      if (state.sizes.length && !p.sizes.some(s => state.sizes.includes(s))) return false;
      if (state.colors.length && !p.colors.some(c => state.colors.includes(c))) return false;
      if (priceOf(p) > state.maxPrice) return false;
      if (state.q) {
        const hay = `${p.name} ${p.brand} ${p.category} ${p.subcategory} ${p.colors.join(' ')}`.toLowerCase();
        if (!hay.includes(state.q.toLowerCase())) return false;
      }
      return true;
    });
    const sorters = {
      low: (a, b) => priceOf(a) - priceOf(b),
      high: (a, b) => priceOf(b) - priceOf(a),
      newest: (a, b) => b.added - a.added,
      popular: (a, b) => b.reviews * b.rating - a.reviews * a.rating,
    };
    list.sort(sorters[state.sort]);

    el('resultCount').textContent = `Showing ${list.length} product${list.length === 1 ? '' : 's'}`;
    el('grid').innerHTML = list.map(productCard).join('');
    el('emptyState').innerHTML = list.length ? '' : `
      <div class="empty"><h3>No products found</h3>
      <p class="muted">Try removing a filter or searching for something else.</p>
      <button class="btn btn--pink" id="emptyClear">Clear all filters</button></div>`;
    const ec = document.getElementById('emptyClear');
    if (ec) ec.onclick = clearAll;
    revealNew();
  }

  function clearAll() {
    Object.assign(state, { categories: [], subs: [], brands: [], sizes: [], colors: [], maxPrice: 14000, q: '' });
    el('listSearch').value = '';
    history.replaceState({}, '', 'products.html');
    el('listTitle').textContent = 'The Collection';
    el('crumbLabel').textContent = 'Collections';
    renderFilters(); apply();
    toast('Filters cleared', 'info');
  }

  document.querySelector('.layout-sidebar').addEventListener('change', e => {
    const cb = e.target.closest('input[data-group]');
    if (!cb) return;
    const g = cb.dataset.group;
    state[g] = cb.checked ? [...state[g], cb.value] : state[g].filter(v => v !== cb.value);
    if (g === 'categories') state.subs = state.subs.filter(s => state.categories.length === 0 || state.categories.some(c => CATEGORY_TREE[c].includes(s)));
    renderFilters(); apply();
  });
  el('fSize').addEventListener('click', e => {
    const b = e.target.closest('[data-size]'); if (!b) return;
    const v = b.dataset.size;
    state.sizes = state.sizes.includes(v) ? state.sizes.filter(s => s !== v) : [...state.sizes, v];
    renderFilters(); apply();
  });
  el('fColor').addEventListener('click', e => {
    const b = e.target.closest('[data-color]'); if (!b) return;
    const v = b.dataset.color;
    state.colors = state.colors.includes(v) ? state.colors.filter(s => s !== v) : [...state.colors, v];
    renderFilters(); apply();
  });
  el('fPrice').addEventListener('input', e => { state.maxPrice = Number(e.target.value); el('priceLabel').textContent = money(state.maxPrice); apply(); });
  el('listSearch').addEventListener('input', e => { state.q = e.target.value.trim(); apply(); });
  el('sortBy').addEventListener('change', e => { state.sort = e.target.value; apply(); });
  el('clearFilters').addEventListener('click', clearAll);

  renderFilters(); apply();
});
