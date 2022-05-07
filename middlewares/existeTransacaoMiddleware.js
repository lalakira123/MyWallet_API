import { ObjectId } from 'mongodb';
import db from './../db.js';

export async function existeTransacao( req, res, next) {
    const { id } = req.params;
    const existeTransacao = await db.collection('movements').findOne({ _id: new ObjectId(id) });
    if(!existeTransacao) return res.sendStatus(404);

    res.locals.existeTransacao = existeTransacao;

    next();
}