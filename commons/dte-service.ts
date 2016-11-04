import * as DTE from '../cliente/dtes';

export class dteService {

    getNombreDocumento = (tipo: string): string => {

        for (let member in DTE.DTEType)
            if (member == tipo) return "Documento";

        for (let member in DTE.EXPType)
            if (member == tipo) return "Exportacion";

        for (let member in DTE.LIQType)
            if (member == tipo) return "Liquidacion";

    }

}

export class Periodo {

    fechaIni: Date
    fechaFin: Date
    nombre: string

    getPeriodo = (fecha: Date, tipo: tipoPeriodos) {

    }

    getPeriodos = (desde: Date, hasta: Date, tipo: tipoPeriodos) {

    }


}

export class grupoPeriodos {

}

export enum tipoPeriodos {
    diariamente,
    semanalmente,
    quincenalmente,
    mensualmente,
    bimensualmente,
    trimestralmente,
    cuatrimestralmente,
    semestralmente,
    anualmente

}
