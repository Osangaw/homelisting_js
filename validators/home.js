const { z } = require("zod");

const homevalidator = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  category: z.enum(["rent", "sale"], { 
    errorMap: () => ({ message: "Category must be either 'rent' or 'sale'" }) 
  }),
  country: z.string().min(2, "Country selection is required"),
  location: z.string().min(2, "City/State is required"),
  address: z.string().min(5, "Please provide a more detailed street address"), 
  price: z.string().min(1, "Price is required"), 
  description: z.string().min(10, "Description should be a bit more detailed"),
  
  // Coerce is vital because FormData sends everything as a string
  bedrooms: z.coerce.number().int().min(0, "Bedrooms cannot be negative"),
  bathrooms: z.coerce.number().int().min(0, "Bathrooms cannot be negative"),
  garage: z.coerce.number().int().min(0).default(0),
});

module.exports = { homevalidator };