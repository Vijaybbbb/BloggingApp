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
      //  const payload = JWT.verify(tocken,secret,(error,user)=>{
      //       console.log(user);
      //  });
      //  return payload;

      try {
            const payload = JWT.verify(tocken, secret);
            return payload;
        } catch (error) {
            console.error("Token verification error:", error); 
            throw new Error("Invalid token");
        }

 }

 module.exports = {
       createTokenForUser,
       validateTocken,
       
 }