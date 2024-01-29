const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')

const Blog = require('../models/blog')
const premiumBlog = require('../models/premiumBlogs')
const Cart = require('../models/cart')
const { checkForAuthenticationCookie } = require('../middleware/authentication');
const { default: mongoose } = require('mongoose')





router.get("/home",checkForAuthenticationCookie("tocken"),async (req,res)=>{
  const blog = await premiumBlog.find({})
  res.render('premiumBlogs',{
        user:req.user,
         blogs:blog,
         
  })

}) 





router.post('/addToCart', checkForAuthenticationCookie("tocken"), async (req, res) => {
  try {
    const userId = req.user._id;
    const blogId = new mongoose.Types.ObjectId(req.body.blogId)
    console.log(blogId);
    const blog = await premiumBlog.findById(blogId)
    const cart = await Cart.findOne({ UserId: userId });
    if (cart) {
      // If the user already has a cart, update it
      cart.blogs.push(blogId);
      await cart.save();
    } else {
      // If the user doesn't have a cart, create a new one
      await Cart.create({ UserId: userId, blogs: [ blogId ] });
     
    }

    res.redirect("/premium/home")
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

router.get('/removeCartProduct', async (req, res) => {
  try {
    const id = req.query.id;
    const userId = req.query.userId
  

    // Update the cart to remove the specified blog ID
    const updatedCart = await Cart.findOneAndUpdate(
      { UserId: userId },
      { $pull: { blogs: id } },
      { new: true } // This option returns the modified document after update
    );

    if (!updatedCart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.redirect('/user/myCart')
  } catch (error) {
    console.error('Error removing product from cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router