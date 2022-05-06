import { Router } from 'express';

import { postMovements, getMovements } from './../controllers/movementController.js';

const movementRouter = Router();

movementRouter.get('/movements', getMovements);
movementRouter.post('/movements', postMovements); 

export default movementRouter;