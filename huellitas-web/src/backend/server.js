require("dotenv").config();

const app = require("./app");

const PORT_BK = process.env.PORT_BK || 3001;

app.listen(PORT_BK, () => {
    console.log(`🚀 Servidor ejecutándose en el puerto ${PORT_BK}`);
});