const express = require('express')
const { checkForAuthenticationCookie } = require('../middleware/authentication');
const User = require('../models/user')

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




module.exports = {
       signin,
       addBlog,
       Dashboard
}