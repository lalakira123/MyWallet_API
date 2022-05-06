import { Router } from 'express';

import { postMovements, getMovements, deleteMovements, updateMovements } from './../controllers/movementController.js';

const movementRouter = Router();

movementRouter.get('/movements', getMovements);
movementRouter.post('/movements', postMovements); 
movementRouter.delete('/movements/:id', deleteMovements);
movementRouter.put('/movements/:id', updateMovements);

export default movementRouter;