const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{ username: 'chris', password: '1234' }];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }
  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.body.username; // Assuming the username is sent in the request body
    const reviewText = req.body.review; // Assuming the review text is sent in the request body
    if (!username || !reviewText) {
      return res.status(400).json({ message: "Username and review are required in the request body" });
    }
    // Check if the book with the given ISBN exists
    if (!books[isbn]) {
      return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
    }
    // Insert the review into the reviews attribute
    books[isbn].reviews[username] = reviewText;
    return res.status(200).json({ message: "Review added successfully", book: books[isbn] });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.body.username;
  
    // Check if the book with the given ISBN exists
    if (!books[isbn]) {
      return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
    }
  
    // Check if the review with the given username exists
    if (!books[isbn].reviews[username]) {
      return res.status(404).json({ message: `Review by ${username} not found for book with ISBN ${isbn}` });
    }
  
    // Delete the review from the reviews attribute
    delete books[isbn].reviews[username];
  
    return res.status(200).json({ message: `Review by ${username} deleted successfully`, book: books[isbn] });
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
