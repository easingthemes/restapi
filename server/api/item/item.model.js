var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ItemSchema = new Schema({
  title: String,
  content: String
});

module.exports = mongoose.model('Item', ItemSchema);