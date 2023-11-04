import { Router, Request, Response } from "express";
import passport from "passport";
import { Authen } from "../../middlewares";

const router = Router();

router.get(
  "/discord",
  passport.authenticate("discord"),
  (req: Request, res: Response) => {
    res.send(200);
  }
);

router.get(
  "/discord/redirect",
  passport.authenticate("discord"),
  (req: Request, res: Response) => {
    res.redirect("http://localhost:3000/dashboard");
  }
);

router.get("/status", Authen, (req: Request, res: Response) => {
  res.json(req.user);
})

export default router;
