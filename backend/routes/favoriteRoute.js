const express = require("express");
const {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
} = require("../controllers/favoriteController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getFavorites);
router.post("/:productId", addToFavorites);
router.delete("/:productId", removeFromFavorites);

module.exports = router;
