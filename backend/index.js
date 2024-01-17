const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");
const port = 4000;

app.use(express.json());

app.use(cors());

app.post("/getAuthToken", async (req, res) => {
  console.log("hello there");
  try {
    const response = await axios.post("https://api.jdoodle.com/v1/auth-token", {
      clientId: "f322e4f6b064427969418f0cb4ff525a",
      clientSecret:
        "4f4109eadeaa716d6fdf71b3a1eb2c56dc87ee6175fa5bc687e26fd6718a2b2d",
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
