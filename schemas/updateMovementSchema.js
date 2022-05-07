import Joi from 'joi';

const updateMovementschema = Joi.object({
    movement: Joi.number().required(),
    description: Joi.string().trim().required()
})

export default updateMovementschema;