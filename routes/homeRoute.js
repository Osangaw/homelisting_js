const express = require("express");
const {
  createHome,
  findOneHome,
  allHomes,
  updateHome,
  deleteHome,
} = require("../controllers/home");

const router = express.Router();

router.post("/listHome", createHome);
router.get("/home/:id", findOneHome);
router.get("/allHomes", allHomes);
router.post("/updateHome/:id", updateHome);
router.delete("/delete/:id", deleteHome);
module.exports = router;
