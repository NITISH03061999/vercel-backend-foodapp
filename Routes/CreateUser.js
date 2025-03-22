const express = require("express");
require('dotenv').config();
const router = express.Router();
const user = require("../models/User");
const { body, validationResult } = require("express-validator");

const bcrypt=require('bcryptjs')
const jwt= require('jsonwebtoken');
router.post(
  "/createuser",
  [
    body("email").isEmail(),
    body("password", "Incorrect Password ").isLength({ min: 5 }),
    body("name").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }


    const salt= await bcrypt.genSalt(10); //creating salt for password hashing 
    let secpassword= await bcrypt.hash(req.body.password,salt)// combining salt and password hash
    try {
      await user.create({
        name: req.body.name,
        password: secpassword,
        email: req.body.email,
        location: req.body.location,
      });
      res.json({ success: true, message: "user created successfully" });
      console.log("data has been uploaded .");
    } catch (error) {
      console.log(error);
      res.json({ success: false });
    }
  }
);


// login  endpoint 
const jwtSecret=process.env.SECRET_KEY;// jwt signature or secret key
router.post("/loginuser", [
    body("email").isEmail(),
    body("password", "Incorrect Password ").isLength({ min: 5 }),
  ], async (req, res) => {
    let email= req.body.email

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  try {
 let userData = await user.findOne({email})
 console.log(userData);
 
 if(!userData){
    return res.status(400).json({message:'try logging with correct credentials '})
 }

 const pwdcompare= await  bcrypt.compare(req.body.password,userData.password)// 
 if(!pwdcompare){
    return res.status(400).json({  success:false, message:'Password does not match '})

 }

 const data ={ 
    user:{
        id:userData.id
    }
 }

 const authToken= jwt.sign(data,jwtSecret)// creating authtoken 
 return res.json({success:true,authToken:authToken})//sending to the client result and secret key 
   
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
});

module.exports = router;
