import bcrypt from 'bcrypt';
import { v4 } from 'uuid';

import db from './../db.js';

export async function postUser(req, res) {
    const { name, email, password } = req.body;

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

    try{
        const existeUsuario = await db.collection('users').findOne({ email });
        if(!existeUsuario) return res.sendStatus(404);

        const validacao = bcrypt.compareSync(password, existeUsuario.password);
        if(!validacao) return res.status(401).send('Senha Inválida');

        const token = v4();

        await db.collection('sessions').insertOne({ token, userId: existeUsuario._id });

        res.send(token);
    }catch(e){
        res.send(e);
    }
}