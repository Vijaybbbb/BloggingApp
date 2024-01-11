const { AutoEncryptionLoggerLevel } = require("mongodb");
const { createTokenForUser,validateTocken } = require('../services/authentication')

function checkForAuthenticationCookie(cookieName) {
   
    return (req, res, next) => {
       
        const tokenCookieValue = req.cookies[cookieName];
        if (!tokenCookieValue) {
            // No token found, move to the next middleware or route handler
             res.render('signin')
            
        }
        else{
            try {
                
                const userPayload = validateTocken(tokenCookieValue);
                req.user = userPayload;
                // Move to the next middleware or route handler
                next();
            } catch (error) {
                // Handle the error appropriately, e.g., send an error response or redirect to login
                console.error("Token validation error:", error);
                // Optionally, you might want to clear the invalid cookie here
                // res.clearCookie(cookieName);
                next(error); // Pass the error to the next middleware for global error handling
            }
        }

        
    };
}

module.exports = {
    checkForAuthenticationCookie,
};
