const {Schema , model} = require('mongoose')

const blogSchema = new Schema({
       title : {
              type : String,
              required : true
       },
       subTitle : {
              type : String,
              required : true 
       },
       type:{
              type : String,
              required : true,
              default:"Others"
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
              type : Schema.Types.ObjectId,
              ref:"user",
              
       }
},{timestamps:true}
);





const Blog = model('blog',blogSchema)

module.exports = Blog





