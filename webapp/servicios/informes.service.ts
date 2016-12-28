import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs'
import { periodos } from 'core-sales-manager';
import { QueryDataService } from './query-data.service'
import 'google.visualization'


@Injectable()
export class InformesService {

    constructor(private http: Http, private queryData: QueryDataService) { }

    getInformeById(Id: string) {

        return [{
            Graph: 'LineChart',
            Titulo: 'Ventas Totales',
            Posicion: 1,
            Querys: [{
                Funcion: "GetVentas",
                FecFinOffset: 0,
                NumPeriodos: 6,
                TipoPeriodos: periodos.TipoPeriodos.mensuales
            }, {
                Funcion: "GetVentas",
                FecFinOffset: 0,
                NumPeriodos: 6,
                TipoPeridoOffset: periodos.TipoPeriodos.anuales,
                PeriodosOffset: 1,
                TipoPeriodos: periodos.TipoPeriodos.mensuales
            }]
        }]
    }

}


export interface GraphDetail {
    Graph: string;
    Titulo?: string;
    Posicion?: number;
    Querys: QueryDetail[]
}

export interface QueryDetail {
    consulta: {
        campos: {
            ventasNetas: boolean,
            ventasBrutas: boolean,
            cantDocs: boolean,
            cantClientes: boolean,
            cantProductos: boolean
        }
        UltPeriodoOffset?: number,
        NumPeriodos?: number,
        TipoPeriodos: periodos.TipoPeriodos,
        ComparaMismaFraccionDePeriodo: boolean,
        PrimerosNdias?: number
    }
    filtros?: {
        receptor?: {
            ruts?: (string|RegExp)[],
            etiqueta?: {
                nombre: string,
                subetiquetas: (string|RegExp)[]
            },
            comunas?: (string|RegExp)[],
            ciudades?: (string|RegExp)[],
        },
        itemVenta?: {
            tipoCod?: (string|RegExp)[],
            codigo?: (string|RegExp)[],
            nombres?: (string|RegExp)[],
            etiqueta?: {
                nombre: string,
                subetiqueta: (string|RegExp)[]
            }
        },
        documento?: {
            moneda: string
        }
    },
    agrupacion?: {
        receptor?: {
            ruts?: boolean,
            etiqueta?: string,
            comunas?: boolean,
            ciudades?: boolean,
        },
        itemVenta?: {
            tipoCod?: boolean,
            codigo?: boolean,
            nombres?: boolean,
            etiqueta?: string,
        }
    }
}