import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRouter from './routers/authRouter.js';
import movementRouter from './routers/movementRouter.js';

//Express and Dependencies
const app = express();
app.use(cors());
app.use(json());
dotenv.config();

//Routers
app.use(authRouter);
app.use(movementRouter);

app.listen(process.env.PORTA, () => {
    console.log(`Server is running on ${process.env.PORTA}`)
});
