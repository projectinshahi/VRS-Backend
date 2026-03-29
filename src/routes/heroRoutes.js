const express = require("express");
const router = express.Router();
const heroController = require("../controllers/heroController");
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", heroController.getHero);

router.put(
  "/",
  authMiddleware,
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "video", maxCount: 1 },
  ]),
  heroController.updateHero
);

module.exports = router;
