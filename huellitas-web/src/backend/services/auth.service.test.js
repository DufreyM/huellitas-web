jest.mock("../repositories/user.repository");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/user.repository");
const authService = require("./auth.service");

const baseUser = {
    id: 1,
    email: "admin@huellitas.org",
    passwordHash: "hashed",
    role: "Superadministrador",
    isActive: true
};

describe("auth.service — login", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("genera un token cuando las credenciales son válidas", async () => {
        userRepository.findByEmail.mockResolvedValue(baseUser);
        userRepository.update.mockResolvedValue(baseUser);
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue("fake.jwt.token");

        const result = await authService.login("admin@huellitas.org", "correcta");

        expect(jwt.sign).toHaveBeenCalledWith(
            { sub: baseUser.id, role: baseUser.role },
            expect.anything(),
            expect.anything()
        );
        expect(result.token).toBe("fake.jwt.token");
        expect(result.user.passwordHash).toBeUndefined();
    });

    it("rechaza con error controlado si la contraseña es incorrecta", async () => {
        userRepository.findByEmail.mockResolvedValue(baseUser);
        bcrypt.compare.mockResolvedValue(false);

        await expect(authService.login("admin@huellitas.org", "incorrecta")).rejects.toMatchObject({
            statusCode: 401,
            message: "Credenciales inválidas"
        });
    });

    it("rechaza con el mismo mensaje si el correo no existe (no revela si el usuario existe)", async () => {
        userRepository.findByEmail.mockResolvedValue(null);

        await expect(authService.login("noexiste@huellitas.org", "cualquiera")).rejects.toMatchObject({
            statusCode: 401,
            message: "Credenciales inválidas"
        });
        expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it("rechaza si el usuario existe pero está inactivo", async () => {
        userRepository.findByEmail.mockResolvedValue({ ...baseUser, isActive: false });

        await expect(authService.login("admin@huellitas.org", "correcta")).rejects.toMatchObject({
            statusCode: 401
        });
    });
});

describe("auth.service — changePassword", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("actualiza la contraseña cuando la actual es correcta", async () => {
        userRepository.findById.mockResolvedValue(baseUser);
        bcrypt.compare.mockResolvedValue(true);
        bcrypt.hash.mockResolvedValue("nuevo-hash");

        await authService.changePassword(1, "actual", "nueva12345");

        expect(userRepository.update).toHaveBeenCalledWith(1, { passwordHash: "nuevo-hash" });
    });

    it("rechaza si la contraseña actual es incorrecta", async () => {
        userRepository.findById.mockResolvedValue(baseUser);
        bcrypt.compare.mockResolvedValue(false);

        await expect(authService.changePassword(1, "mala", "nueva12345")).rejects.toMatchObject({ statusCode: 400 });
        expect(userRepository.update).not.toHaveBeenCalled();
    });
});
