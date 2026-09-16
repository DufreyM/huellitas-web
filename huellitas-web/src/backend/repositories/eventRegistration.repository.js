const prisma = require("../config/prisma");

async function getAllRegistrations({ skip, limit, eventId, status } = {}) {
    const where = {
        ...(eventId && { eventId }),
        ...(status && { status })
    };

    const [items, total] = await Promise.all([
        prisma.eventRegistration.findMany({
            where,
            include: {
                event: true,
                timeSlot: true
            },
            orderBy: {
                createdAt: "desc"
            },
            skip,
            take: limit
        }),
        prisma.eventRegistration.count({ where })
    ]);

    return { items, total };
}

async function getRegistrationById(id) {
    return prisma.eventRegistration.findUnique({
        where: { id },
        include: {
            event: true,
            timeSlot: true
        }
    });
}

async function findEventById(eventId) {
    return prisma.event.findUnique({
        where: {
            id: eventId
        },
        include: {
            timeSlots: true
        }
    });
}

async function findTimeSlotById(timeSlotId) {
    return prisma.eventTimeSlot.findUnique({
        where: { id: timeSlotId },
        include: {
            _count: {
                select: { registrations: true }
            }
        }
    });
}

async function createRegistration(data) {
    return prisma.eventRegistration.create({
        data,
        include: {
            event: true,
            timeSlot: true
        }
    });
}

async function updateRegistration(id, data) {
    return prisma.eventRegistration.update({
        where: { id },
        data,
        include: {
            event: true,
            timeSlot: true
        }
    });
}

// Resumen por jornada: cuántos inscritos hay en cada estado, para el dashboard.
async function getStatusSummary(eventId) {
    const counts = await prisma.eventRegistration.groupBy({
        by: ["status"],
        where: { eventId },
        _count: true
    });

    return counts.reduce((summary, row) => ({ ...summary, [row.status]: row._count }), {});
}

module.exports = {
    getAllRegistrations,
    getRegistrationById,
    findEventById,
    findTimeSlotById,
    createRegistration,
    updateRegistration,
    getStatusSummary
};
