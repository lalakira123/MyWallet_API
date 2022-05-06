import { Router } from 'express';

import { postMovements, getMovements, deleteMovements } from './../controllers/movementController.js';

const movementRouter = Router();

movementRouter.get('/movements', getMovements);
movementRouter.post('/movements', postMovements); 
movementRouter.delete('/movements/:id', deleteMovements);

export default movementRouter;