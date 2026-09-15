const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();
const routes = require("./routes");

const notFound = require("./middlewares/notFound.middleware");
const errorHandler = require("./middlewares/error.middleware");

const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Demasiados intentos. Intentá de nuevo en unos minutos." }
});

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth/login", authRateLimiter);
app.use("/api/auth/forgot-password", authRateLimiter);

app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;