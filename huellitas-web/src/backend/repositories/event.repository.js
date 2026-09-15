const prisma = require("../config/prisma");

async function getAllEvents({ skip, limit } = {}) {
    const [items, total] = await Promise.all([
        prisma.event.findMany({
            where: {
                isActive: true
            },
            orderBy: {
                startDate: "asc"
            },
            skip,
            take: limit
        }),
        prisma.event.count({ where: { isActive: true } })
    ]);

    return { items, total };
}

async function getEventById(id) {
    return prisma.event.findUnique({
        where: {
            id
        }
    });
}

async function createEvent(data) {
    return prisma.event.create({
        data
    });
}

async function updateEvent(id, data) {
    return prisma.event.update({
        where: {
            id
        },
        data
    });
}

async function deleteEvent(id) {
    return prisma.event.update({
        where: {
            id
        },
        data: {
            isActive: false
        }
    });
}

module.exports = {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
};
