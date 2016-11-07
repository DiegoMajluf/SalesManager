import * as DTE from '../cliente/dtes';
import * as df from 'dateformat'

export class dteService {

    static getNombreDocumento = (tipo: string): string => {

        for (let member in DTE.DTEType)
            if (member == tipo) return "Documento";

        for (let member in DTE.EXPType)
            if (member == tipo) return "Exportacion";

        for (let member in DTE.LIQType)
            if (member == tipo) return "Liquidacion";

    }

    static getSignoDocumento = (dte: DTE.DTE): number => {
        let tipo: any = (dte.Documento || dte.Exportaciones || dte.Liquidacion).Encabezado.IdDoc.TipoDTE
        if ([DTE.DOCType.FacturaElectronica,
        DTE.DOCType.FacturaElectronicadeVentadeBienesyServiciosNoafectosoExentodeIVA,
        DTE.DOCType.NotadeDebitoElectronica,
        DTE.DOCType.N_110,
        DTE.DOCType.N_112
        ].indexOf(tipo) !== -1) return 1;

        if ([DTE.DOCType.NotadeCreditoElectronica, DTE.DOCType.N_111].indexOf(tipo) !== -1) return -1;

        return 0
    }

    static dateReviver = (key: string, value: any) => {
        if (typeof value === 'string')
            if (/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)(Z|([+\-])(\d{2}):(\d{2}))$/.test(value))
                return new Date(value);
        return value;

    }
}

export class Periodo {

    constructor(public fechaIni: Date, public fechaFin: Date, public nombre: string) { }

    static getFecIniPeriodo = (fec: Date, tipo: tipoPeriodos): Date => {
        let i = new Date(fec.getFullYear(), fec.getMonth(), fec.getDate());
        switch (tipo) {
            case tipoPeriodos.diarias:
                return i;

            case tipoPeriodos.semanales:
                i.setDate(i.getDate() - i.getDay() == 0 ? i.getDay() - 1 : 6)
                return i;

            case tipoPeriodos.quincenales:
                if (i.getDate() < 15) i.setDate(1)
                else i.setDate(15)
                return i;

            case tipoPeriodos.mensuales:
                i.setDate(1)
                return i;

            case tipoPeriodos.bimensuales:
                i.setMonth(-(i.getMonth() + 1) % 2, 1)
                return i;

            case tipoPeriodos.trimestrales:
                i.setMonth(-(i.getMonth() + 1) % 3, 1)
                return i;

            case tipoPeriodos.cuatrimestrales:
                i.setMonth(-(i.getMonth() + 1) % 4, 1)
                return i;

            case tipoPeriodos.anuales:
                i.setMonth(0, 1)
                return i;


        }

    }

    static getPeriodos = (desde: Date, hasta: Date, tipo: tipoPeriodos): Periodo[] => {
        let p: Periodo[] = [];
        let i = Periodo.getFecIniPeriodo(desde, tipo)
        let next: Date
        switch (tipo) {
            case tipoPeriodos.diarias:
                for (; i <= hasta; i = next) {
                    next = new Date(i.getTime())
                    next.setDate(i.getDate() + 1)
                    p.push(new Periodo(i, next, df(i, "yyyymmdd")));
                }
                break;
            case tipoPeriodos.semanales:
                for (; i <= hasta; i = next) {
                    next = new Date(i.getTime())
                    next.setDate(i.getDate() + 7)
                    p.push(new Periodo(i, next, df(i, "W")));
                }
                break;
            case tipoPeriodos.quincenales:
                for (; i <= hasta; i = next) {
                    next = new Date(i.getTime())
                    if (i.getDate() < 15) {
                        next.setDate(15)
                        p.push(new Periodo(i, next, df(i, "yyyymm") + "-1ra"));
                    } else {
                        next.setMonth(i.getMonth() + 1, 1)
                        p.push(new Periodo(i, next, df(i, "yyyymm") + "-2da"));
                    }
                }
                break;
            case tipoPeriodos.mensuales:
                for (; i <= hasta; i = next) {
                    next = new Date(i.getTime())
                    next.setMonth(i.getMonth() + 1, 1)
                    p.push(new Periodo(i, next, df(i, "yyyymm")));
                }
                break;
            case tipoPeriodos.bimensuales:
                for (; i <= hasta; i = next) {
                    next = new Date(i.getTime())
                    next.setMonth(i.getMonth() + 2)
                    p.push(new Periodo(i, next, df(i, "yyyy") + 'bi' + (i.getMonth() + 1) / 2));
                }
                break;
            case tipoPeriodos.trimestrales:
                for (; i <= hasta; i = next) {
                    next = new Date(i.getTime())
                    next.setMonth(i.getMonth() + 3)
                    p.push(new Periodo(i, next, df(i, "yyyy") + 'qt' + (i.getMonth() + 1) / 3));
                }
                break;
            case tipoPeriodos.cuatrimestrales:
                for (; i <= hasta; i = next) {
                    next = new Date(i.getTime())
                    next.setMonth(i.getMonth() + 4)
                    p.push(new Periodo(i, next, df(i, "yyyy") + 'tr' + (i.getMonth() + 1) / 4));
                }
                break;
            case tipoPeriodos.anuales:
                for (; i <= hasta; i = next) {
                    next = new Date(i.getTime())
                    next.setFullYear(i.getFullYear() + 1)
                    p.push(new Periodo(i, next, df(i, "yyyy")));
                }
                break;


        }

        return p
    }

