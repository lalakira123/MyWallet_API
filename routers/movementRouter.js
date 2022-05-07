import { Router } from 'express';

import { postMovements, getMovements, deleteMovements, updateMovements } from './../controllers/movementController.js';
import { tokenValidation } from './../middlewares/tokenValidationMiddleware.js';
import { postMovementsSchemaValidation } from './../middlewares/postMovementSchemaValidationMiddleware.js';
import { updateMovementSchemaValidation } from './../middlewares/updateMovementSchemaMiddleware.js';
import { existeTransacao } from './../middlewares/existeTransacaoMiddleware.js';

const movementRouter = Router();

movementRouter.use(tokenValidation);

movementRouter.get('/movements', getMovements);
movementRouter.post('/movements', postMovementsSchemaValidation, postMovements); 
movementRouter.delete('/movements/:id', existeTransacao, deleteMovements);
movementRouter.put('/movements/:id', updateMovementSchemaValidation, existeTransacao, updateMovements);

export default movementRouter;