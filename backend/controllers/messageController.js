const { Message, User, Product } = require("../db/models");
const { Op } = require("sequelize");

exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const messages = await Message.findAll({
      where: { [Op.or]: [{ senderId: userId }, { receiverId: userId }] },
      include: [
        { model: User, as: "Sender", attributes: ["id", "email"] },
        { model: User, as: "Receiver", attributes: ["id", "email"] },
        { model: Product, as: "Product", attributes: ["id", "name", "img"], required: false },
      ],
      order: [["id", "DESC"]],
    });

    const partnerIds = new Set();
    const latestByPartner = {};
    messages.forEach((m) => {
      const partnerId = m.senderId === userId ? m.receiverId : m.senderId;
      if (!latestByPartner[partnerId] || m.id > latestByPartner[partnerId].id) {
        latestByPartner[partnerId] = m;
        partnerIds.add(partnerId);
      }
    });

    const conversations = Array.from(partnerIds).map((pid) => {
      const msg = latestByPartner[pid];
      const partner = msg.senderId === userId ? msg.Receiver : msg.Sender;
      return {
        id: msg.id,
        partner: { id: partner.id, email: partner.email },
        lastMessage: msg.text,
        product: msg.Product,
        createdAt: msg.createdAt,
      };
    });

    res.status(200).json({ success: true, data: conversations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { partnerId } = req.params;

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: userId, receiverId: partnerId },
          { senderId: partnerId, receiverId: userId },
        ],
      },
      include: [
        { model: User, as: "Sender", attributes: ["id", "email"] },
        { model: User, as: "Receiver", attributes: ["id", "email"] },
        { model: Product, as: "Product", attributes: ["id", "name", "img"], required: false },
      ],
      order: [["id", "ASC"]],
    });

    res.status(200).json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId, text, productId } = req.body;

    if (!receiverId || !text) {
      return res.status(400).json({ success: false, message: "receiverId and text required" });
    }

    const message = await Message.create({
      senderId,
      receiverId,
      text,
      productId: productId || null,
    });

    const created = await Message.findByPk(message.id, {
      include: [
        { model: User, as: "Sender", attributes: ["id", "email"] },
        { model: User, as: "Receiver", attributes: ["id", "email"] },
        { model: Product, as: "Product", attributes: ["id", "name", "img"], required: false },
      ],
    });

    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
