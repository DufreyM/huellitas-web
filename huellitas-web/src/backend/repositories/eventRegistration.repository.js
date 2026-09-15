const prisma = require("../config/prisma");

async function getAllRegistrations({ skip, limit } = {}) {
    const [items, total] = await Promise.all([
        prisma.eventRegistration.findMany({
            include: {
                event: true
            },
            orderBy: {
                createdAt: "desc"
            },
            skip,
            take: limit
        }),
        prisma.eventRegistration.count()
    ]);

    return { items, total };
}

async function findEventById(eventId) {
    return prisma.event.findUnique({
        where: {
            id: eventId
        }
    });
}

async function createRegistration(data) {
    return prisma.eventRegistration.create({
        data,
        include: {
            event: true
        }
    });
}

module.exports = {
    getAllRegistrations,
    findEventById,
    createRegistration
};
