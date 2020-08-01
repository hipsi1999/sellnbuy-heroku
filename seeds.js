var mongoose=require('mongoose');
var Product=require("./models/product");
var Comment=require("./models/comment");
var data=[
    {
        name:"clos",
        image:"https://www.nps.gov/grte/planyourvisit/images/JLCG_tents_Teewinot_2008_mattson_1.JPG?maxwidth=1200&maxheight=1200&autorotate=false",
        price:"Rs. 200",
        description:"blah blah blah"
    }
]
function seedBy(){
    Product.remove({},(err)=>{
        if(err){
            console.log(err);
        }
        console.log("removed blogs");
        data.forEach((seed)=>{
            Product.create(seed,(err,product)=>{
                if(err){
                    console.log(err);
                }
                else{
                    console.log("added a data");
                    //comment
                    Comment.create(
                        {
                            text:"no net",
                            author:"homer"
                        },(err,comment)=>{
                            if(err){

                            }
                            else{
                            product.comments.push(comment);
                            product.save();
                            console.log("created new comment");
                            }
                        }
                    )
                }
            }) 
        })
    });
    
} 

module.exports=seedBy;