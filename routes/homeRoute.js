const express = require("express");
const {
  createHome,
  findOneHome,
  allHomes,
  updateHome,
  deleteHome,
} = require("../controllers/home");
const multer = require("multer");
const validate = require("../validators/validate");
const { homevalidator } = require("../validators/home");
const { auth } = require("../middleware");

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, "uploads/")
    },
    filename: function (req, file, cb){
        // Replace spaces with hyphens to avoid URL issues
        cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, '-'))
    }
})

const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } }) 

router.post("/list", auth, upload.array("images"), validate(homevalidator), createHome);
router.post("/updateHome/:id", auth, upload.array("images"), validate(homevalidator), updateHome);
router.get("/home/:id", auth, findOneHome);
router.get("/all", auth, allHomes);
router.delete("/delete/:id", auth, deleteHome);
module.exports = router;
