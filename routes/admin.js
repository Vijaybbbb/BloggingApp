const express = require('express')
const router = express.Router()
const path = require('path')
const bcrypt = require('bcrypt')
const multer = require('multer')
const User = require('../models/user')
const PremiumBlog  = require('../models/premiumBlogs')
const Comment = require('../models/comment')
const Blog = require('../models/blog')
const bodyParser = require('body-parser')
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
const { checkForAuthenticationCookie } = require('../middleware/authentication');
const { createTokenForUser } = require('../services/authentication')
const {signin,
       addBlog,
       Dashboard,
       viewUser,
       userBlogs,
       viewBlog,
       deleteComment,
       editBlog,
       createPremiumBlog,
       viewPremiumBlog

} = require('../controllers/admin') 


//get View User Page
router.get('/viewUser',viewUser)

//get UserBlogs
router.get('/userBlogs',userBlogs) 

//get Single blog
router.get('/viewBlog',viewBlog)

//delete Comments
router.get('/deleteComment',deleteComment)  


//get admin signin Page  
router.get('/signin',signin)   

//get admin addBlog page 
router.get("/adminAddBlog",addBlog)

//get admin Dashboardblogf
router.get('/home',Dashboard) 

//get edit blog page
router.get('/editBlog',editBlog) 

router.get('/createPremiumBlog',createPremiumBlog)

router.get('/viewPremiumBlog',viewPremiumBlog)


// const uploadDir = path.resolve('./public/uploads/');

// const storage = multer.diskStorage({
//        destination:function(req,file,cb){ 
//               cb(null,uploadDir)
//        }, 
//        filename:function (req,file,cb){
//               const filename = `${Date.now()}-${file.originalname}`
//               cb(null,filename)
//        }
// })
 
// const upload = multer({storage:storage})

// router.post('/',upload.single('coverImage'),async  (req,res)=>{
//        const {title , body } = req.body
//        const blog = {
//               body,
//               title,
//               createdBy:req.user._id,
//               coverImageURL:`/uploads/${req.file.filename}`
//        }
//       const card = await PremiumBlog.create(blog)
//       return res.redirect(`/premium/${card._id}`)
       

// })


router.get('/:id',async (req,res)=>{
       
       const blog = await PremiumBlog.findById(req.params.id).populate("createdBy")
       const comments  = await Comment.find({blogId : req.params.id}).populate("createdBy")
       return res.render("admin/premiumBlogs",{
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




router.post('/signin',async(req,res)=>{ 
       const {  email , password } = req.body;
       try {
              const adminFind = await User.findOne({email:email})
              if(!adminFind){
                   return  res.status(401).render("signin", {error: ' Not Exist'})
                     
              }
              else{
                     if(adminFind.role === 'ADMIN'){
                            const isPasswordMatch = await bcrypt.compare(password,adminFind.password)
                            if(isPasswordMatch){
                           
                            const tocken  = createTokenForUser(adminFind)
                            req.session.admin = req.body.fullname;
                            res.cookie('tocken',tocken).redirect('/home') 
                             }
                             else{ 
                                   return  res.status(401).render("admin/adminSignin", {error: 'Invalid creadentials'})    
                            }    
                     }
                     else{
                            return  res.status(401).render("admin/adminSignin", {error: 'Invalid creadentials'}) 
                     }
                     
              }
       }
       catch(error){
              console.error("Error during login:", error);
              res.status(500).send("Internal server error");  
       }
})

// admin comments creations

// router.post('/comment/:blogID',async (req,res)=>{
       
//        const  comment = await Comment.create({
//               content:req.body.content,
//               blogId:req.params.blogID,
//               createdBy:"ADMIN"
              
//        })
//        return res.redirect(`/blog/${req.params.blogID}`)
// })


//delete comments by Admin


//edit Blog

router.post('/editBlog',async(req,res)=>{
     
       const data = {
               id:req.body.id,
               title:req.body.title,
               body:req.body.content
       }
       const userdata = await Blog.findByIdAndUpdate(
              {_id:data.id},{$set:{
                     title:data.title,
                     body:data.body,
                     
                     }})
       res.redirect(`/admin/viewBlog?id=${data.id}`)
})


////-------------------------------

const premiumUploadDir = path.resolve('./public/uploads/premium');

const premiumStorage = multer.diskStorage({
       destination:function(req,file,cb){
              cb(null,premiumUploadDir)
       }, 
       filename:function (req,file,cb){
              const filename = `${Date.now()}-${file.originalname}`
              cb(null,filename)
       }
})

const premiumUpload = multer({storage:premiumStorage})

router.post('/createPremiumBlog',premiumUpload.single('coverImage'),async (req,res)=>{
       const {title , body } = req.body
       const blog = {
              body,
              title,
              coverImageURL:`/uploads/premium/${req.file.filename}`
       }
      const card = await PremiumBlog.create(blog)
      
      return res.redirect(`/admin/viewPremiumBlog`) 
       

})


 
module.exports = router 