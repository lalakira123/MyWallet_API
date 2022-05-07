import Joi from 'joi';

const loginUserSchema = Joi.object({
    email: Joi.string().trim().required(),
    password: Joi.string().trim().required()
});

export default loginUserSchema;