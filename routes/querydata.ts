import * as express from 'express';
import { dte, periodos } from 'sii-dtes'
import { db } from '../commons/mongo';
import { Observable, Subscriber } from 'rxjs/Rx';
import { FindAndModifyWriteOpResultObject } from 'mongodb'


export let router = express.Router();
let rut: string = '76398667-5';
router.get('/getfoliosyaingresadosde/:tipo/enrango/:ini-:fin', (req, res, next) => {
    let query = { $and: [{}, {}, {}, {}] }

    let NombreDoc = dteService.getNombreDocumento(req.params.tipo);

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
        err => res.send(err))

})

router.get('/getventas/:periodo/entre/:desde/:hasta', (req, res, next) => {
    let query = { $or: [{}, {}, {}] }

    let fec = { $gte: new Date(req.params.desde), $lte: new Date(req.params.hasta) }

    query.$or[0][`Documento.Encabezado.IdDoc.FchEmis`] = fec
    query.$or[1][`Exportaciones.Encabezado.IdDoc.FchEmis`] = fec
    query.$or[2][`Liquidaciones.Encabezado.IdDoc.FchEmis`] = fec

    let p = tipoPeriodos[<string>req.params.periodo]
    let gruPe: { periodo: Periodo, dtes: dte.DTE[] }[];
    Observable.from(<Promise<dte.DTE[]>>db.collection('dtes').find(query).toArray()).subscribe(
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


    function asignarDTEaPeriodos(tipo: TipoPeriodos, desde: Date, hasta: Date, dtes: dtes.DTE[])
        : { periodo: Periodo, dtes: dtes.DTE[] }[] => {

        let periodos = Periodo.getPeriodos(desde, hasta, tipo)
        let o = {}
        periodos.forEach(p => o[p.fechaIni.toISOString()] = { periodo: p, dtes: [] })

        dtes.forEach(dte => {
            let fec = Periodo.getFecIniPeriodo(
                (dte.Documento || dte.Exportaciones || dte.Liquidacion).Encabezado.IdDoc.FchEmis, tipo)
            o[fec.toISOString()].dtes.push(dte)
        })

        let arr: { periodo: Periodo, dtes: dtes.DTE[] }[] = [];
        for (let k in o) arr.push(o[k])
        return arr;
    }

    function resumenVentasPorPeriodos(grupPe: { periodo: Periodo, dtes: dtes.DTE[] }[])
        : { periodo: Periodo, ventas: any, numDocs: number }[] => {

        let arr: { periodo: Periodo, ventas: any, numDocs: number }[] = [];

        for (let k in grupPe) {
            let itm = { periodo: grupPe[k].periodo, ventas: {}, numDocs: grupPe[k].dtes.length };
            let peso: dtes.TipMonType = 'PESO CL'
            itm.ventas[peso] = { venta: 0, numDocs: 0, moneda: peso };

            (<dtes.DTE[]>grupPe[k].dtes).forEach(dte => {
                let sig = DteService.getSignoDocumento(dte)
                if (sig === 0) return;
                if (dte.Documento) {
                    itm.ventas[peso].venta += sig *
                        (dte.Documento.Encabezado.Totales.MntExe || 0 + dte.Documento.Encabezado.Totales.MntNeto || 0);
                    itm.ventas[peso].numDocs++;
                } else if (dte.Exportaciones) {
                    let mon = dte.Exportaciones.Encabezado.Totales.TpoMoneda
                    if (!itm.ventas[mon]) itm.ventas[mon] = { venta: 0, numDocs: 0, moneda: mon }
                    itm.ventas[mon].venta += sig * dte.Exportaciones.Encabezado.Totales.MntExe
                    itm.ventas[mon].numDocs++;
                } else {
                    itm.ventas[peso].venta += sig *
                        (dte.Liquidacion.Encabezado.Totales.Comisiones.ValComExe || 0
                            + dte.Liquidacion.Encabezado.Totales.Comisiones.ValComNeto || 0);
                    itm.ventas[peso].numDocs++;
                }

            })

            arr.push(itm);
        }

        return arr;
    }
