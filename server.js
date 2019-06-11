const express = require("express");

const app = express();

// test endpoint
app.get("/", (req, res) => {
  res.send("API working!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
