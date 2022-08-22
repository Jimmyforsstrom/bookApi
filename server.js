const express = require("express");
const fs = require("fs");
const { parse } = require("path");
const app = express();

//pass the incoming data from the client
app.use(express.json());

//post a book
app.post("/book/create", (req, res) => {
  //req.body  console.log(req.body);
  let books = [];
  //read all the file on the file system
  fs.readFile("booksData.json", "utf-8", (err, data) => {
    //check if error
    if (err) {
      return;
    }
    //read the file
    const dataToJSON = JSON.parse(data);
    //check if book title exists
    const titleExist = dataToJSON.find(
      (book) => book.title.toLowerCase() === req.body.title.toLowerCase()
    );

    if (titleExist) {
      return res.send("title already exist");
    }

    //check if there is no title
    if (!req.body.title) {
      return res.send("book title is required!");
    }
    //else create new book
    books.push(...dataToJSON, {
      id: Math.floor(Math.random() * 100),
      title: req.body.title,
      author: req.body.author,
      publishedYear: req.body.publishedYear,
      numPages: req.body.numPages,
    });
    fs.writeFileSync("booksData.json", JSON.stringify(books));
    res.send("Book is successfully created");

    console.log(dataToJSON);
  });
});

//get all books
app.get("/books/all", function (req, res) {
  const data = fs.readFileSync("booksData.json");

  const convertedData = JSON.parse(data);
  res.send(convertedData);
});

//get a specifik book by id
app.get("/bookDetails/:id", (req, res) => {
  const id = req.params.id;

  //fetch all athe books and find the book by id fromo the params

  const data = fs.readFileSync("booksData.json");
  //convert the buffer data into object
  const allBooks = JSON.parse(data);

  //find a book by it id
  const bookFound = allBooks.find((book) => book.id === parseInt(id));

  if (!bookFound) {
    return res.send("book not found");
  }
  res.send(bookFound);
});

//delete a book by it´s id

app.delete("/bookDelete/:id", (req, res) => {
  const id = req.params.id;

  //fetch all athe books and find the book by id fromo the params

  const data = fs.readFileSync("booksData.json");
  //convert the buffer data into object
  let allBooks = JSON.parse(data);

  //find a book by it id
  bookFound = allBooks.find((book) => book.id === parseInt(id));

  if (!bookFound) {
    return res.send("book not found");
  }

  allBooks = allBooks.filter((book) => book.id != id);
  fs.writeFileSync("booksData.json", JSON.stringify(allBooks));

  res.send(allBooks);
});

app.listen(8000, console.log("The Server is up and running om port 8000"));
