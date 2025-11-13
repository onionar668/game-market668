const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const productRoute = require("../backend/routes/productRoute");
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

db.sequelize
  .sync({
    alter: true,
  })
  .then(
    app.listen(PORT, () => {
      console.log(`Server has started on http://localhost:${PORT}`);
    })
  );
