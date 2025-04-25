const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173",  
  methods: "GET,POST",
  credentials: true, 
}));

const auth = require('./routes/auth');
const  mentorRouter = require('./routes/mentorRouter');
const studentRouter = require('./routes/studentRouter');

app.use('/auth',auth)
app.use('/mentor',mentorRouter)
app.use('/student',studentRouter)

app.get("/", (req, res) => {
    res.send("Welcome to the backend server!");
});

app.listen(3000,()=>{
    console.log("Server is running on port 3000");  
});
