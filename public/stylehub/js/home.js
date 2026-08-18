/* Home page rendering */
document.addEventListener('DOMContentLoaded', () => {
  const cats = [
    { name: 'Men', img: IMG.menHero, copy: 'Tailoring, denim & everyday essentials' },
    { name: 'Women', img: IMG.womenHero, copy: 'Dresses, knitwear & statement accessories' },
    { name: 'Kids', img: IMG.kidsHero, copy: 'Playful, soft and made to move' },
  ];
  document.getElementById('categoryCards').innerHTML = cats.map(c => `
    <a class="cat-card reveal" href="products.html?category=${c.name}">
      <img src="${c.img}" alt="${c.name}'s fashion collection">
      <div class="cat-card__body">
        <h3>${c.name}</h3>
        <p>${c.copy}</p>
        <span class="btn btn--light btn--sm" style="margin-top:12px">Explore Collection</span>
      </div>
    </a>`).join('');

  const featured = PRODUCTS.filter(p => p.featured).slice(0, 8);
  const trending = PRODUCTS.filter(p => p.trending).slice(0, 4);
  document.getElementById('featuredGrid').innerHTML = featured.map(productCard).join('');
  document.getElementById('trendingGrid').innerHTML = trending.map(productCard).join('');
  revealNew();
});
