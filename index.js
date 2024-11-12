const express = require("express");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
console.log("Current directory:", __dirname);

const pool = require("./db");
const app = express();
const methodOverride = require("method-override");
app.use(methodOverride("_method"));


app.use(express.urlencoded({extended:false}));
app.use(session({secret: "secret-key", resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");

app.use("/auth", authRoutes);
app.use("/messages", messageRoutes);

passport.use(new LocalStrategy(async (username, password, done) => {
  try{
    const {rows} = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    const user = rows[0];
    if (!user) return done(null, false, {message: "Incorrect username."});

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return done(null, false, {message: "Incorrect password."});
    
    return done(null, user);
  } catch (err){
    return done(err);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const {rows} = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  const user = rows[0];
  done(null, user);
})

app.get("/", (req, res) => {
  res.render("index", {user: req.user});
})

app.set("views", __dirname + "/views");

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000")
})