const prisma = require("../config/prisma");

async function get() {
    return prisma.siteSetting.findUnique({ where: { id: 1 } });
}

async function upsert(data) {
    return prisma.siteSetting.upsert({
        where: { id: 1 },
        create: { id: 1, ...data },
        update: data
    });
}

module.exports = { get, upsert };
