import * as express from 'express';
import * as DTE from '../cliente/dtes';
import { db } from '../commons/mongo';
import { Observable, Subscriber } from 'rxjs/Rx';
import { FindAndModifyWriteOpResultObject } from 'mongodb'


export let router = express.Router();

let getNombreDocumento = (tipo: string): string => {

    for (let member in DTE.DTEType)
        if (member == tipo) return "Documento";

    for (let member in DTE.EXPType)
        if (member == tipo) return "Exportacion";

    for (let member in DTE.LIQType)
        if (member == tipo) return "Liquidacion";

}



router.get('/getfoliosyaingresadosde/:tipo/enrango/:ini-:fin', (req, res, next) => {
    let query = { $and: [{}, {}, {}, {}] }

    let NombreDoc = getNombreDocumento(req.params.tipo);
    let rut: string = '76398667-5'

    query.$and[0][`${NombreDoc}.Encabezado.Emisor.RUTEmisor`] = rut
    query.$and[1][`${NombreDoc}.Encabezado.IdDoc.TipoDTE`] = parseInt(req.params.tipo)
    query.$and[2][`${NombreDoc}.Encabezado.IdDoc.Folio`] = { $gte: parseInt(req.params.ini) };
    query.$and[3][`${NombreDoc}.Encabezado.IdDoc.Folio`] = { $lte: parseInt(req.params.fin) };

    Observable.fromPromise(<Promise<DTE.DTE[]>>db.collection('dtes').find(query, { Signature: 0 }).toArray()).subscribe(
        dtes => {
            let resp = {}
            resp[req.params.tipo] = []
            res.send(dtes.reduce((acc, va) => {
                let doc = va.Documento || va.Exportaciones || va.Liquidacion
                if (!acc[doc.Encabezado.IdDoc.TipoDTE]) acc[doc.Encabezado.IdDoc.TipoDTE] = [];
                acc[doc.Encabezado.IdDoc.TipoDTE].push(doc.Encabezado.IdDoc.Folio)
                return acc
            }, resp))
        },
        err => res.send(err))

})

router.get('/getventas/:tiempo/entre/:desde-:hasta', (req, res, next) => {


})

router.get('/getventasporcliente/:rut/:tiempo/entre/:desde-:hasta', (req, res, next) => {


})

router.get('/gettop/:num/clientes/:tiempo/entre/:desde-:hasta', (req, res, next) => {


})

router.get('/getventasporetiquetacliente/:nombre/:tiempo/entre/:desde-:hasta', (req, res, next) => {


})

router.get('/getventasporetiquetaitem/:nombre/:tiempo/entre/:desde-:hasta', (req, res, next) => {


})

router.get('/getventasporetiquetaitem/:nombre/:tiempo/entre/:desde-:hasta', (req, res, next) => {


})

router.get('/getventasporubicacion/:nombre/:tiempo/entre/:desde-:hasta', (req, res, next) => {


})

router.get('/getventasporubicacion/:nombre/:tiempo/entre/:desde-:hasta', (req, res, next) => {


})