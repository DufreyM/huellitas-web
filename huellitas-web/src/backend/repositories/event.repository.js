const prisma = require("../config/prisma");

async function getAllEvents() {
    return prisma.event.findMany({
        where: {
            isActive: true
        },
        orderBy: {
            startDate: "asc"
        }
    });
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
