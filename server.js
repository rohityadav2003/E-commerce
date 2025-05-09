const express=require("express");
const app=express();
const session=require("express-session");
const mongoose=require("mongoose");
const path=require("path");
const cors=require("cors");
const  bodyParser=require("body-parser");
const router=require('./router/admin');
const router1=require('./router/user');

//middleware//
app.use(express.static('public'));

app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors({
    origin: process.env.REACT_APP_BASE_URL,
    credentials: true
  }));
app.set("trust proxy", 1);
app.use(
  session({
    secret: "my secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    },
  })
);

// Apply CORS middleware to all routes

mongoose.connect("mongodb+srv://mongodbdatabase:rohit2003@cluster0.ppf45.mongodb.net")
.then(()=>console.log("mongodb connected"))
.catch(()=>console.log("error occured"));
app.get('/',function(req,res){
    res.render('index');

})
// app.use((req,res,next)=>{
//     const userEmail=req.session.userEmail;
//     console.log({userEmail,session:req.session});
//     next();
// });
app.use('/admin',router);
app.use('/user',router1);
app.listen(1900,()=>{
    console.log("server running");
})


