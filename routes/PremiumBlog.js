const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const premiumBlog = require('../models/premiumBlogs')
const Blog = require('../models/blog')
const { checkForAuthenticationCookie } = require('../middleware/authentication');





router.get("/home",checkForAuthenticationCookie("tocken"),async (req,res)=>{
  const allBlogs = await Blog.find({}).populate("createdBy")
  res.render('premium/premiumHome',{
         user:req.user,  
         blogs:allBlogs,
         
  })

}) 










module.exports = router