import axios from "axios";
import express from "express";
import querystring from "querystring";
import { customRequest } from "../types/types";
const getGithubuser = async (code: any) => {
  try {
    const githubToken = await axios
      .post(
        `https://github.com/login/oauth/access_token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET_ID}&code=${code}`
      )
      .then((res) => res.data)
      .catch((error) => {
        console.log(error);
      });

    const decoded = querystring.parse(githubToken);
    const access_token = decoded.access_token;
    const github_user = axios
      .get("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((res) => res.data);
    return { github_user, access_token };
  } catch (err) {
    console.log(err);
  }
};

const githubAuthHandler = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
  db: any
) => {
  try {
    const code = req.query.code;
    const path = req.query.path;
    if (!code) {
      throw new Error("code not found");
    } else {
      const { github_user, access_token }: any = await getGithubuser(code);
      const { email, password } = github_user;
      const user = {
        email: email,
        password: password ? password : "",
      };
      const userCollection = db.collection("users");
      const getUser = await userCollection.findOne({ email });
      if (getUser) {
        return res.status(409).json({ message: "User allready exists" });
      } else {
        const result = await userCollection.insertOne(user);
        const querystring = encodeURIComponent(JSON.stringify(result));
        const sixMonthsFromNow = new Date();
        sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
        req.cookies.set("github-jwt", access_token, {
          httpOnly: true,
          maxAge: 15552000 * 1000,
        });

        res
          .status(303)
          .redirect(`${process.env.FRONTEND_URL}/${path}?data=${querystring}`);
      }
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err });
  }
};

const checkTokenValidity = async (
  req: customRequest,
  res: express.Response,
  next: express.NextFunction,
  db: any
) => {
  let userData = req.userData;
  const { email } = userData;
  if (userData) {
    const userCollection = db.collection("users");
    const user = await userCollection.findOne({ email });
    return res.status(200).json([{ message: "success", user: user }]);
  } else {
    return res.status(401).json([{ message: "unauthorized" }]);
  }
};

export default { githubAuthHandler, checkTokenValidity };
