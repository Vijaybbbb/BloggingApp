// const { Schema, model } = require('mongoose');

// const blogSchema = new Schema({
//   UserId: {
//     type: Schema.Types.ObjectId,
//     ref: 'user',
//   },
//   blogs: [
//     {
//       blogid: {
//         type: Schema.Types.ObjectId, // Change to ObjectId
//         ref: 'blog', // Reference to the Blog model
//         required: true,
//       },
//     },
//   ],
// }, { timestamps: true });

// const Cart = model('cart', blogSchema); 

// module.exports = Cart;


const mongoose = require('mongoose')
const { Schema, model } = require('mongoose');

const blogSchema = new Schema({
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', // or the model name to which it refers
    required: true,
  },
  blogs: [
    {
      type: Schema.Types.ObjectId, // Change to ObjectId
      ref: 'blog', // Reference to the Blog model
      required: true,
    },
  ],
}, { timestamps: true });

const Cart = model('cart', blogSchema);

module.exports = Cart;
