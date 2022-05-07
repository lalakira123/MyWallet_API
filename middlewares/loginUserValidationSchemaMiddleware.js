import loginUserSchema from './../schemas/loginUserSchema.js';

export async function loginUserSchemaValidation(req, res, next) {
    const validation = loginUserSchema.validate(req.body);
    if(validation.error) return res.sendStatus(422);

    next();
}