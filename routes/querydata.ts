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
                getEtiquetasFromQuery(q, req['rutEmpresa']))
                .subscribe(
                x => {
                    let prds = asignarDTEaPeriodos(q.consulta.TipoPeriodos, getMinFechaFrom(mq), getMaxFechaFrom(mq), x[0])
                    let arrs: any[] = []
                    getPoints(prds, q, x[1].cliente, x[1].producto)
                        .forEach(pun =>
                            QueryPointToArray(arrs, [pun], pun.monedas))
                    res.send(getDataTable(q, arrs))
                },
                err => res.status(500).send(JSON.stringify(err, null, ' ')),
                () => {
                    if (!queryResult.find(qr => !(qr.puntos || qr.err)))
                        res.send(JSON.stringify(queryResult, null, ' '))
                })

        })

    });
})

/**Transforma la consulta web en una consulta para mongo dtes */
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
    etReceptor: { [key: string]: { [key: string]: string } },
    etItemVenta: { [key: string]: { [key: string]: string } }): qo.QueryResponsePoint[] {


    //Todo: etiqueta de producto
    let qrps: qo.QueryResponsePoint[] = [];

    pes.forEach(pd => {
        let qp: qo.QueryResponsePoint = {
            periodo: pd.periodo,
            numDocs: pd.dtes.length,
            monedas: <qo.QueryResponseGroup>{}
        }

        qrps.push(qp)
        let clis: { [rut: string]: number } = {}
        let clisgroup: { [key: string]: { [rut: string]: number } } = {}
        let last: { grupo?: qo.QueryResponseGroup, data?: qo.QueryResponsePointData, factor: number }


        pd.dtes.forEach(dt => {
            let enc = DteService.getEncabezado(dt)
            let moneda = enc.Totales['TpoMoneda'] || 'PESO CL'
            if (!qp.monedas[moneda]) qp.monedas[moneda] = { factor: 1 }
            let gc = qp.monedas[moneda]

            last = Object.keys(query.asignacion)
                .sort((k1, k2) => k1.localeCompare(k2))
                .map(key => Object.keys(query.asignacion[key])
                    .reduce((acc, c) => {
                        acc.campo = query.asignacion[key][c]
                        acc.clave = c
                        return acc
                    }, { clave: <string>null, campo: <string>null })
                )
                .filter(o => o.clave !== 'campo')
                .reduce((acc, o) => {
                    /**
                    gc = {
                        'PESO CL' : {
                            factor: 1,
                            grupo: {
                                santiago:{
                                    factor: 1,
                                    grupo: {
                                        vitacura : {
                                            factor: 1,
                                            grupo: {
                                                "76398667-5": {
                                                    factor:1,
                                                    grupo: {
                                                            "lomo Vetado": {
                                                                factor: .5346,
                                                                data: {
                                                                    ventasNetas: 4638209
                                                                }
                                                            },
                                                            "Filete": {
                                                                factor: .4654,
                                                                data: {
                                                                    ventasNetas: 567654
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        "Las Condes": {
                                            grupo:
                                        }
                                    }
                                },
                                valparaiso: {

                                }
                            }
                        }
                    }
                     */
                    let vg = getNombreDeGrupo(o, dt, qp, etReceptor, etItemVenta)
                    if (!acc.grupo[vg]) acc.grupo[vg] = { factor: 1 }
                    return acc.grupo[vg]
                }, gc);

            if (!last.data) {
                last.data = {}
                inicializarCampos(query, last)
            }

            sumarDocumento(query, dt, last, clis)
        })

    })

    return qrps;
}

//**Obtiene el valor del grupo para una clave Ej. clave: ciudad => valor: 'santiago' */
function getNombreDeGrupo(key: { clave: string, campo?: string }, dt: dte.DTE, punto: qo.QueryResponsePoint,
    etr: { [key: string]: { [key: string]: string } },
    etv: { [key: string]: { [key: string]: string } }): string {

    if (key.clave === 'periodo') return punto.periodo.nombre


    if (key.clave === 'receptor') {
        let enc = DteService.getEncabezado(dt)
        if (key.campo === 'clientes') return enc.Receptor.RznSocRecep
        if (key.campo === 'comunas') return enc.Receptor.CmnaRecep
        if (key.campo === 'ciudades') return enc.Receptor.CiudadRecep
    }
    if (key.clave === 'itemVenta') {
        let dets = DteService.getDetalles(dt)
        if (key.campo === 'tipoCod') throw 'No implementado'
        if (key.campo === 'codigo') throw 'No implementado'
        if (key.campo === 'nombres') throw 'No implementado'
    }

    if (key.clave === 'etiquetaProducto') {
        let dets = DteService.getDetalles(dt)
        throw 'No implementado'
    }
    if (key.clave === 'etiquetaReceptor') {
        let enc = DteService.getEncabezado(dt)
        return etr[key.campo][enc.Receptor.RUTRecep]
    }


}

