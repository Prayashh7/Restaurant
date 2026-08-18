const db = require('./connection');

const menuItems = [
  {
    name: 'Thakali Khana Set',
    description: 'Traditional Nepali Thakali set with dal, rice, tarkari, achar and greens.',
    price: 420,
    old_price: 480,
    category: 'Main Course',
    image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=900&q=85',
    is_popular: 1,
  },
  {
    name: 'Chicken Momo',
    description: 'Juicy handmade chicken momos served with our signature spicy achar.',
    price: 220,
    old_price: null,
    category: 'Momo',
    image_url: 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&w=900&q=85',
    is_popular: 1,
  },
  {
    name: 'Buff Momo',
    description: 'Classic Nepali buff momo made fresh to order.',
    price: 200,
    old_price: null,
    category: 'Momo',
    image_url: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=900&q=85',
    is_popular: 1,
  },
  {
    name: 'Chicken Sekuwa',
    description: 'Charcoal grilled chicken marinated with authentic Nepali spices.',
    price: 350,
    old_price: null,
    category: 'BBQ',
    image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=85',
    is_popular: 1,
  },
  {
    name: 'Newari Khaja Set',
    description: 'A traditional Newari platter with bara, achar, chhoila and seasonal sides.',
    price: 390,
    old_price: null,
    category: 'Newari',
    image_url: '/momo_premium.jpg',
    is_popular: 0,
  },
  {
    name: 'Chicken Chowmein',
    description: 'Wok-tossed noodles with chicken, vegetables and house seasoning.',
    price: 240,
    old_price: null,
    category: 'Noodles',
    image_url: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=900&q=85',
    is_popular: 0,
  },
  {
    name: 'Buff Chhoila',
    description: 'Spicy Newari-style smoked buff with roasted spices and fresh herbs.',
    price: 320,
    old_price: null,
    category: 'Newari',
    image_url: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85',
    is_popular: 1,
  },
  {
    name: 'Paneer Tikka',
    description: 'Soft paneer grilled with peppers and aromatic Indian-Nepali spices.',
    price: 330,
    old_price: null,
    category: 'BBQ',
    image_url: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=900&q=85',
    is_popular: 0,
  },
  {
    name: 'Chicken Chilli',
    description: 'Crispy chicken tossed with peppers, onions and our chilli sauce.',
    price: 300,
    old_price: null,
    category: 'Snacks',
    image_url: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=900&q=85',
    is_popular: 0,
  },
  {
    name: 'Masala Tea',
    description: 'Hot Nepali masala tea with aromatic spices.',
    price: 80,
    old_price: null,
    category: 'Drinks',
    image_url: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=900&q=85',
    is_popular: 0,
  },
  {
    name: 'Fresh Lemon Soda',
    description: 'Refreshing fresh lemon soda served chilled.',
    price: 120,
    old_price: null,
    category: 'Drinks',
    image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=85',
    is_popular: 0,
  },
  {
    name: 'Mango Lassi',
    description: 'Creamy mango lassi made with fresh yogurt.',
    price: 160,
    old_price: null,
    category: 'Drinks',
    image_url: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=900&q=85',
    is_popular: 0,
  },
];

const reviews = [
  {
    name: 'Suman K.',
    role: 'Local Guide',
    quote: 'The Thakali set was amazing. Everything tasted fresh and authentic. Definitely one of the best places to eat in Hetauda.',
    rating: 5,
    is_approved: 1,
  },
  {
    name: 'Pratiksha S.',
    role: 'Regular Customer',
    quote: 'Great atmosphere, friendly staff and delicious momo. The chicken sekuwa is a must try!',
    rating: 5,
    is_approved: 1,
  },
  {
    name: 'Aayush B.',
    role: 'Customer',
    quote: 'Perfect place for family dinner. Prices are reasonable and the food portions are really good.',
    rating: 5,
    is_approved: 1,
  },
];

function seed() {
  console.log('🌱 Running SQLite DB migrations...');

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price INTEGER NOT NULL,
      old_price INTEGER,
      category TEXT NOT NULL,
      image_url TEXT,
      is_popular INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT,
      phone TEXT,
      items TEXT NOT NULL,
      total INTEGER NOT NULL,
      note TEXT,
      status TEXT DEFAULT 'new',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT,
      quote TEXT NOT NULL,
      rating INTEGER DEFAULT 5,
      is_approved INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('✅ Tables created');

  // Check and seed menu items
  const menuCount = db.prepare('SELECT COUNT(*) AS count FROM menu_items').get();
  if (menuCount.count === 0) {
    const insertMenu = db.prepare(`
      INSERT INTO menu_items (name, description, price, old_price, category, image_url, is_popular)
      VALUES (@name, @description, @price, @old_price, @category, @image_url, @is_popular)
    `);

    const transaction = db.transaction((items) => {
      for (const item of items) {
        insertMenu.run(item);
      }
    });

    transaction(menuItems);
    console.log(`✅ Seeded ${menuItems.length} menu items`);
  } else {
    console.log('ℹ️  Menu items already exist, skipping seed');
  }

  // Check and seed reviews
  const reviewCount = db.prepare('SELECT COUNT(*) AS count FROM reviews').get();
  if (reviewCount.count === 0) {
    const insertReview = db.prepare(`
      INSERT INTO reviews (name, role, quote, rating, is_approved)
      VALUES (@name, @role, @quote, @rating, @is_approved)
    `);

    const transaction = db.transaction((revs) => {
      for (const r of revs) {
        insertReview.run(r);
      }
    });

    transaction(reviews);
    console.log(`✅ Seeded ${reviews.length} reviews`);
  } else {
    console.log('ℹ️  Reviews already exist, skipping seed');
  }

  console.log('🎉 Database ready!');
}

seed();
module.exports = seed;
