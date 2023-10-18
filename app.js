const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const app = express();

// Configure MongoDB connection
mongoose.connect('mongodb://localhost/your-database-name', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport for local authentication
const User = require('./models/User');
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set Pug as the view engine
app.set('view engine', 'pug');

// Set up routes
const authRoutes = require('./routes/auth');
const booksRoutes = require('./routes/books');

app.use('/auth', authRoutes);
app.use('/books', booksRoutes);

// Listen on a port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
