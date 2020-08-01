var express=require("express");
var router=express.Router({mergeParams:true});
var Product=require("../models/product");
var Comment=require("../models/comment");
var middleware=require("../middleware");

router.get('/new',middleware.isLoggedIn,(req,res)=>{
	Product.findById(req.params.id,(err,product)=>{
		if(err){
			console.log(err);
		}
		else{
			res.render("comments/new",{product:product});
		}
	})
})

router.post('/',middleware.isLoggedIn,(req,res)=>{
	Product.findById(req.params.id,(err,product)=>{
		if(err){
			console.log(err);
			res.redirect("/products");
		}
		else{
			Comment.create(req.body.comment,(err,comment)=>{
				if(err){
					req.flash("error","Something went wrong");					
				}
				else{
					comment.author.id=req.user._id;
					comment.author.username=req.user.username;
					comment.save();
					product.comments.push(comment);
					product.save();
					req.flash("success","Successfully added comment");
					res.redirect('/products/'+product._id);
				}
			})

		}
	})
})

//comment edit
router.get('/:comment_id/edit',middleware.checkCommentOwnership,(req,res)=>{
	Comment.findById(req.params.comment_id,(err,foundComment)=>{
		if(err){
			res.redirect("back");
		}
		else{
			res.render('comments/edit',{product_id:req.params.id,comment:foundComment});
		}
	})
	
})

//comment update
router.put('/:comment_id/edit',middleware.checkCommentOwnership,(req,res)=>{
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,(err,updatedComment)=>{
		if(err){
			res.redirect("back");
		}
		else{
			res.redirect('/products/'+req.params.id);
		}
	})
})

//comment delete
router.delete('/:comment_id',middleware.checkCommentOwnership,(req,res)=>{
	Comment.findByIdAndRemove(req.params.comment_id,(err)=>{
		if(err){
			res.redirect("back");
		}
		else{
			res.redirect("/products/"+req.params.id);
		}
	})
})



module.exports=router;