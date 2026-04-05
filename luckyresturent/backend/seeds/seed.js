const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const User = require('../models/User');
const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');
const Review = require('../models/Review');

const UNSPLASH = 'https://images.unsplash.com';

// Category images from Unsplash (free, high quality)
const categoryImages = {
  chicken: `${UNSPLASH}/photo-1598103442097-8b74df4c1st0?w=600&q=80`,
  tandoor: `${UNSPLASH}/photo-1599487488170-d11ec9c172f0?w=600&q=80`,
  mutton: `${UNSPLASH}/photo-1545247181-516773cae754?w=600&q=80`,
  egg: `${UNSPLASH}/photo-1482049016688-2d3e1b311543?w=600&q=80`,
  biryani: `${UNSPLASH}/photo-1563379091339-03b21ab4a4f8?w=600&q=80`,
  rice: `${UNSPLASH}/photo-1536304929831-ee1ca9d44906?w=600&q=80`,
  salad: `${UNSPLASH}/photo-1512621776951-a57141f2eefd?w=600&q=80`,
  bread: `${UNSPLASH}/photo-1549931319-a545753d62ce?w=600&q=80`,
  icecream: `${UNSPLASH}/photo-1501443762994-82bd5dace89a?w=600&q=80`,
  raita: `${UNSPLASH}/photo-1631452180519-c014fe946bc7?w=600&q=80`,
  southindian: `${UNSPLASH}/photo-1630383249896-424e482df921?w=600&q=80`,
  mithas: `${UNSPLASH}/photo-1551024601-bec78aea704b?w=600&q=80`,
  shakes: `${UNSPLASH}/photo-1572490122747-3968b75cc699?w=600&q=80`,
  softdrinks: `${UNSPLASH}/photo-1581006852262-e4307cf6283a?w=600&q=80`,
  hotdrinks: `${UNSPLASH}/photo-1461023058943-07fcbe16d735?w=600&q=80`,
  vegsoups: `${UNSPLASH}/photo-1547592166-23ac45744acd?w=600&q=80`,
  nonvegsoups: `${UNSPLASH}/photo-1603105037880-880cd4edfb0d?w=600&q=80`,
  bake: `${UNSPLASH}/photo-1555939594-58d7cb561ad1?w=600&q=80`,
  snacks: `${UNSPLASH}/photo-1565299624946-b28f40a0ae38?w=600&q=80`,
  noodlesveg: `${UNSPLASH}/photo-1569718212165-3a8278d5f624?w=600&q=80`,
  noodlesnonveg: `${UNSPLASH}/photo-1612929633738-8fe44f7ec841?w=600&q=80`,
  chineseveg: `${UNSPLASH}/photo-1525755662778-989d0524087e?w=600&q=80`,
  chinesenonveg: `${UNSPLASH}/photo-1534422298391-e4f8c172dddb?w=600&q=80`,
  riceveg: `${UNSPLASH}/photo-1596560548464-f010549b84d7?w=600&q=80`,
  ricenonveg: `${UNSPLASH}/photo-1512058564366-18510be2db19?w=600&q=80`,
  lunchdinner: `${UNSPLASH}/photo-1585937421612-70a008356fbe?w=600&q=80`
};

