import express from "express";
export interface customRequest extends express.Request {
  user: object;
  headers: {
    authorization: string;
  };
}
