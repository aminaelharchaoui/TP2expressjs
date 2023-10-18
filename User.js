// userController.js

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

// Définition du modèle User
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const User = mongoose.model('User', userSchema);
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/bdtp2');
  console.log("Connected to DB")
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/bdtp2');` if your database has auth enabled
 }

const registerUser = async (username, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    username,
    password: hashedPassword
  });

  await user.save();
};

module.exports = { registerUser, User }; // Export du modèle User
