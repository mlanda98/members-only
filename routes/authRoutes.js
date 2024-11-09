const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const pool = require("../db");

const router = express.Router();

router.get("/sign-up", (req, res) => {
  res.render("sign-up");
});

router.post("/sign-up", async (req, res, next) => {
  try {
    const { first_name, last_name, username, password, isAdmin } = req.body;

    const isAdminValue = isAdmin ? true : false;
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(req.body); // This will show what the server receives

    await pool.query(
      "INSERT INTO users (first_name, last_name, username, password, is_admin) VALUES ($1, $2, $3, $4, $5)",
      [first_name, last_name, username, hashedPassword, isAdminValue]
    );
    res.redirect("/auth/log-in");
  } catch (err) {
    next(err);
  }
});

router.get("/log-in", (req, res) => {
  res.render("log-in");
});

router.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/log-in",
  })
);

router.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

router.get("/messages", async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      const messages = await pool.query(`
       SELECT messages.id, messages.title, messages.text, messages.timestamp, users.first_name, users.last_name
       FROM messages
       LEFT JOIN users ON messages.user_id = users.id
       ORDER BY messages.timestamp DESC
      `);
      res.render("messages", { messages: messages.rows, isMember: true });
    } else {
      const messages = await pool.query(`
        SELECT id, title, text, timestamp
        FROM messages
        ORDER BY timestamp DESC
        `);
      res.render("messages", { messages: messages.rows, isMember: false });
    }
  } catch (err) {
    next(err);
  }
});



module.exports = router;
