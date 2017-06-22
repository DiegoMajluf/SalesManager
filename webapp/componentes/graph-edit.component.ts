import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ChartType, GruposDeGraficos, ColumnsDefinition, QueryDetail } from "../../commons/definiciones";
var chartDef = <{ [name: string]: ChartType }>require('../chart-definitions.json')
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
    Grupos: GruposDeGraficos[]
    GraphSelect: ChartType
    Series: ColumnsDefinition[] = []
    queryDetail: QueryDetail = {consulta: {}, asignacion: {}}
    constructor() { }


    AgregarSerie(col: ColumnsDefinition) {
        this.Series.unshift(JSON.parse(JSON.stringify(col)))
    }

    ngOnInit() {
        let obg = Object.keys(chartDef)
            .map(k => chartDef[k])
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