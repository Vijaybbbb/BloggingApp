const express = require('express')
const router = express.Router()
const User = require('../models/user')
const userOtp = require('../models/otp')
const bcrypt = require('bcrypt')
const { createTokenForUser } = require('../services/authentication')
const { checkForAuthenticationCookie } = require('../middleware/authentication');
const bodyParser = require('body-parser')

const { GenerateOtp,
       sendOtpToEmail } = require('../services/userOtp')


const  {
       signin,
       signup,
       logout,
       otpVerify,
       forgetpass,
       enterNewPass,
       enterForgetOtp,
       myCart
}   = require('../controllers/user')

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


//get signin page
router.get('/signin',signin)

//get signup page
router.get('/signup',signup)

//get logout page
router.get("/logout",logout)

//get otp page
router.get('/otpVerify',otpVerify)

//get Otp Page for Forget Password
router.get('/enterForgetOtp',enterForgetOtp)

router.get('/forgetPassword',forgetpass)

router.get('/enterNewPass',enterNewPass)

router.get('/myCart',myCart)

router.post('/signup', async (req,res)=>{
      const { fullname , email , password } = req.body;
      try {
       const userFind = await User.findOne({email:email})
       if(userFind){
              res.status(401).render("signup" , {error: 'User  Exist'})
              
       }
       else{  
              req.session.fullname = fullname
              req.session.email = email
              req.session.password = password

              const otp = GenerateOtp().toString()
              //hash the otp
              const hashOtp = await bcrypt.hash(otp, 5);
              await sendOtpToEmail(email,otp)

              //delete existing otp
              await userOtp.deleteMany({email})
               

              //store otp and expiration time
              const expireAt = Date.now() + 60 * 1000; // expire within 30 seconds 
              await userOtp.create({
              email: email,
              otp: hashOtp,
              createdAt: Date.now(),
               expireAt,
              });
              res.redirect(`/user/otpVerify?email=${ req.session.email}`)
             
       }
       }
       catch(error){
               console.error("Error during login:", error);
              res.status(500).send("Internal server error");
       }

})

router.post('/signin',async (req,res)=>{
       const {   email , password } = req.body;
       try {
              const userFind = await User.findOne({email:email})
              if(!userFind){
                     res.status(401).render("signin", {error: 'User Not Exist'})
                     
              }
              else{
                     const isPasswordMatch = await bcrypt.compare(password,userFind.password)
                     if(isPasswordMatch){
                           
                            const tocken  = createTokenForUser(userFind)
                            req.user = req.body.fullname;
                            res.cookie('tocken',tocken).redirect('/home')
                     }
                     else{
                            res.status(401).render("signin", {error: 'Invalid creadentials'})    
                     }
              }
       }
       catch(error){
              console.error("Error during login:", error);
              res.status(500).send("Internal server error");
       }

})


     

router.post('/confirmOtp',async(req,res)=>{
      try{
       const email = req.session.email
       const {first,second,third,fourth,fifth,sixth} = req.body
       const otp = first+second+third+fourth+fifth+sixth
      
       const userOtpRecord = await userOtp.find({email})
       if(userOtpRecord.length == 0 ){
              req.session.errorMessage = 'OTP not found or has expired.';
              return res.redirect('/user/otpVerify');
       }


       const now=new Date();
       //checks otp expired
      if(now > userOtpRecord[0].expireAt){
               req.session.errorMessage = 'OTP has expired.';
               return res.redirect('/user/otpVerify');
       }


       const isOtpValid=await bcrypt.compare(otp,userOtpRecord[0].otp);
       if(isOtpValid){
              const data = {
                     fullname:req.session.fullname,
                     email:req.session.email,
                     password:req.session.password
              }
              const hashedPassword = await bcrypt.hash(data.password , 10)
              data.password = hashedPassword ; 
              const user = await User.insertMany(data)
              const tocken  = createTokenForUser(user[0])
              req.user = req.body.fullname; 
              res.cookie('tocken',tocken).redirect('/home')
       }
       else{
              req.session.errorMessage = 'OTP does not Match ';
              return res.redirect('/user/otpVerify'); 
       }
      }
      catch(err){
              console.log(err);
      }
})


