import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';

const API = 'http://localhost:5000/api';

const WHATSAPP = 'https://wa.me/9779800000000';

const handleMouseMove3D = (e) => {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const rotateX = ((centerY - y) / centerY) * 15;
  const rotateY = ((x - centerX) / centerX) * 15;
  el.style.setProperty('--tilt-x', `${rotateX}deg`);
  el.style.setProperty('--tilt-y', `${rotateY}deg`);
};

const handleMouseLeave3D = (e) => {
  const el = e.currentTarget;
  el.style.setProperty('--tilt-x', '0deg');
  el.style.setProperty('--tilt-y', '0deg');
};

const FALLBACK_MENU = [
  { id:1, name:'Thakali Khana Set', description:'Traditional Nepali Thakali set with dal, rice, tarkari, achar and greens.', price:420, old_price:480, category:'Main Course', image_url:'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=900&q=85', is_popular:true },
  { id:2, name:'Chicken Momo', description:'Juicy handmade chicken momos served with our signature spicy achar.', price:220, old_price:null, category:'Momo', image_url:'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&w=900&q=85', is_popular:true },
  { id:3, name:'Buff Momo', description:'Classic Nepali buff momo made fresh to order.', price:200, old_price:null, category:'Momo', image_url:'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=900&q=85', is_popular:true },
  { id:4, name:'Chicken Sekuwa', description:'Charcoal grilled chicken marinated with authentic Nepali spices.', price:350, old_price:null, category:'BBQ', image_url:'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=85', is_popular:true },
  { id:5, name:'Newari Khaja Set', description:'A traditional Newari platter with bara, achar, chhoila and seasonal sides.', price:390, old_price:null, category:'Newari', image_url:'/momo_premium.jpg', is_popular:false },
  { id:6, name:'Chicken Chowmein', description:'Wok-tossed noodles with chicken, vegetables and house seasoning.', price:240, old_price:null, category:'Noodles', image_url:'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=900&q=85', is_popular:false },
  { id:7, name:'Buff Chhoila', description:'Spicy Newari-style smoked buff with roasted spices and fresh herbs.', price:320, old_price:null, category:'Newari', image_url:'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85', is_popular:true },
  { id:8, name:'Paneer Tikka', description:'Soft paneer grilled with peppers and aromatic Indian-Nepali spices.', price:330, old_price:null, category:'BBQ', image_url:'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=900&q=85', is_popular:false },
  { id:9, name:'Chicken Chilli', description:'Crispy chicken tossed with peppers, onions and our chilli sauce.', price:300, old_price:null, category:'Snacks', image_url:'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=900&q=85', is_popular:false },
  { id:10, name:'Masala Tea', description:'Hot Nepali masala tea with aromatic spices.', price:80, old_price:null, category:'Drinks', image_url:'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=900&q=85', is_popular:false },
  { id:11, name:'Fresh Lemon Soda', description:'Refreshing fresh lemon soda served chilled.', price:120, old_price:null, category:'Drinks', image_url:'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=85', is_popular:false },
  { id:12, name:'Mango Lassi', description:'Creamy mango lassi made with fresh yogurt.', price:160, old_price:null, category:'Drinks', image_url:'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=900&q=85', is_popular:false },
];

const FALLBACK_REVIEWS = [
  { id:1, name:'Suman K.', role:'Local Guide', quote:'The Thakali set was amazing. Everything tasted fresh and authentic. Definitely one of the best places to eat in Hetauda.', rating:5 },
  { id:2, name:'Pratiksha S.', role:'Regular Customer', quote:'Great atmosphere, friendly staff and delicious momo. The chicken sekuwa is a must try!', rating:5 },
  { id:3, name:'Aayush B.', role:'Customer', quote:'Perfect place for family dinner. Prices are reasonable and the food portions are really good.', rating:5 },
];

const CATEGORIES = ['All','Main Course','Momo','Newari','BBQ','Snacks','Noodles','Drinks'];

