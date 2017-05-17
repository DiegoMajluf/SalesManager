import * as mongo from 'mongodb'
import * as rx from 'rxjs'
export let db: mongo.Db
mongo.MongoClient.connect('mongodb://localhost:27017/salesmanager', (err, base) => {
    if (err) return console.log(err)
    console.log('Abierta conexión con db')
    db = base
});

export function GetCodigosPaises(): rx.Observable<{ [cod: string]: pais }> {
    return rx.Observable.fromPromise<pais[]>(db.collection('codigos_paises').find().toArray())
        .flatMap(x => x)
        .reduce((acc, x) => {
            acc[x.codigo] = x
            return acc
        }, <{ [cod: string]: pais }>{})
}
export interface etiquetas {
    nombre: string
    rut: string
    subetiquetas: string[]
    asignaciones: { [rut: string]: string }
}

export interface pais {
    codigo: string,
    pais: string
}