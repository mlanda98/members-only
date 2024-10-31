const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const pool = require("../db");

const router = express.Router();

router.get("/sign-up", (req, res) => {
  res.render("sign-up-form");
})

router.post("/sign-up", async (req, res, next) => {
  try{
    const {username, password, firstName, lastName } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (username, password, first_name, last_name) VALUES ($1, $2, $3, $4)",
      [username, hashedPassword, firstName, lastName]
    );
    res.redirect("/auth/log-in");
  } catch (err){
    next(err);
  }
})
router.get("/log-in", (req, res) => {
  res.render("log-in-form");
})

router.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/log-in", 
  })
)

router.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  })
})

module.exports = router;