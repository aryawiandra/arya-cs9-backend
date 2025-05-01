// app.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

// Inisialisasi app
const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import Routes
const itemRoutes = require("./src/routes/item.routes");
const userRoutes = require("./src/routes/user.routes");
const transactionRoutes = require("./src/routes/transaction.routes");

// Gunakan Routes
app.use("/item", itemRoutes);
app.use("/user", userRoutes);
app.use("/transaction", transactionRoutes);

// 404 Handler (jika route tidak ditemukan)
app.use((req, res, next) => {
const error = new Error("Not Found");
error.status = 404;
next(error);
});


// Global Error Handler
app.use((err, req, res, next) => {
console.error("Error caught:", err.message);
res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    data: null,
    });
});

module.exports = app;
