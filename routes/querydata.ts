import * as express from 'express';
import * as DTE from '../cliente/dtes';
import { db } from '../commons/mongo';
import { Observable, Subscriber } from 'rxjs/Rx';
import { FindAndModifyWriteOpResultObject } from 'mongodb'
import { dteService, Periodo, tipoPeriodos } from '../commons/dte-service'


export let router = express.Router();
let rut: string = '76398667-5'

router.get('/getfoliosyaingresadosde/:tipo/enrango/:ini-:fin', (req, res, next) => {
    let query = { $and: [{}, {}, {}, {}] }

    let NombreDoc = dteService.getNombreDocumento(req.params.tipo);

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

router.get('/getventas/:periodo/entre/:desde/:hasta', (req, res, next) => {
    let query = { $or: [{}, {}, {}] }

    let fec = { $gte: new Date(req.params.desde), $lte: new Date(req.params.hasta) }

    query.$or[0][`Documento.Encabezado.IdDoc.FchEmis`] = fec
    query.$or[1][`Exportaciones.Encabezado.IdDoc.FchEmis`] = fec
    query.$or[2][`Liquidaciones.Encabezado.IdDoc.FchEmis`] = fec

    let p = tipoPeriodos[<string>req.params.periodo]
    let gruPe: { periodo: Periodo, dtes: DTE.DTE[] }[];
    Observable.from(<Promise<DTE.DTE[]>>db.collection('dtes').find(query).toArray()).subscribe(
        dtes => gruPe = Periodo.asignarDTEaPeriodos(p, fec.$gte, fec.$lte, dtes),
        err => res.send(500).send(err),
        () => res.send(Periodo.resumenVentasPorPeriodos(gruPe))
    )

})

router.get('/getventasporcliente/:rut/:periodo/entre/:desde-:hasta', (req, res, next) => {


})

router.get('/gettop/:num/clientes/:periodo/entre/:desde-:hasta', (req, res, next) => {


})

router.get('/getventasporetiquetacliente/:nombre/:periodo/entre/:desde-:hasta', (req, res, next) => {


})

router.get('/getventasporetiquetaitem/:nombre/:periodo/entre/:desde-:hasta', (req, res, next) => {


})

router.get('/getventasporetiquetaitem/:nombre/:periodo/entre/:desde-:hasta', (req, res, next) => {


})

router.get('/getventasporubicacion/:nombre/:periodo/entre/:desde-:hasta', (req, res, next) => {


})

router.get('/getventasporubicacion/:nombre/:periodo/entre/:desde-:hasta', (req, res, next) => {


})