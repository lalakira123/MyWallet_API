import Joi from 'joi';
import bcrypt from 'bcrypt';
import { v4 } from 'uuid';

import db from './../db.js';

export async function postUser(req, res) {
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
}

export async function loginUser (req, res) {
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
}