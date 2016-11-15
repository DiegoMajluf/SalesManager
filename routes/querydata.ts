import * as express from 'express';
import { dte, periodos, DteService, responses } from 'sii-dtes'
import * as queryService from '../commons/query-service'
import { db } from '../commons/mongo';
import { Observable, Subscriber } from 'rxjs/Rx';
import { FindAndModifyWriteOpResultObject } from 'mongodb'


export let router = express.Router();
let rut: string = '76398667-5';
router.get('/getfoliosyaingresadosde/:tipo/enrango/:ini-:fin', (req, res, next) => {
    let query = { $and: [{}, {}, {}, {}] }

    let NombreDoc = DteService.getNombreDocumento(req.params.tipo);

    query.$and[0][`${NombreDoc}.Encabezado.Emisor.RUTEmisor`] = rut
    query.$and[1][`${NombreDoc}.Encabezado.IdDoc.TipoDTE`] = parseInt(req.params.tipo)
    query.$and[2][`${NombreDoc}.Encabezado.IdDoc.Folio`] = { $gte: parseInt(req.params.ini) };
    query.$and[3][`${NombreDoc}.Encabezado.IdDoc.Folio`] = { $lte: parseInt(req.params.fin) };

    Observable.fromPromise(<Promise<dte.DTE[]>>db.collection('dtes').find(query, { Signature: 0 }).toArray()).subscribe(
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
        err => res.status(500).send(err))

})

router.get('/getventas/:periodo/entre/:desde/:hasta', (req, res, next) => {
    let query = { $or: [{}, {}, {}] }

    let fec = { $gte: new Date(req.params.desde), $lte: new Date(req.params.hasta) }

    query.$or[0][`Documento.Encabezado.IdDoc.FchEmis`] = fec
    query.$or[1][`Exportaciones.Encabezado.IdDoc.FchEmis`] = fec
    query.$or[2][`Liquidaciones.Encabezado.IdDoc.FchEmis`] = fec

    let p = periodos.TipoPeriodos[<string>req.params.periodo]
    let gruPe: { periodo: periodos.Periodo, dtes: dte.DTE[] }[];
    Observable.from(<Promise<dte.DTE[]>>db.collection('dtes').find(query).toArray()).subscribe(
        dtes => gruPe = queryService.asignarDTEaPeriodos(p, fec.$gte, fec.$lte, dtes),
        err => res.send(500).send(err),
        () => res.send(queryService.resumenVentasPorPeriodos(gruPe))
    )

})

router.get('/getventasporcliente/:rut/:periodo/entre/:desde-:hasta', (req, res, next) => {
    let query = { $or: [{}, {}, {}] }

    let fec = { $gte: new Date(req.params.desde), $lte: new Date(req.params.hasta) }

    query.$or[0][`Documento.Encabezado.IdDoc.FchEmis`] = fec
    query.$or[1][`Exportaciones.Encabezado.IdDoc.FchEmis`] = fec
    query.$or[2][`Liquidaciones.Encabezado.IdDoc.FchEmis`] = fec

    query.$or[0][`Documento.Encabezado.Receptor.RUTRecep`] = req.params.rut
    query.$or[1][`Exportaciones.Encabezado.Receptor.RUTRecep`] = req.params.rut
    query.$or[2][`Liquidaciones.Encabezado.Receptor.RUTRecep`] = req.params.rut

    let p = periodos.TipoPeriodos[<string>req.params.periodo]
    let gruPe: { periodo: periodos.Periodo, dtes: dte.DTE[] }[];
    Observable.from(<Promise<dte.DTE[]>>db.collection('dtes').find(query).toArray()).subscribe(
        dtes => gruPe = queryService.asignarDTEaPeriodos(p, fec.$gte, fec.$lte, dtes),
        err => res.send(500).send(err),
        () => res.send(queryService.resumenVentasPorPeriodos(gruPe))
    )

})

