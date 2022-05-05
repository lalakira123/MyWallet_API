import Joi from 'joi';
import dayjs from 'dayjs';

import db from './../db.js';

export async function getMovements (req, res) {
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
}

export async function postMovements (req, res) {
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
}