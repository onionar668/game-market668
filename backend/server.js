const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const productRoute = require("./routes/productRoute");
const authRoute = require("./routes/authRoute");
const cartRoute = require("./routes/cartRoute");
const favoriteRoute = require("./routes/favoriteRoute");
const userRoute = require("./routes/userRoute");
const messageRoute = require("./routes/messageRoute");
const db = require("./db/models/index");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 1515;

//MiddleWares
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

//Routes
app.use("/api/product", productRoute);
app.use("/api/auth", authRoute);
app.use("/api/cart", cartRoute);
app.use("/api/favorites", favoriteRoute);
app.use("/api/users", userRoute);
app.use("/api/messages", messageRoute);

db.sequelize
  .sync({
    alter: true,
  })
  .then(
    app.listen(PORT, () => {
      console.log(`Server has started on http://localhost:${PORT}`);
    })
  );