/* ── Scroll reveal hook ── */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.unobserve(el); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ── Animated counter ── */
function useCounter(target, isVisible) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!isVisible) return;
    const num = parseInt(target.replace(/\D/g, ''));
    const suffix = target.replace(/[\d,]/g, '');
    let start = 0;
    const step = Math.ceil(num / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= num) { setVal(target); clearInterval(timer); }
      else setVal(start + suffix);
    }, 24);
    return () => clearInterval(timer);
  }, [isVisible, target]);
  return val || '0';
}

/* ════════════════ APP ════════════════ */
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [category, setCategory] = useState('All');
  const [menu, setMenu] = useState([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  /* ── Fetch menu from API (fallback to local data) ── */
  useEffect(() => {
    fetch(`${API}/menu`)
      .then(r => r.json())
      .then(data => { setMenu(Array.isArray(data) ? data : FALLBACK_MENU); })
      .catch(() => setMenu(FALLBACK_MENU))
      .finally(() => setMenuLoading(false));
  }, []);

  /* ── Fetch reviews from API ── */
  useEffect(() => {
    fetch(`${API}/reviews`)
      .then(r => r.json())
      .then(data => { setReviews(Array.isArray(data) && data.length ? data : FALLBACK_REVIEWS); })
      .catch(() => setReviews(FALLBACK_REVIEWS));
  }, []);

  /* ── Navbar scroll effect ── */
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  /* ── Stats counter observer ── */
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const openWA = useCallback((msg = 'Namaste! I would like to place an order.') => {
    window.open(`${WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank');
  }, []);

  const filteredMenu = category === 'All' ? menu : menu.filter(i => i.category === category);
  const popular = menu.filter(i => i.is_popular).slice(0, 4);

  return (
    <div className="site">
      {/* ════ NAVBAR ════ */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <a href="#home" className="logo" onClick={() => setMenuOpen(false)}>
            <div className="logo-mark">♨</div>
            <div className="logo-text">
              <strong>BASUKALA</strong>
              <small>FAST FOOD</small>
            </div>
          </a>

          <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
            {['home','menu','about','offers','contact'].map(id => (
              <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </a>
            ))}
            <a href="#menu" className="nav-cta" onClick={() => setMenuOpen(false)}>
              Order Now
            </a>
          </div>

          <button className="menu-toggle" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* ════ HERO ════ */}
      <section className="hero" id="home">
        <div className="hero-overlay" />
        <div className="hero-glow" />
        
        {/* Floating Amber Particles */}
        <div className="hero-particles">
          {[...Array(12)].map((_, i) => (
            <span key={i} className={`particle particle-${i + 1}`} />
          ))}
        </div>

        <div className="container hero-container">
          <div className="hero-grid">
            <div className="hero-text-side">
              <div className="hero-badge reveal visible">
                <span>✦</span> Authentic Taste of Nepal
              </div>

              <h1>
                Taste the<br />
                <em>Heart of Nepal.</em>
              </h1>

              <p className="hero-desc">
                Experience the culinary artistry of Nepal. Traditional recipes reimagined with luxury presentation, charcoal-fired flavors, and premium ingredients.
              </p>

              <div className="hero-buttons">
                <a href="#menu" className="btn btn-primary btn-luxury" id="hero-explore-btn">
                  Explore Our Menu <span className="arrow">→</span>
                </a>
                <button className="btn btn-outline btn-luxury-outline" id="hero-order-btn" onClick={() => openWA()}>
                  Order on WhatsApp
                </button>
              </div>

              <div className="hero-stats">
                <div className="hero-stat-item">
                  <strong>4.9★</strong>
                  <small>Google Rating</small>
                </div>
                <div className="hero-stat-item">
                  <strong>11AM–10PM</strong>
                  <small>Open Daily</small>
                </div>
                <div className="hero-stat-item">
                  <strong>Fresh</strong>
                  <small>Made to Order</small>
                </div>
                <div className="hero-stat-item">
                  <strong>10+ Yrs</strong>
                  <small>Of Hospitality</small>
                </div>
              </div>
            </div>

            <div className="hero-visual-side">
              <div 
                className="hero-3d-card"
                onMouseMove={handleMouseMove3D}
                onMouseLeave={handleMouseLeave3D}
              >
                <div className="hero-3d-card-glow" />
                <div className="hero-3d-card-inner">
                  <img src="/momo_premium.jpg" alt="Signature luxury momo plate" className="hero-3d-img" />
                  <div className="hero-3d-badge">
                    <span className="gold-sparkle">✦</span> Signature Dish
                  </div>
                  <div className="hero-3d-info">
                    <h3>Gourmet Steamed Momo</h3>
                    <p>Artisanal handmade dumplings served with fire-roasted tomato achar</p>
                    <div className="hero-3d-price">Rs. 220</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="scroll-indicator">
          <div className="scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* ════ INTRO ════ */}
      <section className="intro">
        <div className="container intro-grid">
          <div>
            <span className="eyebrow">Welcome to Hetauda Kitchen</span>
            <h2>Where tradition<br />meets <em>taste.</em></h2>
          </div>
          <div className="intro-text">
            <p>
              We believe great food is more than just a meal. It is about
              memories, family and bringing people together around the table.
            </p>
            <p>
              From steaming momos to traditional Thakali khana and smoky
              sekuwa, every dish is prepared with carefully selected
              ingredients and authentic Nepali flavours.
            </p>
            <a href="#about" className="text-link">Our Story →</a>
          </div>
        </div>
      </section>

      {/* ════ POPULAR ════ */}
      <section className="popular" id="popular">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Customer Favourites</span>
              <h2>Most Loved <em>Dishes</em></h2>
            </div>
            <a href="#menu" className="view-all">View Full Menu →</a>
          </div>
          <div className="food-grid popular-grid">
            {popular.map((item, i) => (
              <FoodCard key={item.id} item={item} delay={i} onOrder={openWA} />
            ))}
          </div>
        </div>
      </section>

      {/* ════ WEEKLY OFFER ════ */}
      <section className="offer-section" id="offers">
        <div className="container offer-container">
          <div 
            className="offer-card"
            onMouseMove={handleMouseMove3D}
            onMouseLeave={handleMouseLeave3D}
          >
            <div className="offer-img-wrap">
              <div className="offer-img" />
              <div className="offer-img-overlay" />
            </div>
            <div className="offer-body">
              <span className="eyebrow">This Week's Special</span>
              <h2>Family<br /><em>Feast</em></h2>
              <p className="offer-desc">
                Gather your loved ones and indulge in an authentic Nepali culinary feast. A curated selection of our finest items, perfect for sharing.
              </p>
              <div className="offer-price">
                <strong>Rs. 1,499</strong>
                <span>for 4 people</span>
              </div>
              <button
                className="btn btn-primary btn-luxury"
                id="offer-order-btn"
                onClick={() => openWA('Namaste! I would like to order the Family Feast special.')}
              >
                Order This Offer <span className="arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ════ MENU ════ */}
      <section className="menu-section" id="menu">
        <div className="container">
          <div className="menu-header">
            <span className="eyebrow">Our Menu</span>
            <h2>Made with <em>love.</em></h2>
            <p>
              From classic Nepali comfort food to modern favourites,
              there's something for everyone.
            </p>
          </div>

          <div className="cat-bar">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                id={`cat-${cat.toLowerCase().replace(/\s/g,'-')}`}
                className={`cat-pill ${category === cat ? 'active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {menuLoading ? (
            <div className="menu-loading">
              <div className="spinner" />
              Loading menu…
            </div>
          ) : (
            <div className="food-grid">
              {filteredMenu.map((item, i) => (
                <FoodCard key={item.id} item={item} delay={i % 3} onOrder={openWA} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ════ ABOUT ════ */}
      <section className="about-section" id="about">
        <div className="container about-grid">
          <AboutImages />
          <div className="about-content">
            <span className="eyebrow">Our Story</span>
            <h2>Food that feels<br />like <em>home.</em></h2>
            <p>
              Started with a simple dream — to create a place where people
              could enjoy the authentic taste of Nepal in a comfortable,
              welcoming environment.
            </p>
            <p>
              Located in Hetauda, our kitchen brings together traditional
              recipes, local ingredients and modern presentation while
              keeping the soul of Nepali food alive.
            </p>
            <div className="about-points">
              {[
                { label: 'Fresh Ingredients', sub: 'Locally sourced whenever possible' },
                { label: 'Authentic Recipes', sub: 'Traditional flavours from Nepal' },
                { label: 'Made Fresh', sub: 'Prepared after you order' },
              ].map(p => (
                <div key={p.label} className="about-point">
                  <div className="about-point-icon">✓</div>
                  <div>
                    <strong>{p.label}</strong>
                    <small>{p.sub}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════ STATS ════ */}
      <section className="stats" ref={statsRef}>
        <div className="container stats-grid">
          {[
            { value: '15K+', label: 'Happy Customers' },
            { value: '40+',  label: 'Menu Items' },
            { value: '4.9★', label: 'Average Rating' },
            { value: '10+',  label: 'Years Experience' },
          ].map(s => (
            <StatItem key={s.label} value={s.value} label={s.label} isVisible={statsVisible} />
          ))}
        </div>
      </section>

      {/* ════ REVIEWS ════ */}
      <section className="reviews" id="reviews">
        <div className="container">
          <div className="reviews-header">
            <span className="eyebrow">What People Say</span>
            <h2>Loved by <em>Hetauda.</em></h2>
          </div>
          <div className="review-grid">
            {reviews.map((r, i) => (
              <ReviewCard key={r.id || i} review={r} delay={i} />
            ))}
          </div>
          <ReviewForm api={API} />
        </div>
      </section>

      {/* ════ DELIVERY CTA ════ */}
      <section className="delivery">
        <div className="delivery-overlay" />
        <div className="delivery-body">
          <span className="eyebrow">Hungry? We've got you.</span>
          <h2>Your favourite food,<br /><em>delivered.</em></h2>
          <p>
            Enjoy our food from the comfort of your home.
            Order directly through WhatsApp for fast, easy delivery.
          </p>
          <button
            className="btn btn-primary"
            id="delivery-cta-btn"
            onClick={() => openWA()}
          >
            Order on WhatsApp →
          </button>
        </div>
      </section>

      {/* ════ FOOTER ════ */}
      <footer id="contact">
        <div className="container footer-grid">
          <div className="footer-brand">
            <a href="#home" className="logo">
              <div className="logo-mark">♨</div>
              <div className="logo-text">
                <strong>BASUKALA</strong>
                <small>FAST FOOD</small>
              </div>
            </a>
            <p>
              Authentic Nepali flavours, warm hospitality and
              memorable dining experiences in Hetauda.
            </p>
            <div className="footer-socials">
              {['IG','FB','TK'].map(s => (
                <a key={s} href="#" className="footer-social">{s}</a>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            {[['Home','#home'],['Our Menu','#menu'],['Our Story','#about'],['Offers','#offers'],['Contact','#contact']].map(([l,h]) => (
              <a key={l} href={h}>{l}</a>
            ))}
          </div>

          <div className="footer-col">
            <h4>Contact</h4>
            <p>Hetauda-4, Makwanpur</p>
            <p>Bagmati Province, Nepal</p>
            <a href="tel:+9779800000000">+977 9800000000</a>
            <a href="mailto:hello@hetaudakitchen.com">hello@hetaudakitchen.com</a>
          </div>

          <div className="footer-col">
            <h4>Hours</h4>
            <p>Sunday – Friday</p>
            <strong>11:00 AM – 10:00 PM</strong>
            <p>Saturday</p>
            <strong>11:00 AM – 10:30 PM</strong>
          </div>
        </div>

        <div className="container footer-bottom">
          <p>© 2026 Hetauda Kitchen & Grill. All rights reserved.</p>
          <p>Made with ❤️ in Nepal</p>
        </div>
      </footer>

      {/* ════ FLOATING WHATSAPP ════ */}
      <button
        className="floating-btn"
        id="floating-whatsapp-btn"
        onClick={() => openWA()}
        aria-label="Order on WhatsApp"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.553 4.118 1.523 5.845L0 24l6.335-1.505A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.012-1.373l-.36-.214-3.76.893.942-3.665-.234-.374A9.78 9.78 0 012.182 12C2.182 6.578 6.578 2.182 12 2.182S21.818 6.578 21.818 12 17.422 21.818 12 21.818z" />
        </svg>
        Order Now
      </button>
    </div>
  );
}

/* ════ FOOD CARD ════ */
function FoodCard({ item, delay, onOrder }) {
  const ref = useReveal();
  return (
    <div
      className={`food-card reveal reveal-delay-${delay + 1}`}
      ref={ref}
    >
      <div className="food-img-wrap">
        <img src={item.image_url} alt={item.name} loading="lazy" />
        {item.is_popular && <span className="food-badge">Popular</span>}
        <button
          className="food-order-btn"
          onClick={() => onOrder(`Namaste! I want to order ${item.name}`)}
          aria-label={`Order ${item.name}`}
        >
          +
        </button>
      </div>
      <div className="food-body">
        <div className="food-meta">
          <h3>{item.name}</h3>
          <div className="food-price-wrap">
            <strong>Rs. {item.price}</strong>
            {item.old_price && <del>Rs. {item.old_price}</del>}
          </div>
        </div>
        <p>{item.description}</p>
        <span className="food-cat">{item.category}</span>
      </div>
    </div>
  );
}

/* ════ ABOUT IMAGES ════ */
function AboutImages() {
  const ref = useReveal();
  return (
    <div className="about-images reveal" ref={ref}>
      <div className="about-img-main" />
      <div className="about-img-sub" />
      <div className="about-badge">
        <strong>10+</strong>
        <span>Years of<br />Hospitality</span>
      </div>
    </div>
  );
}

/* ════ STAT ITEM ════ */
function StatItem({ value, label, isVisible }) {
  const displayed = useCounter(value, isVisible);
  return (
    <div className="stat-item">
      <strong>{displayed}</strong>
      <span>{label}</span>
    </div>
  );
}

/* ════ REVIEW CARD ════ */
function ReviewCard({ review, delay }) {
  const ref = useReveal();
  return (
    <div className={`review-card reveal reveal-delay-${delay + 1}`} ref={ref}>
      <div className="review-quote-mark">"</div>
      <div className="review-stars">{'★'.repeat(review.rating || 5)}</div>
      <p>"{review.quote}"</p>
      <div className="review-person">
        <div className="review-avatar">
          {review.avatar_url
            ? <img src={review.avatar_url} alt={review.name} />
            : review.name.charAt(0)
          }
        </div>
        <div>
          <strong>{review.name}</strong>
          <small>{review.role}</small>
        </div>
      </div>
    </div>
  );
}

/* ════ REVIEW FORM ════ */
function ReviewForm({ api }) {
  const ref = useReveal();
  const [form, setForm] = useState({ name: '', role: '', quote: '', rating: '5' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch(`${api}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, rating: parseInt(form.rating) }),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
      setForm({ name: '', role: '', quote: '', rating: '5' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="review-form-wrap reveal" ref={ref}>
      <h3>Leave a Review</h3>
      <p>Share your experience — approved reviews appear on this page.</p>

      {status === 'success' ? (
        <div className="form-success">
          🙏 Thank you! Your review has been submitted and will appear after approval.
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="review-name">Your Name *</label>
              <input
                id="review-name"
                name="name"
                required
                placeholder="Suman K."
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="review-role">Role / Title</label>
              <input
                id="review-role"
                name="role"
                placeholder="Regular Customer"
                value={form.role}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="review-quote">Your Review *</label>
            <textarea
              id="review-quote"
              name="quote"
              required
              placeholder="Tell us about your experience…"
              value={form.quote}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="review-rating">Rating</label>
            <select id="review-rating" name="rating" value={form.rating} onChange={handleChange}>
              {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>)}
            </select>
          </div>
          {status === 'error' && (
            <p style={{ color: 'var(--ember)', fontSize: '12px', marginBottom: '12px' }}>
              Something went wrong. Please try again.
            </p>
          )}
          <button
            type="submit"
            className="btn btn-primary"
            id="review-submit-btn"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Submitting…' : 'Submit Review →'}
          </button>
        </form>
      )}
    </div>
  );
}
