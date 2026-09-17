const prisma = require("../config/prisma");

const withTimeSlots = {
    timeSlots: {
        include: {
            _count: {
                select: { registrations: true }
            }
        },
        orderBy: { startTime: "asc" }
    }
};

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
            take: limit,
            include: withTimeSlots
        }),
        prisma.event.count({ where: { isActive: true } })
    ]);

    return { items, total };
}

async function getEventById(id) {
    return prisma.event.findUnique({
        where: {
            id
        },
        include: withTimeSlots
    });
}

async function createEvent(data) {
    const { timeSlots, ...eventData } = data;

    return prisma.event.create({
        data: {
            ...eventData,
            timeSlots: timeSlots?.length ? { create: timeSlots } : undefined
        },
        include: withTimeSlots
    });
}

async function updateEvent(id, data) {
    const { timeSlots, ...eventData } = data;

    if (!timeSlots) {
        return prisma.event.update({
            where: { id },
            data: eventData,
            include: withTimeSlots
        });
    }

    // No se borran en bloque: un horario que ya tiene inscritos no se puede eliminar
    // (rompería sus inscripciones), así que solo se borran los que están vacíos y ya
    // no vienen en la lista nueva; el resto se actualiza in-place o se crea.
    const existingSlots = await prisma.eventTimeSlot.findMany({
        where: { eventId: id },
        include: { _count: { select: { registrations: true } } }
    });

    const incomingIds = new Set(timeSlots.filter(slot => slot.id).map(slot => slot.id));
    const slotsToDelete = existingSlots.filter(
        slot => !incomingIds.has(slot.id) && slot._count.registrations === 0
    );

    const [, updatedEvent] = await prisma.$transaction([
        prisma.eventTimeSlot.deleteMany({
            where: { id: { in: slotsToDelete.map(slot => slot.id) } }
        }),
        prisma.event.update({
            where: { id },
            data: {
                ...eventData,
                timeSlots: {
                    create: timeSlots.filter(slot => !slot.id).map(({ startTime, capacity }) => ({ startTime, capacity }))
                }
            },
            include: withTimeSlots
        }),
        ...timeSlots
            .filter(slot => slot.id)
            .map(slot =>
                prisma.eventTimeSlot.update({
                    where: { id: slot.id },
                    data: { startTime: slot.startTime, capacity: slot.capacity }
                })
            )
    ]);

    return prisma.event.findUnique({ where: { id }, include: withTimeSlots });
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
