const express = require("express");
require("dotenv").config();
const connectDB = require("./src/config/db");

const app = express();

// Connect to MongoDB
connectDB();

// Parse JSON
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.json({ message: "API is working 🕸" });
});

// User routes
const userRoutes = require("./src/routes/userRoutes");
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
