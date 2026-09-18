const express = require('express');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const prisma = require('../db');
const { requireAdmin } = require('../middlewares/authAdmin');

const router = express.Router();
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false });

router.get('/', (req, res) => res.redirect(req.session.adminUserId ? '/admin/dashboard' : '/admin/login'));
router.get('/login', (req, res) => res.render('admin/login', { error: null, username: '' }));

router.post('/login', loginLimiter, [
  body('username').trim().isLength({ min: 1, max: 50 }).withMessage('Username wajib diisi.'),
  body('password').isLength({ min: 1, max: 200 }).withMessage('Password wajib diisi.')
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).render('admin/login', { error: errors.array()[0].msg, username: req.body.username });

  try {
    const admin = await prisma.adminUser.findUnique({ where: { username: req.body.username.trim() } });
    const valid = admin && await bcrypt.compare(req.body.password, admin.passwordHash);
    if (!valid) return res.status(401).render('admin/login', { error: 'Username atau password salah.', username: req.body.username });

    req.session.adminUserId = admin.id;
    res.redirect('/admin/dashboard');
  } catch (error) {
    next(error);
  }
});

router.post('/logout', requireAdmin, (req, res) => {
  req.session.destroy(() => res.redirect('/admin/login'));
});

router.get('/dashboard', requireAdmin, async (req, res, next) => {
  try {
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    const dominant = typeof req.query.dominant === 'string' ? req.query.dominant : '';
    const where = {};
    if (search) where.OR = [
      { nama: { contains: search, mode: 'insensitive' } },
      { programStudi: { contains: search, mode: 'insensitive' } }
    ];
    if (dominant) where.hasil = { kategoriDominan: dominant };

    const participants = await prisma.participant.findMany({
      where,
      include: { hasil: true },
      orderBy: { createdAt: 'desc' }
    });
    res.render('admin/dashboard', { participants, filters: { search, dominant } });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
