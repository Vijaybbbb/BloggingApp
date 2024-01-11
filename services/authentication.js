const JWT = require('jsonwebtoken');
 const secret  = 'superman@123'
 function createTokenForUser(user){
       const payload  = {
              _id : user._id,
              email : user.email,
              profileImageURL: user.profileImageURL,
              role : user.role,
              fname:user.fullname
       }
       const tocken = JWT.sign(payload,secret)
       return tocken;
 }

 function validateTocken(tocken){  
       const payload = JWT.verify(tocken,secret);
       return payload;
 }

 module.exports = {
       createTokenForUser,
       validateTocken,
       
 }