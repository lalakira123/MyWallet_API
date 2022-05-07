import postMovementsSchema from './../schemas/postMovementsSchema.js';

export async function postMovementsSchemaValidation(req, res, next) {
    const validation = postMovementsSchema.validate( req.body );
    if(validation.error) return res.sendStatus(422);

    next();
}