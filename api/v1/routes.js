"use strict";

const express      = require("express"),
      router       = express.Router(),
      errorHandler = require("../errorHandler");


router.get("/test", (req, res, next) => {
  res.send("OK").status(200).end();
});

router.use(errorHandler);

module.exports = router;
