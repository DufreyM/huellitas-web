const prisma = require("../config/prisma");

async function getAllRegistrations() {
    return prisma.eventRegistration.findMany({
        include: {
            event: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });
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
