const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  image: {
    type: String,
    required: [true, 'Please add an image URL for the post']
  },
  description: {
    type: String,
    required: [true, 'Please add a description for the post']
  }
}, {
  timestamps: true // Automatically handles upload time (createdAt, updatedAt)
});

module.exports = mongoose.model('Post', postSchema);