router.get('/gettop/:num/clientes/:moneda/:periodo/entre/:desde-:hasta', (req, res, next) => {

    let fec = { $gte: new Date(req.params.desde), $lte: new Date(req.params.hasta) }

    let query: { $or?: [{}, {}, {}] }

    if (<dte.TipMonType>req.params.moneda === 'PESO CL') {
        query = { $or: [{}, {}, {}] };
        query.$or[0][`Documento.Encabezado.IdDoc.FchEmis`] = fec
        query.$or[1][`Exportaciones.Encabezado.IdDoc.FchEmis`] = fec
        query.$or[2][`Liquidaciones.Encabezado.IdDoc.FchEmis`] = fec

        query.$or[1][`Exportaciones.Encabezado.Totales.TpoMoneda`] = req.params.moneda
    } else {
        query = {};
        query[`Exportaciones.Encabezado.IdDoc.FchEmis`] = fec
        query[`Exportaciones.Encabezado.Totales.TpoMoneda`] = req.params.moneda

    }


    let p = periodos.TipoPeriodos[<string>req.params.periodo]
    let gruPe: { periodo: periodos.Periodo, dtes: dte.DTE[] }[];

    Observable.from(<Promise<dte.DTE[]>>db.collection('dtes').find(query).toArray()).subscribe(
        dtes => {
            let sortRuts = dtes.reduce((acc, dte) => {
                let rut = DteService.getEncabezado(dte).Receptor.RUTRecep
                let acRut = acc[rut];
                if (!acRut) {
                    acRut = { dtes: [], suma: 0 }
                    acc[rut] = acRut;
                }
                acRut.suma += DteService.getAporteVentasDocumento(dte)
                return acc
            }, <{ [rut: string]: { dtes: dte.DTE[], suma: number } }>{})

            let Ruts: { dtes: dte.DTE[], suma: number }[] = [];
            for (let rut in sortRuts) Ruts.push(sortRuts[rut])
            let ds = Ruts.sort((d1, d2) => d2.suma - d1.suma)
                .slice(0, req.params.num)
                .map(r => r.dtes)
                .reduce((acc, dtes) => acc.concat(dtes), [])
            gruPe = queryService.asignarDTEaPeriodos(p, fec.$gte, fec.$lte, ds)
        }
        ,
        err => res.send(500).send(err),
        () => res.send(queryService.resumenVentasPorPeriodos(gruPe))
    )


})

router.get('/getventasporetiquetacliente/:nombre/:periodo/entre/:desde-:hasta', (req, res, next) => {
    let query = { $or: [{}, {}, {}] }

    let fec = { $gte: new Date(req.params.desde), $lte: new Date(req.params.hasta) }

    query.$or[0][`Documento.Encabezado.IdDoc.FchEmis`] = fec
    query.$or[1][`Exportaciones.Encabezado.IdDoc.FchEmis`] = fec
    query.$or[2][`Liquidaciones.Encabezado.IdDoc.FchEmis`] = fec

    let p = periodos.TipoPeriodos[<string>req.params.periodo]
    let gruPe: { periodo: periodos.Periodo, dtes: dte.DTE[] }[];
    let ob1 : { [rut: string]: string }

    Observable.combineLatest(
        Observable.from(<Promise<dte.DTE[]>>db.collection('dtes').find(query).toArray()),
        Observable.from(<Promise<{ [rut: string]: string }>>db.collection('etiquetas-clientes')
            .findOne({ nombre: req.params.nombre, rut: rut })))
        .subscribe(
        ob => {
            gruPe = queryService.asignarDTEaPeriodos(p, fec.$gte, fec.$lte, ob[0])
            ob1 = ob[1];
        },
        err => res.send(500).send(err),
        () => res.send(queryService
            .resumenVentasPorPeriodos(gruPe, req.params.nombre, ob1, (dte, ets) =>
                ets[DteService.getEncabezado(dte).Receptor.RUTRecep] || 'sin clasificación'
            ))
        )

})

router.get('/getventasporetiquetaitem/:nombre/:periodo/entre/:desde-:hasta', (req, res, next) => {


})

router.get('/getventasporciudad/:nombre/:periodo/entre/:desde-:hasta', (req, res, next) => {


})

router.get('/getventasporcomuna/:nombre/:periodo/entre/:desde-:hasta', (req, res, next) => {


})