router.post('/resendOtp',async (req,res)=>{
       try{
              const email = req.session.email;
              const otp = GenerateOtp().toString()
              //hash the otp
              const hashOtp = await bcrypt.hash(otp, 5);
              await sendOtpToEmail(email,otp)

              //delete existing otp
              await userOtp.deleteMany({email})
               

              //store otp and expiration time
              const expireAt = Date.now() + 60 * 1000; // expire within 30 seconds
              await userOtp.create({
              email: email,
              otp: hashOtp,
              createdAt: Date.now(),
               expireAt,
              });
       }
       catch(err){
              console.log(err);
       }
})

router.post('/forgetPassword',async (req,res)=>{
       try{
              const { email } = req.body
              req.email = email
              const otp = GenerateOtp().toString()
              //hash the otp
              const hashOtp = await bcrypt.hash(otp, 5);
              await sendOtpToEmail(email,otp)

              //delete existing otp
              await userOtp.deleteMany({email})
               

              //store otp and expiration time
              const expireAt = Date.now() + 60 * 1000; // expire within 30 seconds
              await userOtp.create({
              email: email,
              otp: hashOtp,
              createdAt: Date.now(),
               expireAt,
              });
              return res.redirect(`/user/enterForgetOtp?email=${email}`)
       }
       catch(err){
              console.log(err);
       }
})

router.post('/confirmForgetOtp',async(req,res)=>{
       try{
              
       const  email = req.query.email 
        const {first,second,third,fourth,fifth,sixth} = req.body
        const otp = first+second+third+fourth+fifth+sixth
        console.log(email);
        const userOtpRecord = await userOtp.find({email})
        if(userOtpRecord.length == 0 ){
               req.session.errorMessage = 'OTP not found or has expired.';
               return res.redirect('/user/otpVerify');
        } 
 
 
        const now=new Date();
        //checks otp expired
       if(now > userOtpRecord[0].expireAt){
                req.session.errorMessage = 'OTP has expired.';
                return res.redirect('/user/otpVerify');
        }
        const isOtpValid=await bcrypt.compare(otp,userOtpRecord[0].otp);
        if(isOtpValid){
              return res.redirect(`/user/enterNewPass?email=${email}`)
        }
        else{
               req.session.errorMessage = 'OTP does not Match ';
               return res.redirect('/user/enterForgetOtp');  
        }
       }
       catch(err){
               console.log(err);
       }
 })
 router.post('/resendForgetOtp',async (req,res)=>{ 
       try{
              const {email} = req.body
              const otp = GenerateOtp().toString()
              //hash the otp
              const hashOtp = await bcrypt.hash(otp, 5);
              await sendOtpToEmail(email,otp)

              //delete existing otp
              await userOtp.deleteMany({email})
               

              //store otp and expiration time
              const expireAt = Date.now() + 60 * 1000; // expire within 30 seconds
              await userOtp.create({
              email:email,
              otp: hashOtp,
              createdAt: Date.now(),
               expireAt,
              });
              return res.redirect('/users/enterForgetOtp')
             
       }
       catch(err){
              console.log(err);
       }
})


router.post('/setNewPasswordLogout',async(req,res)=>{
       const password = req.body.password
       const hashedPassword = await bcrypt.hash(password, 10);

       const email = req.query.email
       const user = await User.find({email})
       if(!user){
              console.log("User Not Found");

       }
       else{
              console.log("User Found");
             
              const user = await User.findOneAndUpdate(
                     { email },
                     { password: hashedPassword },
                     { new: true } // This option returns the modified document
                   );
              return res.redirect('/user/signin')
       }

})






module.exports = router