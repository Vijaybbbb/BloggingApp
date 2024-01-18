const express = require('express')
const { checkForAuthenticationCookie } = require('../middleware/authentication');

const signin = (req,res)=>{
       if(checkForAuthenticationCookie("tocken")){
              res.redirect('/home')   
       }else{
              res.render('signin')
       }
}

const signup = (req,res)=>{
       res.render('signup')
}

const logout = (req,res)=>{
       res.clearCookie('tocken').redirect('/home')
}

const otpVerify = (req,res)=>{
       const email = req.query.email;
       req.session.email = email; // Store the email in the session 
       let errorMessage = req.session.errorMessage
       res.render('otp', { message: '', errorMessage:errorMessage, email: email });
       
}

const forgetpass = (req,res)=>{
       res.render('forgetPasswordOtp')
}

const enterNewPass = (req,res)=>{
       const email = req.query.email
       res.render('forgetPassword',{email:email})
}

const enterForgetOtp = (req,res)=>{
       const email = req.query.email;
       req.session.email = email; // Store the email in the session 
       let errorMessage = req.session.errorMessage
       res.render('enterForgetOtp',{ message: '', errorMessage:errorMessage, email: email })
}

const myCart = (req,res)=>{
       res.render('myCart')
}


module.exports = {
       signin,
       signup,
       logout,
       otpVerify,
       forgetpass,
       enterNewPass,
       enterForgetOtp,
       myCart
}