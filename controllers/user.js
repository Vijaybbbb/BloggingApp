const express = require('express')
const { checkForAuthenticationCookie } = require('../middleware/authentication');
const User = require('../models/user')
const Cart  = require('../models/cart');
const premiumBlogs = require('../models/premiumBlogs')
const mongoose = require('mongoose')

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





const myCart = async (req, res) => {
  try {
       const userId = req.user._id;
       const value = new  mongoose.Types.ObjectId(userId) 
    const carts = await Cart.aggregate([
       {
         $match: { UserId: value }
       },
       {
         $lookup: {
           from: 'premiumblogs',
           let: { blogList: '$blogs' },
           pipeline: [
             {
               $match: {
                 $expr: {
                   $in: ['$_id', '$$blogList']
                 }
               }
             }
           ],
           as: 'CartItems'
         }
       }
     ]);
    res.render('mycart',{
       carts:carts[0].CartItems,
       userId
    })

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};



const profile = async(req,res)=>{
       const id = req.user._id
       const user =  await User.findById(id)

       res.render('profile',{
          user:user    
       })
}

const payment = async (req,res)=>{ 
       res.render('payment')
}


module.exports = {
       signin,
       signup,
       logout,
       otpVerify,
       forgetpass,
       enterNewPass,
       enterForgetOtp,
       myCart,
       profile,
       payment
}