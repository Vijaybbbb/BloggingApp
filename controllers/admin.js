const express = require('express')
const { checkForAuthenticationCookie } = require('../middleware/authentication');


const signin = (req,res) =>{
       res.render('admin/adminSignin')
}


const addBlog = (req,res) =>{
       res.render('admin/addBlog')
}







module.exports = {
       signin,
       addBlog
}