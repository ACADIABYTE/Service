import { NextFunction, Request, Response } from "express";

export default function authen(
  req: Request,
  res: Response,
  next: NextFunction
) {
  return req.user ? next() : res.status(404).send("Unauthorize");
}
