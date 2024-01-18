const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const premiumBlog = require('../models/premiumBlogs')
const Blog = require('../models/blog')
const Cart = require('../models/cart')
const { checkForAuthenticationCookie } = require('../middleware/authentication');





router.get("/home",checkForAuthenticationCookie("tocken"),async (req,res)=>{
  const blog = await premiumBlog.find({})
  res.render('premiumBlogs',{
         blogs:blog,
         
  })

}) 


router.post('/addToCart', checkForAuthenticationCookie("tocken"), async (req, res) => {
  try {
    const userId = req.user._id;
    const blogId = req.body.blogId;

    const cart = await Cart.findOne({ UserId: userId });
    if (cart) {
      // If the user already has a cart, update it
      cart.blogs.push({ blogid: blogId });
      await cart.save();
    } else {
      // If the user doesn't have a cart, create a new one
      await Cart.create({ UserId: userId, blogs: [{ blogid: blogId }] });
    }

   
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});






module.exports = router