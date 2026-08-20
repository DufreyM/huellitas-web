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
