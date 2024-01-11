const express = require('express')
const nodeMailer  = require('nodemailer')



//nodemailer Setup
const transport = nodeMailer.createTransport({
       service: "gmail",
       auth: {
         user: 'blogify6@gmail.com', 
         pass: "qxpu eghk aemc tzmo",
       },
       secure: true, // Use TLS
       tls: {
         rejectUnauthorized: false, // Disable TLS certificate verification
       },
     });



//Generate Random OTP
function GenerateOtp() {
  console.log("OTP generated");
  return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
}

//Send OTP to Email

function sendOtpToEmail(toEmail, otp) {
  return new Promise((resolve, reject) => {
    if (otp) {
      const email = toEmail;
      const mailOptions = {
        from: 'blogify6@gmail.com',
        to: email,
        subject: "OTP VERIFICATION",
        text: `verify your email to signup ... YOUR OTP IS : ${otp}`
      };

      transport.sendMail(mailOptions, (err) => {
        if (err) {
          console.error(err);
          reject(new Error("Failed to send OTP"));
        } else {
          console.log("OTP Sent successfully");
          resolve("OTP Sent successfully");
        }
      });
    } else {
      reject(new Error("OTP generation failed"));
    }
  });
}


  module.exports = {
       GenerateOtp,
       sendOtpToEmail
  }

