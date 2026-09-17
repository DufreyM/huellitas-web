jest.mock("../repositories/stats.repository");

const statsRepository = require("../repositories/stats.repository");
const statsService = require("./stats.service");

describe("stats.service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("combina los conteos de rescatados, adoptados y castrados", async () => {
        statsRepository.countPets.mockResolvedValue(120);
        statsRepository.countPetsByStatus.mockResolvedValue(45);
        statsRepository.countRegistrationsByStatus.mockResolvedValue(80);

        const stats = await statsService.getImpactStats();

        expect(stats).toEqual({ rescatados: 120, adoptados: 45, castrados: 80 });
        expect(statsRepository.countPetsByStatus).toHaveBeenCalledWith("Adoptada");
        expect(statsRepository.countRegistrationsByStatus).toHaveBeenCalledWith(
            expect.arrayContaining(["Castrado", "En_seguimiento", "Seguimiento_finalizado"])
        );
    });
});
