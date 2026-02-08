const { Favorite, Product } = require("../db/models");

exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.findAll({
      where: { userId: req.user.id },
      include: [{ model: Product, as: "Product" }],
    });
    res.status(200).json({ success: true, data: favorites });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addToFavorites = async (req, res) => {
  try {
    const { productId } = req.params;
    const [favorite, created] = await Favorite.findOrCreate({
      where: { userId: req.user.id, productId },
    });

    if (!created) {
      return res.status(400).json({ success: false, message: "Already in favorites" });
    }

    const fullFavorite = await Favorite.findByPk(favorite.id, {
      include: [{ model: Product, as: "Product" }],
    });
    res.status(201).json({ success: true, data: fullFavorite });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.removeFromFavorites = async (req, res) => {
  try {
    const { productId } = req.params;
    const favorite = await Favorite.findOne({
      where: { userId: req.user.id, productId },
    });

    if (!favorite) {
      return res.status(404).json({ success: false, message: "Not in favorites" });
    }

    await favorite.destroy();
    res.status(200).json({ success: true, message: "Removed from favorites" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
