const { addMonths, monthsBetween } = require("./dateMath");

describe("dateMath — addMonths", () => {
    it("suma meses respetando el cambio de año", () => {
        expect(addMonths(new Date("2026-11-15"), 3)).toEqual(new Date("2027-02-15"));
    });
});

describe("dateMath — monthsBetween", () => {
    it("calcula meses completos entre dos fechas", () => {
        expect(monthsBetween(new Date("2026-01-10"), new Date("2026-07-10"))).toBe(6);
    });

    it("redondea hacia abajo cuando no se cumplió el mes completo", () => {
        expect(monthsBetween(new Date("2026-01-15"), new Date("2026-07-10"))).toBe(5);
    });

    it("calcula años completos como meses (edad de una mascota)", () => {
        expect(monthsBetween(new Date("2024-03-01"), new Date("2026-03-01"))).toBe(24);
    });
});
