import { Component, OnInit, Input } from '@angular/core';
import { CamposNumericosEnum, GrupoReceptorEnum, GrupoItemVentaEnum, ColumnsDefinition } from '../../commons/definiciones'
import { periodos } from "core-sales-manager";

@Component({
    selector: 'campos-select',
    templateUrl: 'campos-select.component.html'
})
export class CamposSelectComponent implements OnInit {
    CamposNumericos = CamposNumericosEnum
    GrupoReceptor = GrupoReceptorEnum
    GrupoItemVentas = GrupoItemVentaEnum
    Periodos = periodos.TipoPeriodos
    @Input() columna: ColumnsDefinition

    keyValue: string
    keyValueSerie: string
    constructor() { }

    ngOnInit() { }
}