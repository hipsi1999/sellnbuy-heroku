var express=require('express');
var app=new express();
var path=require('path');
var bodyParser=require("body-parser");
var mongoose=require('mongoose');
var methodOverride=require("method-override");
var seedDB=require("./seeds");
var flash=require("connect-flash");
var passport=require("passport");
var LocalStrategy=require("passport-local");
var Product=require("./models/product");
var Comment=require("./models/comment");
var User=require("./models/User");

var productRoutes=require("./routes/products"),
	commentRoutes=require("./routes/comments"),
	indexRoutes=require("./routes/index");

//connect to mongodb
// var url='mongodb://localhost/snb';
var url='mongodb+srv://hipsi:hipsirakshinikki@socialsoundsbyhipsi-wdow5.mongodb.net/snb?retryWrites=true&w=majority';
mongoose.connect(url,{ useUnifiedTopology: true, useNewUrlParser: true });
var db=mongoose.connection;
db.on('error',console.error.bind(console,'MongoDb connection error'));


app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'/')));
app.use('/uploads',express.static('uploads'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
// seedDB();

app.use(require("cookie-session")({
	secret:"hipsi",
	resave:false,
	saveUninitialized:false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 


app.use((req,res,next)=>{
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next(); 
})

app.use("/products",productRoutes);
app.use("/products/:id/comments",commentRoutes);
app.use(indexRoutes);




app.listen(process.env.PORT||3000,()=>{
	console.log("The SNB server created");
});