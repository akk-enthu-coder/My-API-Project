
require("dotenv").config();



const express = require("express");

const mongoose = require ("mongoose");

var bodyParser = require("body-parser");
//Database
const database = require("./database/database");

//models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

//initialise express
const booky = express();


booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());


mongoose.connect(process.env.MONGO_URL,
{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}
).then(() => console.log("Connection has been established"));



/*
Route         /
Description   Get all the books
Access        PUBLIC
Parameter     NONE
Methods       GET
*/

booky.get("/",async (req,res) => {
  const getAllBooks = await BookModel.find();
  return res.json({getAllBooks});
});



/*
Route         /is
Description   Get specific book on ISBN
Access        PUBLIC
Parameter     isbn
Methods       GET
*/

booky.get("/is/:isbn",async (req,res) =>{


  const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn});

  //
  // const getSpecificBook = database.books.filter(
  //   (book) =>book.ISBN === req.params.isbn                //commented because of above code (mongoose)
  // );


//null !0 = 1,  !1= 0
  if(!getSpecificBook){
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


booky.get("/c/:category",async (req,res) => {
  const getSpecificBook = await BookModel.findOne({category: req.params.category});


//null !0 = 1,  !1= 0
  if(!getSpecificBook){
    return res.json({error: `No Book Found for the category of ${req.params.category}`})
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


//------------------------------------------2-----------------------------------


/*
Route         /author
Description   Get all authors
Access        PUBLIC
Parameter     NONE
Methods       GET
*/


booky.get("/author",async (req,res) => {
  const getAllAuthors = await AuthorModel.find()
  return res.json({getAllAuthors});
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



//------------------------------------------3-----------------------------------

/*
Route         /publications
Description   Get all publications
Access        PUBLIC
Parameter     NONE
Methods       GET
*/

booky.get("/publications",async (req,res) => {
  const getAllPublications = await PublicationModel.find();
  return res.json({getAllPublications});
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

/*

booky.get("/publications/:id",(req,res) => {
  const getSpecificPub = database.publications.filter(
    (publication) => publication.id === parseInt(req.params.id)
  );

  if(getSpecificPub.length === 0){
    return res.json({error: `No publication was found based on the id ${req.params.id}`})
  }

  return res.json({book: getSpecificPub});

});
*/




//-------------------------------------POST-------------------------------------

//POST

/*
Route         /book/new
Description   Add new books
Access        PUBLIC
Parameter     none
Methods       POST
*/

booky.post("/book/new",async (req,res) => {
  const { newBook } = req.body;

  const addNewBook = BookModel.create(newBook);
  return res.json({
    books: addNewBook,
    message:"Book was added"
  });

  // database.books.push(newBook);                         //await is not needed
  // return res.json({updatedBooks: database.books});      //commented because above code i.e mongodb
});





/*
Route         /author/new
Description   Add new authors
Access        PUBLIC
Parameter     none
Methods       POST
*/

booky.post("/author/new",async (req,res) => {
  const{ newAuthor } = req.body;                                      //{  } - destructuring
  const addNewAuthor = AuthorModel.create(newAuthor);
  return res.json({
    books: addNewAuthor,
    message:"Author was added"
  });

  // database.author.push(newAuthor);
  // return res.json(database.author);
});


/*
Route         /publication/new
Description   Add new publications
Access        PUBLIC
Parameter     none
Methods       POST
*/

booky.post("/publication/new",async (req,res) => {
  const{ newPublication } =req.body;
  const addNewPublication = PublicationModel.create(newPublication);
  return res.json({
    books: addNewPublication,
    message: "Publication was added"
  });


  // database.publication.push(newPublication);
  // return res.json(database.publication);
});


//------------------------PUT---------------------------------------------------


/*
Route         book/update
Description   Update book on isbn
Access        PUBLIC
Parameter     isbn
Methods       PUT
*/

booky.put("/book/update/:isbn",async (req,res) => {
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn
    },
    {
      title : req.body.bookTitle                //in postman { "bookTitle": .....}
    },
    {
      new: true                                 //shows the updated data in frontend
    }
  );

  return res.json({
    books: updatedBook
  });
});


      /********UPDATING NEW AUTHOR AND BOOK ALSO SIMULTANEOUSLY*********/

      /*
      Route         /book/author/update
      Description   Update/add new author
      Access        PUBLIC
      Parameter     isbn
      Methods       PUT
      */


booky.put("/book/author/update/:isbn", async (req,res) => {
          //Update the book Database
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn
    },
    {
      $addToSet:{
        authors: req.body.newAuthor
      }
    },
    {
      new: true
    }
  );

        //Update the author database
  const updatedAuthor = await AuthorModel.findOneAndUpdate(
    {
      id: req.body.newAuthor
    },
    {
      $addToSet:{
        books: req.body.isbn
      }
    },
    {
      new: true
    }
  );

  return res.json(
    {
      books: updatedBook,
      authors: updatedAuthor,
      message: "new author was added"
    }
  )
});










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


//--------------------------------DELETE----------------------------------------



/*
Route         /book/delete
Description   Delete a book
Access        PUBLIC
Parameter     isbn
Methods       DELETE
*/


booky.delete("/book/delete/:isbn", async(req,res) => {
  //whichever book that does not match with isbn , just send it to an updated database array
  //and rest will be filtered out

  const updatedBookDatabase = await BookModel.findOneAndDelete(
    {
      ISBN: req.params.isbn
    }
  );

  return res.json({
    books: updatedBookDatabase
  });
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
