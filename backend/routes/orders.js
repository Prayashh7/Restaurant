const express = require('express');
const db = require('../db/connection');
const { requireAdmin } = require('../middleware/auth');
const router = express.Router();

// POST /api/orders — public, place a new order
router.post('/', (req, res) => {
  try {
    const { customer_name, phone, items, total, note } = req.body;
    if (!items || !total) {
      return res.status(400).json({ error: 'items and total are required' });
    }
    const stmt = db.prepare(`
      INSERT INTO orders (customer_name, phone, items, total, note)
      VALUES (?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      customer_name || 'Guest',
      phone || null,
      JSON.stringify(items),
      total,
      note || null
    );
    const created = db.prepare('SELECT * FROM orders WHERE id = ?').get(info.lastInsertRowid);
    created.items = JSON.parse(created.items);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/orders — admin only
router.get('/', requireAdmin, (req, res) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM orders';
    const params = [];

    if (status) {
      params.push(status);
      query += ' WHERE status = ?';
    }

    query += ' ORDER BY created_at DESC';
    const stmt = db.prepare(query);
    const rows = stmt.all(...params);
    
    const parsed = rows.map(r => ({
      ...r,
      items: JSON.parse(r.items)
    }));

    res.json(parsed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/orders/:id/status — admin only
router.patch('/:id/status', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ['new', 'confirmed', 'preparing', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${validStatuses.join(', ')}` });
    }
    const stmt = db.prepare('UPDATE orders SET status = ? WHERE id = ?');
    const info = stmt.run(status, id);
    if (info.changes === 0) return res.status(404).json({ error: 'Order not found' });
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
    order.items = JSON.parse(order.items);
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
