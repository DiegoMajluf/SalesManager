import * as mongo from 'mongodb'
export let db: mongo.Db
mongo.MongoClient.connect('mongodb://localhost:27017/salesmanager', (err, base) => {
    console.log('Abierta conexión con db')
    db = base} );
