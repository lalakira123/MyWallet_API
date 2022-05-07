import Joi from 'joi';

const postUserSchema = Joi.object({
    name: Joi.string().trim().required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().required(),
    passwordConfirmation: Joi.string().required().valid(Joi.ref('password'))
});

export default postUserSchema;