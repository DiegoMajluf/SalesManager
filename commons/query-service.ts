import { dte, periodos, DteService, responses } from 'core-sales-manager'


export function asignarDTEaPeriodos(tipo: periodos.TipoPeriodos, desde: Date, hasta: Date, dtes: dte.DTE[]):
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

export function resumenVentasPorPeriodos(grupPe: { periodo: periodos.Periodo, dtes: dte.DTE[] }[],
    grupoEtiquetas?: string,
    etiquetas?: { [nombre: string]: string },
    fun?: (dte: dte.DTE, etiquetas: { [nombre: string]: string }) =>
        { [etiqueta: string]: number }): responses.QueryResponsePoint[] {

    let qrps: responses.QueryResponsePoint[] = [];

    for (let k in grupPe) {
        let itm = new responses.QueryResponsePoint();
        itm.periodo = grupPe[k].periodo
        itm.monedas = {}
        itm.numDocs = grupPe[k].dtes.length;
        let peso: dte.TipMonType = 'PESO CL'
        itm.monedas[peso] = { valor: 0, numDocs: 0 };

        (<dte.DTE[]>grupPe[k].dtes).forEach(dte => {
            let mon: dte.TipMonType = peso;
            if (dte.Exportaciones) {
                mon = dte.Exportaciones.Encabezado.Totales.TpoMoneda
                if (!itm.monedas[mon]) itm.monedas[mon] = { valor: 0, numDocs: 0 }
            }
            let aporte = DteService.getAporteVentasDocumento(dte)
            itm.monedas[mon].valor += aporte;
            itm.monedas[mon].numDocs++;
            if (fun) {
                let eti = fun(dte, etiquetas);
                for (let et in eti) {
                    if (!itm.monedas[mon].etiquetas[et]) itm.monedas[mon].etiquetas[et] = { valor: 0, numDocs: 0 }
                    itm.monedas[mon].etiquetas[et].numDocs++;
                    itm.monedas[mon].etiquetas[et].valor += aporte * eti[et];
                }
            }

        })

        qrps.push(itm);
    }

    return qrps;
}

