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
    ],
    mission: "Rescatar, rehabilitar y encontrar hogares amorosos para perros y gatos en situación de calle en Guatemala. Trabajamos incansablemente para darles una segunda oportunidad a los animales abandonados, brindándoles atención veterinaria, alimentación y amor mientras encuentran una familia permanente.",
    vision: "Soñamos con un Guatemala donde ningún animal esté en situación de calle, donde cada perro y gato tenga un hogar seguro y amoroso. Aspiramos a crear conciencia sobre la tenencia responsable de mascotas y reducir el abandono animal a través de la educación y programas de esterilización.",
    timeline: [
        { year: "2018", text: "Un pequeño grupo de amigos comenzó a alimentar a perros callejeros en su comunidad. Lo que inició como un acto de compasión se convirtió en una misión." },
        { year: "2020", text: "Fundación oficial de Huellitas de la Calle como organización sin fines de lucro. Rescatamos a nuestros primeros 50 perritos y los ubicamos en hogares temporales." },
        { year: "2022", text: "Lanzamos nuestro primer programa de jornadas de castración, esterilizando más de 200 mascotas en comunidades de bajos recursos." },
        { year: "2024", text: "Hemos facilitado más de 500 adopciones exitosas y realizamos jornadas mensuales de castración en todo Guatemala." }
    ],
    heroSlides: []
};

async function getSiteSettings() {
    const settings = await siteSettingRepository.get();

    return settings ?? DEFAULTS;
}

async function updateSiteSettings(data) {
    return siteSettingRepository.upsert(data);
}

module.exports = { getSiteSettings, updateSiteSettings };
