const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRepository = require("../repositories/user.repository");
const ApiError = require("../utils/ApiError");
const jwtConfig = require("../config/jwt");

function sanitizeUser(user) {
    const { passwordHash, ...safeUser } = user;

    return safeUser;
}

async function login(email, password) {
    const user = await userRepository.findByEmail(email);

    if (!user || !user.isActive) {
        throw new ApiError(401, "Credenciales inválidas");
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
        throw new ApiError(401, "Credenciales inválidas");
    }

    const token = jwt.sign(
        {
            sub: user.id,
            role: user.role
        },
        jwtConfig.secret,
        {
            expiresIn: jwtConfig.expiresIn
        }
    );

    return {
        token,
        user: sanitizeUser(user)
    };
}

async function getMe(userId) {
    const user = await userRepository.findById(userId);

    if (!user || !user.isActive) {
        throw new ApiError(404, "Usuario no encontrado");
    }

    return sanitizeUser(user);
}

module.exports = {
    login,
    getMe
};
