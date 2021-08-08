

const express = require("express");

var bodyParser = require("body-parser");
//Database
const database = require("./database");
//initialise express

const booky = express();


booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());

/*
Route         /
Description   Get all the books
Access        PUBLIC
Parameter     NONE
Methods       GET
*/

booky.get("/",(req,res) => {
  return res.json({books: database.books});
});



/*
Route         /is
Description   Get specific book on ISBN
Access        PUBLIC
Parameter     isbn
Methods       GET
*/

booky.get("/is/:isbn",(req,res) =>{
  const getSpecificBook = database.books.filter(
    (book) =>book.ISBN === req.params.isbn
  );

  if(getSpecificBook.length === 0){
    return res.json({error: `No Book Found for the ISBN of ${req.params.isbn}`})
  }

  return res.json({book: getSpecificBook});
});


/*
Route         /c
Description   Get specific book on Category
Access        PUBLIC
Parameter     category
Methods       GET
*/


booky.get("/c/:category",(req,res) => {
  const getSpecificBook = database.books.filter(
    (book) => book.category.includes(req.params.category)                        //include because its an array
  )

  if(getSpecificBook.length === 0) {
    return res.json({error: `No Book found for the category of ${req.params.category}`})
  }

  return res.json({book: getSpecificBook});
});


/*
Route         /l
Description   Get specific book on language
Access        PUBLIC
Parameter     language
Methods       GET
*/

booky.get("/l/:language",(req,res) => {
  const getSpecificBook = database.books.filter(
    (book) => book.language === req.params.language
  );

  if(getSpecificBook.length === 0){
    return res.json({error: `No Book Found for the language of ${req.params.language}`})
  }

  return res.json({book: getSpecificBook});
});


//------------------------------------------2-----------------------------------------


/*
Route         /author
Description   Get all authors
Access        PUBLIC
Parameter     NONE
Methods       GET
*/


booky.get("/author", (req,res) => {
  return res.json({authors: database.author});
});











/*
Route         /author/id
Description   Get author based on id
Access        PUBLIC
Parameter     id
Methods       GET
*/

booky.get("/author/:id",(req,res) => {
  const getSpecificAuthor = database.author.filter(
    (author) => author.id === parseInt(req.params.id)
  );

  if(getSpecificAuthor.length === 0){
    return res.json({error: `No author Found for the id of ${req.params.id}`});
  }

  return res.json({author:getSpecificAuthor})
});













/*
Route         /author/book
Description   Get author based on books
Access        PUBLIC
Parameter     isbn
Methods       GET
*/

booky.get("/author/book/:isbn" , (req,res) => {
  const getSpecificAuthor = database.author.filter(
    (author) => author.books.includes(req.params.isbn)
  )

  if(getSpecificAuthor.length === 0){
    return res.json({
      error: `No author found for the book of ${req.params.isbn}`
    })
  }

  return res.json({authors: getSpecificAuthor});
});



//------------------------------------------3-------------------------------------------

/*
Route         /publications
Description   Get all publications
Access        PUBLIC
Parameter     NONE
Methods       GET
*/

booky.get("/publications",(req,res) => {
  return res.json({publications: database.publication});
})




/*
Route         /publications
Description   To get specific publication based on name
Access        PUBLIC
Parameter     name
Methods       GET
*/

booky.get("/publications/:name",(req,res) => {
  const getSpecificPub = database.publication.filter(
    (publication) => publication.name === req.params.name
  );

  if(getSpecificPub.length === 0){
    return res.json({error: `No Book Found for the publication of ${req.params.name}`})
  }

  return res.json({book: getSpecificPub});
});




/*
Route         /publications
Description   To get specific publication based on id
Access        PUBLIC
Parameter     id
Methods       GET
*/



booky.get("/publications/:id",(req,res) => {
  const getSpecificPub = database.publications.filter(
    (publication) => publication.id === parseInt(req.params.id)
  );

  if(getSpecificPub.length === 0){
    return res.json({error: `No publication was found based on the id ${req.params.id}`})
  }

  return res.json({book: getSpecificPub});

});






//-------------------------------------POST-----------------------------------------------

//POST

/*
Route         /book/new
Description   Add new books
Access        PUBLIC
Parameter     none
Methods       POST
*/

booky.post("/book/new", (req,res) => {
  const newBook = req.body;
  database.books.push(newBook);
  return res.json({updatedBooks: database.books});
});





/*
Route         /author/new
Description   Add new authors
Access        PUBLIC
Parameter     none
Methods       POST
*/

booky.post("/author/new", (req,res) => {
  const newAuthor = req.body;
  database.author.push(newAuthor);
  return res.json(database.author);
});


/*
Route         /publication/new
Description   Add new publications
Access        PUBLIC
Parameter     none
Methods       POST
*/

booky.post("/publication/new", (req,res) => {
  const newPublication = req.body;
  database.publication.push(newPublication);
  return res.json(database.publication);
});


//------------------------PUT----------------------------------------------------


/*
Route         /publication/update/book
Description   Update/add new publications
Access        PUBLIC
Parameter     isbn
Methods       PUT
*/

booky.put("/publication/update/book/:isbn", (req,res) => {
  //update the publication Database
  database.publication.forEach((pub) => {
    if(pub.id === req.body.pubId){
    return pub.books.push(req.params.isbn);
    }
  });
  //Update the Database
  database.books.forEach((book) => {
    if(book.ISBN === req.params.isbn){
      book.publications = req.body.pubId;
      return;
    }
  });

  return res.json(
    {
      books: database.books,
      publications: database.publication,
      message: "Succesfully updated publications"
    }
  );
});


//--------------------------------DELETE---------------------------------------



/*
Route         /book/delete
Description   Delete a book
Access        PUBLIC
Parameter     isbn
Methods       DELETE
*/


booky.delete("/book/delete/:isbn",(req,res) => {
  //whichever book that does not match with isbn , just send it to an updated database array
  //and rest will be filtered out

  const updatedBookDatabase = database.books.filter(
    (book) => book.ISBN !== req.params.isbn
  )
  database.books = updatedBookDatabase;

  return res.json({books: database.books});

});




/*
Route         /book/delete/author
Description   Delete author from book and related book from author
Access        PUBLIC
Parameter     isbn, authorId
Methods       DELETE
*/


booky.delete("/book/delete/author/:isbn/:authorId", (req,res) => {
  //update the book Database
  database.books.forEach((book) => {
    if(book.ISBN === req.params.isbn){
      const newAuthorList = book.author.filter(
        (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
      );
      book.author = newAuthorList;
      return;
    }
  });


  //update the author database
  booky.author.forEach((eachAuthor) => {
    if(eachAuthor.id === parseInt(req.params.authorId)){
      const newBookList = eachAuthor.books.filter(
        (book) => book !== req.params.isbn
      )
      eachAuthor.books = newBookList;
      return;
    }
  });

  return res.json({
    book: database.books,
    author: database.author,
    message: "Author was deleted !!"

  });
});






booky.listen(3000,() => {
  console.log("Server is up and running");
});
