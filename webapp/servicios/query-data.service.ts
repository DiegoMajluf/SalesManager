import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable'
import { periodos, appData, responses } from 'core-sales-manager'
import { QueryDetail, DataTable } from "../../commons/definiciones";


type columna = {
    id?: string, label?: string, pattern?: string, p?: any,
    type: 'string' | 'boolean' | 'number' | 'date' | 'datetime' | 'timeofday'
}

type celda = { v?: string | boolean | number | Date, f?: string, p?: any }


@Injectable()
export class QueryDataService {

    constructor(private http: Http) { }

    getQuery(qd: QueryDetail[]): Observable<DataTable[]> {
        return this.http.post(`${appData.HTTP_ROOT}query/getquerys`, qd)
            .map(x => x.json())
    }
}