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
const allowedOrigins = ['https://rohit-ecommerceproject.netlify.app'];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow cookies to be sent with requests
};

// Apply CORS middleware to all routes
app.use(cors(corsOptions));
app.use(express.json());

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


