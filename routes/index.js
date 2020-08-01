var express=require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../models/User");
var Product=require("../models/product");
//home
router.get("/",(req,res)=>{
	res.render("Home");
});
//render register
router.get('/register',(req,res)=>{
	res.render("register"); 
});
//post register
router.post('/register',(req,res)=>{
	var newUser=new User({username:req.body.username,name:req.body.name,number:req.body.number,address:req.body.address});
	User.register(newUser,req.body.password,(err,user)=>{
		if(err){
			req.flash("error","Username already in use");
			res.redirect("/register");
		}
		passport.authenticate("local")(req,res,()=>{
			req.flash("success","Welcome to Sell'N'Buy "+ user.username);
			res.redirect("/products");
		});
	});
});
//edit user
router.get('/edit',(req,res)=>{
		res.render('edit');
})
//update user
router.put('/edit',(req,res)=>{
	User.findByIdAndUpdate(req.user._id,req.body.user,{new:true},(err,updateduser)=>{
		if(err){
			res.redirect('/');
		}
		else{
			Product.find({},(err,products)=>{
				if(err){
					console.log(err);
					res.redirect('/');
				}else{
					products.forEach(product=>{
						if(product.seller.id.equals(req.user._id)){
							product.seller.name=updateduser.name;
							product.seller.number=updateduser.number;
							product.seller.address=updateduser.address;
							product.save();
						}
					})
					res.redirect('/');
				}
			})
		}
	})

})
//render login
router.get('/login',(req,res)=>{
	res.render('login',{message: req.flash("error")});
});
//post login
router.post('/login',passport.authenticate("local",
{
	successRedirect:"/products",
	failureRedirect:"/login",
	badRequestMessage : 'Missing username or password.',
    failureFlash: true
}),(req,res)=>{
});
//logout
router.get('/logout',(req,res)=>{
	req.logout();
	req.flash("success","Logged you out!");
	res.redirect("/");
});
//functions


module.exports=router;