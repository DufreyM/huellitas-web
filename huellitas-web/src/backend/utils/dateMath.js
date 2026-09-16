// Estas fechas son "solo calendario" (@db.Date) y llegan como medianoche UTC:
// hay que operar con los getters/setters UTC*, si no la hora local del server
// puede correr el día y desajustar el cálculo de meses en 1.
function addMonths(date, months) {
    const result = new Date(date);
    result.setUTCMonth(result.getUTCMonth() + months);
    return result;
}

// Diferencia en meses completos entre dos fechas (redondeando hacia abajo),
// usada para validar edades y vigencias contra la fecha de la jornada.
function monthsBetween(from, to) {
    let months = (to.getUTCFullYear() - from.getUTCFullYear()) * 12 + (to.getUTCMonth() - from.getUTCMonth());

    if (to.getUTCDate() < from.getUTCDate()) {
        months -= 1;
    }

    return months;
}

module.exports = { addMonths, monthsBetween };
