import { Router } from 'express';

import { postUser, loginUser } from './../controllers/authController.js';

const authRouter = Router();

authRouter.post('/sign-up', postUser);
authRouter.post('/sign-in', loginUser);

export default authRouter;