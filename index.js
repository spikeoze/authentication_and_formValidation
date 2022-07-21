import Express from "express";
const app = Express();
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { passportConfig } from "./passportConfig.js";
const prisma = new PrismaClient();
import Joi from "joi";
import { registerValidator, validatorMiddlewere } from "./schemaValidation.js";


//---------------------middleweres---------------------------//
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET, POST",
    credentials: true,
  })
);
app.use(
  session({
    secret: "secret",
    saveUninitialized: true,
    resave: false,

    // store: new PrismaSessionStore(new PrismaClient(), {
    //   checkPeriod: 2 * 60 * 1000, //ms
    //   dbRecordIdIsSessionId: true,
    //   dbRecordIdFunction: undefined,
    // }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

passportConfig(passport);
app.use(passport.initialize());
app.use(passport.session());
//---------------ROUTES----------------------------//

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login-failure",
    successRedirect: "login-success",
  }),
  (req, res, next) => {}
);

// TODO
app.post(
  "/register",
  validatorMiddlewere(registerValidator),
  async (req, res, next) => {
    const { username, password } = req.body;

    const user = await prisma.users.findFirst({ where: { username } });
    if (!user) {
      const hashedPass = await bcrypt.hash(password, 10);

      const newUser = await prisma.users.create({
        data: {
          username,
          password: hashedPass,
        },
      });
      res.redirect("/login");
      console.log(newUser);
    } else {
      res.json("user already exists");
    }
  }
);

/**
 * -------------- GET ROUTES ----------------
 */

app.get("/", (req, res, next) => {
  res.send(
    '<h1>Home</h1><p>Please <a href="/register">register</a> or <a href="/login">login</a> </p>'
  );
});

// When you visit http://localhost:8000/login, you will see "Login Page"
app.get("/login", (req, res, next) => {
  const form =
    '<h1>Login Page</h1><form method="POST" action="/login">\
    Enter Username:<br><input type="text" name="username">\
    <br>Enter Password:<br><input type="password" name="password">\
    <br><br><input type="submit" value="Submit"></form>';

  res.send(form);
});

// When you visit http://localhost:3000/register, you will see "Register Page"
app.get("/register", (req, res, next) => {
  const form =
    '<h1>Register Page</h1><form method="post" action="register">\
                    Enter Username:<br><input type="text" name="username">\
                    <br>Enter Password:<br><input type="password" name="password">\
                    <br><br><input type="submit" value="Submit"></form>';

  res.send(form);
});

/**
 * Lookup how to authenticate users on routes with Local Strategy
 * Google Search: "How to use Express Passport Local Strategy"
 *
 * Also, look up what behaviour express session has without a maxage set
 */
app.get("/protected-route", (req, res, next) => {
  // This is how you check if a user is authenticated and protect a route.  You could turn this into a custom middleware to make it less redundant
  if (req.isAuthenticated()) {
    res.send(
      '<h1>You are authenticated</h1><p><a href="/logout">Logout and reload</a></p>'
    );
    // console.log({ currentUser: req.user });
  } else {
    res.send(
      '<h1>You are not authenticated</h1><p><a href="/login">Login</a></p>'
    );
  }
});

app.get("/user", (req, res) => {
  if (req.user) {
    res.json(req.user);
  }
});

// Visiting this route logs the user out
app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/protected-route");
  });
});

app.get("/login-success", (req, res, next) => {
  res.send(
    '<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>'
  );
  console.log({ Session: req.session });
  console.log({ CurrentUser: req.user });
});

app.get("/login-failure", (req, res, next) => {
  res.send("You entered the wrong password.");
});

app.listen(8000, () => {
  console.log("serving on port 8000");
});
