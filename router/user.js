require('dotenv').config();

const express=require("express");
const  app=express();
// const  session=require("express-session");
const path=require("path");
// const bodyparser=require("body-parser");
const Users=require('../models/users');
const add=require('../models/address');
const cart = require("../models/cart");
const orders = require("../models/orderdetail");

const bcrypt=require("bcrypt");
const router=express.Router();
const{validationResult}=require('express-validator');
const  Razorpay=require('razorpay');
const crypto=require('crypto');
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});
//middleware//
// app.use(session({
//     secret:'my secret key',
//     resave:false,
//     saveUninitialized:true,
//     cookie:{secure:false}

// }))
// app.use(express.static("public"));
// router.use(bodyparser.urlencoded({extended:true}));
const mailer=require('../validation/mailer');
//PAYMENT RAZORPAY//

const{registervalidator}=require('../validation/validation')
router.post('/signup',registervalidator,async(req,res)=>{
    const{name,mobile,email,password}=req.body;
    try{
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
      
        return res.status(400).json({ message: errors.array()[0].msg });
      }
        const exist=await Users.findOne({email});
        if(exist){
            return res.status(400).json({ message: "User already exists" });
        }
        // const hashpassword=await bcrypt.hash(password,10);
        const savedata=new Users({
            name,mobile,email,password
          
        })
        await savedata.save();
        // const msg='<p>Hii,'+name+',please<a href="http://localhost:1900/mail-varification?id='+savedata._id+'">varify</a></p>'
        
        // mailer.sendMail(email,'mail varification',msg)
        return res.status(200).json({message:"registred successfully"});
    }
    catch(err){
        console.log(err.message)
    }
    
  
})
//login//
router.post('/login',async(req,res)=>{
    try{
    const{email,password}=req.body;
    const existing=await Users.findOne({email})
    if(!existing){
         return res.status(400).json({message:"no record found"})

    }
    // const isMatch = await bcrypt.compare(password, existing.password);

    //     if (isMatch) {
    //         req.session.userEmail = { email: existing.email, name: existing.name };
    //         return res.status(200).json({ message: "Login successful", user: { name: existing.name, email: existing.email } });
    //     } 
    else if(existing.password===password){
        req.session.userEmail={email:existing.email,name:existing.name};
        return res.status(200).json({ message: "login succesfull", user: { name: existing.name, email: existing.email } });
    }
    else{
        return res.status(400).json({message:"incorrect password"})
    }
}
catch(err){
    console.log(err.message)
}
})


// carts//
router.post('/cart',async(req,res)=>{
    const id=req.session.userEmail.email
   
    const{product,price,discountPrice,stockStatus,image1}=req.body;
  
    try{
     
        
        const savedata=new cart({
            product,price,discountPrice,stockStatus,image1,id
          

        })
        await savedata.save()
        return res.status(200).json({message:"cart successfull"})
    }
    catch(err){
        console.log(err.message)
    }
    })
//apicarts//
router.get('/apicarts',async(req,res)=>{
    const id  = req.session.userEmail.email;
    const carts=await cart.find({id});
    res.json(carts);
})
router.get("/fetchlogin", (req, res) => {
    if (!req.session.userEmail) {
      return res.status(401).json({ message: "User not logged in" });
    }
  
    const { name, email } = req.session.userEmail;
    res.status(200).json({ name, email });
  });
  
router.post("/deletecart", async (req, res) => {
    try {
      const { id } = req.body;
      await cart.findByIdAndDelete(id);
      res.status(200).json({ message: "Cart item deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting cart item", error: err.message });
    }
  });
  //address//
  router.post("/address",async(req,res)=>{
    const{username,address,city,pincode,state}=req.body;
    const id  = req.session.userEmail.email;
    try{  
        if (!id) {
            return res.status(401).json({ message: "User not logged in" });
          }     
        const saveadd=new add({
            username,address,city,pincode,state,id
        })
        await saveadd.save();
         res.status(200).json({message:"address edit successfully"});
    }
    catch(err){
        console.log(err.message)
    }
  })
  //logout//
  router.get('/logoutapi',async(req,res)=>{
    req.session.destroy(err=>{
        if(err){
            console.log(err);
            res.json({mesaage:"cannot logout"})
        }
        res.json({message:"logout succesfull"});
    })
  })
  router.get('/payment', async (req, res) => {
    try {
     
  
      if (!req.session.userEmail || !req.session.userEmail.email) {
        return res.status(401).json({ message: "User not logged in" });
      }
      const id = req.session.userEmail?.email;
      const payment = await add.find({ id });
      res.status(200).json(payment);
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ message: "Something went wrong" });
    }
  });
  //paymentrazorpay//
  router.post('/create-order', async (req, res) => {
    const { totalamounts } = req.body;
  
    const options = {
      amount: totalamounts * 100, // amount in paisa
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`
    };
  
    try {
      const order = await razorpay.orders.create(options);
      res.json(order);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error creating order');
    }
  });
  //myorders//
  
module.exports=router;