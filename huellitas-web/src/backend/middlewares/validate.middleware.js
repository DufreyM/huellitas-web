const ApiError = require("../utils/ApiError");

function validate(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            return next(
                new ApiError(
                    400,
                    result.error.issues[0].message
                )
            );
        }

        // Reemplazamos el body por el body validado
        req.body = result.data;

        next();
    };
}

module.exports = validate;