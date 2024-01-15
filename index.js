const express = require('express');
const path = require('path');
const app = express()
const PORT = 8000;
const Blog = require("./models/blog")
const PremiumBlog  = require('./models/premiumBlogs')
const session = require('express-session')
const userRouter = require('./routes/user')
const blogRouter = require('./routes/blog')
const premiumBlogRouter = require('./routes/PremiumBlog')
const adminRouter = require('./routes/admin')
const mongoose = require("mongoose")
const connect=mongoose.connect("mongodb://localhost:27017/blogify")
const cookieParser = require('cookie-parser');
const { checkForAuthenticationCookie } = require('./middleware/authentication');
const bodyParser = require('body-parser')

app.use(express.static(path.join(__dirname, 'static')));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'./public')))

connect.then(()=>{
       console.log("Database connected Successfuly");  
})
.catch(()=>{
       console.log("Failed to connect"); 
})


app.use(session({
       secret: 'your-secret-key',
       resave: false,
       saveUninitialized: true,
     }));
     

app.set('view engine','ejs')
app.set("views",path.join(__dirname,"./views"))
app.use(express.urlencoded({extended:false}))
app.use(cookieParser('your-secret-key'));


app.get("/home",checkForAuthenticationCookie("tocken"),async (req,res)=>{
       const allBlogs = await Blog.find({}).populate("createdBy")
       res.render('home',{
              user:req.user,  
              blogs:allBlogs,
              
       })
       
}) 
app.get('/',(req,res)=>{
       res.render('partials/landingPage')
})
 

app.use('/user',userRouter) 
app.use('/blog',blogRouter)
app.use('/premium',premiumBlogRouter)
app.use("/admin",adminRouter)

app.listen(PORT,()=>{
       console.log('Server Started at http://localhost:8000/user/signup');
})