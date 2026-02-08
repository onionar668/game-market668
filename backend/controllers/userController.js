const { User, Product } = require("../db/models");

exports.getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: ["id", "email"],
      include: [{ model: Product, as: "Products", attributes: ["id", "name", "price", "img", "category"] }],
    });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const products = user.Products || [];
    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        products,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
