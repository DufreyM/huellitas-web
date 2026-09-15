const { parsePagination, buildPaginatedResult } = require("./pagination");

describe("pagination — parsePagination", () => {
    it("usa page=1 y el límite por defecto cuando no se envía nada", () => {
        expect(parsePagination({})).toEqual({ page: 1, limit: 20, skip: 0 });
    });

    it("calcula skip a partir de page y limit", () => {
        expect(parsePagination({ page: "3", limit: "10" })).toEqual({ page: 3, limit: 10, skip: 20 });
    });

    it("usa el valor por defecto cuando page no es numérico", () => {
        expect(parsePagination({ page: "abc" }).page).toBe(1);
    });

    it("no permite un limit menor a 1", () => {
        expect(parsePagination({ limit: "-5" }).limit).toBe(1);
    });

    it("no permite page menor a 1", () => {
        expect(parsePagination({ page: "0" }).page).toBe(1);
    });

    it("limita el máximo de resultados por página", () => {
        expect(parsePagination({ limit: "9999" }).limit).toBe(100);
    });
});

describe("pagination — buildPaginatedResult", () => {
    it("arma el envelope con los metadatos de paginación", () => {
        const result = buildPaginatedResult(["a", "b"], 42, 2, 10);

        expect(result).toEqual({
            items: ["a", "b"],
            pagination: { page: 2, limit: 10, total: 42, totalPages: 5 }
        });
    });

    it("devuelve al menos 1 página cuando no hay resultados", () => {
        const result = buildPaginatedResult([], 0, 1, 20);

        expect(result.pagination.totalPages).toBe(1);
    });
});
