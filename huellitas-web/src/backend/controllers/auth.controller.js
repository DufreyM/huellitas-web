const authService = require("../services/auth.service");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Inicio de sesión exitoso",
            result
        )
    );
});

const me = asyncHandler(async (req, res) => {
    const user = await authService.getMe(req.user.id);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Usuario obtenido correctamente",
            user
        )
    );
});

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const result = await authService.forgotPassword(email);

    return res.status(200).json(
        new ApiResponse(
            200,
            result.message
        )
    );
});

const resetPassword = asyncHandler(async (req, res) => {
    const { token, password } = req.body;

    await authService.resetPassword(token, password);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Contraseña restablecida correctamente"
        )
    );
});

const updateMe = asyncHandler(async (req, res) => {
    const user = await authService.updateProfile(req.user.id, req.body);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Perfil actualizado correctamente",
            user
        )
    );
});

const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    await authService.changePassword(req.user.id, currentPassword, newPassword);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Contraseña actualizada correctamente"
        )
    );
});

module.exports = {
    login,
    me,
    forgotPassword,
    resetPassword,
    updateMe,
    changePassword
};
