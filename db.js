import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const database = process.env.BANCO_MONGO;

try {
    let db;
    const mongoClient = new MongoClient(process.env.MONGO_URI);
    await mongoClient.connect();
    db = mongoClient.db(database); 
    console.log('Foi possível se conectar ao Banco de Dados!');  
} catch (error) {
    console.log('Não foi possível se conectar ao Banco de Dados!');
}

export default db;