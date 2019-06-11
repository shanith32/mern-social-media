import express from "express";
import connectDB from "./config/db";

const app = express();

// Connect to DB
connectDB();

// Test endpoint
app.get("/", (req, res) => {
  res.send("API running...");
});

// Define Routes
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/users", require("./routes/api/users"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
