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
            contactEmail: "contacto@huellitas.org",
            whatsappNumber: "50212345678",
            bankName: "Banco Industrial",
            bankAccountType: "Cuenta Monetaria",
            bankAccountNumber: "123-456789-0",
            bankAccountHolder: "Asociación Huellitas de la Calle",
            donationDropoffAddress: "Zona 10, Ciudad de Guatemala",
            donationDropoffHours: "Lunes a sábado de 9:00 AM a 4:00 PM",
            neededSupplies: [
                "Concentrado para perros",
                "Concentrado para gatos",
                "Medicamentos",
                "Camas y Cobijas",
                "Correas",
                "Transportadoras",
                "Arena para gatos",
                "Productos de limpieza"
            ],
            mission: expect.any(String),
            vision: expect.any(String),
            timeline: expect.any(Array),
            heroSlides: []
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
