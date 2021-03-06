import * as express from 'express';
import { dte, periodos, DteService, responses } from 'core-sales-manager'
import * as mongo from '../commons/mongo';
import { Observable, Subscriber } from 'rxjs/Rx';
import { FindAndModifyWriteOpResultObject } from 'mongodb'

import * as qo from '../commons/definiciones'

export let router = express.Router();
let docsName = ['Documento', 'Exportaciones', 'Liquidaciones']


router.get('/getfoliosyaingresadosde/:tipo/enrango/:ini-:fin', (req, res, next) => {
    let query = { $and: [{}, {}, {}, {}] }

    let NombreDoc = DteService.getNombreDocumento(req.params.tipo);

    query.$and[0][`${NombreDoc}.Encabezado.Emisor.RUTEmisor`] = req['rutEmpresa'];
    query.$and[1][`${NombreDoc}.Encabezado.IdDoc.TipoDTE`] = parseInt(req.params.tipo)
    query.$and[2][`${NombreDoc}.Encabezado.IdDoc.Folio`] = { $gte: parseInt(req.params.ini) };
    query.$and[3][`${NombreDoc}.Encabezado.IdDoc.Folio`] = { $lte: parseInt(req.params.fin) };

    Observable.fromPromise(<Promise<dte.DTE[]>>mongo.db.collection('dtes').find(query, { Signature: 0 }).toArray())
        .subscribe({
            next: dtes => {
                let resp = {}
                resp[req.params.tipo] = []
                res.send(dtes.reduce((acc, va) => {
                    let doc = va.Documento || va.Exportaciones || va.Liquidacion
                    if (!acc[doc.Encabezado.IdDoc.TipoDTE]) acc[doc.Encabezado.IdDoc.TipoDTE] = [];
                    acc[doc.Encabezado.IdDoc.TipoDTE].push(doc.Encabezado.IdDoc.Folio)
                    return acc
                }, resp))
            },
            error: err => res.status(500).send(err)
        })

})