// Food item images by type
const foodImages = {
  chicken_curry: `${UNSPLASH}/photo-1603894584373-5ac82b2ae398?w=400&q=80`,
  chicken_tikka: `${UNSPLASH}/photo-1599487488170-d11ec9c172f0?w=400&q=80`,
  tandoori: `${UNSPLASH}/photo-1610057099431-d73a1c9d2f2f?w=400&q=80`,
  mutton_curry: `${UNSPLASH}/photo-1545247181-516773cae754?w=400&q=80`,
  egg_dish: `${UNSPLASH}/photo-1482049016688-2d3e1b311543?w=400&q=80`,
  biryani: `${UNSPLASH}/photo-1563379091339-03b21ab4a4f8?w=400&q=80`,
  pulao: `${UNSPLASH}/photo-1536304929831-ee1ca9d44906?w=400&q=80`,
  salad: `${UNSPLASH}/photo-1512621776951-a57141f2eefd?w=400&q=80`,
  naan: `${UNSPLASH}/photo-1549931319-a545753d62ce?w=400&q=80`,
  roti: `${UNSPLASH}/photo-1565557623262-b51c2513a641?w=400&q=80`,
  paratha: `${UNSPLASH}/photo-1626132647523-66f5bf380027?w=400&q=80`,
  icecream: `${UNSPLASH}/photo-1501443762994-82bd5dace89a?w=400&q=80`,
  raita: `${UNSPLASH}/photo-1631452180519-c014fe946bc7?w=400&q=80`,
  dosa: `${UNSPLASH}/photo-1630383249896-424e482df921?w=400&q=80`,
  uttapam: `${UNSPLASH}/photo-1645177628172-a94c1f96e6db?w=400&q=80`,
  sweet: `${UNSPLASH}/photo-1551024601-bec78aea704b?w=400&q=80`,
  shake: `${UNSPLASH}/photo-1572490122747-3968b75cc699?w=400&q=80`,
  colddrink: `${UNSPLASH}/photo-1581006852262-e4307cf6283a?w=400&q=80`,
  coffee: `${UNSPLASH}/photo-1461023058943-07fcbe16d735?w=400&q=80`,
  tea: `${UNSPLASH}/photo-1556679343-c7306c1976bc?w=400&q=80`,
  soup: `${UNSPLASH}/photo-1547592166-23ac45744acd?w=400&q=80`,
  nonvegsoup: `${UNSPLASH}/photo-1603105037880-880cd4edfb0d?w=400&q=80`,
  bake: `${UNSPLASH}/photo-1555939594-58d7cb561ad1?w=400&q=80`,
  pizza: `${UNSPLASH}/photo-1565299624946-b28f40a0ae38?w=400&q=80`,
  burger: `${UNSPLASH}/photo-1568901346375-23c9450c58cd?w=400&q=80`,
  sandwich: `${UNSPLASH}/photo-1528735602780-2552fd46c7af?w=400&q=80`,
  noodles: `${UNSPLASH}/photo-1569718212165-3a8278d5f624?w=400&q=80`,
  chowmein: `${UNSPLASH}/photo-1612929633738-8fe44f7ec841?w=400&q=80`,
  manchurian: `${UNSPLASH}/photo-1525755662778-989d0524087e?w=400&q=80`,
  friedrice: `${UNSPLASH}/photo-1512058564366-18510be2db19?w=400&q=80`,
  paneer: `${UNSPLASH}/photo-1585937421612-70a008356fbe?w=400&q=80`,
  dal: `${UNSPLASH}/photo-1546833999-b9f581a1996d?w=400&q=80`,
  mushroom: `${UNSPLASH}/photo-1504674900247-0877df9cc836?w=400&q=80`,
  kofta: `${UNSPLASH}/photo-1574484284002-952d92456975?w=400&q=80`,
  chilli: `${UNSPLASH}/photo-1534422298391-e4307cf6283a?w=400&q=80`,
  spring_roll: `${UNSPLASH}/photo-1548340748-6d2b7d7da280?w=400&q=80`,
  cutlet: `${UNSPLASH}/photo-1555939594-58d7cb561ad1?w=400&q=80`,
  chips: `${UNSPLASH}/photo-1573080496219-bb080dd4f877?w=400&q=80`,
  lassi: `${UNSPLASH}/photo-1626200419199-391ae4be7a41?w=400&q=80`,
  juice: `${UNSPLASH}/photo-1534353473418-4cfa6c56fd38?w=400&q=80`,
  water: `${UNSPLASH}/photo-1548839140-29a749e1cf4d?w=400&q=80`,
  milk: `${UNSPLASH}/photo-1550583724-b2692b85b150?w=400&q=80`,
  papad: `${UNSPLASH}/photo-1601050690117-94f5f6fa8bd7?w=400&q=80`,
};

const categories = [
  { name: 'Chicken', slug: 'chicken', order: 1, image: categoryImages.chicken, description: 'Signature chicken dishes cooked with aromatic spices' },
  { name: 'Tandoor Ki Gujarish', slug: 'tandoor-ki-gujarish', order: 2, image: categoryImages.tandoor, description: 'Clay oven specialties' },
  { name: 'Mutton', slug: 'mutton', order: 3, image: categoryImages.mutton, description: 'Tender mutton preparations' },
  { name: 'Egg', slug: 'egg', order: 4, image: categoryImages.egg, description: 'Delicious egg varieties' },
  { name: 'Biryani', slug: 'biryani', order: 5, image: categoryImages.biryani, description: 'Aromatic biryanis cooked to perfection' },
  { name: 'Rice & Pulao', slug: 'rice-pulao', order: 6, image: categoryImages.rice, description: 'Flavorful rice dishes' },
  { name: 'Salad & Papad', slug: 'salad-papad', order: 7, image: categoryImages.salad, description: 'Fresh salads and crispy papads' },
  { name: 'Bread', slug: 'bread', order: 8, image: categoryImages.bread, description: 'Freshly baked naans, rotis & parathas' },
  { name: 'Ice Cream', slug: 'ice-cream', order: 9, image: categoryImages.icecream, description: 'Chilled dessert delights' },
  { name: 'Raita', slug: 'raita', order: 10, image: categoryImages.raita, description: 'Cool yogurt accompaniments' },
  { name: 'South Indian', slug: 'south-indian', order: 11, image: categoryImages.southindian, description: 'Classic South Indian favorites' },
  { name: 'Mithas', slug: 'mithas', order: 12, image: categoryImages.mithas, description: 'Traditional Indian sweets' },
  { name: 'Shakes', slug: 'shakes', order: 13, image: categoryImages.shakes, description: 'Creamy milkshakes' },
  { name: 'Soft Drinks', slug: 'soft-drinks', order: 14, image: categoryImages.softdrinks, description: 'Refreshing cold beverages' },
  { name: 'Hot Drinks', slug: 'hot-drinks', order: 15, image: categoryImages.hotdrinks, description: 'Warm drinks to comfort you' },
  { name: 'Veg Soups', slug: 'veg-soups', order: 16, image: categoryImages.vegsoups, description: 'Wholesome vegetarian soups' },
  { name: 'Non Veg Soups', slug: 'non-veg-soups', order: 17, image: categoryImages.nonvegsoups, description: 'Rich non-veg soups' },
  { name: 'Bake Dishes', slug: 'bake-dishes', order: 18, image: categoryImages.bake, description: 'Oven baked specialties' },
  { name: 'Snacks', slug: 'snacks', order: 19, image: categoryImages.snacks, description: 'Quick bites and starters' },
  { name: 'Noodles Veg', slug: 'noodles-veg', order: 20, image: categoryImages.noodlesveg, description: 'Vegetarian noodle dishes' },
  { name: 'Noodles Non Veg', slug: 'noodles-non-veg', order: 21, image: categoryImages.noodlesnonveg, description: 'Non-veg noodle specialties' },
  { name: 'Chinese (Veg)', slug: 'chinese-veg', order: 22, image: categoryImages.chineseveg, description: 'Vegetarian Chinese favorites' },
  { name: 'Chinese (Non Veg)', slug: 'chinese-non-veg', order: 23, image: categoryImages.chinesenonveg, description: 'Non-veg Chinese specialties' },
  { name: 'Rice (Veg)', slug: 'rice-veg', order: 24, image: categoryImages.riceveg, description: 'Vegetarian rice dishes' },
  { name: 'Rice (Non Veg)', slug: 'rice-non-veg', order: 25, image: categoryImages.ricenonveg, description: 'Non-veg rice preparations' },
  { name: 'Lunch & Dinner (Veg)', slug: 'lunch-dinner-veg', order: 26, image: categoryImages.lunchdinner, description: 'Main course vegetarian dishes' }
];

