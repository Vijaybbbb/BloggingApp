const express = require('express')
const { checkForAuthenticationCookie } = require('../middleware/authentication');
const User = require('../models/user')
const Comment = require('../models/comment')
const Blog = require('../models/blog')
const PremiumBlog = require('../models/premiumBlogs')

const signin = (req,res) =>{
       res.render('admin/adminSignin')
}


const addBlog = (req,res) =>{
       res.render('admin/addBlog')
}


const Dashboard = async(req,res)=>{
       const users = await User.find({})
       res.render('admin/adminHome',{users,search:''})  
}


const viewUser = async (req,res)=>{
       const id = req.query.id
       req.session.userID = id
       
       const user = await User.findById({_id:id})
       const blogs = await Blog.find({createdBy:id});
       res.render("admin/viewUser",{
              user:user,  
              blogs:blogs,
              search:''
       })     
}


const userBlogs = async(req,res)=>{
       try {
              req.session.admin='admin' 
              if (req.session.admin) {
                   var search="";
                   if(req.query.search){ 
                          search=req.query.search
                          
                   }
                   
                   const blogs = await Blog.find(
                     {
                         createdBy: req.session.userID,
                         $or: [
                             { title: { $regex: '.*' + search + '.*' } },
                         ]
                     }
                 ).populate('createdBy');
              
                     if(blogs){
                            res.render("admin/viewUser", { blogs: blogs , search:search ,user:blogs[0].createdBy});
                     }
                     else{
                            console.log("no blogs ");
                     } 
                  

              } else {
                res.redirect("/admin/home"); 
              }
            } catch (error) {
              console.error("Error retrieving user data:", error);    
              res.status(500).send("Internal server error");  
            }
}

const viewBlog = async(req,res) =>{
       const id = req.query.id
       const blog = await Blog.findById(id)
       const comments  = await Comment.find({blogId : id}).populate("createdBy")
       res.render('admin/ViewBlog',{
              blog:blog,
              comments:comments  
       })
}

const deleteComment = async(req,res) =>{
       const id  = req.query.id
       const comment = await Comment.find({_id:id}) 
       await Comment.deleteOne({_id:id})
       res.redirect(`/admin/viewBlog?id=${comment[0].blogId}`)
}

const editBlog = async(req,res)=>{
       const id = req.query.id
       const blog = await Blog.findById(id)
       console.log(blog);
       res.render('admin/editBlog',{
            blog:blog
       }) 
}

const createPremiumBlog = async(req,res)=>{
       res.render('admin/createPremiumBlog')
}

const viewPremiumBlog = async(req,res) =>{
       const id = req.query.id
       const blog = await PremiumBlog.findById(id)
       res.render('admin/ViewBlog',{
              blog:blog,
              
       })
}

module.exports = {
       signin,
       addBlog,
       Dashboard,
       viewUser,
       userBlogs,
       viewBlog,
       deleteComment,
       editBlog,
       createPremiumBlog,
       viewPremiumBlog
}