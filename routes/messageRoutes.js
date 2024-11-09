const express = require("express");
const pool = require("../db");
const router = express.Router();

router.get("/new", (req, res, next) => {
  console.log("GET /messages/new route accessed");
  if (req.isAuthenticated()) {
    res.render("message-form", { isMember: true });
  } else {
    res.render("message-form", { isMember: false });
  }
});

router.post("new", async (req, res, next) => {
  try {
    const { title, text } = req.body;
    let user_id = null;

    if (req.isAuthenticated()) {
      user_id = req.user.id;
    }

    await pool.query(
      "INSERT INTO messages (title, text, user_id) VALUES ($1, $2, $3)",
      [title, text, user_id]
    );

    res.redirect("/messages");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
