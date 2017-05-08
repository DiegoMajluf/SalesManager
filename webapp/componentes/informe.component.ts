import { Component, OnInit, Input } from '@angular/core';
import { InformesService } from '../servicios/informes.service'
import { QueryDataService } from '../servicios/query-data.service'
import { Observable } from 'rxjs'
import { GraphDetail, DataTable } from "../../routes/definiciones";

@Component({
    selector: 'selector',
    templateUrl: './informe.component.html'
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
            Observable.forkJoin(
                this.infser.getInformeById(this.Id)
                    .do<GraphDetail>(x => this.Graph = x)
                    .flatMap(x => Observable.from(x.Querys))
                    .flatMap(qd => this.qds.getQuery(qd))
                    .do(x => this.Graph.Data = x),
                Observable.bindCallback(google.charts.setOnLoadCallback)())
                .subscribe({
                    error: e => console.log(e),
                    complete: () => this.dibujar()
                })

        } else
            this.infser.getInformeById(this.Id)
                .do<GraphDetail>(x => this.Graph = x)
                .flatMap(x => Observable.from(x.Querys))
                .flatMap(qd => this.qds.getQuery(qd))
                .subscribe({
                    next: x => this.Informe = x,
                    error: e => console.log(e),
                    complete: () => this.dibujar()
                })
    }
}