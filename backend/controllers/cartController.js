const { CartItem, Product } = require("../db/models");

exports.getCart = async (req, res) => {
  try {
    const items = await CartItem.findAll({
      where: { userId: req.user.id },
      include: [{ model: Product, as: "Product" }],
    });
    res.status(200).json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID required" });
    }

    const [item, created] = await CartItem.findOrCreate({
      where: { userId: req.user.id, productId },
      defaults: { quantity },
    });

    if (!created) {
      item.quantity += Number(quantity) || 1;
      await item.save();
    }

    const fullItem = await CartItem.findByPk(item.id, {
      include: [{ model: Product, as: "Product" }],
    });
    res.status(200).json({ success: true, data: fullItem });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const item = await CartItem.findOne({ where: { id, userId: req.user.id } });

    if (!item) {
      return res.status(404).json({ success: false, message: "Cart item not found" });
    }

    if (quantity <= 0) {
      await item.destroy();
      return res.status(200).json({ success: true, data: null, message: "Item removed" });
    }

    item.quantity = quantity;
    await item.save();
    res.status(200).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await CartItem.findOne({ where: { id, userId: req.user.id } });

    if (!item) {
      return res.status(404).json({ success: false, message: "Cart item not found" });
    }

    await item.destroy();
    res.status(200).json({ success: true, message: "Item removed from cart" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
