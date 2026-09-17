const siteSettingRepository = require("../repositories/siteSetting.repository");

const DEFAULTS = {
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
    ]
};

async function getSiteSettings() {
    const settings = await siteSettingRepository.get();

    return settings ?? DEFAULTS;
}

async function updateSiteSettings(data) {
    return siteSettingRepository.upsert(data);
}

module.exports = { getSiteSettings, updateSiteSettings };
