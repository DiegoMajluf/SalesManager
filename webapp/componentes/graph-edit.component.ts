import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ChartType, GruposDeGraficos, ColumnsDefinition, QueryDetail, columnAsignation } from "../../commons/definiciones";
import { periodos } from "core-sales-manager";
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
    queryDetail: QueryDetail = { consulta: {}, asignacion: [] }
    Periodos = Object.keys(periodos.TipoPeriodos)
        .filter(k => isNaN(+k))
        .map(k => {
            return {
                Nombre: `${k.charAt(0).toLocaleUpperCase() + k.substr(1)}`,
                Valor: periodos.TipoPeriodos[k]
            }
        })
    constructor() { }


    AgregarSerie(col: ColumnsDefinition) {
        this.Series.unshift(JSON.parse(JSON.stringify(col)))
    }

    AsignarAColumna() {
        console.log(this.queryDetail)

    }

    SeleccionarGrafico(gr: ChartType) {
        this.GraphSelect = gr

        this.queryDetail.asignacion = gr.columns.map((a, i) => this.queryDetail.asignacion[i] || new Object())
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