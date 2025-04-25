const mongoose = require('mongoose');

const DB_URI = 'mongodb+srv://sitesmiths:12345@devjam1.fe87g.mongodb.net/';
const dbgr=require("debug")("development:mongoose")

mongoose.connect(DB_URI)
  .then(() => {
   dbgr('Connected to MongoDB Atlas successfully');
  })
  .catch((err) => {
   dbgr('Connection error:', err);
  });


module.exports = mongoose.connection;