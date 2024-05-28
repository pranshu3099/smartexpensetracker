require("dotenv").config();
import express from "express";
import routes from "./routes/index";
const port = process.env.PORT;
const app = express();
app.use(express.json());
app.use(routes);
app.listen(port, () => {
  console.log("starting node server");
});
