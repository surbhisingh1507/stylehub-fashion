/* StyleHub — product catalogue & static data (frontend only) */
const U = (id, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const IMG = {
  shirt: U('1602810318383-e386cc2a3ccf'),
  tshirt: U('1521572163474-6864f9cf17ab'),
  tee2: U('1503341504253-dff4815485f1'),
  jeans: U('1542272604-787c3835535d'),
  chinos: U('1473966968600-fa801b869a1a'),
  blazer: U('1594938298603-c8148c4dae35'),
  suit: U('1507003211169-0a1dd7228f2d'),
  sneaker: U('1549298916-b41d501d3772'),
  leatherShoe: U('1614252369475-531eba835eb1'),
  watch: U('1524805444758-089113d48a6d'),
  belt: U('1553062407-98eeb64c6a62'),
  sunglass: U('1511499767150-a48a237f0083'),
  dress: U('1595777457583-95e059d581b8'),
  gown: U('1566174053879-31528523f8ae'),
  blouse: U('1551048632-24e444b48a3e'),
  top: U('1485231183945-fffde7cc051e'),
  skirt: U('1583496661160-fb5886a13d77'),
  wJeans: U('1594633312681-425c7b97ccd1'),
  heels: U('1543163521-1bf539c55dd2'),
  wSneaker: U('1600185365483-26d7a4cc7519'),
  handbag: U('1584917865442-de89df76afd3'),
  scarf: U('1520903920243-00d872a2d1c9'),
  jewel: U('1515562141207-7a88fb7ce338'),
  kidsBoy: U('1519238263530-99bdd11df2ea'),
  kidsGirl: U('1518831959646-742c3a14ebf7'),
  kidsGirl2: U('1518831959646-742c3a14ebf7'),
  infant: U('1522771930-78848d9293e8'),
  kidsShoe: U('1514989940723-e8e51635b782'),
  kidsAcc: U('1503944583220-79d8926ad5e2'),
  hoodie: U('1556821840-3a63f95609a7'),
  coat: U('1539533018447-63fcce2678e3'),
  knit: U('1576566588028-4147f3842f27'),
  menHero: U('1490578474895-699cd4e2cf59', 1400),
  womenHero: U('1483985988355-763728e1935b', 1400),
  kidsHero: U('1622290291468-a28f7a7dc6a8', 1400),
  hero: U('1509631179647-0177331693ae', 1800),
  banner: U('1445205170230-053b83016050', 1600),
  about1: U('1441984904996-e0b6ba687e04', 1200),
  about2: U('1558769132-cb1aea458c5e', 1200),
  sustain: U('1523381210434-271e8be1f52b', 1200),
  d1: U('1494790108377-be9c29b29330'),
  d2: U('1500648767791-00dcc994a43e'),
  d3: U('1534528741775-53994a69daeb'),
  d4: U('1507003211169-0a1dd7228f2d'),
};

const MATERIALS = ['100% Organic Cotton', 'Premium Linen Blend', 'Italian Wool Blend', 'Sustainable Viscose', 'Genuine Leather', 'Recycled Polyester Blend'];
const FITS = ['Regular Fit', 'Slim Fit', 'Oversized Fit', 'Relaxed Fit', 'Tailored Fit'];

const APPAREL_SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const SHOE_SIZES = ['6', '7', '8', '9', '10', '11'];
const KID_SIZES = ['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-11Y'];
const ONE_SIZE = ['One Size'];

const RAW = [
  // id, name, brand, category, subcategory, price, discount, colors, sizes, rating, reviews, image, featured, trending
  [1,'Premium Cotton Oversized Shirt','StyleHub','Men','Shirts & T-Shirts',2499,1799,['Black','White','Pink'],APPAREL_SIZES,4.7,124,IMG.shirt,1,1],
  [2,'Essential Pima Crew Tee','Noir Atelier','Men','Shirts & T-Shirts',1299,899,['White','Navy','Grey'],APPAREL_SIZES,4.5,318,IMG.tshirt,1,0],
  [3,'Heritage Striped Polo','Maison Rue','Men','Shirts & T-Shirts',1899,null,['Navy','White'],APPAREL_SIZES,4.3,86,IMG.tee2,0,1],
  [4,'Slim Tapered Dark Denim','Denim Co.','Men','Jeans & Trousers',3499,2449,['Blue','Black'],APPAREL_SIZES,4.6,203,IMG.jeans,1,1],
  [5,'Tailored Cotton Chinos','StyleHub','Men','Jeans & Trousers',2799,2099,['Beige','Navy','Olive'],APPAREL_SIZES,4.4,141,IMG.chinos,0,0],
  [6,'Milano Unstructured Blazer','Maison Rue','Men','Suits & Blazers',7999,5599,['Charcoal','Navy'],APPAREL_SIZES,4.8,64,IMG.blazer,1,1],
  [7,'Two-Piece Formal Suit','Noir Atelier','Men','Suits & Blazers',12999,9749,['Black','Grey'],APPAREL_SIZES,4.9,52,IMG.suit,1,0],
  [8,'Cloudstep Leather Sneakers','Aurum','Men','Footwear',5499,3849,['White','Black'],SHOE_SIZES,4.6,229,IMG.sneaker,1,1],
  [9,'Oxford Handcrafted Leather Shoes','Maison Rue','Men','Footwear',7499,null,['Brown','Black'],SHOE_SIZES,4.7,77,IMG.leatherShoe,0,0],
  [10,'Minimal Sapphire Wristwatch','Aurum','Men','Accessories',9999,7499,['Gold','Silver'],ONE_SIZE,4.8,158,IMG.watch,1,1],
  [11,'Italian Leather Belt','StyleHub','Men','Accessories',1999,1399,['Brown','Black'],ONE_SIZE,4.4,96,IMG.belt,0,0],
  [12,'Aviator Gold-Rim Sunglasses','Aurum','Men','Accessories',3499,2449,['Gold','Black'],ONE_SIZE,4.5,187,IMG.sunglass,0,1],
  [13,'Fleece-Lined Zip Hoodie','Urban Loom','Men','Shirts & T-Shirts',2999,2099,['Grey','Black','Pink'],APPAREL_SIZES,4.3,264,IMG.hoodie,0,1],
  [14,'Wool Longline Overcoat','Noir Atelier','Men','Suits & Blazers',13999,9799,['Camel','Charcoal'],APPAREL_SIZES,4.7,41,IMG.coat,1,0],

  [15,'Silk-Touch Wrap Midi Dress','Aurelia','Women','Dresses & Gowns',4599,3219,['Pink','Black','Emerald'],APPAREL_SIZES,4.8,412,IMG.dress,1,1],
  [16,'Satin Evening Gown','Maison Rue','Women','Dresses & Gowns',9999,6999,['Emerald','Black'],APPAREL_SIZES,4.9,88,IMG.gown,1,1],
  [17,'Ruffled Georgette Blouse','Aurelia','Women','Tops & Blouses',2299,1599,['White','Pink'],APPAREL_SIZES,4.5,176,IMG.blouse,1,0],
  [18,'Ribbed Knit Crop Top','Urban Loom','Women','Tops & Blouses',1499,1049,['Beige','Black','White'],APPAREL_SIZES,4.2,231,IMG.top,0,1],
  [19,'Pleated Midi Skirt','Aurelia','Women','Jeans & Skirts',2899,2029,['Blush','Navy'],APPAREL_SIZES,4.6,119,IMG.skirt,1,0],
  [20,'High-Rise Straight Jeans','Denim Co.','Women','Jeans & Skirts',3299,2309,['Blue','Black'],APPAREL_SIZES,4.5,287,IMG.wJeans,0,1],
  [21,'Stiletto Patent Heels','Aurum','Women','Footwear',5999,4199,['Black','Pink'],SHOE_SIZES,4.4,143,IMG.heels,1,1],
  [22,'Cloud Runner Sneakers','Urban Loom','Women','Footwear',4499,3149,['White','Pink'],SHOE_SIZES,4.6,321,IMG.wSneaker,0,0],
  [23,'Structured Leather Tote','Maison Rue','Women','Accessories',8999,6299,['Tan','Black'],ONE_SIZE,4.8,204,IMG.handbag,1,1],
  [24,'Printed Silk Scarf','Aurelia','Women','Accessories',1899,1329,['Pink','Gold'],ONE_SIZE,4.3,67,IMG.scarf,0,0],
  [25,'Gold Layered Necklace Set','Aurum','Women','Accessories',3999,2799,['Gold'],ONE_SIZE,4.7,255,IMG.jewel,1,1],
  [26,'Merino Oversized Cardigan','Noir Atelier','Women','Tops & Blouses',5499,3849,['Cream','Grey'],APPAREL_SIZES,4.6,94,IMG.knit,0,0],

  [27,'Boys Cotton Casual Shirt','Little Rue','Kids','Boys Clothing',1299,899,['Blue','White'],KID_SIZES,4.4,73,IMG.kidsBoy,1,0],
  [28,'Boys Denim Dungaree Set','Little Rue','Kids','Boys Clothing',1899,1329,['Blue'],KID_SIZES,4.5,58,IMG.kidsAcc,0,1],
  [29,'Girls Floral Party Dress','Little Rue','Kids','Girls Clothing',1999,1399,['Pink','White'],KID_SIZES,4.8,162,IMG.kidsGirl,1,1],
  [30,'Girls Knit Sweater Dress','Aurelia Mini','Kids','Girls Clothing',1699,1189,['Cream','Pink'],KID_SIZES,4.3,49,IMG.kidsGirl2,0,0],
  [31,'Organic Infant Bodysuit Pack','Little Rue','Kids','Infant Wear',1499,999,['White','Beige'],['0-3M','3-6M','6-12M'],4.7,208,IMG.infant,1,1],
  [32,'Kids Everyday Sneakers','Urban Loom','Kids','Kids Footwear',2199,1539,['White','Pink','Blue'],['UK 8','UK 9','UK 10','UK 11','UK 12'],4.5,131,IMG.kidsShoe,0,1],
  [33,'Kids Sun Hat & Bag Set','Little Rue','Kids','Kids Accessories',999,699,['Beige','Pink'],ONE_SIZE,4.2,37,IMG.kidsAcc,0,0],
  [34,'Girls Denim Jacket','Denim Co.','Kids','Girls Clothing',2299,1609,['Blue'],KID_SIZES,4.6,64,IMG.kidsGirl,0,0],
];

const COLOR_HEX = {
  Black:'#1A1A2E', White:'#ffffff', Pink:'#E91E63', Navy:'#25314f', Grey:'#9a9aa5',
  Blue:'#3b6ea5', Beige:'#e6d9c3', Olive:'#6b7350', Charcoal:'#3a3a44', Brown:'#7a4a20',
  Gold:'#C9A227', Silver:'#c9ccd4', Camel:'#c19a6b', Emerald:'#0f6b56', Blush:'#f2c9d6',
  Tan:'#c9884f', Cream:'#f4efe4'
};

const PRODUCTS = RAW.map((r, i) => {
  const [id,name,brand,category,subcategory,price,discountPrice,colors,sizes,rating,reviews,image] = r;
  return {
    id, name, brand, category, subcategory, price, discountPrice, colors, sizes, rating, reviews, image,
    featured: !!r[12], trending: !!r[13],
    added: 1000 + (RAW.length - i),
    material: MATERIALS[i % MATERIALS.length],
    fit: subcategory === 'Footwear' || subcategory === 'Accessories' ? 'True to size' : FITS[i % FITS.length],
    care: 'Machine wash cold with like colours. Do not bleach. Warm iron on reverse.',
    description: `${name} by ${brand} — crafted for the modern wardrobe. A refined ${subcategory.toLowerCase()} piece with impeccable finishing, considered proportions and a premium hand-feel that carries you from day to evening.`,
    gallery: [image, IMG.womenHero, IMG.menHero, IMG.banner],
  };
});

const CATEGORY_TREE = {
  Men: ['Shirts & T-Shirts','Jeans & Trousers','Suits & Blazers','Footwear','Accessories'],
  Women: ['Dresses & Gowns','Tops & Blouses','Jeans & Skirts','Footwear','Accessories'],
  Kids: ['Boys Clothing','Girls Clothing','Infant Wear','Kids Footwear','Kids Accessories'],
};

const COUPONS = { STYLE10:10, WELCOME20:20, FASHION30:30 };
