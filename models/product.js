var mongoose=require('mongoose');

var productSchema=new mongoose.Schema({
	name:String,
	image:String,
    description:String,
    price:String,
    seller:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        name:String,
        username:String,
        number:String,
        address:String
    },
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    }]    
});

module.exports=mongoose.model("Product",productSchema);
