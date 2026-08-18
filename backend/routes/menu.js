const express = require('express');
const db = require('../db/connection');
const { requireAdmin } = require('../middleware/auth');
const router = express.Router();

// GET /api/menu — public, optional ?category= filter
router.get('/', (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM menu_items WHERE is_active = 1';
    const params = [];

    if (category && category !== 'All') {
      params.push(category);
      query += ' AND category = ?';
    }

    query += ' ORDER BY is_popular DESC, id ASC';
    const stmt = db.prepare(query);
    const rows = stmt.all(...params);
    
    // In SQLite, bool is returned as 1/0. Map it if needed.
    const mapped = rows.map(r => ({
      ...r,
      is_popular: !!r.is_popular,
      is_active: !!r.is_active
    }));

    res.json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/menu/categories — public, list unique categories
router.get('/categories', (req, res) => {
  try {
    const rows = db.prepare('SELECT DISTINCT category FROM menu_items WHERE is_active = 1 ORDER BY category').all();
    const categories = ['All', ...rows.map(r => r.category)];
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/menu — admin only
router.post('/', requireAdmin, (req, res) => {
  try {
    const { name, description, price, old_price, category, image_url, is_popular } = req.body;
    if (!name || !price || !category) {
      return res.status(400).json({ error: 'name, price, and category are required' });
    }
    const stmt = db.prepare(`
      INSERT INTO menu_items (name, description, price, old_price, category, image_url, is_popular)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      name,
      description || null,
      price,
      old_price || null,
      category,
      image_url || null,
      is_popular ? 1 : 0
    );
    const created = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/menu/:id — admin only
router.put('/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, old_price, category, image_url, is_popular, is_active } = req.body;
    
    const existing = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(id);
    if (!existing) return res.status(404).json({ error: 'Item not found' });

    const stmt = db.prepare(`
      UPDATE menu_items SET
        name = ?,
        description = ?,
        price = ?,
        old_price = ?,
        category = ?,
        image_url = ?,
        is_popular = ?,
        is_active = ?
      WHERE id = ?
    `);

    stmt.run(
      name !== undefined ? name : existing.name,
      description !== undefined ? description : existing.description,
      price !== undefined ? price : existing.price,
      old_price !== undefined ? old_price : existing.old_price,
      category !== undefined ? category : existing.category,
      image_url !== undefined ? image_url : existing.image_url,
      is_popular !== undefined ? (is_popular ? 1 : 0) : existing.is_popular,
      is_active !== undefined ? (is_active ? 1 : 0) : existing.is_active,
      id
    );

    const updated = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(id);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/menu/:id — admin only (soft delete)
router.delete('/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('UPDATE menu_items SET is_active = 0 WHERE id = ?');
    const info = stmt.run(id);
    if (info.changes === 0) return res.status(404).json({ error: 'Item not found' });
    const item = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(id);
    res.json({ message: 'Item deactivated', item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
