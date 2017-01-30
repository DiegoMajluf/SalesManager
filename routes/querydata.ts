import * as express from 'express';
import { dte, periodos, DteService, responses } from 'core-sales-manager'
import * as queryService from '../commons/query-service'
import { db, etiquetas } from '../commons/mongo';
import { Observable, Subscriber } from 'rxjs/Rx';
import { FindAndModifyWriteOpResultObject } from 'mongodb'

import * as qo from '../webapp/servicios/informes.service'

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

router.post('/getquerys', (req, res, next) => {
    let str = '';
    req.setEncoding('utf8')
    req.on('data', chnk => str += chnk);
    req.on('end', () => {
        let querys: qo.QueryDetail[]
        try {
            querys = JSON.parse(str);
        } catch (err) {
            return res.status(500).send(err)

        }


        let queryResult: { query: qo.QueryDetail, puntos: qo.QueryResponsePoint[], err: any }[] = []
        querys.forEach(q => {
            let o: { query: qo.QueryDetail, puntos: qo.QueryResponsePoint[], err: any } = { query: q, puntos: null, err: null }
            queryResult.push(o)
            let mq = queryDetailToMongoQuery(q, req['rutEmpresa']);
            Observable.forkJoin(
                Observable.from(<Promise<dte.DTE[]>>db.collection('dtes').find(mq).toArray()),
                getEtiquetasFromQuery(q, req['rutEmpresa'])).subscribe(
                x => {
                    let prds = asignarDTEaPeriodos(q.consulta.TipoPeriodos, getMinFechaFrom(mq), getMaxFechaFrom(mq), x[0])
                    let puntos = getPoints(prds, q, x[1].cliente, x[1].producto)
                    let dataTable = getDataTable(q, puntos)
                },
                err => res.status(500).send(JSON.stringify(err, null, ' ')),
                () => {
                    if (!queryResult.find(qr => !(qr.puntos || qr.err)))
                        res.send(JSON.stringify(queryResult, null, ' '))
                })

        })

    });
})

/**Transforma la consulta web en una cosnulta para mongo dtes */
function queryDetailToMongoQuery(qd: qo.QueryDetail, rutEmpresa: string): any {
    let query = { $or: [{}, {}, {}] }

    let rangoFechas = getRangoFechaFromQueryDetail(qd)
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

/**Obtiene la fecha mínima del la consulta mongo */
function getMinFechaFrom(mongoQuery: any): Date {
    let fec: Date
    mongoQuery.$or.forEach((val: any) => Object.keys(val.$or[0]).forEach(key => {
        if (!fec || <Date>(val.$or[0][key].$gte) < fec) fec = <Date>(val.$or[0][key].$gte)
    }))
    return fec
}

/**Obtiene la fecha de el día anterior al último de la consulta mongo */
function getMaxFechaFrom(mongoQuery: any): Date {
    let fec: Date
    mongoQuery.$or.forEach((val: any) => Object.keys(val.$or[0]).forEach(key => {
        if (!fec || <Date>(val.$or[0][key].$lt) > fec) fec = <Date>(val.$or[0][key].$lt)
    }))
    fec.setUTCDate(fec.getUTCDate() - 1)
    return fec
}

/**Construye el rango de fechas para la QueryDetail */
function getRangoFechaFromQueryDetail(qd: qo.QueryDetail): { $gte: Date, $lt: Date }[] {

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
        let fec = periodos.Periodo.getFecIniPeriodo(DteService.getEncabezado(dte).IdDoc.FchEmis, tipo)
        o[fec.toISOString()].dtes.push(dte)
    })

    let arr: { periodo: periodos.Periodo, dtes: dte.DTE[] }[] = [];
    for (let k in o) arr.push(o[k])
    return arr;
}

