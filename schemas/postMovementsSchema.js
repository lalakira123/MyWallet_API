import Joi from 'joi';

const postMovementsSchema = Joi.object({
    movement: Joi.number().required(),
    description: Joi.string().trim().required(),
    isPlus: Joi.boolean()
})

export default postMovementsSchema;