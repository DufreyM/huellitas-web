const siteSettingRepository = require("../repositories/siteSetting.repository");

const DEFAULTS = {
    instagramHandle: "@huellitasdelacalleong",
    contactEmail: "contacto@huellitas.org"
};

async function getSiteSettings() {
    const settings = await siteSettingRepository.get();

    return settings ?? DEFAULTS;
}

async function updateSiteSettings(data) {
    return siteSettingRepository.upsert(data);
}

module.exports = { getSiteSettings, updateSiteSettings };
