const { z, string } = require("zod");
import regexPatterns from "../regex/index";
const registerSchema = z.object({
  name: string().min(5).max(100).regex(regexPatterns?.nameRegex, {
    message: "name should contain only alphabets, hyphen or apostrophe",
  }),
  mobile_number: string().min(8).max(10).regex(regexPatterns?.passwordRegex, {
    message: "The length of password must be of 8 to 10",
  }),
  email: string()
    .max(100)
    .regex(regexPatterns?.emailRegex, { message: "Invalid email" }),
});

const schema = { registerSchema };
export default schema;
