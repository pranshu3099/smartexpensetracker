require("dotenv").config();
import express from "express";
import routes from "./routes/index";
import cors from "cors";
import cookies from "cookies";
const port = process.env.PORT;
const app = express();
app.use(cookies.express([""]));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use(express.json());
app.use(routes);

app.listen(port, () => {
  console.log("starting node server");
});
