import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs'
import { periodos } from 'core-sales-manager';
import { QueryDataService } from './query-data.service'
import 'google.visualization'


@Injectable()
export class InformesService {

    constructor(private http: Http, private queryData: QueryDataService) { }

    getInformeById(Id: string): Observable<GraphDetail> {

        return Observable.of({
            Graph: 'LineChart',
            Titulo: 'Ventas Totales',
            Posicion: 1,
            Querys: [{
                "consulta": {
                    "UltPeriodoOffset": -1,
                    "NumPeriodos": 12,
                    "TipoPeriodos": 3,
                    "campos": {
                        "ventasNetas": true,
                        "ventasBrutas": true,
                        "cantDocs": false,
                        "cantClientes": true,
                        "cantProductos": true
                    }
                },
                "filtros": {

                }
            }]

        })
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
        ComparaMismaFraccionDePeriodo?: boolean,
        PrimerosNdias?: number
    }
    filtros?: {
        receptor?: {
            ruts?: (string | RegExp)[],
            razones?: (string | RegExp)[],
            etiqueta?: {
                nombre: string,
                subetiquetas: (string | RegExp)[]
            },
            comunas?: (string | RegExp)[],
            ciudades?: (string | RegExp)[],
        },
        itemVenta?: {
            tipoCod?: (string | RegExp)[],
            codigo?: (string | RegExp)[],
            nombres?: (string | RegExp)[],
            etiqueta?: {
                nombre: string,
                subetiqueta: (string | RegExp)[]
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

export interface QueryResponsePoint {
    periodo: periodos.Periodo
    monedas: {
        [moneda: string]: {
            data: QueryResponsePointData;
            grupoCliente?: {
                etiquetas?: { [id: string]: QueryResponsePointData }
                ruts?: { [id: string]: QueryResponsePointData }
                comunas?: { [id: string]: QueryResponsePointData }
                ciudades?: { [id: string]: QueryResponsePointData }
            }
            grupoProducto?: {
                tipoCod?: { [id: string]: QueryResponsePointData }
                codigo?: { [id: string]: QueryResponsePointData }
                nombres?: { [id: string]: QueryResponsePointData }
                etiqueta?: { [id: string]: QueryResponsePointData }
            }
        }
    }
    numDocs: number
    grupoEtiquetas?: string

}

export interface QueryResponsePointData {
    montoNeto?: number,
    montoBruto?: number,
    numDocs?: number,
    numClientes?: number,
    numProductos?: number

}

export interface DataTable {
    cols: ColumnaDataTable[]
    rows: FilaDataTable[]


}

export interface ColumnaDataTable {
    id?: string, label?: string, pattern?: string, p?: any,
    type: 'string' | 'boolean' | 'number' | 'date' | 'datetime' | 'timeofday'
}

export interface FilaDataTable {
    c: {v?: string | boolean | number | Date, f?: string, p?: any}[]
}