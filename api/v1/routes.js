"use strict";

const express        = require("express"),
      router         = express.Router(),
      paymentHistory = require("./paymentHistory"),
      errorHandler   = require("../errorHandler");


router.get("/test", (req, res, next) => {
  res.send("OK").status(200).end();
});

router.get("/paymentHistory", paymentHistory.getPaymentHistory);
router.post("/paymentHistory", paymentHistory.addToPaymentHistory);
router.put("/paymentHistory/:id", paymentHistory.updatePaymentHistory);
router.delete("/paymentHistory/:id", paymentHistory.deletePaymentHistory);

router.use(errorHandler);

module.exports = router;
