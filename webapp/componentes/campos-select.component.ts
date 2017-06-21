import { Component, OnInit } from '@angular/core';
import { CamposNumericosEnum, GrupoReceptorEnum, GrupoItemVentaEnum} from '../../commons/definiciones'
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

    keyValue: string
    constructor() { }

    ngOnInit() { }
}