const {Schema , model} = require('mongoose')

const blogSchema = new Schema({
       title : {
              type : String,
              required : true
       },
       body :{
              type : String,
              required : true
       },
       coverImageURL :{
              type : String,
              required : false
       },
       createdBy :{
              type : String,
              default:"ADMIN",
              
       },
       has_access:{
              type:Boolean,
              default:false
       }
},{timestamps:true}
);





const PremiumBlog = model('PremiumBlog',blogSchema)

module.exports = PremiumBlog





