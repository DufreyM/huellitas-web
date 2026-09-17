const { z } = require("zod");

const updateSiteSettingsSchema = z.object({
    instagramHandle: z.string().min(1),
    contactEmail: z.string().email(),
    whatsappNumber: z.string().min(1),
    bankName: z.string().min(1),
    bankAccountType: z.string().min(1),
    bankAccountNumber: z.string().min(1),
    bankAccountHolder: z.string().min(1),
    donationDropoffAddress: z.string().min(1),
    donationDropoffHours: z.string().min(1),
    neededSupplies: z.array(z.string().min(1)).min(1)
});

module.exports = { updateSiteSettingsSchema };
