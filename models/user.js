
const {Schema , model } = require('mongoose')

const userSchema =  new Schema({
       fullname: {
              type : String,
              required:true
       },
       email: {
              type : String,
              required:true,
              unique:true
       },
       salt:{
              type : String,
              
       },
       password: {
              type : String,
              required:true
       },
       profileImageURL:{
              type:String,
              default:'uploads/download.png'
       },
       role:{
              type:String,
              enum:["USER","ADMIN"],
              default:"USER"
       }

},{timestamps:true});




const User  = model('user',userSchema)

module.exports = User