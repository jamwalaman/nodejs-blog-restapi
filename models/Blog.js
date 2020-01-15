// const moment = require('moment');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
  title: {
    type: String,
    required: true,
    max: 100
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});


// Export model
module.exports = mongoose.model('Blog', BlogSchema);
