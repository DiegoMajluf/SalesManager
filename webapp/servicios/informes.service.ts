import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs'
import { periodos } from 'core-sales-manager'

@Injectable()
export class InformesService {

    constructor(private http: Http) { }

    getInformeById(Id: string) {

        return Observable.of([{
            Graph: 'LineChart',
            Titulo: 'Ventas Totales',
            Posicion: 1,
            Query: {
                Funcion: "GetVentas",
                Params: ["return periodos.TipoPeriodos.mensuales",
                    "return "]
            }
        }])
    }
}