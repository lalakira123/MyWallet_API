import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const database = process.env.BANCO_MONGO;

let db;
const mongoClient = new MongoClient(process.env.MONGO_URI);

try {
    await mongoClient.connect(); 
    db = mongoClient.db(database);
    console.log('Conexão com o Banco Mongo estabelecida!');  
} catch (error) {
    console.log('Erro ao conectar com o Banco Mongo!');
} 

export default db;