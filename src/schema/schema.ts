const { z, string } = require("zod");
import regexPatterns from "../regex/index";
const registerSchema = z.object({
  name: string().min(3).max(100).regex(regexPatterns?.nameRegex, {
    message: "name should contain only alphabets, hyphen or apostrophe",
  }),
  password: string().min(10).max(20).regex(regexPatterns?.passwordRegex, {
    message: "The length of password must be of 10 to 20",
  }),
  email: string()
    .max(100)
    .regex(regexPatterns?.emailRegex, { message: "Invalid email" }),
});

const LoginSchema = z.object({
  password: string().min(10).max(20).regex(regexPatterns?.passwordRegex, {
    message: "The length of password must be of 10 to 20",
  }),
  email: string()
    .max(100)
    .regex(regexPatterns?.emailRegex, { message: "Invalid email" }),
});

const schema = { registerSchema, LoginSchema };
export default schema;
