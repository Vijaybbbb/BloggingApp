const { Schema, model } = require('mongoose');

const blogSchema = new Schema({
  UserId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  blogs: [
    {
      blogid: {
        type: Schema.Types.ObjectId, // Change to ObjectId
        ref: 'Blog', // Reference to the Blog model
        required: true,
      },
    },
  ],
}, { timestamps: true });

const Cart = model('cart', blogSchema); 

module.exports = Cart;
