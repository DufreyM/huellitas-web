const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userRepository = require("../repositories/user.repository");
const ApiError = require("../utils/ApiError");
const jwtConfig = require("../config/jwt");
const mailService = require("./mail.service");

const PASSWORD_RESET_EXPIRES_MINUTES = 60;

function hashResetToken(token) {
    return crypto.createHash("sha256").update(token).digest("hex");
}

function sanitizeUser(user) {
    const { passwordHash, passwordResetTokenHash, passwordResetExpires, ...safeUser } = user;

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

    const updatedUser = await userRepository.update(user.id, {
        lastLoginAt: new Date()
    });

    return {
        token,
        user: sanitizeUser(updatedUser)
    };
}

async function getMe(userId) {
    const user = await userRepository.findById(userId);

    if (!user || !user.isActive) {
        throw new ApiError(404, "Usuario no encontrado");
    }

    return sanitizeUser(user);
}

async function forgotPassword(email) {
    const user = await userRepository.findByEmail(email);
    const genericMessage = "Si el correo existe en el sistema, se envió un enlace de recuperación";

    if (!user || !user.isActive) {
        return { message: genericMessage };
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const passwordResetExpires = new Date(Date.now() + PASSWORD_RESET_EXPIRES_MINUTES * 60 * 1000);

    await userRepository.update(user.id, {
        passwordResetTokenHash: hashResetToken(resetToken),
        passwordResetExpires
    });

    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password?token=${resetToken}`;

    await mailService.sendPasswordResetEmail(user.email, resetUrl);

    return { message: genericMessage };
}

async function resetPassword(token, newPassword) {
    const tokenHash = hashResetToken(token);
    const user = await userRepository.findByResetTokenHash(tokenHash);

    if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
        throw new ApiError(400, "El enlace de recuperación es inválido o expiró");
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await userRepository.update(user.id, {
        passwordHash,
        passwordResetTokenHash: null,
        passwordResetExpires: null
    });
}

async function updateProfile(userId, { name, phone }) {
    const updatedUser = await userRepository.update(userId, { name, phone });

    return sanitizeUser(updatedUser);
}

async function changePassword(userId, currentPassword, newPassword) {
    const user = await userRepository.findById(userId);

    if (!user) {
        throw new ApiError(404, "Usuario no encontrado");
    }

    const passwordMatches = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!passwordMatches) {
        throw new ApiError(400, "La contraseña actual es incorrecta");
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await userRepository.update(userId, { passwordHash });
}

module.exports = {
    login,
    getMe,
    forgotPassword,
    resetPassword,
    updateProfile,
    changePassword
};
