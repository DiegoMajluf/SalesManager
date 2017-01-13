import * as mongo from 'mongodb'
export let db: mongo.Db
mongo.MongoClient.connect('mongodb://localhost:27017/salesmanager', (err, base) => {
    if(err) return console.log(err)
    console.log('Abierta conexión con db')
    db = base
    console.log(db.collection.length)
});


export interface etiquetas {
    nombre: string
    rut: string
    subetiquetas: string[]
    asignaciones: {[rut: string]: string}
}