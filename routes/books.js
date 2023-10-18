const express = require('express');
const router = express.Router();

// Middleware to check if the user is authenticated
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/login');
};

// Books route
router.get('/', isLoggedIn, (req, res) => {
  // Fetch books from a local variable or your database
  const books = ['Book 1', 'Book 2', 'Book 3'];

  res.render('books', { books });
});

module.exports = router;
