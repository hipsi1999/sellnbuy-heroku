var express=require("express");
var router=express.Router();
var Product=require("../models/product");
var middleware=require("../middleware");
var fs=require('fs');
var multer=require('multer');
var path=require('path');

//-----------------------------
//---------image---------------
//-----------------------------

var storage=multer.diskStorage({
    fileFilter: function(req,file,cb){
        if(!file.mimetype.match(/jpg|jpeg|png|gif$i/)){
            cb(new Error('File is not supported'),false)
            return
        }
        cb(null,true);
    }
})
var upload=multer({storage:storage});

const cloudinary=require('cloudinary');
cloudinary.config({
    cloud_name:'hipsicloud',
    api_key:'132221192517858',
    api_secret:'sTC558B7RVN40sFYbVN_26GMWLA'
})

//-----------------------------
//-----------------------------
//-----------------------------


router.get("/",(req,res)=>{
	Product.find({},(err,allproducts)=>{
		if(err)console.log(err);
		else{
			res.render("products/products",{products:allproducts,currentUser:req.user});
		}
	});
});
router.get("/your",(req,res)=>{
	var user=req.user._id;
	Product.find({'seller.id':user},(err,products)=>{
		if(err){
			console.log(err);
			res.render('/');
		}else{
			res.render("products/products",{products:products,currentUser:req.user});
		}
	})
})
router.post("/",middleware.isLoggedIn,upload.single('image'),async (req,res)=>{
	var name=req.body.name;
	const image=await cloudinary.v2.uploader.upload(req.file.path);
	var img=image['secure_url'];
	var desc=req.body.description;
	var price=req.body.price;
	var seller={
		id:req.user._id,
		username:req.user.username,
		number:req.user.number,
		name:req.user.name,
		address:req.user.address
	};
	var newProduct={name:name,image:img,description:desc,price:price,seller:seller};
	Product.create(newProduct,(err,newlyCreated)=>{
		if(err)console.log(err);
		else{
			res.redirect("/products");
		}
	});
});
router.post("/search",(req,res)=>{
	var search=req.body.product;
	Product.find({name:{"$regex":search,"$options":"i"}},(err,products)=>{
		if(err)console.log(err);
		else{
			res.render("products/search",{products:products});
		}
	})
});
router.get("/new",middleware.isLoggedIn,(req,res)=>{
	res.render("products/new");
});

router.get("/:id",(req,res)=>{
	Product.findById(req.params.id).populate("comments").exec((err,foundProduct)=>{
		if(err)console.log(err);
		else{
			res.render("products/show",{product:foundProduct});
		}
	});
});

// edit blog
router.get('/:id/edit',middleware.checkProductOwnership,(req,res)=>{
    Product.findById(req.params.id,(err,foundProduct)=>{
        res.render('products/edit',{product:foundProduct});
})
})

// update blog
router.put('/:id',middleware.checkProductOwnership,(req,res)=>{
Product.findByIdAndUpdate(req.params.id,req.body.product,(err,updatedProduct)=>{
    if(err){
        
        res.redirect('/products');
    }
    else{
        res.redirect('/products/'+req.params.id);
    }
})
})

// destroy 
router.delete('/:id',middleware.checkProductOwnership,(req,res)=>{
Product.findByIdAndRemove(req.params.id,(err)=>{
    if(err){
		req.flash("error",err.message);
        return res.redirect('/products');
    }
    else{
        res.redirect('/products');
    }
})
})

module.exports=router;