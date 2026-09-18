require('dotenv').config();

const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const csrf = require('csurf');
const path = require('path');

const pesertaRoutes = require('./routes/peserta');
const adminRoutes = require('./routes/admin');

const app = express();
const port = Number(process.env.PORT) || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../public')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'development-only-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60
  }
}));
app.use(csrf());
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  res.locals.currentPath = req.path;
  next();
});

app.use('/', pesertaRoutes);
app.use('/admin', adminRoutes);
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') return res.status(403).render('error', { message: 'Form sudah kedaluwarsa. Silakan coba lagi.' });
  console.error(err);
  res.status(500).render('error', { message: 'Terjadi kesalahan pada server.' });
});

app.listen(port, () => console.log(`Workshop interest test running at http://localhost:${port}`));
