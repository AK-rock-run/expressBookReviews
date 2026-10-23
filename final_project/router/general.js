
const express = require('express');
const axios = require('axios');
const books = require('./booksdb.js');
const auth = require('./auth_users.js');

const public_users = express.Router();

// Retrieve all books using async/await and Axios
public_users.get('/', async (req, res) => {
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts/1');
    if (!response.data) throw new Error('Request failed');
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Unable to retrieve books' });
  }
});

// Retrieve book by ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  res.json(books[req.params.isbn] || {});
});

// Retrieve books by author
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author.toLowerCase();
  res.json(Object.values(books).filter(book =>
    book.author.toLowerCase().includes(author)
  ));
});

// Retrieve books by title
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title.toLowerCase();
  res.json(Object.values(books).filter(book =>
    book.title.toLowerCase().includes(title)
  ));
});

// Retrieve reviews for a book
public_users.get('/review/:isbn', (req, res) => {
  res.json(books[req.params.isbn]?.reviews || {});
});

// Register a new user
public_users.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  if (auth.isValid(username)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  auth.users.push({ username, password });

  res.status(200).json({
    message: 'User successfully registered. Now you can login'
  });
});

module.exports.general = public_users;
