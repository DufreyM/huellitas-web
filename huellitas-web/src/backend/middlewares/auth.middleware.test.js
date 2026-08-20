jest.mock("jsonwebtoken");

const jwt = require("jsonwebtoken");
const { protect, authorize } = require("./auth.middleware");

function mockReqRes(authHeader) {
    const req = { headers: { authorization: authHeader }, user: undefined };
    const res = {};
    const next = jest.fn();

    return { req, res, next };
}

describe("auth.middleware — protect", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("rechaza la solicitud si no hay header de autorización", () => {
        const { req, res, next } = mockReqRes(undefined);

        protect(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
    });

    it("rechaza la solicitud si el header no tiene formato Bearer", () => {
        const { req, res, next } = mockReqRes("Token abc123");

        protect(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
    });

    it("rechaza un token inválido o expirado", () => {
        jwt.verify.mockImplementation(() => {
            throw new Error("jwt expired");
        });
        const { req, res, next } = mockReqRes("Bearer un-token-vencido");

        protect(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
    });

    it("adjunta req.user y continúa si el token es válido", () => {
        jwt.verify.mockReturnValue({ sub: 7, role: "Voluntario" });
        const { req, res, next } = mockReqRes("Bearer un-token-valido");

        protect(req, res, next);

        expect(req.user).toEqual({ id: 7, role: "Voluntario" });
        expect(next).toHaveBeenCalledWith();
    });
});

describe("auth.middleware — authorize", () => {
    it("rechaza con 403 si el rol del usuario no está permitido", () => {
        const req = { user: { id: 1, role: "Voluntario" } };
        const next = jest.fn();

        authorize("Superadministrador", "Operador")(req, {}, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 403 }));
    });

    it("continúa si el rol del usuario está permitido", () => {
        const req = { user: { id: 1, role: "Operador" } };
        const next = jest.fn();

        authorize("Superadministrador", "Operador")(req, {}, next);

        expect(next).toHaveBeenCalledWith();
    });
});
