import { Component, OnInit, Input } from '@angular/core';
import { InformesService, GraphDetail } from '../servicios/informes.service'
import {QueryDataService} from '../servicios/query-data.service'
import { Observable } from 'rxjs'

@Component({
    selector: 'selector',
    templateUrl: 'informe.component.html'
})
export class InformeComponent implements OnInit {
    constructor(private infser: InformesService, private qds: QueryDataService) { }
    @Input('default') Id: string;
    Informe: any;
    Graph: GraphDetail
    dibujar() {


    }

    ngOnInit() {
        if (!google.visualization) {
            google.charts.load('current', { 'packages': ['corechart'] });
            Observable.forkJoin(this.infser.getInformeById(this.Id), Observable.bindCallback(google.charts.setOnLoadCallback)())
                .subscribe({
                    next: x => this.Graph = x[0],
                    error: e => console.log(e),
                    complete: () => this.dibujar()
                })

                this.infser.getInformeById(this.Id)
                .map(x => Observable.from(x.Querys))
                .flatMap(x => x)
                .flatMap(qd => this.qds.getQuery(qd))
                
        } else
            this.infser.getInformeById(this.Id)
                .subscribe({
                    next: x => this.Informe = x,
                    error: e => console.log(e),
                    complete: () => this.dibujar()
                })
    }
}