const { Product, User } = require("../db/models");
const { Op } = require("sequelize");

exports.getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 12, search, category, priceMin, priceMax } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = {};

    if (search) {
      where.name = { [Op.iLike]: `%${search}%` };
    }
    if (category) {
      where.category = category;
    }
    if (priceMin || priceMax) {
      where.price = {};
      if (priceMin) where.price[Op.gte] = parseInt(priceMin);
      if (priceMax) where.price[Op.lte] = parseInt(priceMax);
    }

    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [{ model: User, as: "User", attributes: ["id", "email"] }],
      limit: parseInt(limit),
      offset,
      order: [["id", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / parseInt(limit)),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const getOne = await Product.findByPk(id, {
      include: [{ model: User, as: "User", attributes: ["id", "email"] }],
    });
    if (!getOne) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: getOne });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, price, img, category } = req.body;
    if (!name || !price || !img) {
      return res.status(400).json({ success: false, message: "Name, price, img required" });
    }
    const create = await Product.create({
      name,
      price,
      img,
      category: category || null,
      userId: req.user.id,
    });
    const withUser = await Product.findByPk(create.id, {
      include: [{ model: User, as: "User", attributes: ["id", "email"] }],
    });
    res.status(200).json({ success: true, data: withUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, price, img, category } = req.body;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    if (product.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized to edit this product" });
    }
    await Product.update(
      { name: name || product.name, price: price ?? product.price, img: img || product.img, category: category !== undefined ? category : product.category },
      { where: { id } }
    );
    const updated = await Product.findByPk(id, {
      include: [{ model: User, as: "User", attributes: ["id", "email"] }],
    });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    if (product.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this product" });
    }
    await Product.destroy({ where: { id } });
    res.status(200).json({ success: true, message: "Product deleted!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
