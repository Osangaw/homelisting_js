const express = require("express")
const { signUp, signIn, verifyEmail } = require("../controllers/auth");
const validate = require("../validators/validate");
const { signUpValidator, loginValidator } = require("../validators/auth");

const router = express.Router();

router.post("/signup",validate(signUpValidator), signUp);
router.post("/signin",validate(loginValidator), signIn)
router.post("/verifyEmail", verifyEmail)

module.exports = router;

