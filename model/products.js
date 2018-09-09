var mongoose=require('mongoose');

var products=mongoose.model('products',{
  name:
  {
    type:String,
    required:true,
    minlength:1,
    trim:true//should not contain only white spaces
  },
  product:
  {
    type:String,
    required:true,
    minlength:1,
    trim:true//should not contain only white spaces
  },
  quantity:
  {
    type:Number,
    default:null
  }
});
module.exports=
{
   products:products
};
