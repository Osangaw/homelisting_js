const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Token = require("../models/token");
const { sendEmail } = require("../util/emailService");
const { signUpValidator, loginValidator } = require("../validators/auth");
const { formatZodError } = require("../util/errorZod");

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

exports.signUp = async (req, res) => {
  const signUpResult = signUpValidator.safeParse(req.body);
  if (!signUpResult.success) {
    return res.status(400).json({ 
        errors: formatZodError(signUpResult.error.issues) 
    });
  }

  const { name, email, phoneNumber, password, accountType } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      phoneNumber,
      password: encryptedPassword,
      accountType: accountType || "user",
      isVerified: false
    });

    await newUser.save();

    try {
      const otp = Math.floor(100000 + Math.random() * 900000);
      const token = new Token({ email, token: otp });
      await token.save();
      // await sendEmail(email, otp); // Uncomment when email is configured
    } catch (e) {
      console.log("OTP failed but user created", e);
    }

    return res.status(201).json({ 
      message: "User registered successfully" 
    });

  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.signIn = async (req, res) => {
  const loginResult = loginValidator.safeParse(req.body);
  if (!loginResult.success) {
    console.log("error in zod");
    
    return res.status(400).json({ errors: formatZodError(loginResult.error.issues) });
  }

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = generateToken(user);

    // Remove password from response object
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json({
      message: "User sign in successfully",
      user: userResponse,
      token: token
    });

  } catch (error) {
    console.error("SignIn Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.verifyEmail = async (req, res) => {
  const { email, verifyToken } = req.body;
  try {
    const tokenRecord = await Token.findOne({ email, token: verifyToken });
    
    if (!tokenRecord) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    // Logic: Update user to verified and cleanup token
    await User.findOneAndUpdate({ email }, { isVerified: true });
    await Token.deleteOne({ _id: tokenRecord._id });

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Verification Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};