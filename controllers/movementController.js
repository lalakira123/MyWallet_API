import Joi from 'joi';
import dayjs from 'dayjs';
import { ObjectId } from 'mongodb';

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

export async function deleteMovements (req, res) {
    const { id } = req.params;
    const { authorization } = req.headers;

    try {
        const token = authorization?.replace('Bearer', '').trim();
        if(!token) return res.sendStatus(401);

        const session = await db.collection('sessions').findOne({ token });
        if(!session) return res.sendStatus(401);

        const existeTransacao = await db.collection('movements').findOne({ _id: new ObjectId(id) });
        if(!session) return res.sendStatus(404);

        await db.collection('movements').deleteOne({ _id: existeTransacao._id });

        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(422);
    }
}

export async function updateMovements(req, res) {
    const { id } = req.params;
    const { authorization } = req.headers;
    const { movement, description } = req.body;

    const schema = Joi.object({
        movement: Joi.number().required(),
        description: Joi.string().trim().required()
    })
    const validation = schema.validate({ movement, description });
    if(validation.error) return res.sendStatus(422);

    try {
        const token = authorization?.replace('Bearer', '').trim();
        if(!token) return res.sendStatus(401);

        const session = await db.collection('sessions').findOne({ token });
        if(!session) return res.sendStatus(401);

        const existeTransacao = await db.collection('movements').findOne({ _id: new ObjectId(id) });
        if(!existeTransacao) return res.sendStatus(404);

        await db.collection('movements').updateOne({
            _id: existeTransacao._id
        }, { $set: { movement, description } });

        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(422);
    }
}