// All items exactly from the menu photos
const menuItems = {
  'chicken': [
    { name: 'Lucky Special Chicken Rara', priceHalf: 410, priceFull: 750, isSpecial: true, tags: ['bestseller', 'special'], image: foodImages.chicken_curry },
    { name: 'Butter Chicken', priceHalf: 380, priceFull: 710, tags: ['bestseller'], image: foodImages.chicken_curry },
    { name: 'Chicken Korma', priceHalf: 370, priceFull: 690, image: foodImages.chicken_curry },
    { name: 'Chicken Kashmiri', priceHalf: 370, priceFull: 690, image: foodImages.chicken_curry },
    { name: 'Chicken -O- Mughlai', priceHalf: 370, priceFull: 690, image: foodImages.chicken_curry },
    { name: 'Chicken Matki', priceHalf: 370, priceFull: 690, image: foodImages.chicken_curry },
    { name: 'Chicken Handi', priceHalf: 370, priceFull: 690, image: foodImages.chicken_curry },
    { name: 'Chicken Kadhai', priceHalf: 370, priceFull: 690, image: foodImages.chicken_curry },
    { name: 'Chicken Kali Mirch', priceHalf: 370, priceFull: 690, image: foodImages.chicken_curry },
    { name: 'Chicken Hariyali', priceHalf: 370, priceFull: 690, image: foodImages.chicken_curry },
    { name: 'Chicken Masala', priceHalf: 370, priceFull: 690, image: foodImages.chicken_curry },
    { name: 'Afghani Chicken', priceHalf: 370, priceFull: 690, image: foodImages.chicken_curry },
    { name: 'Chicken Do Payaza', priceHalf: 370, priceFull: 690, image: foodImages.chicken_curry },
    { name: 'Chicken Rogan Josh', priceHalf: 370, priceFull: 690, image: foodImages.chicken_curry },
    { name: 'Methi Malai Chicken', priceHalf: 370, priceFull: 690, image: foodImages.chicken_curry },
    { name: 'Chicken Curry', priceHalf: 350, priceFull: 670, image: foodImages.chicken_curry }
  ],
  'tandoor-ki-gujarish': [
    { name: 'Chicken Tikka (8 Pcs)', priceFull: 330, image: foodImages.chicken_tikka },
    { name: 'Tandoori Chicken (H/F)', priceHalf: 290, priceFull: 560, image: foodImages.tandoori },
    { name: 'Paneer Tikka (8 pc)', priceFull: 260, isVeg: true, image: foodImages.paneer }
  ],
  'mutton': [
    { name: 'Mutton Keema Wala', priceFull: 460, image: foodImages.mutton_curry },
    { name: 'Mutton Dahi Wala', priceFull: 400, image: foodImages.mutton_curry },
    { name: 'Mutton Saag Wala', priceFull: 400, image: foodImages.mutton_curry },
    { name: 'Mutton Kadhai', priceFull: 400, image: foodImages.mutton_curry },
    { name: 'Mutton Korma', priceFull: 400, image: foodImages.mutton_curry },
    { name: 'Mutton-Do-Pyaza', priceFull: 400, image: foodImages.mutton_curry },
    { name: 'Mutton Chatpata', priceFull: 400, image: foodImages.mutton_curry },
    { name: 'Mutton Rogan Josh', priceFull: 400, image: foodImages.mutton_curry },
    { name: 'Mutton Curry', priceFull: 400, image: foodImages.mutton_curry }
  ],
  'egg': [
    { name: 'Stuff Omelette (Mushroom)', priceFull: 150, image: foodImages.egg_dish },
    { name: 'Eggs Masala', priceFull: 200, image: foodImages.egg_dish },
    { name: 'Egg Curry', priceFull: 180, image: foodImages.egg_dish },
    { name: 'Omelette with Slice', priceFull: 100, image: foodImages.egg_dish },
    { name: 'Egg Bhujia (two eggs)', priceFull: 120, image: foodImages.egg_dish },
    { name: 'Egg Omelette', priceFull: 90, image: foodImages.egg_dish }
  ],
  'biryani': [
    { name: 'Hyderabadi Biryani (non-veg)', priceFull: 290, image: foodImages.biryani },
    { name: 'Chicken Biryani', priceFull: 260, image: foodImages.biryani },
    { name: 'Mutton Biryani', priceFull: 330, image: foodImages.biryani },
    { name: 'Egg Biryani', priceFull: 230, image: foodImages.biryani },
    { name: 'Veg. Biryani', priceFull: 200, isVeg: true, image: foodImages.biryani }
  ],
  'rice-pulao': [
    { name: 'Rang Taran Kash. Pulao', priceFull: 210, isVeg: true, image: foodImages.pulao },
    { name: 'Cheese Pulao', priceFull: 190, isVeg: true, image: foodImages.pulao },
    { name: 'Veg. Pulao/Peas Pulao', priceFull: 180, isVeg: true, image: foodImages.pulao },
    { name: 'Jeera Rice', priceFull: 150, isVeg: true, image: foodImages.pulao },
    { name: 'Plain Rice (H/F)', priceHalf: 70, priceFull: 110, isVeg: true, image: foodImages.pulao }
  ],
  'salad-papad': [
    { name: 'Aloo Chat Salad', priceFull: 90, isVeg: true, image: foodImages.salad },
    { name: 'Garden Green Salad', priceFull: 80, isVeg: true, image: foodImages.salad },
    { name: 'Masala Papad Sour', priceFull: 70, isVeg: true, image: foodImages.papad },
    { name: 'Cucumber Salad', priceFull: 60, isVeg: true, image: foodImages.salad },
    { name: 'Onion Salad', priceFull: 50, isVeg: true, image: foodImages.salad },
    { name: 'Fry Papad', priceFull: 60, isVeg: true, image: foodImages.papad },
    { name: 'Dry Papad', priceFull: 40, isVeg: true, image: foodImages.papad }
  ],
  'bread': [
    { name: 'Kashmiri Naan', priceFull: 90, isVeg: true, image: foodImages.naan },
    { name: 'Keema Naan', priceFull: 100, image: foodImages.naan },
    { name: 'Cheese Naan', priceFull: 70, isVeg: true, image: foodImages.naan },
    { name: 'Egg Paratha', priceFull: 70, image: foodImages.paratha },
    { name: 'Stuff Paratha', priceFull: 55, isVeg: true, image: foodImages.paratha },
    { name: 'Pudina Paratha', priceFull: 55, isVeg: true, image: foodImages.paratha },
    { name: 'Mirchi Paratha', priceFull: 40, isVeg: true, image: foodImages.paratha },
    { name: 'Garlic Naan', priceFull: 55, isVeg: true, image: foodImages.naan },
    { name: 'Stuff Naan', priceFull: 55, isVeg: true, image: foodImages.naan },
    { name: 'Butter Naan', priceFull: 45, isVeg: true, image: foodImages.naan },
    { name: 'Lacha Paratha', priceFull: 35, isVeg: true, image: foodImages.paratha },
    { name: 'Naan', priceFull: 35, isVeg: true, image: foodImages.naan },
    { name: 'Missi Roti', priceFull: 35, isVeg: true, image: foodImages.roti },
    { name: 'Butter Roti', priceFull: 20, isVeg: true, image: foodImages.roti },
    { name: 'Roti', priceFull: 15, isVeg: true, image: foodImages.roti }
  ],
  'ice-cream': [
    { name: 'Tutti Fruity', priceFull: 150, isVeg: true, image: foodImages.icecream },
    { name: 'Kesar Pista', priceFull: 90, isVeg: true, image: foodImages.icecream },
    { name: 'Black Current', priceFull: 90, isVeg: true, image: foodImages.icecream },
    { name: 'Butter Scotch', priceFull: 90, isVeg: true, image: foodImages.icecream },
    { name: 'Chocolate', priceFull: 90, isVeg: true, image: foodImages.icecream },
    { name: 'Pineapple', priceFull: 90, isVeg: true, image: foodImages.icecream },
    { name: 'Vanilla', priceFull: 80, isVeg: true, image: foodImages.icecream },
    { name: 'Strawberry', priceFull: 80, isVeg: true, image: foodImages.icecream }
  ],
  'raita': [
    { name: 'Pineapple Raita', priceFull: 170, isVeg: true, image: foodImages.raita },
    { name: 'Mix Fruit Raita', priceFull: 170, isVeg: true, image: foodImages.raita },
    { name: 'Mix Raita, Boondi Raita', priceFull: 120, isVeg: true, image: foodImages.raita },
    { name: 'Tomato, Aloo & Onion Raita', priceFull: 120, isVeg: true, image: foodImages.raita },
    { name: 'Plain Curd', priceFull: 90, isVeg: true, image: foodImages.raita }
  ],
  'south-indian': [
    { name: 'Plain Paper Dosa', priceFull: 150, isVeg: true, image: foodImages.dosa },
    { name: 'Masala Dosa', priceFull: 180, isVeg: true, image: foodImages.dosa },
    { name: 'Coconut Masala Dosa', priceFull: 190, isVeg: true, image: foodImages.dosa },
    { name: 'Special Masala Dosa', priceFull: 190, isVeg: true, image: foodImages.dosa },
    { name: 'Butter Masala Dosa', priceFull: 190, isVeg: true, image: foodImages.dosa },
    { name: 'Paneer Dosa', priceFull: 220, isVeg: true, image: foodImages.dosa },
    { name: 'Bt. Paneer Dosa', priceFull: 230, isVeg: true, image: foodImages.dosa },
    { name: 'Mix Veg. Uttapam', priceFull: 180, isVeg: true, image: foodImages.uttapam },
    { name: 'Masala Uttapam', priceFull: 180, isVeg: true, image: foodImages.uttapam }
  ],
  'mithas': [
    { name: 'Rasgulla (Single pcs)', priceFull: 30, isVeg: true, image: foodImages.sweet },
    { name: 'Rasmalai (Single pcs)', priceFull: 40, isVeg: true, image: foodImages.sweet }
  ],
  'shakes': [
    { name: 'Vanilla Shake', priceFull: 160, isVeg: true, image: foodImages.shake },
    { name: 'Strawberry Shake', priceFull: 160, isVeg: true, image: foodImages.shake },
    { name: 'Chocolate Shake', priceFull: 170, isVeg: true, image: foodImages.shake },
    { name: 'Pineapple Shake', priceFull: 170, isVeg: true, image: foodImages.shake },
    { name: 'Butter Scotch Shake', priceFull: 170, isVeg: true, image: foodImages.shake },
    { name: 'Shake with ICE Cream', priceFull: 200, isVeg: true, tags: ['special'], image: foodImages.shake }
  ],
  'soft-drinks': [
    { name: 'Cold Coffee with Icecream', priceFull: 160, isVeg: true, image: foodImages.coffee },
    { name: 'Cold Coffee', priceFull: 120, isVeg: true, image: foodImages.coffee },
    { name: 'Virgin Mojito (Mint)', priceFull: 100, isVeg: true, image: foodImages.colddrink },
    { name: 'Lassi (Sweet & Salted)', priceFull: 90, isVeg: true, image: foodImages.lassi },
    { name: 'Butter Milk', priceFull: 70, isVeg: true, image: foodImages.lassi },
    { name: 'Milk', priceFull: 60, isVeg: true, image: foodImages.milk },
    { name: 'Fruits Juice', priceFull: 60, isVeg: true, image: foodImages.juice },
    { name: 'Fresh Lime Soda (Sweet & Salted)', priceFull: 60, isVeg: true, image: foodImages.colddrink },
    { name: 'Masala Cold Drinks', priceFull: 50, isVeg: true, image: foodImages.colddrink },
    { name: 'Cold Drinks Glass', priceFull: 40, isVeg: true, image: foodImages.colddrink },
    { name: 'Fresh Lime Water', priceFull: 30, isVeg: true, image: foodImages.water },
    { name: 'Mineral Water (MRP)', priceFull: 20, isVeg: true, image: foodImages.water }
  ],
  'hot-drinks': [
    { name: 'Hot Coffee', priceFull: 90, isVeg: true, image: foodImages.coffee },
    { name: 'Tea', priceFull: 50, isVeg: true, image: foodImages.tea }
  ],
  'veg-soups': [
    { name: 'Zed Soup', priceFull: 120, isVeg: true, image: foodImages.soup },
    { name: 'Sweet Corn Soup', priceFull: 120, isVeg: true, image: foodImages.soup },
    { name: 'Cream of Mushroom Soup', priceFull: 120, isVeg: true, image: foodImages.soup },
    { name: 'Peking Soup', priceFull: 110, isVeg: true, image: foodImages.soup },
    { name: 'Talumein Soup', priceFull: 110, isVeg: true, image: foodImages.soup },
    { name: 'Manchow Soup', priceFull: 110, isVeg: true, image: foodImages.soup },
    { name: 'Veg Clear Soup', priceFull: 110, isVeg: true, image: foodImages.soup },
    { name: 'Hot N Sour Soup', priceFull: 110, isVeg: true, image: foodImages.soup },
    { name: 'Noodle Soup', priceFull: 110, isVeg: true, image: foodImages.soup },
    { name: 'Cream of Veg Soup', priceFull: 110, isVeg: true, image: foodImages.soup },
    { name: 'Cream of Tomato Soup', priceFull: 110, isVeg: true, image: foodImages.soup }
  ],
  'non-veg-soups': [
    { name: 'Chicken Ball Soup', priceFull: 150, image: foodImages.nonvegsoup },
    { name: 'Manchow Soup (Non Veg)', priceFull: 140, image: foodImages.nonvegsoup },
    { name: 'Peking Soup (Non Veg)', priceFull: 140, image: foodImages.nonvegsoup },
    { name: 'Talumein Soup (Non Veg)', priceFull: 140, image: foodImages.nonvegsoup },
    { name: 'Sweet Corn Chicken Soup', priceFull: 140, image: foodImages.nonvegsoup },
    { name: 'Hot N Sour Soup (Non Veg)', priceFull: 140, image: foodImages.nonvegsoup },
    { name: 'Cream of Chicken Soup', priceFull: 140, image: foodImages.nonvegsoup },
    { name: 'Chicken Clear Soup', priceFull: 140, image: foodImages.nonvegsoup }
  ],
  'bake-dishes': [
    { name: 'Bake Chicken', priceFull: 430, image: foodImages.bake },
    { name: 'Baked Vegetable', priceFull: 320, isVeg: true, image: foodImages.bake },
    { name: 'Bake Macroni', priceFull: 230, isVeg: true, image: foodImages.bake },
    { name: 'Bake Mushroom', priceFull: 350, isVeg: true, image: foodImages.bake },
    { name: 'Bake Potato', priceFull: 210, isVeg: true, image: foodImages.bake }
  ],
  'snacks': [
    { name: 'Lucky Special Pizza', priceFull: 250, isVeg: true, isSpecial: true, tags: ['bestseller', 'special'], image: foodImages.pizza },
    { name: 'Chicken Pizza', priceFull: 260, image: foodImages.pizza },
    { name: 'Chicken Pakora (8 Pcs.)', priceFull: 290, image: foodImages.chicken_tikka },
    { name: 'Paneer Tikka (8 Pcs.)', priceFull: 260, isVeg: true, image: foodImages.paneer },
    { name: 'Veg. Pizza', priceFull: 190, isVeg: true, image: foodImages.pizza },
    { name: 'Cheese Pizza', priceFull: 170, isVeg: true, image: foodImages.pizza },
    { name: 'Chicken Cutlet', priceFull: 210, image: foodImages.cutlet },
    { name: 'Chicken Burger', priceFull: 160, image: foodImages.burger },
    { name: 'Cheese Club Sandwich', priceFull: 150, isVeg: true, image: foodImages.sandwich },
    { name: 'Paneer Pakora (8 Pcs.)', priceFull: 200, isVeg: true, image: foodImages.paneer },
    { name: 'Cheese Cutlet', priceFull: 190, isVeg: true, image: foodImages.cutlet },
    { name: 'Veg Club Sandwich', priceFull: 110, isVeg: true, image: foodImages.sandwich },
    { name: 'Cheese Burger', priceFull: 110, isVeg: true, image: foodImages.burger },
    { name: 'Cheese Sandwich', priceFull: 110, isVeg: true, image: foodImages.sandwich },
    { name: 'Veg. Pakora (8 Pcs.)', priceFull: 170, isVeg: true, image: foodImages.paneer },
    { name: 'Veg. Cutlet', priceFull: 120, isVeg: true, image: foodImages.cutlet },
    { name: 'Finger Chips', priceFull: 120, isVeg: true, image: foodImages.chips },
    { name: 'Veg. Sandwich', priceFull: 90, isVeg: true, image: foodImages.sandwich },
    { name: 'Veg. Burger', priceFull: 90, isVeg: true, image: foodImages.burger },
    { name: 'Bread Butter', priceFull: 80, isVeg: true, image: foodImages.naan },
    { name: 'Butter Toast', priceFull: 80, isVeg: true, image: foodImages.naan }
  ],
  'noodles-veg': [
    { name: 'Lucky Special Noodles', priceFull: 230, isVeg: true, isSpecial: true, tags: ['bestseller', 'special'], image: foodImages.noodles },
    { name: 'Hakka Noodles', priceFull: 190, isVeg: true, image: foodImages.noodles },
    { name: 'Schezwan Noodles', priceFull: 190, isVeg: true, image: foodImages.noodles },
    { name: 'Garlic Noodles', priceFull: 190, isVeg: true, image: foodImages.noodles },
    { name: 'Chinese Chopsuey', priceFull: 190, isVeg: true, image: foodImages.noodles },
    { name: 'American Chopsuey', priceFull: 190, isVeg: true, image: foodImages.noodles },
    { name: 'Chowmein', priceFull: 180, isVeg: true, image: foodImages.chowmein }
  ],
  'noodles-non-veg': [
    { name: 'Chicken Chowmein', priceFull: 240, image: foodImages.chowmein },
    { name: 'American Chopsuey (Non Veg)', priceFull: 230, image: foodImages.noodles },
    { name: 'Hakka Noodles (Non Veg)', priceFull: 210, image: foodImages.noodles },
    { name: 'Egg Chowmein', priceFull: 210, image: foodImages.chowmein },
    { name: 'Mix Noodles', priceFull: 260, image: foodImages.noodles },
    { name: 'Chinese Chopsuey (Non Veg)', priceFull: 240, image: foodImages.noodles }
  ],
  'chinese-veg': [
    { name: 'Chilli Paneer', priceFull: 270, isVeg: true, image: foodImages.manchurian },
    { name: 'Chilli Mushroom', priceFull: 280, isVeg: true, image: foodImages.mushroom },
    { name: 'Paneer Manchurian', priceFull: 270, isVeg: true, image: foodImages.manchurian },
    { name: 'Veg. Manchurian', priceFull: 240, isVeg: true, image: foodImages.manchurian },
    { name: 'Honey Chilli Potato', priceFull: 240, isVeg: true, image: foodImages.chilli },
    { name: 'Chilli Potato', priceFull: 230, isVeg: true, image: foodImages.chilli },
    { name: 'Veg Chow Chow', priceFull: 240, isVeg: true, image: foodImages.manchurian },
    { name: 'Veg Sweet N Sour', priceFull: 240, isVeg: true, image: foodImages.manchurian },
    { name: 'Veg. Ball Hot Garlic', priceFull: 240, isVeg: true, image: foodImages.manchurian },
    { name: 'Veg with Mushroom Cashewnut', priceFull: 240, isVeg: true, image: foodImages.mushroom },
    { name: 'Garlic Lolly Sweet', priceFull: 240, isVeg: true, image: foodImages.manchurian },
    { name: 'Veg. Sixty Five', priceFull: 230, isVeg: true, image: foodImages.manchurian },
    { name: 'Spring Roll', priceFull: 230, isVeg: true, image: foodImages.spring_roll },
    { name: 'Veg. Lolli Pop', priceFull: 200, isVeg: true, image: foodImages.manchurian }
  ],
  'chinese-non-veg': [
    { name: 'Chilli Chicken (Boneless)', priceFull: 360, image: foodImages.chilli },
    { name: 'Chicken Lolly Pop', priceFull: 360, image: foodImages.chicken_tikka },
    { name: 'Chicken Hongkong', priceFull: 360, image: foodImages.chilli },
    { name: 'Chicken Manchurian', priceFull: 360, image: foodImages.manchurian },
    { name: 'Chicken Sixty Five', priceFull: 360, image: foodImages.chilli },
    { name: 'Chicken Hot Garlic', priceFull: 360, image: foodImages.chilli },
    { name: 'Ginger Chicken', priceFull: 360, image: foodImages.chilli },
    { name: 'Chicken Chow Chow', priceFull: 360, image: foodImages.manchurian },
    { name: 'Chicken Sweet N Sour', priceFull: 360, image: foodImages.chilli },
    { name: 'Lemon Chicken', priceFull: 360, image: foodImages.chilli },
    { name: 'Chicken Roll', priceFull: 270, image: foodImages.spring_roll },
    { name: 'Egg Roll', priceFull: 220, image: foodImages.spring_roll }
  ],
  'rice-veg': [
    { name: 'Lucky Special Rice', priceFull: 230, isVeg: true, isSpecial: true, tags: ['bestseller', 'special'], image: foodImages.friedrice },
    { name: 'Schezwan Rice', priceFull: 200, isVeg: true, image: foodImages.friedrice },
    { name: 'Mushroom Rice', priceFull: 220, isVeg: true, image: foodImages.friedrice },
    { name: 'Garlic Rice', priceFull: 200, isVeg: true, image: foodImages.friedrice },
    { name: 'Fried Rice', priceFull: 180, isVeg: true, image: foodImages.friedrice }
  ],
  'rice-non-veg': [
    { name: 'Garlic Chicken Fried Rice', priceFull: 260, image: foodImages.friedrice },
    { name: 'Chicken Fried Rice', priceFull: 260, image: foodImages.friedrice },
    { name: 'Egg Fried Rice', priceFull: 220, image: foodImages.friedrice }
  ],
  'lunch-dinner-veg': [
    { name: 'Paneer Butter Masala', priceFull: 290, isVeg: true, tags: ['bestseller'], image: foodImages.paneer },
    { name: 'Methi Malai Paneer', priceFull: 290, isVeg: true, image: foodImages.paneer },
    { name: 'Paneer Lajawab', priceFull: 290, isVeg: true, image: foodImages.paneer },
    { name: 'Paneer Kalimirch', priceFull: 290, isVeg: true, image: foodImages.paneer },
    { name: 'Malai Paneer', priceFull: 290, isVeg: true, image: foodImages.paneer },
    { name: 'Paneer Shabnam', priceFull: 290, isVeg: true, image: foodImages.paneer },
    { name: 'Paneer Pasanda', priceFull: 290, isVeg: true, image: foodImages.paneer },
    { name: 'Paneer Handi', priceFull: 290, isVeg: true, image: foodImages.paneer },
    { name: 'Paneer Do Pyaza', priceFull: 290, isVeg: true, image: foodImages.paneer },
    { name: 'Kadhai Paneer', priceFull: 290, isVeg: true, image: foodImages.paneer },
    { name: 'Paneer Korama', priceFull: 290, isVeg: true, image: foodImages.paneer },
    { name: 'Darbari Paneer', priceFull: 280, isVeg: true, image: foodImages.paneer },
    { name: 'Shahi Paneer', priceFull: 280, isVeg: true, image: foodImages.paneer },
    { name: 'Matar Mushroom', priceFull: 280, isVeg: true, image: foodImages.mushroom },
    { name: 'Mushroom Curry', priceFull: 280, isVeg: true, image: foodImages.mushroom },
    { name: 'Khoya Paneer', priceFull: 280, isVeg: true, image: foodImages.paneer },
    { name: 'Malai Kofta', priceFull: 280, isVeg: true, image: foodImages.kofta },
    { name: 'Cheese Hariyali Kofta', priceFull: 260, isVeg: true, image: foodImages.kofta },
    { name: 'Palak Paneer', priceFull: 250, isVeg: true, image: foodImages.paneer },
    { name: 'Matar Paneer', priceFull: 250, isVeg: true, image: foodImages.paneer },
    { name: 'Paneer Bhujia', priceFull: 250, isVeg: true, image: foodImages.paneer },
    { name: 'Navratan Korma', priceFull: 260, isVeg: true, image: foodImages.paneer },
    { name: 'Kashmiri Kofta', priceFull: 260, isVeg: true, image: foodImages.kofta },
    { name: 'Chana Masala', priceFull: 240, isVeg: true, image: foodImages.dal },
    { name: 'Mix Veg.', priceFull: 240, isVeg: true, image: foodImages.paneer },
    { name: 'Palak Chola', priceFull: 240, isVeg: true, image: foodImages.dal },
    { name: 'Dum Aloo Kashmiri', priceFull: 240, isVeg: true, image: foodImages.paneer },
    { name: 'Rajma Masala', priceFull: 240, isVeg: true, image: foodImages.dal },
    { name: 'Matar Dry Kanpuri', priceFull: 200, isVeg: true, image: foodImages.dal },
    { name: 'Stuff Tomato', priceFull: 230, isVeg: true, image: foodImages.paneer },
    { name: 'Stuff Capsicum', priceFull: 230, isVeg: true, image: foodImages.paneer },
    { name: 'Veg. Jhal Frezi', priceFull: 240, isVeg: true, image: foodImages.paneer },
    { name: 'Dal Makhani', priceFull: 240, isVeg: true, image: foodImages.dal },
    { name: 'Veg. Kofta', priceFull: 230, isVeg: true, image: foodImages.kofta },
    { name: 'Dum Aloo Plain', priceFull: 230, isVeg: true, image: foodImages.paneer },
    { name: 'Jeera Aloo', priceFull: 180, isVeg: true, image: foodImages.paneer },
    { name: 'Seasonal Veg', priceFull: 180, isVeg: true, image: foodImages.paneer },
    { name: 'Dal Butter Fry', priceFull: 210, isVeg: true, image: foodImages.dal }
  ]
};

