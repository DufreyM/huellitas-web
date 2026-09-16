const eventRegistrationRepository = require("../repositories/eventRegistration.repository");
const mailService = require("./mail.service");
const ApiError = require("../utils/ApiError");
const { monthsBetween } = require("../utils/dateMath");

const MIN_AGE_MONTHS = 5;
const MAX_AGE_MONTHS = 6 * 12;
const MAX_DEWORMING_AGE_MONTHS = 5;
const MAX_VACCINATION_AGE_MONTHS = 12;

async function listRegistrations({ skip, limit, eventId, status } = {}) {
    return await eventRegistrationRepository.getAllRegistrations({ skip, limit, eventId, status });
}

async function getRegistrationById(id) {
    const registration = await eventRegistrationRepository.getRegistrationById(id);

    if (!registration) {
        throw new ApiError(404, "Inscripción no encontrada");
    }

    return registration;
}

function validateClinicalDates({ birthDate, lastDewormingDate, lastVaccinationDate }, referenceDate) {
    const ageMonths = monthsBetween(new Date(birthDate), referenceDate);

    if (ageMonths < MIN_AGE_MONTHS) {
        throw new ApiError(400, `La mascota es muy joven para esta jornada (edad mínima: ${MIN_AGE_MONTHS} meses)`);
    }

    if (ageMonths > MAX_AGE_MONTHS) {
        throw new ApiError(400, `La mascota supera la edad máxima para esta jornada (máximo: ${MAX_AGE_MONTHS / 12} años)`);
    }

    const dewormingAgeMonths = monthsBetween(new Date(lastDewormingDate), referenceDate);

    if (dewormingAgeMonths > MAX_DEWORMING_AGE_MONTHS) {
        throw new ApiError(400, `La desparasitación debe tener menos de ${MAX_DEWORMING_AGE_MONTHS} meses a la fecha de la jornada`);
    }

    const vaccinationAgeMonths = monthsBetween(new Date(lastVaccinationDate), referenceDate);

    if (vaccinationAgeMonths > MAX_VACCINATION_AGE_MONTHS) {
        throw new ApiError(400, `La vacunación debe tener menos de ${MAX_VACCINATION_AGE_MONTHS} meses a la fecha de la jornada`);
    }
}

async function createRegistration(data) {
    const event = await eventRegistrationRepository.findEventById(data.eventId);

    if (!event || !event.isActive) {
        throw new ApiError(404, "Evento no encontrado");
    }

    if (event.status === "Finalizado" || event.status === "Cancelado") {
        throw new ApiError(400, "Este evento ya no acepta inscripciones");
    }

    const timeSlot = event.timeSlots.find(slot => slot.id === data.timeSlotId);

    if (!timeSlot) {
        throw new ApiError(400, "El horario seleccionado no pertenece a esta jornada");
    }

    const timeSlotWithCount = await eventRegistrationRepository.findTimeSlotById(data.timeSlotId);

    if (timeSlotWithCount._count.registrations >= timeSlotWithCount.capacity) {
        throw new ApiError(400, "Ese horario ya no tiene cupo disponible");
    }

    validateClinicalDates(data, new Date(event.startDate));

    return await eventRegistrationRepository.createRegistration(data);
}

async function updatePatientRecord(id, data) {
    await getRegistrationById(id);

    return await eventRegistrationRepository.updateRegistration(id, data);
}

async function sendReminder(id, type) {
    const registration = await getRegistrationById(id);

    await mailService.sendCastrationReminder(registration.ownerEmail, type, {
        ownerName: registration.ownerName,
        petName: registration.petName,
        eventTitle: registration.event.title,
        eventDate: registration.event.startDate,
        eventLocation: registration.event.location,
        timeSlot: registration.timeSlot.startTime
    });

    return registration;
}

module.exports = {
    listRegistrations,
    getRegistrationById,
    createRegistration,
    updatePatientRecord,
    sendReminder
};
