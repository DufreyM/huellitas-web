const bcrypt = require("bcrypt");

const userRepository = require("../repositories/user.repository");
const ApiError = require("../utils/ApiError");

function sanitizeUser(user) {
    const { passwordHash, passwordResetTokenHash, passwordResetExpires, ...safeUser } = user;

    return safeUser;
}

async function listUsers() {
    const users = await userRepository.findAll();

    return users.map(sanitizeUser);
}

async function createUser({ name, email, phone, password, role }) {
    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
        throw new ApiError(409, "Ya existe un usuario con ese correo");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await userRepository.create({
        name,
        email,
        phone,
        passwordHash,
        role
    });

    return sanitizeUser(user);
}

module.exports = {
    listUsers,
    createUser
};
