const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const Blog = require('../models/blog')
const User  = require('../models/user')
const Comment = require('../models/comment')
const { checkForAuthenticationCookie } = require('../middleware/authentication');
const { render } = require('ejs')
const fs =require('fs')

function check(req,res,next){
       if(checkForAuthenticationCookie("tocken")){
              next()               
       }else{
              res.render('signin')
       }
}
router.get('/myBlogs', checkForAuthenticationCookie("tocken") , async (req, res) => {
       try {
         // Find blogs created by the authenticated user
         const blogs = await Blog.find({ createdBy: req.user._id });
     
         // Render the 'myBlogs' page with the user's blogs
         return res.render('myBlogs', {
           user: req.user,
           blogs,
         });
       } catch (error) {
         console.error(error);
         // Handle the error appropriately, e.g., render an error page
         res.status(500).send('Internal Server Error');
       }
});


const uploadDir = path.resolve('./public/uploads/');

const storage = multer.diskStorage({
       destination:function(req,file,cb){
              cb(null,uploadDir)
       }, 
       filename:function (req,file,cb){
              const filename = `${Date.now()}-${file.originalname}`
              cb(null,filename)
       }
})

const upload = multer({storage:storage})

router.get('/addnew',checkForAuthenticationCookie("tocken"),(req,res)=>{
       return res.render('addBlog',{
              user:req.user
       })
})
router.post('/',checkForAuthenticationCookie("tocken"),upload.single('coverImage'),async (req,res)=>{
       const {title ,subTitle, selectBox , body } = req.body
       const blog = {
              body,
              title,
              type:selectBox
              subTitle,
              createdBy:req.user._id,
              coverImageURL:`/uploads/${req.file.filename}`
       }
      const card = await Blog.create(blog)
      return res.redirect(`/blog/${card._id}`) 
       

})

router.get('/:id',checkForAuthenticationCookie("tocken"),async (req,res)=>{
       
       const blog = await Blog.findById(req.params.id).populate("createdBy")
       const comments  = await Comment.find({blogId : req.params.id}).populate("createdBy")
       console.log(comments);
       return res.render("blog",{
              user:req.user,
              title:blog.title,
              image:blog.coverImageURL,
              body:blog.body,
              userimage: blog.createdBy.profileImageURL,
              username: blog.createdBy.fullname,
              blog:blog,
              comments
       })

})


router.post('/comment/:blogID',checkForAuthenticationCookie("tocken"),async (req,res)=>{
       
       const  comment = await Comment.create({
              content:req.body.content,
              blogId:req.params.blogID,
              createdBy:req.user._id 
              
       })

       return res.redirect(`/blog/${req.params.blogID}`)
})




module.exports  = router