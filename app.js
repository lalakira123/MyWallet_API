import express, { json } from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import Joi from 'joi';
import bcrypt from 'bcrypt';

const app = express();
app.use(cors());
app.use(json());
dotenv.config();

//MongoDB
let db;
const mongoClient = new MongoClient(process.env.MONGO_URL);
const database = process.env.BANCO_MONGO;

//Sign-Up
app.post('/sign-up', async (req, res) => {
    const { name, email, password, passwordConfirmation } = req.body;
    const newUserSchema = Joi.object({
        name: Joi.string().trim().required(),
        email: Joi.string().trim().email().required(),
        password: Joi.string().trim().required(),
        passwordConfirmation: Joi.string().required().valid(Joi.ref('password'))
    });

    try{
        await mongoClient.connect();
        db = mongoClient.db(database);

        await newUserSchema.validateAsync({ 
            name, 
            email, 
            password, 
            passwordConfirmation 
        },{ abortEarly: false });

        const existeUsuario = await db.collection('users').findOne( { email } );
        if(existeUsuario){
            res.sendStatus(409);
            mongoClient.close();
            return;
        }

        const passwordHash = bcrypt.hashSync( password, 10);

        await db.collection('users').insertOne( { name, email, password: passwordHash } )

        res.sendStatus(201);
        mongoClient.close();
    }catch(e){
        res.status(422).send(e.details.map(detail => detail.message));
        mongoClient.close();
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
        await mongoClient.connect();
        db = mongoClient.db(database);

        await schema.validateAsync({ email, password });

        const existeUsuario = await db.collection('users').findOne({ email });
        if(!existeUsuario){
            res.sendStatus(404);
            mongoClient.close();
            return;
        }

        const validacao = bcrypt.compareSync(password, existeUsuario.password);
        if(!validacao){
            res.status(409).send('Não deu match');
            mongoClient.close();
            return;
        }

        res.send(existeUsuario);
        mongoClient.close();
    }catch(e){
        res.status(422).send(e.details.map(detail => detail.message));
        mongoClient.close();
    }
});

app.listen(process.env.PORTA, () => {
    console.log(`Server is running on ${process.env.PORTA}`)
});
