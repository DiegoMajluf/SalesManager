import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import {Observable} from 'rxjs'

@Injectable()
export class InformesService {

    constructor(private http: Http) { }

    getInformeById(Id: string){

        return Observable.of([{
            Graph: 'LineChart',
            Titulo: 'Ventas Totales',
            Posicion: 1
        }])
    }
}