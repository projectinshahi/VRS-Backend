const express = require("express");
const router = express.Router();

const controller = require("../controllers/securedPropertyController");
const upload = require("../middleware/upload");

// GET ALL
router.get("/", controller.getAllProperties);

router.post(
  "/",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 10 },
  ]),
  controller.createProperty,
);

router.put(
  "/:id",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 10 },
  ]),
  controller.updateProperty,
);

// DELETE
router.delete("/:id", controller.deleteProperty);





module.exports = router;
