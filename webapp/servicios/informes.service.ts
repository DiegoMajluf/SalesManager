import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable'
import { periodos } from 'core-sales-manager';
import { QueryDataService } from './query-data.service'
import { GraphDetail, CamposNumericosEnum, ChartType } from "../../commons/definiciones";
var chartDef = <{[name: string]: ChartType}>require('../chart-definitions.json')


@Injectable()
export class InformesService {

    constructor(private http: Http, private queryData: QueryDataService) { }

    getInformeById(Id: string): Observable<GraphDetail[]> {

        return Observable.of<GraphDetail[]>([{
            Type: chartDef['TableChart'],
            Titulo: 'Ventas Totales',
            Posicion: 1,
            Querys: [{
                "consulta": {
                    "UltPeriodoOffset": 0,
                    "NumPeriodos": 5,
                    "TipoPeriodos": 3
                },
                "filtros": {

                },
                "asignacion": {
                    "0": {
                        "periodo": "mensuales"
                    },
                    "1": {
                        "campo": CamposNumericosEnum.ventasNetas
                    },
                    "2": {
                        "campo": CamposNumericosEnum.ventasNetas
                    },

                }
            }]

        }])
    }



}



