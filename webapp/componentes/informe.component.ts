import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { InformesService } from '../servicios/informes.service'
import { QueryDataService } from '../servicios/query-data.service'
import { Observable } from 'rxjs'
import { GraphDetail, DataTable } from "../../commons/definiciones";
import { GraphComponent } from "./graph.component";
import { appData } from 'core-sales-manager'

@Component({
    selector: 'informe',
    templateUrl: './informe.component.html'
})
export class InformeComponent implements OnInit {
    constructor(private infser: InformesService, private qds: QueryDataService) { }
    @Input() Id: string;
    Informe: any;
    Graph: GraphDetail
    @ViewChild(GraphComponent) GraphComp: GraphComponent
    dibujar() {


    }

    ngOnInit() {
        if (!this.Id) return
        if (!google.visualization) {
            Observable.forkJoin(
                this.infser.getInformeById(this.Id)
                    .do<GraphDetail[]>(x => this.GraphComp.graph = x[0])
                    .do(x => google.charts.load('current', { 
                        packages: [this.GraphComp.graph.Type.packages] , 
                        mapsApiKey: appData.MAP_KEY}))
                    .flatMap(x => Observable.from(x[0].Querys))
                    .flatMap(qd => this.qds.getQuery([qd])),
                Observable.bindCallback(google.charts.setOnLoadCallback)())
                .map(x => x[0])
                .subscribe({
                    next: x => this.GraphComp.graph.Data = new google.visualization.DataTable(x[0]),
                    error: e => console.log(e),
                    complete: () => this.GraphComp.dibujar()

                })

        } else
            this.infser.getInformeById(this.Id)
                .do<GraphDetail[]>(x => this.Graph = x[0])
                .flatMap(x => Observable.from(x[0].Querys))
                .flatMap(qd => this.qds.getQuery([qd]))
                .subscribe({
                    next: x => this.Informe = x,
                    error: e => console.log(e),
                    complete: () => this.dibujar()
                })
    }
}