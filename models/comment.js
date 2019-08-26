var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Create a new object
var CommentSchema = new Schema({
    body: String
});

// Create model from schema using mongoose's model method
var Comment = mongoose.model("Comment", CommentSchema);

// Export model
module.exports = Comment;