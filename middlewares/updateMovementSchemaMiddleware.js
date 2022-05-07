import updateMovementSchema from './../schemas/updateMovementSchema.js';

export async function updateMovementSchemaValidation(req, res, next) {
    const validation = updateMovementSchema.validate( req.body );
    if(validation.error) return res.sendStatus(422);

    next();
}