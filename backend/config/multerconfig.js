const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary"); 


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "mentors", 
    allowed_formats: ["jpg", "jpeg", "png"], 
    public_id: (req, file) => file.originalname.split(".")[0], 
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
