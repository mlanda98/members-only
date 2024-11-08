const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Message routes are working");
} )

module.exports = router;