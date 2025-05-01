const express = require("express");
const cors = require("cors"); // Import CORS
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Menggunakan middleware CORS
app.use(express.json()); // Middleware untuk mengurai JSON
app.use(express.urlencoded({ extended: true }));

// Import Routes
const itemRoutes = require("./src/routes/item.routes");
const userRoutes = require("./src/routes/user.routes");
const transactionRoutes = require("./src/routes/transaction.routes"); 

// Menggunakan Routes
app.use("/item", itemRoutes);
app.use("/user", userRoutes);
app.use("/transaction", transactionRoutes); 

// Menjalankan Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// app.js
const helmet = require('helmet');
app.use(helmet());
