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
       console.log(req.user);
       const allBlogs = await Blog.find({}).populate("createdBy")
       const timeAgo = (createdAt) => {
              const now = new Date();
              const createdDate = new Date(createdAt);
              const timeDifference = now - createdDate;
              const hoursAgo = Math.floor(timeDifference / (1000 * 60 * 60));
          
              if (hoursAgo === 0) {
                return "Just now";
              } else if(hoursAgo<24) {
                return `${hoursAgo} ${hoursAgo === 1 ? 'hour' : 'hours'} ago`;
              }
              else{
                 const days = Math.floor(hoursAgo/24)
                 return `${days} ${days === 1 ? 'day' : 'days'} ago`   
              }
            };
          
       res.render('home',{
              user:req.user ,
              blogs:allBlogs,
              timeAgo
              
       })
       
}) 
app.get('/',async(req,res)=>{
       const allBlogs = await Blog.find({}).populate("createdBy")
       res.render('partials/landingPage',{
              blogs:allBlogs
       })
})
 

app.use('/user',userRouter) 
app.use('/blog',blogRouter)
app.use('/premium',premiumBlogRouter)
app.use("/admin",adminRouter)

app.listen(PORT,()=>{ 
       console.log('Server Started at http://localhost:8000');
})