import { Component, OnInit, Input } from '@angular/core';
import { InformesService } from '../servicios/informes.service'
import { Observable } from 'rxjs'

@Component({
    selector: 'selector',
    templateUrl: 'informe.component.html'
})
export class InformeComponent implements OnInit {
    constructor(private infser: InformesService) { }
    @Input('default') Id: string;
    Informe: any
    dibujar() {

    }

    ngOnInit() {
        if (!google.visualization) {
            google.charts.load('current', { 'packages': ['corechart'] });
            Observable.forkJoin(this.infser.getInformeById(this.Id), Observable.bindCallback(google.charts.setOnLoadCallback)())
                .subscribe({
                    next: x => this.Informe = x[0],
                    error: e => console.log(e),
                    complete: () => this.dibujar()
                })

        } else
            this.infser.getInformeById(this.Id)
                .subscribe({
                    next: x => this.Informe = x,
                    error: e => console.log(e),
                    complete: () => this.dibujar()
                })
    }
}