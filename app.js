import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import { v4 } from 'uuid';
import dayjs from 'dayjs';

import db from './db.js';

//Express and Dependencies
const app = express();
app.use(cors());
app.use(json());
dotenv.config();

//Sign-Up
app.post('/sign-up', async (req, res) => {
    const { name, email, password, passwordConfirmation } = req.body;
    const newUserSchema = Joi.object({
        name: Joi.string().trim().required(),
        email: Joi.string().trim().email().required(),
        password: Joi.string().trim().required(),
        passwordConfirmation: Joi.string().required().valid(Joi.ref('password'))
    });

    const validation = newUserSchema.validate({ 
        name, 
        email, 
        password, 
        passwordConfirmation 
    });
    if(validation.error) return res.sendStatus(422);

    try {
        const existeUsuario = await db.collection('users').findOne( { email } );
        if(existeUsuario) return res.sendStatus(409);

        const passwordHash = bcrypt.hashSync( password, 10);

        await db.collection('users').insertOne( { name, email, password: passwordHash } )

        res.sendStatus(201);    
    } catch (error) {
       res.send(error); 
    }
});

//Sign-In
app.post('/sign-in', async (req, res) => {
    const { email, password } = req.body;
    const schema = Joi.object({
        email: Joi.string().trim().required(),
        password: Joi.string().trim().required()
    });    

    try{
        await schema.validateAsync({ email, password });

        const existeUsuario = await db.collection('users').findOne({ email });
        if(!existeUsuario) return res.sendStatus(404);

        const validacao = bcrypt.compareSync(password, existeUsuario.password);
        if(!validacao) return res.status(401).send('Senha Inválida');

        const token = v4();

        await db.collection('sessions').insertOne({ token, userId: existeUsuario._id });

        res.send(token);
    }catch(e){
        res.status(422).send(e.details.map(detail => detail.message));
    }
});

//Movements
app.get('/movements', async (req, res) => {
    const { authorization } = req.headers;

    try {
        const token = authorization?.replace('Bearer', '').trim();
        if(!token) return res.sendStatus(401);

        const session = await db.collection('sessions').findOne( {token} );
        if( !session ) return res.status(401).send('Usuário não existe');

        const user = await db.collection('users').findOne({ _id: session.userId });

        delete user.password;
        delete user._id;

        const movements = await db.collection('movements').find( { userId: session.userId } ).toArray();
        movements.forEach((movement) => {
            delete movement.userId;
            delete movement._id;
        })
        movements.reverse();
        
        res.send({...user, movements});
    } catch (error) {
        console.log(error);
    }
});

app.post('/movements', async (req, res) => {
    const { movement, description, isPlus } = req.body;
    const { authorization } = req.headers;

    const schema = Joi.object({
        movement: Joi.number().required(),
        description: Joi.string().trim().required(),
        isPlus: Joi.boolean()
    })
    const validation = schema.validate({ movement, description, isPlus });
    if(validation.error) return res.sendStatus(422);
    
    try{
        const token = authorization?.replace('Bearer', '').trim();
        if(!token) return res.sendStatus(401);

        const session = await db.collection('sessions').findOne({ token });
        if(!session) return res.sendStatus(401);

        const date = dayjs().locale('pt-br').format('DD/MM');
        await db.collection('movements').insertOne({ 
            movement, 
            description, 
            isPlus,
            date,
            userId: session.userId 
        });

        res.sendStatus(201);
    }catch(e){
        res.send('Não foi possível postar novo movimento')
    }
}); 

app.listen(process.env.PORTA, () => {
    console.log(`Server is running on ${process.env.PORTA}`)
});
