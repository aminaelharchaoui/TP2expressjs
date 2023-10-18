// app.js
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const app = express();
app.use(express.json());



const livreRouter = require('./books');
const { registerUser,User } = require('./User');
app.use(express.urlencoded({ extended: true }));


// declaration de la session 
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
}));


// configurer le moteur de rendu de vues et définir le répertoire où se trouvent les fichiers de vues
app.set('view engine', 'pug');
app.set('views', './views');

app.use('/livres', (req, res, next) => {
  if (req.session.isAuthenticated) {
    next();
  } else {
    res.status(401).json({ message: 'Authentication required.' });
  }
});
app.use('/livres', livreRouter);
// app.use('/auth', authRouter);



// envoyer Registration.pug  en réponse à la requête HTTP.
app.get('/register', (req, res) => {
  res.render('Register.pug');
});


//Enregistre un nouvel utilisateur dans le système
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: 'Nom d\'utilisateur ou mot de passe manquant.' });
    return;
  }

  try {
    registerUser(username, password); // Appel correct à registerUser
    
    res.redirect('/login')
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur lors de l\'enregistrement de l\'utilisateur.' });
  }
});


// Afficher la page de connexion
app.get('/login', (req, res) => {
  res.render('Login'); 
});

// Gère l'authentification de l'utilisateur 
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
      res.redirect('/livres'); // Redirect to the books page
    } else {
      res.status(401).json({ message: 'Identifiants invalides.' });
    }
  } catch (error) {
    console.error('Erreur lors de l\'authentification de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur lors de l\'authentification.' });
  }
});


app.listen(5000, () => {
  console.log('Port running on 5000');
});
