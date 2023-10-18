const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const router = express.Router();

// Register a new user
router.post('/register', (req, res) => {
  const { username, password } = req.body;
  User.register(new User({ username }), password, (err, user) => {
    if (err) {
      return res.render('register');
    }
    passport.authenticate('local')(req, res, () => {
      res.redirect('/books');
    });
  });
});

// Login
router.post('/login', passport.authenticate('local', {
  successRedirect: '/books',
  failureRedirect: '/login',
}));

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
