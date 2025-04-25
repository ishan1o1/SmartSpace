const express = require("express");
const app = express();
const router = express.Router();
const db = require("../config/db");
const userModel = require("../models/user");
const mentorModel = require("../models/mentor");
const studentModel = require("../models/student");
require('dotenv').config();
const jwt = require("jsonwebtoken");
const jwtSecret = "myverysec";
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const path = require("path");
const { sendVerificationEmail } = require("../utils/nodemailer");
const  mentorRouter = require('./mentorRouter');
const studentRouter = require('./studentRouter');

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use('/mentor',mentorRouter)
app.use('/student',studentRouter)


router.post("/register", async (req, res) => {
  try {
    let { name, email, password, confirm_password, role } = req.body;
    if (password !== confirm_password) return res.status(400).json({ message: "Passwords do not match" });

    let user = await userModel.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);



    let token = jwt.sign({ name:name,email:email,password:hashedPassword, role: role }, jwtSecret);
        
    
  
    await sendVerificationEmail(email, token);
    res.status(200).json({ message: "Verification email sent. Please check your inbox." });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Something went wrong during registration" });      //500 means something went wrong on the server side
  }
});
router.get("/verify-email/:token", async (req, res) => {
  try {
    const { token } = req.params;

    const decoded = jwt.verify(token, jwtSecret);
    const { name, email, password, role } = decoded;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already verified or exists." });
    }

    const user = await userModel.create({
      name,
      email,
      password,
      role,
      isVerified: true,
    });

    res.status(201).json({ message: "Email verified successfully. User registered." });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Invalid or expired token." });
  }
});



router.post('/login',async (req, res) => {
    
  let {email,password,role}=req.body
  
  
  let user = await userModel.findOne({email});
  
  if(!user)return res.send("something went wrong");
  bcrypt.compare(password, user.password, async function(err, result) {
    if(result){
      let token = jwt.sign({email:email, userid:user._id,role:role},jwtSecret)
      if (!user.isVerified) {
        return res.status(403).json({ message: "Email not verified. Please check your inbox." });
      }
      res.cookie('token', token).status(200).json({ message: "Login successful",
         token,
        role,
      redirectTo: role === "student" ? `/student/profile/${user._id}` : `/mentor/profile/${user._id}`});
     }
    else
     {
      res.status(400).json({ message: "Invalid credentials" });
     } 
  })        
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;