const { z } = require("zod");

const updateSiteSettingsSchema = z.object({
    instagramHandle: z.string().min(1),
    contactEmail: z.string().email()
});

module.exports = { updateSiteSettingsSchema };
