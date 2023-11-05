const { Router } = require("express")
const passport = require("passport")
const { Authen } = require("../../middlewares")

const router = Router();

router.get(
  "/discord",
  passport.authenticate("discord"),
  (req, res) => {
    res.send(200);
  }
);

router.get(
  "/discord/redirect",
  passport.authenticate("discord"),
  (req, res) => {
    console.log(req.session)
    res.redirect("http://localhost:3000/dashboard");
  }
);

router.get("/status", Authen, (req, res) => {
  res.json(req.user);
})

module.exports = router;
