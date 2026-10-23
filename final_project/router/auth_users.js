
const express = require('express');
const books = require('./booksdb.js');
const regd_users = express.Router();

let users = [];

const isValid = (username) =>
  users.some(user => user.username === username);

const authenticatedUser = (username, password) =>
  users.some(user =>
    user.username === username && user.password === password
  );

regd_users.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({
      message: 'Invalid username or password'
    });
  }

  req.session.username = username;

  return res.json({ message: 'Login successful!' });
});

regd_users.put('/auth/review/:isbn', (req, res) => {
  const username = req.session.username;
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!username) {
    return res.status(401).json({ message: 'Please login first' });
  }

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  if (typeof req.body.review !== 'string' || !req.body.review.trim()) {
    return res.status(400).json({ message: 'Review is required' });
  }

  book.reviews[username] = req.body.review;

  return res.json({
    message: `Review for ISBN ${isbn} added successfully`,
    reviews: book.reviews
  });
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
  const username = req.session.username;
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!username) {
    return res.status(401).json({ message: 'Please login first' });
  }

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  delete book.reviews[username];

  return res.json({
    message: `Review for ISBN ${isbn} deleted`,
    reviews: book.reviews
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
