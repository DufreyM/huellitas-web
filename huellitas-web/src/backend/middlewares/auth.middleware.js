const jwt = require("jsonwebtoken");

const ApiError = require("../utils/ApiError");
const jwtConfig = require("../config/jwt");

function protect(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new ApiError(401, "No autorizado"));
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token, jwtConfig.secret);

        req.user = {
            id: payload.sub,
            role: payload.role
        };

        next();
    } catch (error) {
        next(new ApiError(401, "No autorizado"));
    }
}

function authorize(...allowedRoles) {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return next(new ApiError(403, "No tenés permisos para esta acción"));
        }

        next();
    };
}

module.exports = {
    protect,
    authorize
};
