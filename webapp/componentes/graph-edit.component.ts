import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ChartDefinitions, ChartType, ColumnsDefinition, GruposDeGraficos } from "../../routes/definiciones";

@Component({
    selector: 'graph-edit',
    templateUrl: './graph-edit.component.html'
})
export class GraphEditComponent implements OnInit {
    Graficos: ChartType[]
    ColumnasDef: { [id: string]: ColumnsDefinition }
    Grupos: GruposDeGraficos[]
    constructor() { }


    ngOnInit() {
    }

}