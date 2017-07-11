import { Component, OnInit, Input, Output, EventEmitter, forwardRef, Provider } from '@angular/core';
import { CamposNumericosEnum, GrupoReceptorEnum, GrupoItemVentaEnum, ColumnsDefinition, columnAsignation } from '../../commons/definiciones'
import { periodos } from "core-sales-manager";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CamposSelectComponent),
    multi: true
};

@Component({
    selector: 'campos-select',
    templateUrl: 'campos-select.component.html',
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class CamposSelectComponent implements OnInit, ControlValueAccessor {
    CamposNumericos = CamposNumericosEnum
    GrupoReceptor = GrupoReceptorEnum
    GrupoItemVentas = GrupoItemVentaEnum
    Periodos = periodos.TipoPeriodos
    @Input() columna: ColumnsDefinition

    colAsig: columnAsignation
    keyValueSerie: string

    private onTouchedCallback: () => void = () => { }
    private onChangeCallback: (col: columnAsignation) => void = () => { }
    constructor() { }

    KeyValueChange(keyValue: string) {
        if (Object.keys(this.colAsig).length > 0) Object.keys(this.colAsig).forEach(k => delete this.colAsig[k])
        let sel = keyValue.split('-')
        switch (sel[0]) {
            case 'campo':
                this.colAsig.campo = +sel[1]
                break
            case 'periodo':
                this.colAsig.periodo = +sel[1]
                break
            case 'receptor':
                this.colAsig.receptor = +sel[1]
                break
            case 'ItemVentas':
                this.colAsig.itemVenta = +sel[1]
                break
            case 'moneda':
                this.colAsig.moneda = 'moneda'
                break
        }
    }

    get ColumnAsignation(): string {
        if (this.colAsig && Object.keys(this.colAsig).length > 0){
            return Object.keys(this.colAsig).reduce((acc, key) => acc + `${key}-${this.colAsig[key]}`, '')
        }return null
    }

    set ColumnAsignation(col: string) {
        this.KeyValueChange(col)
        this.onChangeCallback(this.colAsig);
    }

    writeValue(col: columnAsignation) {
        this.colAsig = col;
    }

    registerOnChange(fn: (col: columnAsignation) => void) { this.onChangeCallback = fn }
    registerOnTouched(fn: () => void) { this.onTouchedCallback = fn }

    ngOnInit() { }
}