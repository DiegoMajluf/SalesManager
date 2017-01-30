import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs'
import { periodos, appData, responses } from 'core-sales-manager'
import { QueryDetail, QueryResponsePoint } from './informes.service'
import 'google.visualization'


type columna = {
    id?: string, label?: string, pattern?: string, p?: any,
    type: 'string' | 'boolean' | 'number' | 'date' | 'datetime' | 'timeofday'
}

type celda = { v?: string | boolean | number | Date, f?: string, p?: any }


@Injectable()
export class QueryDataService {

    constructor(private http: Http) { }

    getQuery(qd: QueryDetail): Observable<google.visualization.DataTable> {
        return this.http.post(`${appData.HTTP_ROOT}/query/getquery`, qd)
            .map(x => <responses.QueryResponsePoint[]>x.json())
            .map(x => {
                let d = { cols: <columna[]>[], rows: <{ c: celda[] }[]>[] }
                let mons = Object.keys(x.reduce((acc, v) => {
                    Object.keys(v.monedas).forEach(k => acc[k] = 1)
                    return acc;
                }, {}))
                mons.forEach(m => d.cols.push({ label: 'Ventas en ' + m, type: 'number' }))
                x.forEach(p => {
                    let c: celda[] = [];
                    mons.forEach(mon => {
                        if (p.monedas[mon]) c.push(null)
                        else c.push({ v: p.monedas[mon].valor })
                    })
                })
                return new google.visualization.DataTable(d);
            })
    }
}