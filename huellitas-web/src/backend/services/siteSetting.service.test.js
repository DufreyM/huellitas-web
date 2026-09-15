jest.mock("../repositories/siteSetting.repository");

const siteSettingRepository = require("../repositories/siteSetting.repository");
const siteSettingService = require("./siteSetting.service");

describe("siteSetting.service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("devuelve valores por defecto si todavía no existe una fila guardada", async () => {
        siteSettingRepository.get.mockResolvedValue(null);

        const settings = await siteSettingService.getSiteSettings();

        expect(settings).toEqual({
            instagramHandle: "@huellitasdelacalleong",
            contactEmail: "contacto@huellitas.org"
        });
    });

    it("devuelve la fila guardada cuando existe", async () => {
        siteSettingRepository.get.mockResolvedValue({ id: 1, instagramHandle: "@otra", contactEmail: "otro@huellitas.org" });

        const settings = await siteSettingService.getSiteSettings();

        expect(settings.instagramHandle).toBe("@otra");
    });

    it("guarda los cambios mediante upsert", async () => {
        siteSettingRepository.upsert.mockResolvedValue({ id: 1, instagramHandle: "@nuevo", contactEmail: "nuevo@huellitas.org" });

        const result = await siteSettingService.updateSiteSettings({ instagramHandle: "@nuevo", contactEmail: "nuevo@huellitas.org" });

        expect(siteSettingRepository.upsert).toHaveBeenCalledWith({ instagramHandle: "@nuevo", contactEmail: "nuevo@huellitas.org" });
        expect(result.instagramHandle).toBe("@nuevo");
    });
});
