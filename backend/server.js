const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./models/db");
const routes = require("./routes/routes");
const bodyParser = require('body-parser');

// Load environment variables
dotenv.config();



// Initialize app
const app = express();
app.use(cors());
app.use(express.json());

// ✅ Middleware to parse JSON (Fixes "undefined" error)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use routes
app.use("/api", routes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
