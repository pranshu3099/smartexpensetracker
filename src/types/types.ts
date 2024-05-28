import express from "express";
export interface customRequest extends express.Request {
  user: object;
  userData: {
    email: string;
  };
  headers: {
    authorization: string;
  };
}
