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
    Consulta: string;
    UltPeriodoOffset?: number;
    NumPeriodos?: number;
    TipoPeriodos: periodos.TipoPeriodos;
    PrimerosN?: number
    Offset?: {
        TipoPeriodos: periodos.TipoPeriodos;
        UltPeriodoOffset?: number;
        NumPeriodos: number;
    }
    filtros?: {
        receptor?: {
            ruts?: string[],
            etiqueta?: {
                nombre: string,
                subetiquetas?: string[]
            },
            comunas?: string[],
            ciudades?: string[],
        },
        itemVenta?: {
            codigo?: string[],
            nombres?: string[],
            etiqueta?: {
                nombre: string,
                subetiqueta?: string[]
            }
        }
    },
    agrupacion?: {

    }
}