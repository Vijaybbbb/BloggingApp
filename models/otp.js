const {Schema , model} = require('mongoose')
const otpSchema  =new Schema({
       email:String,
       otp:String,
       createdAt:Date,
       expireAt:Date
})



const otp = model('userotp',otpSchema)

module.exports = otp
