import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { postUser, loginUser } from './controllers/authController.js';
import { postMovements, getMovements } from './controllers/movementController.js';

//Express and Dependencies
const app = express();
app.use(cors());
app.use(json());
dotenv.config();

//Sign-Up
app.post('/sign-up', postUser);

//Sign-In
app.post('/sign-in', loginUser);

//Movements
app.get('/movements', getMovements);
app.post('/movements', postMovements); 

app.listen(process.env.PORTA, () => {
    console.log(`Server is running on ${process.env.PORTA}`)
});