    static asignarDTEaPeriodos = (tipo: tipoPeriodos, desde: Date, hasta: Date, dtes: DTE.DTE[])
        : { periodo: Periodo, dtes: DTE.DTE[] }[] => {

        let periodos = Periodo.getPeriodos(desde, hasta, tipo)
        let o = {}
        periodos.forEach(p => o[p.fechaIni.toISOString()] = { periodo: p, dtes: [] })

        dtes.forEach(dte => {
            let fec = Periodo.getFecIniPeriodo(
                (dte.Documento || dte.Exportaciones || dte.Liquidacion).Encabezado.IdDoc.FchEmis, tipo)
            o[fec.toISOString()].dtes.push(dte)
        })

        let arr: { periodo: Periodo, dtes: DTE.DTE[] }[] = [];
        for (let k in o) arr.push(o[k])
        return arr;
    }

    static resumenVentasPorPeriodos = (grupPe: { periodo: Periodo, dtes: DTE.DTE[] }[])
        : { periodo: Periodo, ventas: any, numDocs: number }[] => {

        let arr: { periodo: Periodo, ventas: any, numDocs: number }[] = [];

        for (let k in grupPe) {
            let itm = { periodo: grupPe[k].periodo, ventas: {}, numDocs: grupPe[k].dtes.length };
            let peso: DTE.TipMonType = 'PESO CL'
            itm.ventas[peso] = { venta: 0, numDocs: 0, moneda: peso };

            (<DTE.DTE[]>grupPe[k].dtes).forEach(dte => {
                let sig = dteService.getSignoDocumento(dte)
                if (sig === 0) return;
                if (dte.Documento) {
                    itm.ventas[peso].venta += sig * (dte.Documento.Encabezado.Totales.MntExe || 0 +
                        dte.Documento.Encabezado.Totales.MntNeto || 0);
                    itm.ventas[peso].numDocs++;
                } else if (dte.Exportaciones) {
                    let mon = dte.Exportaciones.Encabezado.Totales.TpoMoneda
                    if (!itm.ventas[mon]) itm.ventas[mon] = { venta: 0, numDocs: 0, moneda: mon }
                    itm.ventas[mon].venta += sig * dte.Exportaciones.Encabezado.Totales.MntExe
                    itm.ventas[mon].numDocs++;
                } else {
                    itm.ventas[peso].venta += sig * (dte.Liquidacion.Encabezado.Totales.Comisiones.ValComExe || 0 +
                        dte.Liquidacion.Encabezado.Totales.Comisiones.ValComNeto || 0);
                    itm.ventas[peso].numDocs++;
                }

            })

            arr.push(itm);
        }

        return arr;
    }
}


export enum tipoPeriodos {
    diarias,
    semanales,
    quincenales,
    mensuales,
    bimensuales,
    trimestrales,
    cuatrimestrales,
    semestrales,
    anuales

}
