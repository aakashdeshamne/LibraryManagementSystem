const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());
const port = 3000;

require("./DataBase/Connetion.cjs");
const User = require("./DataBase/Models/User.cjs");
const Book = require("./DataBase/Models/Book.cjs");
const Borrower = require("./DataBase/Models/Borrower.cjs");
const Return = require("./DataBase/Models/Return.cjs");

const auth = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access Denied");
  try {
    const decoded = jwt.verify(token, "secret_key");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};

//register user
app.post("/register", async (req, res) => {
  const { name, username, password, email, mobile, admin } = req.body;
  const user = new User({ name, username, password, email, mobile, admin });
  const existingUser = await User.findOne({ username: username });
  try {
    if (existingUser) {
      return res.status(400).send("User already exists");
    }
    await user.save();
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      "secret_key"
    );

    res.status(201).send({ token });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//login user
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email: email });
    if (!existingUser || existingUser.password !== password) {
      return res
        .status(400)
        .send("User not exists OR the password is incorrect");
    } else {
      const token = jwt.sign(
        { userId: existingUser._id, email: existingUser.email },
        "secret_key"
      );
      res.status(200).send({ token });
    }
  } catch (err) {
    res.status(400).send("User does not exist");
  }
});

//add book to store
app.post("/addbook", auth, async (req, res) => {
  const { name, author, genre, type } = req.body;
  const book = new Book({ name, author, genre, type });
  try {
    await book.save();
    res.status(201).send("Book added successfully");
  } catch {
    res.status(400).send("Book not added");
  }
});

//get all books
app.get("/books", auth, async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).send(books);
  } catch {
    res.status(400).send("Books not found");
  }
});

//get all users in system

app.get("/users", auth, async (req, res) => {
  try {
    const users = await User.find().select("name email mobile");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Error occur", error: err });
  }
});

//Borrow book from store
app.post("/borrow", auth, async (req, res) => {
  const { bookId, duedate } = req.body;
  const userId = req.user.userId;
  const book = await Book.findById(bookId);
  const user = await User.findById(userId);
  if (!book || !user || !book.available) {
    return res.status(400).send("Book or User not found");
  }
  const borrow = new Borrower({
    username: user.username,
    bookid: bookId,
    duedate,
  });
  try {
    await borrow.save();
    book.available = false;
    await book.save();
    res.status(201).send("Book borrowed successfully");
  } catch (err) {
    res.status(400).send("Book not borrowed");
  }
});

// Return the book
app.post("/return", auth, async (req, res) => {
  const { bookId } = req.body;
  const userId = req.user.userId;
  const user = await User.findById(userId);
  const borrower = await Borrower.findOne({
    bookid: bookId,
    username: user.username,
  });
  if (!borrower) {
    return res.status(400).send("Book not borrowed by user");
  }
  const currentDate = new Date();
  const returnDate = new Date(borrower.duedate);
  const diffTime = Math.abs(returnDate - currentDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  let fine = diffDays * 1;

  const returnrec = new Return({
    username: user.username,
    bookid: bookId,
    duedate: borrower.duedate,
    fine,
  });
  try {
    await returnrec.save();
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).send("Book not found.");
    }
    book.available = true;
    await book.save();
    res.status(201).send("Book returned successfully");
  } catch (err) {
    res.status(400).send("Book not returned");
  }
});

//book updated from admin
app.post("/updatebook", auth, async (req, res) =>{
    const {bookid} = req.body;
    const userId = req.user.userId;
    const isadmin = await User.findById(userId);
    if(!isadmin.admin){
        return res.status(400).send("You are not admin");
    }
    try{
        const book= await Book.findById(bookid);
        console.log('Book found:', book); 
         if(!book){
             return res.status(400).send("Book not found");
        }
        book.available = !book.available;
        await book.save();
    }
    catch(err){
        res.status(400).send("Book not updated");
    }

});

app.listen(port, (error) => {
  if (error) {
    console.log("Error starting the server");
  }
  console.log("Server is running on port", port);
});