/**Obtiene las asignaciones de etiquetas de la consulta, si las hubiera */
function getEtiquetasFromQuery(query: qo.QueryDetail, rut: string):
    Observable<{
        cliente: { [key: string]: { [key: string]: string } },
        producto: { [key: string]: { [key: string]: string } }
    }> {



    let querys = Object.keys(query.asignacion).reduce((acc, key) => {
        if (query.asignacion[key].etiquetaItmVta)
            acc.prod.$or.push({ nombre: query.asignacion[key].etiquetaItmVta })
        else if (query.asignacion[key].etiquetaRecep)
            acc.recep.$or.push({ nombre: query.asignacion[key].etiquetaRecep })

        return acc
    }, { prod: { $or: [] }, recep: { $or: [] } })

    return Observable.forkJoin(
        querys.prod.$or.length > 0
            ? Observable.fromPromise<{ nombre: string, asignaciones: { [key: string]: string } }[]>(db
                .collection('etiquetas_productos')
                .find(querys.prod)
                .toArray())
            : Observable.of(null),
        querys.recep.$or.length > 0
            ? Observable.fromPromise<{ nombre: string, asignaciones: { [key: string]: string } }[]>(db
                .collection('etiquetas_receptores')
                .find(querys.recep)
                .toArray())
            : Observable.of(null))
        .map(x => {
            return {
                producto: x[0] ? x[0].reduce((acc, et) => {
                    acc[et.nombre] = et.asignaciones
                    return acc
                }, <{ [key: string]: { [key: string]: string } }>{}) : null,
                cliente: x[1] ? x[1].reduce((acc, et) => {
                    acc[et.nombre] = et.asignaciones
                    return acc
                }, <{ [key: string]: { [key: string]: string } }>{}) : null

            }
        })


}

/**Inicializa en cero los datos de un punto o una sub agrupación dentro del punto */
function inicializarCampos(query: qo.QueryDetail, dta: qo.QueryResponsePointData) {
    if (query.consulta.campos.ventasNetas) dta.ventasNetas = 0;
    if (query.consulta.campos.ventasBrutas) dta.ventasBrutas = 0;
    if (query.consulta.campos.cantDocs) dta.cantDocs = 0;
    if (query.consulta.campos.cantClientes) dta.cantClientes = 0;
    if (query.consulta.campos.cantProductos) dta.cantProductos = 0;

}

/**Suma un documento al QueryResponsePoint */
function sumarDocumento(query: qo.QueryDetail, dt: dte.DTE, dta: qo.QueryResponsePointData, clis?: { [rut: string]: number }) {
    let enc = DteService.getEncabezado(dt)
    if (query.consulta.campos.ventasNetas)
        dta.ventasNetas += DteService.getSignoDocumento(dt) * (enc.Totales['MntNeto'] || enc.Totales.MntTotal)
    if (query.consulta.campos.ventasBrutas)
        dta.ventasBrutas += DteService.getSignoDocumento(dt) * enc.Totales.MntTotal
    if (query.consulta.campos.cantDocs) dta.cantDocs++
    if (query.consulta.campos.cantClientes && clis) {

    }
}

/**Trasforma la respuesta de los QueryResponsePoint[] en un DataTable para Google Charts */
function getDataTable(query: qo.QueryDetail, arrs: any[][]): qo.DataTable {
    let dt = { rows: <qo.FilaDataTable[]>[], cols: <qo.ColumnaDataTable[]>[] }

    //Crear Columnas cols
    Object.keys(query.asignacion).forEach(j => {
        if (query.asignacion[j].campo)
            dt.cols.push({ label: query.asignacion[j].campo, type: 'number' })
        else if (query.asignacion[j].periodo)
            dt.cols.push({ label: query.consulta.TipoPeriodos.toString(), type: 'date' })
        else if (query.asignacion[j].receptor)
            dt.cols.push({ label: query.asignacion[j].receptor, type: 'string' })
        else if (query.asignacion[j].etiquetaItmVta)
            dt.cols.push({ label: query.asignacion[j].etiquetaItmVta, type: 'string' })
        else if (query.asignacion[j].etiquetaRecep)
            dt.cols.push({ label: query.asignacion[j].etiquetaRecep, type: 'string' })
        else //Opcionales que se deja en blanco
            dt.cols.push({ type: 'string' })
    })


    //Crear Filas rows
    arrs.forEach((arr, i) => {

        let startIndex = 2
        dt.rows.push({
            c: Object.keys(query.asignacion)
                .reduce((acc, id, k) => {
                    if (query.asignacion[id].campo)
                        acc.push({
                            v: arr.slice(-1)[0][query.asignacion[id].campo] || 0
                        })
                    else {
                        let existeCampo = Object.keys(query.asignacion)
                            .slice(0, k)
                            .some(x => query.asignacion[x].campo !== undefined)

                        if (arr.length < startIndex + k && query.asignacion[id].periodo)
                            acc.push({
                                v: (<qo.QueryResponsePoint>arr[0]).periodo.nombre
                            })
                        else acc.push({
                            v: arr[startIndex + k + (existeCampo ? -1 : 0)] || null
                        })
                    }
                    return acc
                }, <qo.CeldaDataTable[]>[])
        })

    })


    return dt
}

/**convierte un QueryResponseGroup en un arreglo de arreglos para ser agregado a un dataTable */
function QueryPointToArray(acc: any[][], padre: any[], punto: qo.QueryResponseGroup): any {


    if (punto.data)
        return acc.push(padre.concat([punto.data]))

    Object.keys(punto.grupo).forEach(key =>
        QueryPointToArray(acc, padre.concat([key]), punto.grupo[key]))


    if (Object.keys(punto.grupo).length === 0) acc.push(padre)

}



