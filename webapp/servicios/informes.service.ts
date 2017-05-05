import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable'
import { periodos } from 'core-sales-manager';
import { QueryDataService } from './query-data.service'
import { GraphDetail, TipoDato } from "../../routes/definiciones";


@Injectable()
export class InformesService {

    constructor(private http: Http, private queryData: QueryDataService) { }

    getInformeById(Id: string): Observable<GraphDetail> {

        return Observable.of<GraphDetail>({
            Graph: 'LineChart',
            Titulo: 'Ventas Totales',
            Posicion: 1,
            Querys: [{
                "consulta": {
                    "UltPeriodoOffset": -1,
                    "NumPeriodos": 12,
                    "TipoPeriodos": 3
                },
                "filtros": {

                },
                "asignacion": {
                    "0": {
                        "periodo": "periodo"
                    },
                    "1": {
                        "campo": TipoDato.ventasNetas
                    },
                    "2": {
                        "receptor": "clientes"
                    }
                }
            }]

        })
    }



}



