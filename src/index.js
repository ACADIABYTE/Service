require("dotenv").config();

const morgan = require("morgan")
const cors = require("cors")
const routes = require("./routes")
const session = require("express-session")
const express = require("express")
const passport = require("passport")

require("./strategies/discord");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

//cors
app.use(
  cors({
    credentials: true,
    origin: ["https://ddmanagementcsr-acadiabyte.vercel.app", "http://localhost:5174", "http://localhost:3000"],
  })
);

app.use(
  session({
    secret: "SUPERSECRET",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60000 * 60 * 24 * 7,
      httpOnly: false
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

//routes
app.use("/", routes);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  try {
    console.log(`Running in ${process.env.ENVIRONMENT || "DEV"} mode.`);
    console.log(`Server running as port: ${port}`);
  } catch (err) {
    console.error(err);
  }
});
