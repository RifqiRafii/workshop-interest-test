const express = require('express');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const prisma = require('../db');
const { calculateScores, CATEGORY_LABELS } = require('../services/scoringService');

const router = express.Router();
const submitLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false });
const scaleValues = new Set(['-2', '-1', '0', '1', '2']);

router.get('/', (req, res) => res.render('peserta/landing'));

router.get('/mulai', (req, res) => res.render('peserta/identity', { values: {}, errors: [] }));

router.post('/mulai', [
  body('nama').trim().isLength({ min: 2, max: 100 }).withMessage('Nama wajib diisi (2-100 karakter).'),
  body('programStudi').trim().isLength({ min: 2, max: 100 }).withMessage('Program studi wajib diisi (2-100 karakter).')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).render('peserta/identity', { values: req.body, errors: errors.array() });

  req.session.participant = {
    nama: req.body.nama.trim(),
    programStudi: req.body.programStudi.trim()
  };
  res.redirect('/soal');
});

router.get('/soal', async (req, res, next) => {
  if (!req.session.participant) return res.redirect('/mulai');
  try {
    const questions = await prisma.question.findMany({ orderBy: { urutan: 'asc' } });
    res.render('peserta/questions', { questions, participant: req.session.participant });
  } catch (error) {
    next(error);
  }
});

router.post('/submit', submitLimiter, async (req, res, next) => {
  if (!req.session.participant) return res.redirect('/mulai');

  try {
    const questions = await prisma.question.findMany({ orderBy: { urutan: 'asc' } });
    const submittedAnswers = new Map();
    for (const question of questions) {
      const rawScore = req.body[`question_${question.id}`];
      if (!scaleValues.has(rawScore)) return res.status(422).render('peserta/questions', {
        questions,
        participant: req.session.participant,
        error: 'Semua pernyataan wajib dijawab dengan pilihan yang tersedia.'
      });
      submittedAnswers.set(question.id, Number(rawScore));
    }

    const result = calculateScores(questions, submittedAnswers);
    const participant = await prisma.participant.create({
      data: {
        nama: req.session.participant.nama,
        programStudi: req.session.participant.programStudi,
        answers: { create: questions.map((question) => ({ questionId: question.id, skor: submittedAnswers.get(question.id) })) },
        hasil: { create: {
          skorAlgoritma: result.scores.ALGORITMA,
          skorWebsite: result.scores.WEBSITE,
          skorUiux: result.scores.UIUX,
          kategoriDominan: result.dominantLabel
        } }
      },
      include: { hasil: true }
    });

    req.session.participant = null;
    res.render('peserta/result', {
      participant,
      result,
      categoryLabels: CATEGORY_LABELS,
      maxScore: questions.filter((question) => question.kategori === 'ALGORITMA').length * 2
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
