const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());

// Connect to the MongoDB database
mongoose.connect('mongodb://127.0.0.1:27017/bdtp2', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.error("Error connecting to DB:", err);
  });

const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  password: String
}));

// Dummy books data
const books = [
  { title: 'Book 1', author: 'Author 1' },
  { title: 'Book 2', author: 'Author 2' },
  // Add more books as needed
];

app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
}));

// Middleware to check authentication for /livres routes
app.use('/livres', (req, res, next) => {
  if (req.session.isAuthenticated) {
    next();
  } else {
    res.status(401).json({ message: 'Authentication required.' });
  }
});

// Books route
app.get('/livres', (req, res) => {
  res.json(books);
});

// Registration route
app.get('/register', (req, res) => {
  res.render('Register.pug');
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: 'Nom d\'utilisateur ou mot de passe manquant.' });
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      password: hashedPassword,
    });

    await user.save();
    res.redirect('/login');
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur lors de l\'enregistrement de l\'utilisateur.' });
  }
});

// Login route
app.get('/login', (req, res) => {
  res.render('Login.pug');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      req.session.isAuthenticated = true;
      res.redirect('/livres');
    } else {
      res.status(401).json({ message: 'Identifiants invalides.' });
    }
  } catch (error) {
    console.error('Erreur lors de l\'authentification de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur lors de l\'authentification.' });
  }
});

app.set('view engine', 'pug');
app.set('views', './views');

app.listen(5000, () => {
  console.log('Port running on 5000');
});
