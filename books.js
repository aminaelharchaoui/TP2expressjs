// livreRouter.js

const express = require('express');
const router = express.Router();
const books = [
  { title: 'Book 1', author: 'Author 1' },
  { title: 'Book 2', author: 'Author 2' },
  // Add more books as needed
];

router.get('/', (req, res) => {
  res.json(books);
});
router.post('/', (req, res) => {
  Livres.push(req.body);
  res.status(201).send('Livre ajouté avec succès');
});
router.get('/', (req, res) => {
  if (req.session.isAuthenticated) {
    res.json(books);
  } else {
    res.status(401).json({ message: 'Authentication required.' });
  }
});
module.exports = router;
