const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    commentCount: {
        type: Number,
        required: true
    },
    comment: [String]
});

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;