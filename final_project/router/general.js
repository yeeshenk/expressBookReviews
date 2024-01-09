const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      console.log("usersgeneral",users);
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
  return res.status(300).json({message: "Yet to be implemented"});
});

const getBooks = new Promise((resolve,reject) => {
  try {
    const bookList = JSON.stringify(books, null, 4);
    resolve(bookList)
  } catch(err){
    reject(err)
  }
})

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  getBooks
  .then((bookList) => {
    res.send(bookList);
  })
  .catch((error) => {
    return res.status(404).json({message: error});
  });
});

const getBookIsbn = (isbnNumber) => new Promise((resolve,reject) => {
    try {
      const book = books[isbnNumber];
      resolve(book)
    } catch(err){
      reject(err)
    }
  })

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    // Check if the provided ISBN is a valid number
    if (isNaN(isbn)) {
      return res.status(400).json({ error: 'Invalid ISBN format' });
    }

    // Convert ISBN to a number
    const isbnNumber = parseInt(isbn);
    // Check if the book with the given ISBN exists
    if (!books[isbnNumber]) {
      return res.status(404).json({ error: `Book with ISBN ${isbnNumber} not found` });
    }

    // Retrieve the book based on the ISBN
    getBookIsbn(isbnNumber)
    .then((book) => {
        res.send(book);
      })
      .catch((error) => {
        return res.status(404).json({message: error});
      });
  });
  
  const getBookAuthor = (authorName) => new Promise((resolve,reject) => {
    try {
      const book = Object.values(books).find(book => book.author === authorName);
      resolve(book)
    } catch(err){
      reject(err)
    }
  })

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  getBookAuthor(author)
  .then((book) => {
      res.send(book);
    })
    .catch((error) => {
      return res.status(404).json({message: error});
    });});

const getBookTitle = (titleName) => new Promise((resolve,reject) => {
    try {
        const book = Object.values(books).find(book => book.title === titleName);
        resolve(book)
    } catch(err){
        reject(err)
    }
})

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  getBookTitle(title)
  .then((book) => {
      res.send(book);
    })
    .catch((error) => {
      return res.status(404).json({message: error});
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    // Check if the provided ISBN is a valid number
    if (isNaN(isbn)) {
      return res.status(400).json({ error: 'Invalid ISBN format' });
    }
  
    // Convert ISBN to a number
    const isbnNumber = parseInt(isbn);
  
    // Check if the book with the given ISBN exists
    if (!books[isbnNumber]) {
      return res.status(404).json({ error: `Book with ISBN ${isbnNumber} not found` });
    }
  
    // Retrieve the reviews for the book based on the ISBN
    const reviews = books[isbnNumber].reviews;
  
    // Send the reviews as a JSON response
    res.send(reviews);});

module.exports.general = public_users;