/**Genera los puntos agrupados para la consulta */
function getPoints(pes: { periodo: periodos.Periodo, dtes: dte.DTE[] }[], query: qo.QueryDetail,
    etReceptor: { [rut: string]: string }, etItemVenta: { [rut: string]: string }): qo.QueryResponsePoint[] {


    //Todo: etiqueta de producto
    let qrps: qo.QueryResponsePoint[] = [];

    pes.forEach(pd => {
        let qp: qo.QueryResponsePoint = { periodo: pd.periodo, numDocs: pd.dtes.length, monedas: {} }
        qrps.push(qp)
        let clis: { [rut: string]: number } = {}
        let clisgroup: { [key: string]: { [rut: string]: number } } = {}
        pd.dtes.forEach(dt => {
            let enc = DteService.getEncabezado(dt)
            let moneda = enc.Totales['TpoMoneda'] || 'PESO CL'
            if (!qp.monedas[moneda]) {
                qp.monedas[moneda] = { data: {} }
                inicializarCampos(query, qp.monedas[moneda].data)
            }
            sumarDocumento(query, dt, qp.monedas[moneda].data, clis)

            if (query.agrupacion) {
                if (query.agrupacion.receptor) {
                    if (!qp.monedas[moneda].grupoCliente) qp.monedas[moneda].grupoCliente = {}
                    let gc = qp.monedas[moneda].grupoCliente
                    Object.keys(query.agrupacion.receptor)
                        .filter(key => key !== 'etiqueta')
                        .forEach(key => {
                            if (!gc[key]) gc[key] = {}
                            if (!gc[key][enc.Receptor[mapGrupoCliente[key]]]) {
                                gc[key][enc.Receptor[mapGrupoCliente[key]]] = {}
                                inicializarCampos(query, gc[key][enc.Receptor[mapGrupoCliente[key]]])
                                if (!clisgroup[key]) clisgroup[key] = {}
                            }
                            sumarDocumento(query, dt, gc[key][enc.Receptor[mapGrupoCliente[key]]], clisgroup[key])
                        })

                    if (query.agrupacion.receptor.etiqueta) {
                        if (!gc.etiquetas) {
                            gc.etiquetas = {}
                            if (!etReceptor) etReceptor = {}
                        }
                        if (!gc.etiquetas[etReceptor[enc.Receptor.RUTRecep]]) {
                            gc.etiquetas[etReceptor[enc.Receptor.RUTRecep]] = {}
                            inicializarCampos(query, gc.etiquetas[etReceptor[enc.Receptor.RUTRecep]])
                        }
                        sumarDocumento(query, dt, gc.etiquetas[etReceptor[enc.Receptor.RUTRecep]])
                    }

                }
            }
        })

    })

    return qrps;
}

/**Obtiene las asignaciones de etiquetas de la consulta, si las hubiera */
function getEtiquetasFromQuery(query: qo.QueryDetail, rut: string):
    Observable<{ cliente: { [id: string]: string }, producto: { [id: string]: string } }> {

    let c: Observable<{ [id: string]: string }> = Observable.of(null)
    let p: Observable<{ [id: string]: string }> = Observable.of(null)
    if (query.agrupacion) {
        if (query.agrupacion.receptor)
            if (query.agrupacion.receptor.etiqueta)
                c = Observable.fromPromise(
                    <Promise<{ asignaciones: { [rut: string]: string } }[]>>
                    db.collection('etiquetaClientes').find({
                        empresa: rut,
                        etiqueta: query.agrupacion.receptor.etiqueta
                    }, { asignaciones: 1 }).limit(1).toArray())
                    .map(x => x.length === 1 ? x[0].asignaciones : null)


        if (query.agrupacion.itemVenta)
            if (query.agrupacion.itemVenta.etiqueta)
                p = Observable.fromPromise(
                    <Promise<{ asignaciones: { [rut: string]: string } }[]>>
                    db.collection('etiquetaProductos').find({
                        empresa: rut,
                        etiqueta: query.agrupacion.itemVenta.etiqueta
                    }, { asignaciones: 1 }).limit(1).toArray())
                    .map(x => x.length === 1 ? x[0].asignaciones : null)

    }

    return Observable.forkJoin(c, p)
        .map(x => {
            return {
                cliente: x[0],
                producto: x[1]
            }
        })


}