const sampleReviews = [
  { name: 'Rahul Sharma', rating: 5, comment: 'Best butter chicken in Kanpur! The taste is authentic and the ambiance is wonderful. Highly recommended for family dining.', isApproved: true },
  { name: 'Priya Gupta', rating: 4, comment: 'Great food quality and generous portions. The paneer dishes are amazing. Service could be a bit faster during peak hours.', isApproved: true },
  { name: 'Amit Kumar', rating: 5, comment: 'Lucky Restaurant never disappoints! Been coming here since 2010. The biryani and tandoori chicken are must-tries.', isApproved: true },
  { name: 'Neha Singh', rating: 4, comment: 'Wonderful family restaurant with diverse menu. Chinese and North Indian both are excellent. Kids loved the ice cream selection.', isApproved: true },
  { name: 'Vikram Patel', rating: 5, comment: 'Celebrated my anniversary here. The ambiance, food quality, and service were all top-notch. Special mention to the Lucky Special Chicken Rara!', isApproved: true },
  { name: 'Sunita Devi', rating: 4, comment: 'Very good vegetarian options. The paneer butter masala and dal makhani are delicious. Clean and hygienic place.', isApproved: true }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lucky-restaurant');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await MenuItem.deleteMany({});
    await Review.deleteMany({});
    console.log('Cleared existing data');

    // Create admin
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@luckyrestaurant.com',
      password: 'admin123',
      role: 'superadmin'
    });
    console.log(`✅ Admin created: ${admin.email}`);

    // Create categories
    const createdCategories = {};
    for (const cat of categories) {
      const created = await Category.create(cat);
      createdCategories[cat.slug] = created._id;
    }
    console.log(`✅ ${categories.length} categories created`);

    // Create menu items
    let totalItems = 0;
    for (const [catSlug, items] of Object.entries(menuItems)) {
      const categoryId = createdCategories[catSlug];
      if (!categoryId) {
        console.log(`⚠️ Category not found for: ${catSlug}`);
        continue;
      }

      for (const item of items) {
        await MenuItem.create({
          ...item,
          category: categoryId,
          isAvailable: true,
          isVeg: item.isVeg || false,
          isSpecial: item.isSpecial || false,
          tags: item.tags || [],
          priceHalf: item.priceHalf || null,
          description: item.description || ''
        });
        totalItems++;
      }
    }
    console.log(`✅ ${totalItems} menu items created`);

    // Create reviews
    for (const review of sampleReviews) {
      await Review.create(review);
    }
    console.log(`✅ ${sampleReviews.length} sample reviews created`);

    console.log('\n🎉 Database seeded successfully!');
    console.log(`📧 Admin login: admin@luckyrestaurant.com / admin123`);
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
