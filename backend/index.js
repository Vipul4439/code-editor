const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");
const port = 4000;
require("dotenv").config();
app.use(express.json());

app.use(cors());

app.post("/getAuthToken", async (req, res) => {
  console.log("hello there");
  try {
    const response = await axios.post("https://api.jdoodle.com/v1/auth-token", {
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    });
    console.log("response data", response.data);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
