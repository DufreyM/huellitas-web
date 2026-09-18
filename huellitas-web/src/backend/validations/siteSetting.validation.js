const { z } = require("zod");

const timelineEntrySchema = z.object({
    year: z.string().min(1),
    text: z.string().min(1)
});

const heroSlideSchema = z.object({
    imageUrl: z.string().min(1),
    theme: z.string().min(1),
    headline: z.string().min(1),
    headlineLine2: z.string().min(1),
    focusPosition: z.enum(["center top", "center center", "center bottom"]).optional()
});

const faqEntrySchema = z.object({
    question: z.string().min(1),
    answer: z.string().min(1)
});

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
    neededSupplies: z.array(z.string().min(1)).min(1),
    mission: z.string().min(1),
    vision: z.string().min(1),
    timeline: z.array(timelineEntrySchema).min(1),
    heroSlides: z.array(heroSlideSchema),
    faqs: z.array(faqEntrySchema).min(1)
});

module.exports = { updateSiteSettingsSchema };
