import * as express from 'express';
import { dte, periodos, DteService, responses } from 'core-sales-manager'
import * as queryService from '../commons/query-service'
import { db } from '../commons/mongo';
import { Observable, Subscriber } from 'rxjs/Rx';
import { FindAndModifyWriteOpResultObject } from 'mongodb'

import { QueryDetail, QueryResponsePoint, QueryResponsePointData } from '../webapp/servicios/informes.service'

export let router = express.Router();
let docsName = ['Documento', 'Exportaciones', 'Liquidaciones']
router.get('/getfoliosyaingresadosde/:tipo/enrango/:ini-:fin', (req, res, next) => {
    let query = { $and: [{}, {}, {}, {}] }

    let NombreDoc = DteService.getNombreDocumento(req.params.tipo);

    query.$and[0][`${NombreDoc}.Encabezado.Emisor.RUTEmisor`] = req['rutEmpresa'];
    query.$and[1][`${NombreDoc}.Encabezado.IdDoc.TipoDTE`] = parseInt(req.params.tipo)
    query.$and[2][`${NombreDoc}.Encabezado.IdDoc.Folio`] = { $gte: parseInt(req.params.ini) };
    query.$and[3][`${NombreDoc}.Encabezado.IdDoc.Folio`] = { $lte: parseInt(req.params.fin) };

    Observable.fromPromise(<Promise<dte.DTE[]>>db.collection('dtes').find(query, { Signature: 0 }).toArray())
        .subscribe(
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

    docsName.forEach((v, k) => {
        query.$or[k][`${v}.Encabezado.IdDoc.FchEmis`] = fec
        query.$or[k][`${v}.Encabezado.Emisor.RUTEmisor`] = req['rutEmpresa'];

    })

    let p = periodos.TipoPeriodos[<string>req.params.periodo]
    let gruPe: { periodo: periodos.Periodo, dtes: dte.DTE[] }[];
    Observable.from(<Promise<dte.DTE[]>>db.collection('dtes').find(query).toArray()).subscribe(
        dtes => gruPe = asignarDTEaPeriodos(p, fec.$gte, fec.$lte, dtes),
        err => res.send(500).send(err),
        () => res.send(queryService.resumenVentasPorPeriodos(gruPe))
    )

})


router.post('/getquerys', (req, res, next) => {
    let str = '';
    req.setEncoding('utf8')
    req.on('data', chnk => str += chnk);
    req.on('end', () => {
        let querys: QueryDetail[]
        try {
            querys = JSON.parse(str);
        } catch (err) {
            return res.status(500).send(err)

        }


        let queryResult: { query: any, puntos: QueryResponsePoint[], err: any }[] = []
        querys.forEach(q => {
            let o: { query: any, puntos: QueryResponsePoint[], err: any } = { query: q, puntos: null, err: null }
            let mq = queryDetailToMongoQuery(q, req['rutEmpresa']);
            Observable.from(<Promise<dte.DTE[]>>db.collection('dtes').find(mq).toArray())
                .subscribe(
                dtes => o.puntos = formatearResultado(
                    asignarDTEaPeriodos(q.consulta.TipoPeriodos, new Date('2016-01-01'), new Date('2016-12-01'), dtes), q),
                err => JSON.stringify(res.status(500).send(err), null, ' '),
                () => {
                    if (!queryResult.find(qr => !(qr.puntos || qr.err)))
                        res.send(JSON.stringify(queryResult, null, ' '))
                }
                )
            queryResult.push(o)
        })

    });
})

function queryDetailToMongoQuery(qd: QueryDetail, rutEmpresa: string): any {
    let query = { $or: [{}, {}, {}] }

    let rangoFechas = GetRangoFechaFromQueryDetail(qd)
    docsName.forEach((v, k) => {
        query.$or[k]['$or'] = rangoFechas.reduce((acc, rng) => {
            let o = {}
            o[`${v}.Encabezado.IdDoc.FchEmis`] = rng;
            acc.push(o)
            return acc
        }, [])
        query.$or[k][`${v}.Encabezado.Emisor.RUTEmisor`] = rutEmpresa;
        if (qd.filtros) {
            if (qd.filtros.receptor) {
                if (qd.filtros.receptor.razones)
                    query.$or[k][`${v}.Encabezado.Receptor.RznSocRecep`] = { $in: qd.filtros.receptor.razones };
                if (qd.filtros.receptor.ruts)
                    query.$or[k][`${v}.Encabezado.Receptor.RUTRecep`] = { $in: qd.filtros.receptor.ruts };
                if (qd.filtros.receptor.ciudades)
                    query.$or[k][`${v}.Encabezado.Receptor.CiudadRecep`] = { $in: qd.filtros.receptor.ciudades };
                if (qd.filtros.receptor.comunas)
                    query.$or[k][`${v}.Encabezado.Receptor.CmnaRecep`] = { $in: qd.filtros.receptor.comunas };

            }
            if (qd.filtros.itemVenta) {
                query.$or[k][`${v}.Detalle`] = { $elemMatch: {} }
                if (qd.filtros.itemVenta.tipoCod || qd.filtros.itemVenta.codigo) {
                    let o = { $elemMatch: {} };
                    if (qd.filtros.itemVenta.codigo) o.$elemMatch['VlrCodigo'] = { $in: qd.filtros.itemVenta.codigo }
                    if (qd.filtros.itemVenta.tipoCod) o.$elemMatch['TpoCodigo'] = { $in: qd.filtros.itemVenta.tipoCod }
                    query.$or[k][`${v}.Detalle`].$elemMatch.CdgItem = o
                } if (qd.filtros.itemVenta.nombres)
                    query.$or[k][`${v}.Detalle`].$elemMatch.NmbItem = { $in: qd.filtros.itemVenta.nombres };
            }
        }
    })

    let doc = new dte.Documento
    //doc.Encabezado.Receptor.RznSocRecep
    return query;
}

function GetRangoFechaFromQueryDetail(qd: QueryDetail): { $gte: Date, $lt: Date }[] {

    let peIni = periodos.Periodo.getPeriodo(new Date(), qd.consulta.TipoPeriodos, -qd.consulta.NumPeriodos + qd.consulta.UltPeriodoOffset + 1)
    let peFin = periodos.Periodo.getPeriodo(new Date(), qd.consulta.TipoPeriodos, qd.consulta.UltPeriodoOffset || 0)

    if (!qd.consulta.ComparaMismaFraccionDePeriodo && isNaN(qd.consulta.PrimerosNdias)) {
        return [{ $gte: peIni.fechaIni, $lt: peFin.fechaFin }]
    } else {
        let pe = periodos.Periodo.getPeriodo(new Date(), qd.consulta.TipoPeriodos, 0)
        let dias = Math.ceil((new Date().getTime() - pe.fechaIni.getTime()) / 86400000) + 1
        let prd = periodos.Periodo.getPeriodos(peIni.fechaIni, peFin.fechaIni, qd.consulta.TipoPeriodos)
        let o: { $gte: Date, $lt: Date }[] = []
        prd.forEach(p => {
            if (qd.consulta.ComparaMismaFraccionDePeriodo) {
                let d = new Date(p.fechaFin.getTime())
                d.setUTCDate(d.getUTCDate() - 1)
                d.setUTCDate(Math.min(dias, d.getUTCDate() + 1))
                p.fechaFin = d
            }
            if (qd.consulta.PrimerosNdias > 0) {
                let d = new Date(p.fechaIni.getTime())
                d.setUTCDate(Math.min(qd.consulta.PrimerosNdias + 1, 1 + (p.fechaFin.getTime() - p.fechaIni.getTime()) / 86400000))
                p.fechaFin = d
            }
            o.push({ $gte: p.fechaIni, $lt: p.fechaFin })
        })
        return o
    }
}

function asignarDTEaPeriodos(tipo: periodos.TipoPeriodos, desde: Date, hasta: Date, dtes: dte.DTE[]):
    { periodo: periodos.Periodo, dtes: dte.DTE[] }[] {

    let prds = periodos.Periodo.getPeriodos(desde, hasta, tipo)
    let o = {}
    prds.forEach(p => o[p.fechaIni.toISOString()] = { periodo: p, dtes: [] })

    dtes.forEach(dte => {
        let fec = periodos.Periodo.getFecIniPeriodo(
            (dte.Documento || dte.Exportaciones || dte.Liquidacion).Encabezado.IdDoc.FchEmis, tipo)
        o[fec.toISOString()].dtes.push(dte)
    })

    let arr: { periodo: periodos.Periodo, dtes: dte.DTE[] }[] = [];
    for (let k in o) arr.push(o[k])
    return arr;
}

function formatearResultado(pes: { periodo: periodos.Periodo, dtes: dte.DTE[] }[], query: QueryDetail): QueryResponsePoint[] {
    let qrps: QueryResponsePoint[] = [];

    pes.forEach(pd => {
        let qp: QueryResponsePoint = { periodo: pd.periodo, numDocs: pd.dtes.length, monedas: {} }
        qrps.push(qp)
        let clis: { [rut: string]: number } = {}
        let clisgroup : { [key: string]: {[rut: string]: number} } = {}
        pd.dtes.forEach(dt => {
            let enc = dt.Documento.Encabezado || dt.Liquidacion.Encabezado || dt.Exportaciones.Encabezado
            let moneda = enc.Totales['TpoMoneda'] || 'PESO CL'
            if (!qp.monedas[moneda]) {
                qp.monedas[moneda] = { data: {} }
                inicializarCampos(query, qp.monedas[moneda].data)
            }
            sumarDocumento(query, dt, qp.monedas[moneda].data, clis)

            if (query.agrupacion.receptor) {
                if (!qp.monedas[moneda].grupoCliente) qp.monedas[moneda].grupoCliente = {}
                let gc = qp.monedas[moneda].grupoCliente
                Object.keys(query.agrupacion.receptor).forEach(key => {
                    if (!gc[key]) gc[key] = {}
                    if (!gc[key][enc.Receptor[mapGrupoCliente[key]]]) {
                        gc[key][enc.Receptor[mapGrupoCliente[key]]] = {}
                        inicializarCampos(query, gc[key][enc.Receptor[mapGrupoCliente[key]]])
                    }
                    if(!clisgroup[key]) clisgroup[key]= {}
                    sumarDocumento(query, dt, gc[key][enc.Receptor[mapGrupoCliente[key]]], clisgroup[key])
                })
            }
        })
    })

    return qrps;
}


function inicializarCampos(query: QueryDetail, dta: QueryResponsePointData) {
    if (query.consulta.campos.ventasNetas) dta.montoNeto = 0;
    if (query.consulta.campos.ventasBrutas) dta.montoBruto = 0;
    if (query.consulta.campos.cantDocs) dta.numDocs = 0;
    if (query.consulta.campos.cantClientes) dta.numClientes = 0;
    if (query.consulta.campos.cantProductos) dta.numProductos = 0;

}

function sumarDocumento(query: QueryDetail, dt: dte.DTE, dta: QueryResponsePointData, clis: { [rut: string]: number }) {
    let enc = DteService.getEncabezado(dt)
    if (query.consulta.campos.ventasNetas)
        dta.montoNeto += DteService.getSignoDocumento(dt) * enc.Totales['MntNeto'] || enc.Totales.MntTotal
    if (query.consulta.campos.ventasBrutas)
        dta.montoBruto += DteService.getSignoDocumento(dt) * enc.Totales.MntTotal
    if (query.consulta.campos.cantDocs) dta.numDocs++
    if (query.consulta.campos.cantClientes) {
        clis[enc.Receptor.RUTRecep] = 1
        dta.numClientes  = Object.keys(clis).length
    }
}


let mapGrupoCliente = {
    ruts: 'RUTRecep',
    ciudades: 'CiudadRecep',
    comunas: 'CmnaRecep'
}