/**Inicializa en cero los datos de un punto o una sub agrupación dentro del punto */
function inicializarCampos(query: qo.QueryDetail, dta: qo.QueryResponsePointData) {
    if (query.consulta.campos.ventasNetas) dta.montoNeto = 0;
    if (query.consulta.campos.ventasBrutas) dta.montoBruto = 0;
    if (query.consulta.campos.cantDocs) dta.numDocs = 0;
    if (query.consulta.campos.cantClientes) dta.numClientes = 0;
    if (query.consulta.campos.cantProductos) dta.numProductos = 0;

}

function sumarDocumento(query: qo.QueryDetail, dt: dte.DTE, dta: qo.QueryResponsePointData, clis?: { [rut: string]: number }) {
    let enc = DteService.getEncabezado(dt)
    if (query.consulta.campos.ventasNetas)
        dta.montoNeto += DteService.getSignoDocumento(dt) * (enc.Totales['MntNeto'] || enc.Totales.MntTotal)
    if (query.consulta.campos.ventasBrutas)
        dta.montoBruto += DteService.getSignoDocumento(dt) * enc.Totales.MntTotal
    if (query.consulta.campos.cantDocs) dta.numDocs++
    if (query.consulta.campos.cantClientes && clis) {
        clis[enc.Receptor.RUTRecep] = 1
        dta.numClientes = Object.keys(clis).length
    }
}

function getDataTable(query: qo.QueryDetail, puntos: qo.QueryResponsePoint[]): qo.DataTable {
    let dt = { rows: <qo.FilaDataTable[]>[], cols: <qo.ColumnaDataTable[]>[] }

    if (query.consulta.NumPeriodos > 1)
        dt.cols.push({ label: periodos.TipoPeriodos[query.consulta.TipoPeriodos], type: 'string' })

    if (query.consulta.campos.cantClientes) dt.cols.push({ label: 'Cantidad de Clientes', type: 'number' })
    if (query.consulta.campos.cantDocs) dt.cols.push({ label: 'Cantidad de Documentos', type: 'number' })
    if (query.consulta.campos.cantProductos) dt.cols.push({ label: 'Cantidad de Productos', type: 'number' })
    if (query.consulta.campos.ventasBrutas) dt.cols.push({ label: 'Ventas Brutas', type: 'number' })
    if (query.consulta.campos.ventasNetas) dt.cols.push({ label: 'Ventas Netas', type: 'number' })

    if (query.agrupacion) {
        if (query.agrupacion.receptor) {
            if (query.agrupacion.receptor.ciudades) dt.cols.push({ label: 'Ciudades', type: 'string' })
            if (query.agrupacion.receptor.comunas) dt.cols.push({ label: 'Comunas', type: 'string' })
            if (query.agrupacion.receptor.ruts) dt.cols.push({ label: 'Empresa', type: 'string' })
            if (query.agrupacion.receptor.etiqueta) dt.cols.push({ label: query.agrupacion.receptor.etiqueta, type: 'string' })
        }
    }


    puntos.forEach(p => {
        let c: any[] = []
        if (query.consulta.NumPeriodos > 1) c.push({ v: p.periodo.nombre })
        if (query.consulta.campos.cantClientes) c.push({ v: p.monedas['PESO CL'].grupoCliente. })
        if (query.consulta.campos.cantDocs) c.push({ label: 'Cantidad de Documentos', type: 'number' })
        if (query.consulta.campos.cantProductos) c.push({ label: 'Cantidad de Productos', type: 'number' })
        if (query.consulta.campos.ventasBrutas) c.push({ label: 'Ventas Brutas', type: 'number' })
        if (query.consulta.campos.ventasNetas) c.push({ label: 'Ventas Netas', type: 'number' })

        dt.rows.push({
            c: [
                { v: p.periodo.nombre },
                { v: p.monedas['PESO CL'].data.montoNeto }
            ]
        })
    })

    return dt
}


let mapGrupoCliente = {
    ruts: 'RUTRecep',
    ciudades: 'CiudadRecep',
    comunas: 'CmnaRecep'
}
