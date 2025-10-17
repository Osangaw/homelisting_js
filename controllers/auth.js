const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Token = require("../models/token");
const { sendEmail } = require("../util/emailService");
const { z } = require("zod");
const { signUpValidator, loginValidator } = require("../validators/auth");
const { formatZodError } = require("../util/errorZod");

exports.signUp = async (req, res) => {
  const signUpResult = signUpValidator.safeParse(req.body);
  if(!signUpResult.success){
    return res.status(400).json(formatZodError(signUpResult.error.issues))
  }
  const { name, email, phoneNumber, password, accountType} = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`User already exists with email: ${email}`);
      return res
        .status(400)
        .json({ message: `User already exists with email: ${email}` });
    } else {
      const salt = await bcrypt.genSalt(10);
      const encryptedPassword = await bcrypt.hash(password, salt);
      function randomNumber() {
        return Math.floor(100000 + Math.random() * 9000);
      }

      try {
        const otp = randomNumber();
        const token = new Token({ email, token: otp });
        await sendEmail(email, otp);
        await token.save();
        console.log("email sent", otp);
      } catch (e) {
        console.log("error in sending mail", e);
      }
      const newUser = new User({
        name,
        email,
        phoneNumber,
        password: encryptedPassword,
        accountType
      });

      await newUser.save();
      console.log("new user registered", newUser);
      return res.status(201).json({ message: "User registered successfully" });
    }
  } catch (e) {
    console.log("signup error", e);
    return res.status(500).json({ message: "Internal server error"});
  }
};

exports.signIn = async (req, res) => {
  const loginResult = loginValidator.safeParse(req.body);
  if(!loginResult.success){
    return res.status(400).json(formatZodError(loginResult.error.issues))
  }
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      console.log(`user with email: ${email} does not exist`);
      return res
        .status(400)
        .json({ message: `User with email: ${email} does not exist` });
    }
    bcrypt.compare(password, user.password, function (err, result) {
      if (result) {
        console.log("user sign in successful", user);
        return res.status(200).json({ message: "User sign in successfully" });
      }
    });
  } catch (e) {
    console.log("SignIn error", e);
  }
};

exports.verifyEmail = async (req, res) => {
  const { email, verifyToken } = req.body;
    try {
      const user = await Token.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: `User with ${email} does not exist` });
    }
    const tokenCheck = user.token === verifyToken;
    if (tokenCheck) {
      console.log("email verified successfully");
      const userr = await User.findOne({ email });
      userr.isVerified = true;
      const deleteToken = await Token.findOneAndDelete({ email });
      await userr.save();
      return res.status(200).json({ message: "email verified successfully" });
    } else {
      console.log("token verification failed");
      return res.status(400).json({ message: "email verification failed" });
    }
  } catch (err) {
    console.log("error in email verification", err);
    return res.status(500).json({ message: "internal server error" });
  }
};
