const express = require("express");
const router = express.Router();
const tagController = require("../controllers/tagController");
const { validateTag } = require("../middleware/validationMiddleware");

router.post("/", validateTag, tagController.createTag);
router.get("/", tagController.getTags);
router.get("/:id", tagController.getTagById);
router.put("/:id", validateTag, tagController.updateTag);
router.delete("/:id", tagController.deleteTag);

module.exports = router;
