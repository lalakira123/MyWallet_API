import dayjs from 'dayjs';

import db from './../db.js';

export async function getMovements (req, res) {
    try {
        const {user} = res.locals;

        const movements = await db.collection('movements').find( { userId: user._id } ).toArray();
        movements.forEach((movement) => {
            delete movement.userId;
        })
        movements.reverse();

        delete user.password;
        delete user._id;
        
        res.send({...user, movements});
    } catch (error) {
        console.log(error);
    }
}

export async function postMovements (req, res) {
    const { movement, description, isPlus } = req.body;
    
    try{
        const { user } = res.locals;

        const date = dayjs().locale('pt-br').format('DD/MM');
        await db.collection('movements').insertOne({ 
            movement, 
            description, 
            isPlus,
            date,
            userId: user._id 
        });

        res.sendStatus(201);
    }catch(e){
        res.send('Não foi possível postar novo movimento')
    }
}

export async function deleteMovements (req, res) {
    try {
        const { existeTransacao } = res.locals;

        await db.collection('movements').deleteOne({ _id: existeTransacao._id });

        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(422);
    }
}

export async function updateMovements(req, res) {
    const { movement, description } = req.body;

    try {
        const { existeTransacao } = res.locals;

        await db.collection('movements').updateOne({
            _id: existeTransacao._id
        }, { $set: { movement, description } });

        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(422);
    }
}