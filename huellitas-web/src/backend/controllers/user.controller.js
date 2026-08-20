const userService = require("../services/user.service");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await userService.listUsers();

    return res.status(200).json(
        new ApiResponse(
            200,
            "Usuarios obtenidos correctamente",
            users
        )
    );
});

const createUser = asyncHandler(async (req, res) => {
    const user = await userService.createUser(req.body);

    return res.status(201).json(
        new ApiResponse(
            201,
            "Usuario creado correctamente",
            user
        )
    );
});

module.exports = {
    getAllUsers,
    createUser
};
