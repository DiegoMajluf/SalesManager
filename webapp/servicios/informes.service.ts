import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable'
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

                },
                "asignacion": {

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
    asignacion: columnsAsignations
}


export interface columnsAsignations {
    [id: string]: {
        campo?: "ventasNetas" | "ventasBrutas" | "cantDocs" | "cantClientes" | "cantProductos",
        receptor?: "ruts" | "comunas" | "ciudades",
        etiquetaRecep?: string,
        itemVenta?: "tipoCod" | "codigo" | "nombres",
        etiquetaItmVta?: string,
        periodo?: string
    }
}

export interface QueryResponsePoint {
    periodo: periodos.Periodo
    monedas: (QueryResponseGroup | QueryResponsePointData)
    numDocs: number

}

export interface QueryResponseGroup {
    [id: string]: (QueryResponseGroup | QueryResponsePointData)
}

export interface QueryResponsePointData {
    __data: {
        montoNeto?: number,
        montoBruto?: number,
        numDocs?: number,
        numClientes?: number,
        numProductos?: number
    }

}

export interface DataTable {
    cols: ColumnaDataTable[]
    rows: FilaDataTable[]


}

export interface ColumnaDataTable {
    /**Id debe ser único en la tabla, evitar carcateres que requieran escapes */
    id?: string,
    /**Etiqueta de columna para visualización en algunos gráficos */
    label?: string,
    /**Un patrón de formato para el valor de celdas, sólo como referencia, no tiene uso */
    pattern?: string,
    /**Valores personalizados. Ej p:{style: 'border: 1px solid green;'} */
    p?: any,
    type: 'string' | 'boolean' | 'number' | 'date' | 'datetime' | 'timeofday'
}

export interface FilaDataTable {
    /**Arreglo de celdas */
    c: CeldaDataTable[]
}

export interface CeldaDataTable {
    /**Es el valor asociado a cada columna, debe coincidir con el tipo de dato */
    v?: string | boolean | number | Date,
    /**Es una versión de texto del valor v. Ej v:1000, f:$1,000.00 */
    f?: string,
    /**Valores personalizados. Ej p:{style: 'border: 1px solid green;'} */
    p?: any
}

export interface chartDefinitions {
    charts: chart[],
    columnsFormats: {
        [id: number]: {
            columna: number,
            dataType: string[],
            esRepetible: boolean
        }
    }
}

export interface chart {
    nombre: "string",
    packages: "string",
    className: "string",
    scope: "string",
    columnsFormat: number
}

