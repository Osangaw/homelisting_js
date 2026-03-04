// middleware/validate.js
const { formatZodError } = require("../util/errorZod");

const validate = (schema) => (req, res, next) => {
  // Use the schema you passed in (e.g., signUpValidator)
  const result = schema.safeParse(req.body);

  if (!result.success) {
    // Format the Zod issues into the string array you like
    const errorMessages = formatZodError(result.error.issues);

    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: errorMessages, // Sends your formatted strings to React
    });
  }

  // If successful, replace req.body with the cleaned data 
  // (this removes any extra fields a hacker might try to inject)
  req.body = result.data;
  next();
};

module.exports = validate;