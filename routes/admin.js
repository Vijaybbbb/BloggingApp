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
const {signin,addBlog,Dashboard} = require('../controllers/admin')
const session = require('express-session')


router.get('/viewUser',async(req,res)=>{ 
       const id = req.query.id
       const user = await User.findById({_id:id})
       const blogs = await Blog.find({createdBy:id});
       res.render("admin/viewUser",{
              user:user,  
              blogs:blogs,
              search:''
       })  
})

router.get('/userBlogs',async(req,res)=>{
       try {
              req.session.admin='admin'
              if (req.session.admin) {
                   var search="";
                   if(req.query.search){ 
                          search=req.query.search
                          
                   }
                   
                   const blogs = await Blog.find({ 
                          
                          $or:[
                                 {title:{$regex: '.*'+ search +'.*'}},
                                        
                          ] 
                   
                  });
                 
                   res.render("admin/viewUser", { blogs: blogs , search:search});
                  

              } else {
                res.redirect("/admin/home");
              }
            } catch (error) {
              console.error("Error retrieving user data:", error);  
              res.status(500).send("Internal server error"); 
            }

})

//get admin signin Page 
router.get('/signin',signin)  

//get admin addBlog page 
router.get("/adminAddBlog",addBlog)

//get admin Dashboardblogf
router.get('/home',Dashboard) 







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

router.post('/',upload.single('coverImage'),async  (req,res)=>{
       const {title , body } = req.body
       const blog = {
              body,
              title,
              createdBy:req.user._id,
              coverImageURL:`/uploads/${req.file.filename}`
       }
      const card = await PremiumBlog.create(blog)
      return res.redirect(`/premium/${card._id}`)
       

})


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







 
module.exports = router 