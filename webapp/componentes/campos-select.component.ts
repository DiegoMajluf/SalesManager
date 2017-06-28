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
    keyValue: string
    keyValueSerie: string

    private onTouchedCallback: () => void = () => { }
    private onChangeCallback: (col: columnAsignation) => void = () => { }
    constructor() { }

    KeyValueChange() {
        this.colAsig = {}
        let sel = this.keyValue.split('-')
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

    get ColumnAsignation(): columnAsignation {
        console.log('get', this.colAsig)
        return this.colAsig;
    }

    set ColumnAsignation(col: columnAsignation) {
        console.log('set', col)
        if (col !== this.colAsig) {
            this.colAsig = col;
            this.onChangeCallback(col);
        }
    }

    writeValue(col: columnAsignation) {
        console.log('write', col)
        if (col !== this.colAsig) {
            this.colAsig = col;
            if (col) this.keyValue = Object.keys(col).reduce((acc, key) => key + '-' + col[key])
        }
    }

    registerOnChange(fn: (col: columnAsignation) => void) { this.onChangeCallback = fn }
    registerOnTouched(fn: () => void) { this.onTouchedCallback = fn }

    ngOnInit() { }
}