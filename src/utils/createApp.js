const morgan = require("morgan")
const cors = require("cors")
const routes = require("../routes")
const session = require("express-session")
const express = require("express")
const passport = require("passport")
const store = require("connect-mongo")
require("../strategies/discord");

module.exports = () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("dev"));

  //cors
  app.use(
    cors({
      credentials: true,
      origin: false
    })
  );

  // app.options("/", (req, res, next) => {
  //   res.header('Access-Control-Allow-Origin', "*");
  //   next()
  // })

  //authen
  app.use(
    session({
      secret: "SUPERSECRET",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 60000 * 60 * 24 * 7,
        httpOnly: false,
      },
      store: store.create({
        mongoUrl:
          "mongodb+srv://admin:1234@cluster.h3b1zwk.mongodb.net/dragondice",
      }),
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  //routes
  app.use("/", routes);

  return app;
}
