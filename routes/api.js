/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const Book = require('../model/Book');

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      console.log("GET /api/books");
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find({}, function(err, books) {
        if (err) {
          console.log(`server error: ${err}`);
          return res.status(500).send(`server error: ${err}`);
        }

        return res.status(200).send(books);
      });
    })
    
    .post(function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      console.log("POST /api/books");
      if (!req.body.title) {
        return res.status(400).send("missing required field title");
      }

      const book = new Book({
        title: req.body.title,
        commentCount: 0
      });

      book.save(function(err) {
        if (err) {
          console.log(`server error: ${err}`);
          return res.status(500).send(`server error: ${err}`);
        }

        return res.status(201).json({title: book.title, _id: book._id});
      });
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      console.log("DELETE /api/book");

      Book.remove({}, function(err) {
        if (err) {
          const message = `server error: ${err}`;
          console.log(message);
          return res.status(500).send(message);
        }
        return res.status(200).send("complete delete successful");
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      console.log("GET /api/books/:id");

      Book.findOne({_id: bookid}, function(err, book) {
        if (err) {
          const message = `server error: ${err}`;
          console.log(message);
          return res.status(500)>send(message);
        }
        
        if (!book) {
          return res.status(400).send("no book exists");
        }

        return res.status(200).json({
          title: book.title,
          _id: book._id,
          comments: book.comments
        });
      });
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get

      if (!comment) {
        return res.status(400).send("missing required field comment");
      }

      Book.findOne({_id: bookid}, async function(err, book) {
        if (err) {
          const message = `server error: ${err}`;
          console.log(message);
          return res.status(500).send(message);
        }

        if (!book) {
          return res.status(404).send('no book exists');
        }

        book.comments.push(comment);
        book.commentCount = book.comments.length;

        await book.save(function(err) {
          if (err) {
            const message = `server error: ${err}`;
            console.log(message);
            return res.status(500).send(message);
          }

          return res.status(200).json({
            title: book.title,
            _id: book._id,
            comments: book.comments
          });
        });
      })
    })
    
    .delete(function(req, res){
      // let bookid = req.params.id;
      //if successful response will be 'delete successful'
      console.log("DELETE /api/books/:id");

      let bookid = req.params.id;

      Book.findOne({_id: bookid}, function(err, book) {
        if (err) {
          const message = `server error: ${err}`;
          console.log(message);
          return res.status(500).send(message);
        }

        if (!book) {
          return res.status(404).send(`Could not find book with ID ${bookid}`);
        }

        book.remove(function(err) {
          if (err) {
            const message = `server error: ${err}`;
            console.log(message);
            return res.status(500).send(message);
          }
          return res.status(200).send("delete successful");
        });
      });
    });
  
};