router.post('/getquerys', (req, res, next) => {
    if (Object.keys(req.body).length == 0) return res.status(400)

    let querys: qo.QueryDetail[] = req.body

    let paises: { [cod: string]: mongo.pais }
    let ets: {
        cliente: { [key: string]: { [key: string]: string } },
        producto: { [key: string]: { [key: string]: string } }
    }

    let dtaTables: qo.DataTable[] = [];


    (querys.some(query => query.asignacion
        .some(a => a.receptor &&
            (a.receptor == qo.GrupoReceptorEnum.comunas || a.receptor == qo.GrupoReceptorEnum.ciudades)))
        ? mongo.GetCodigosPaises() : Observable.of({}))
        .do(x => paises = x)
        .flatMap(x => getEtiquetasFromQuery(querys, req['rutEmpresa']))
        .do(x => ets = x)
        .flatMap(ets => querys)
        .flatMap((q, i) => {
            let mq = queryDetailToMongoQuery(q, req['rutEmpresa'])
            return Observable.fromPromise(<Promise<dte.DTE[]>>mongo.db.collection('dtes').find(mq).toArray())
                .map(dtes => asignarDTEaPeriodos(q.consulta.TipoPeriodos, getMinFechaFrom(mq), getMaxFechaFrom(mq), dtes))
                .map(x => {
                    return {
                        query: q,
                        periodos: x,
                        indice: i
                    }
                })

        })
        .subscribe({
            next: x => {
                let Lineas: qo.Linea[] = []
                let pun = getPoints(x.periodos, x.query, ets.cliente, ets.producto, paises)
                QueryPointToArray(Lineas, { campos: [], data: null }, pun.monedas)
                dtaTables[x.indice] = getDataTable(x.query, Lineas)
            },
            error: err => res.status(500).send(err),
            complete: () => res.send(dtaTables)
        })

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
    etItemVenta: { [key: string]: { [key: string]: string } },
    paises: { [cod: string]: mongo.pais }): qo.QueryResponsePoint {


    let qp: qo.QueryResponsePoint = {
        monedas: <qo.QueryResponseGroup>{}
    }



    /**Corresponde a los requerimientos de columnas de las consultas */
    let datosColumnas = <{ clave: string, campo: string }[]>[{ clave: 'moneda' }]//concatenamos el campo monedas. Debe ir al comienzo para que los subtotales sean consistentes
        .concat(query.asignacion
            .map(q => Object.keys(q)
                .reduce((acc, c) => {
                    acc.campo = q[c]
                    acc.clave = c
                    return acc
                }, { clave: <string>null, campo: <string>null })
            )
            .filter(o => o.clave !== 'moneda')) //Se elimina 'moneda' de las asignaciones si ha sido incluído (ya se agregó al comienzo)
        .filter(o => o.clave !== 'campo')

    let campos = query.asignacion.filter(q => q.campo)


    pes.forEach(pd => {

        let clis: { [rut: string]: number } = {}
        let clisgroup: { [key: string]: { [rut: string]: number } } = {}


        pd.dtes.forEach(dt => {
            let join = datosColumnas.reduce((acc, o) => {
                acc.push(getQueryResponseGroupSubTotal(o, dt, pd.periodo, etReceptor, etItemVenta, paises))
                return acc
            }, <{ key: string, sub: qo.QueryResponseGroupSubTotal }[][]>[])

            JoinTables(join, qp.monedas)
        })

    })

    return qp;
}

//**Obtiene el valor del grupo para una clave Ej. clave: ciudad => valor: 'santiago' */
function getQueryResponseGroupSubTotal(key: { clave: string, campo?: any }, dt: dte.DTE, periodo: periodos.Periodo,
    etr?: { [key: string]: { [key: string]: string } },
    etv?: { [key: string]: { [key: string]: string } },
    paises?: { [cod: string]: mongo.pais }):
    { key: string, sub: qo.QueryResponseGroupSubTotal }[] {

    let enc = <dte.DocumentoEncabezado>DteService.getEncabezado(dt)
    let signo = DteService.getSignoDocumento(dt)



    if (key.clave === 'etiquetaProducto') {
        let dets = DteService.getDetalles(dt)
        throw 'No implementado'
    }


    if (key.clave === 'itemVenta') {
        let dets = DteService.getDetalles(dt) // acá se debería filtrar por query.filter
        let afecto = 0
        let exento = 0
        let totimpuestos = signo * (enc.Totales.IVA || 0)
        let impuestos: { [cod: string]: { MontoImp: number, TipoImp: string, TasaImp: number } } =
            (enc.Totales.ImptoReten || []).reduce((acc, imp) => {
                totimpuestos += imp.MontoImp
                acc[dte.ImpAdicDTEType[imp.TipoImp]] = imp
                return acc
            }, { IVA: { MontoImp: signo * (enc.Totales.IVA || 0), TipoImp: 'IVA', TasaImp: enc.Totales.TasaIVA || 0 } })
        dets.forEach(det => {
            if ([dte.DocumentoIndExe.ElproductoNoConstituyeVenta, dte.DocumentoIndExe.ElProductooServicioNOESFacturable,
            dte.DocumentoIndExe.ItemaRebajar, dte.DocumentoIndExe.Nofacturablesnegativos]
                .indexOf(<dte.DocumentoIndExe>det.IndExe) !== -1) {
                det['afecto'] = 0
                det['exento'] = 0
            } else if (dte.DocumentoIndExe.ElProductooServicioNOESTAAfectoaIVA === det.IndExe ||
                enc.IdDoc.TipoDTE === dte.DTEType.FacturaElectronicadeVentadeBienesyServiciosNoafectosoExentodeIVA) {
                det['afecto'] = 0
                det['exento'] = signo * det.MontoItem
                exento += signo * det.MontoItem
            } else {
                det['afecto'] = signo * det.MontoItem
                det['exento'] = 0
                afecto += signo * det.MontoItem
            }
        })
        let sortL: { [key: string]: qo.QueryResponseGroupSubTotal }

        let defaultCodigo = [new dte.DocumentoCdgItem()]
        if (key.campo === 'codigo') sortL = dets
            .reduce((acc, det) => acc.concat((det.CdgItem || defaultCodigo).map(x => {
                return { codigo: x, afecto: det['afecto'], exento: det['exento'], impuestos: det['CodImpAdic'] || [] }
            })), <{ codigo: dte.DocumentoCdgItem, afecto: number, exento: number, impuestos: string[] }[]>[])
            .reduce((acc, itm) => {
                let key = `${itm.codigo.TpoCodigo}-${itm.codigo.VlrCodigo}`
                if (Object.keys(itm.codigo).length === 0) key = 'Sin Codigo'
                acc[key] = {
                    afecto: itm.afecto,
                    exento: itm.exento,
                    bruto: itm.afecto + itm.exento,
                    neto: itm.afecto + itm.exento,
                    totalImpuesto: ((impuestos['IVA'] || { TasaImp: 0 }).TasaImp / 100) * itm.afecto,
                    impuestos: {},
                    clave: key
                }

                itm.impuestos.forEach(imp => {
                    if (!acc[key].impuestos[imp]) acc[key].impuestos[imp] = 0
                    acc[key].impuestos[imp] += itm.afecto * (impuestos[imp] || { TasaImp: 0 }).TasaImp / 100
                    acc[key].totalImpuesto += acc[key].impuestos[imp]
                })
                acc[key].bruto += acc[key].totalImpuesto
                return acc
            }, <{ [key: string]: qo.QueryResponseGroupSubTotal }>{})

        else if (key.campo === 'nombres') sortL = dets
            .reduce((acc, det) => {
                acc[det.NmbItem] = {
                    afecto: det['afecto'],
                    exento: det['exento'],
                    bruto: det['afecto'] + det['exento'],
                    neto: det['afecto'] + det['exento'],
                    totalImpuesto: ((impuestos['IVA'] || { TasaImp: 0 }).TasaImp / 100) * det['afecto'],
                    impuestos: {},
                    clave: det.NmbItem
                };

                (det['CodImpAdic'] || []).forEach((imp: string) => {
                    if (!acc[det.NmbItem].impuestos[imp]) acc[det.NmbItem].impuestos[imp] = 0
                    acc[det.NmbItem].impuestos[imp] += det['afecto'] * (impuestos[imp] || { TasaImp: 0 }).TasaImp / 100
                    acc[det.NmbItem].totalImpuesto += acc[det.NmbItem].impuestos[imp]
                })
                acc[det.NmbItem].bruto += acc[det.NmbItem].totalImpuesto
                return acc
            }, <{ [key: string]: qo.QueryResponseGroupSubTotal }>{})


        return Object.keys(sortL)
            .map(key => {
                return {
                    key: key,
                    sub: sortL[key]
                }
            })

    }

    let sub: qo.QueryResponseGroupSubTotal = {
        afecto: signo * (enc.Totales.MntNeto || 0),
        exento: signo * (enc.Totales.MntExe || 0),
        neto: signo * ((enc.Totales.MntNeto || 0) + (enc.Totales.MntExe || 0)),
        bruto: signo * enc.Totales.MntTotal,
        impuestos: (enc.Totales.ImptoReten || [])
            .map(imp => {
                return { TipoImp: dte.ImpAdicDTEType[imp.TipoImp], MontoImp: imp.MontoImp }
            })
            .concat([{ TipoImp: 'IVA', MontoImp: signo * (enc.Totales.IVA || 0) }])
            .reduce((acc, imp) => {
                acc[imp.TipoImp] = signo * imp.MontoImp
                return acc
            }, <{ [cod: string]: number }>{}),
        totalImpuesto: signo * (enc.Totales.ImptoReten || []).reduce((acc, imp) => acc + imp.MontoImp, enc.Totales.IVA),
        clave: null
    }

    let tmp: { key: string, sub: qo.QueryResponseGroupSubTotal }[]
    if (key.clave === 'periodo') tmp = [{ key: periodo.nombre, sub: sub }]


    else if (key.clave === 'receptor') {
        let pais = 'Chile'
        if (enc.Receptor.Extranjero) pais = paises[enc.Receptor.Extranjero.Nacionalidad].pais

        if (key.campo === 'clientes') tmp = [{ key: enc.Receptor.RznSocRecep, sub: sub }]
        if (key.campo === qo.GrupoReceptorEnum.comunas) tmp = [{
            key: `${enc.Receptor.CmnaRecep}, ${enc.Receptor.CiudadRecep}, ${pais}`,
            sub: sub
        }]
        if (key.campo === qo.GrupoReceptorEnum.ciudades) tmp = [{
            key: `${enc.Receptor.CiudadRecep}, ${pais}`,
            sub: sub
        }]
        if (key.campo === qo.GrupoReceptorEnum.paises) tmp = [{
            key: pais,
            sub: sub
        }]
    }

    else if (key.clave === 'etiquetaReceptor')
        tmp = [{ key: etr[key.campo][enc.Receptor.RUTRecep], sub: sub }]


    else if (key.clave === 'moneda')
        tmp = [{ key: enc.Totales['TpoMoneda'] || 'PESO CL', sub: sub }]

    tmp.forEach(t => t.sub.clave = t.key)
    return tmp
}

/**Obtiene las asignaciones de etiquetas de la consulta, si las hubiera */
function getEtiquetasFromQuery(querys: qo.QueryDetail[], rut: string):
    Observable<{
        cliente: { [key: string]: { [key: string]: string } },
        producto: { [key: string]: { [key: string]: string } }
    }> {



    return Observable.from(querys)
        .flatMap(q => Object.keys(q.asignacion).map(key => q.asignacion[key]))
        .filter(a => !!(a.etiquetaItmVta || a.etiquetaRecep))
        .distinct(a => (a.etiquetaItmVta ? 'vta:' + a.etiquetaItmVta : '') + (a.etiquetaRecep ? 'rcp:' + a.etiquetaRecep : ''))
        .reduce((acc, a) => {
            if (a.etiquetaItmVta) acc.prod.$or.push({ nombre: a.etiquetaItmVta })
            else acc.recep.$or.push({ nombre: a.etiquetaRecep })
            return acc
        }, { prod: { $or: [] }, recep: { $or: [] } })
        .flatMap(querys => Observable.forkJoin(
            querys.prod.$or.length > 0
                ? Observable.fromPromise<{ nombre: string, asignaciones: { [key: string]: string } }[]>(mongo.db
                    .collection('etiquetas_productos')
                    .find(querys.prod)
                    .toArray())
                : Observable.of(null),
            querys.recep.$or.length > 0
                ? Observable.fromPromise<{ nombre: string, asignaciones: { [key: string]: string } }[]>(mongo.db
                    .collection('etiquetas_receptores')
                    .find(querys.recep)
                    .toArray())
                : Observable.of(null)))
        .map(x => {
            return {
                producto: x[0] ? x[0].reduce((acc: any, et: any) => {
                    acc[et.nombre] = et.asignaciones
                    return acc
                }, <{ [key: string]: { [key: string]: string } }>{}) : null,
                cliente: x[1] ? x[1].reduce((acc: any, et: any) => {
                    acc[et.nombre] = et.asignaciones
                    return acc
                }, <{ [key: string]: { [key: string]: string } }>{}) : null

            }
        })


}

/***/
function getValorCampo(campo: qo.CamposNumericosEnum, sub: qo.QueryResponseGroupSubTotal): number {
    if (campo == qo.CamposNumericosEnum.ventasExentas) return sub.exento
    if (campo == qo.CamposNumericosEnum.ventasAfectas) return sub.afecto
    if (campo == qo.CamposNumericosEnum.ventasNetas) return sub.neto
    if (campo == qo.CamposNumericosEnum.ventasBrutas) return sub.bruto
    if (campo == qo.CamposNumericosEnum.impuestosRetenidos) return sub.totalImpuesto

    return 0

}

/**Trasforma la respuesta de los QueryResponsePoint[] en un DataTable para Google Charts */
function getDataTable(query: qo.QueryDetail, Lineas: qo.Linea[]): qo.DataTable {
    let dt = { rows: <qo.FilaDataTable[]>[], cols: <qo.ColumnaDataTable[]>[] }

    //Crear Columnas cols
    query.asignacion.forEach(q => {
        if (q.campo)
            dt.cols.push({ label: qo.CamposNumericosEnum[q.campo], type: 'number' })
        else if (q.periodo)
            dt.cols.push({ label: periodos.TipoPeriodos[query.consulta.TipoPeriodos], type: 'string' })
        else if (q.receptor)
            dt.cols.push({ label: qo.GrupoReceptorEnum[q.receptor], type: 'string' })
        else if (q.etiquetaItmVta)
            dt.cols.push({ label: q.etiquetaItmVta, type: 'string' })
        else if (q.etiquetaRecep)
            dt.cols.push({ label: q.etiquetaRecep, type: 'string' })
        else if (q.moneda)
            dt.cols.push({ label: 'Moneda', type: 'string' })
        else //Opcionales que se deja en blanco
            dt.cols.push({ type: 'string' })
    })


    //Crear Filas rows
    Lineas.forEach((linea, i) => {

        //**Indica si en las asignaciones debemos restar al índice por la aparición de campo y periodo */

        let startMoneda = query.asignacion.some(q => !q.moneda) ? 1 : 0
        let menosIndex = 0

        dt.rows.push({
            c: query.asignacion
                .reduce((acc, q, k) => {
                    let v: string | number
                    if (q.campo) {
                        v = getValorCampo(q.campo, linea.data) || 0
                        menosIndex++
                    } else if (q.moneda) {
                        v = linea.campos[0].clave
                    } else
                        v = linea.campos[startMoneda + k - menosIndex].clave || null

                    acc.push({ v: v })
                    return acc
                }, <qo.CeldaDataTable[]>[])
        })

    })


    return dt
}

/**convierte un QueryResponseGroup en un arreglo de arreglos para ser agregado a un dataTable */
function QueryPointToArray(acc: qo.Linea[], padre: qo.Linea, punto: qo.QueryResponseGroup): void {

    Object.keys(punto).forEach(key => {
        let linea: qo.Linea = {
            data: null,
            campos: padre.campos.concat([punto[key].subTotal]),
        }
        if (punto[key].grupo)
            QueryPointToArray(acc, linea, punto[key].grupo)
        else {
            linea.data = punto[key].subTotal
            acc.push(linea)
        }
    })

}

/**Construye el objecto  */
function JoinTables(tab: { key: string, sub: qo.QueryResponseGroupSubTotal }[][], raiz: qo.QueryResponseGroup) {
    for (let i = 0; i < tab[0].length; ++i) {
        let key = tab[0][i].key
        let sub = tab[0][i].sub

        if (!raiz[key]) raiz[key] = { subTotal: <any>{ impuestos: {}, clave: sub.clave } }

        if (tab.length > 1) {
            if (!raiz[key].grupo) raiz[key].grupo = {}
            JoinTables(tab.slice(1), raiz[key].grupo)
        } else {  // se suman los valores
            Object.keys(sub)
                .filter(k => k !== 'impuestos' && k !== 'clave')
                .forEach(k => raiz[key].subTotal[k] = (raiz[key].subTotal[k] || 0) + sub[k])

            Object.keys(sub.impuestos)
                .forEach(k => raiz[key].subTotal.impuestos[k] = (raiz[key].subTotal.impuestos[k] || 0) + sub.impuestos[k])

        }
    }
}

