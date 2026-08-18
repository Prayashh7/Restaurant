const express = require('express');
const db = require('../db/connection');
const { requireAdmin } = require('../middleware/auth');
const router = express.Router();

// GET /api/reviews — public, only approved reviews
router.get('/', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM reviews WHERE is_approved = 1 ORDER BY created_at DESC').all();
    const mapped = rows.map(r => ({
      ...r,
      is_approved: !!r.is_approved
    }));
    res.json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/reviews/all — admin only, all reviews
router.get('/all', requireAdmin, (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM reviews ORDER BY created_at DESC').all();
    const mapped = rows.map(r => ({
      ...r,
      is_approved: !!r.is_approved
    }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/reviews — public, submit a review
router.post('/', (req, res) => {
  try {
    const { name, role, quote, rating } = req.body;
    if (!name || !quote) {
      return res.status(400).json({ error: 'name and quote are required' });
    }
    const safeRating = Math.min(5, Math.max(1, parseInt(rating) || 5));
    const stmt = db.prepare(`
      INSERT INTO reviews (name, role, quote, rating)
      VALUES (?, ?, ?, ?)
    `);
    const info = stmt.run(name, role || 'Guest', quote, safeRating);
    const created = db.prepare('SELECT * FROM reviews WHERE id = ?').get(info.lastInsertRowid);
    created.is_approved = !!created.is_approved;
    res.status(201).json({
      message: 'Review submitted! It will appear after approval.',
      review: created,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/reviews/:id/approve — admin only
router.patch('/:id/approve', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('UPDATE reviews SET is_approved = 1 WHERE id = ?');
    const info = stmt.run(id);
    if (info.changes === 0) return res.status(404).json({ error: 'Review not found' });
    const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(id);
    review.is_approved = !!review.is_approved;
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/reviews/:id — admin only
router.delete('/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM reviews WHERE id = ?');
    const info = stmt.run(id);
    if (info.changes === 0) return res.status(404).json({ error: 'Review not found' });
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
