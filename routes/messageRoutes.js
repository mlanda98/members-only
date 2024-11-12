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

router.post("/new", async (req, res, next) => {
  try {
    const { title, text } = req.body;
    let user_id = null;

    if (req.isAuthenticated()) {
      user_id = req.user.id;
    }
console.log("User is authenticated:", req.isAuthenticated());

    await pool.query(
      "INSERT INTO messages (title, text, user_id) VALUES ($1, $2, $3)",
      [title, text, user_id]
    );

    res.redirect("/messages");
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try{
    const messagesId = req.params.id;

    if (!req.isAuthenticated() || !req.user.is_admin) {
      return res.status(403).send("You do not have permission to delete this message");
    }

    await pool.query("DELETE FROM messages WHERE id = $1", [messagesId]);

    res.redirect("/messages");
  } catch (err){
    next(err);
  }
})

router.get("/", async (req, res, next) => {
  console.log("GET  /messages route accessed")
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
