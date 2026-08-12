const express = require("express");

const petRoutes = require("./pet.routes");
const authRoutes = require("./auth.routes");

const router = express.Router();

router.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "API funcionando correctamente"
    });
});

router.get("/error", (req, res, next) => {
    const error = new Error("Este es un error de prueba");
    error.status = 500;

    next(error);
});

router.use("/pets", petRoutes);
router.use("/auth", authRoutes);

module.exports = router;