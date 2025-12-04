const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./src/config/db");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API is working 🚀" });
});

const userRoutes = require("./src/routes/userRoutes");
const resourceRoutes = require("./src/routes/resourceRoutes");

app.use("/api/users", userRoutes);
app.use("/api/resources", resourceRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
