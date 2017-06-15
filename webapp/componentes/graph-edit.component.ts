import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ChartType, GruposDeGraficos, ColumnsDefinition } from "../../routes/definiciones";
var chartDef = <{[name: string]: ChartType}>require('../chart-definitions.json')
@Component({
    selector: 'graph-edit',
    templateUrl: './graph-edit.component.html',
    styles: [
        '.select {background-color: #d9edf7}',
        'tab {padding-top: 1em}'
    ]
})
export class GraphEditComponent implements OnInit {
    Graficos: ChartType[]
    ColumnasDef = chartDef.columnsFormats
    Grupos: GruposDeGraficos[]
    GraphSelect: ChartType
    Series: ColumnsDefinition[] = []
    constructor() { }


    ngOnInit() {
        let obg = Object.keys(chartDef.charts)
            .map(k => chartDef.charts[k])
            .filter(g => g.grupo)
            .reduce((acc, g) => {
                if (!acc[g.grupo]) acc[g.grupo] = <GruposDeGraficos>{
                    nombre: g.grupo,
                    charts: [],
                    icono: g.className + '.png'
                }
                acc[g.grupo].charts.push(g)
                return acc
            }, <{ [id: string]: GruposDeGraficos }>{})

        this.Grupos = Object.keys(obg)
            .map(k => obg[k])

    }

}