import postUserSchema from "./../schemas/postUserSchema.js";

export async function postUserSchemaValidation(req, res, next) {
    const validation = postUserSchema.validate(req.body);
    if(validation.error) return res.sendStatus(422);

    next();
}