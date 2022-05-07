import { Router } from 'express';

import { postUser, loginUser } from './../controllers/authController.js';
import { postUserSchemaValidation } from './../middlewares/postUserValidationSchemaMiddleware.js';
import { loginUserSchemaValidation } from './../middlewares/loginUserValidationSchemaMiddleware.js';

const authRouter = Router();

authRouter.post('/sign-up', postUserSchemaValidation, postUser);
authRouter.post('/sign-in', loginUserSchemaValidation, loginUser);

export default authRouter;