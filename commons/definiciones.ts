import { periodos } from 'core-sales-manager';

export interface GraphDetail {
    Type: ChartType;
    Titulo?: string;
    Posicion?: number;
    Querys: QueryDetail[],
    Data?: google.visualization.DataTable
}

export interface QueryDetail {
    consulta: {
        UltPeriodoOffset?: number,
        NumPeriodos?: number,
        TipoPeriodos?: periodos.TipoPeriodos,
        ComparaMismaFraccionDePeriodo?: boolean,
        PrimerosNdias?: number
    }
    filtros?: {
        receptor?: {
            ruts?: (string | RegExp)[],
            razones?: (string | RegExp)[],
            etiqueta?: {
                nombre: string,
                subetiquetas: (string | RegExp)[]
            },
            comunas?: (string | RegExp)[],
            ciudades?: (string | RegExp)[],
        },
        itemVenta?: {
            tipoCod?: (string | RegExp)[],
            codigo?: (string | RegExp)[],
            nombres?: (string | RegExp)[],
            etiqueta?: {
                nombre: string,
                subetiqueta: (string | RegExp)[]
            }
        },
        documento?: {
            moneda: (string | RegExp)[]
        }
    },
    asignacion: columnAsignation[]
}


export interface columnAsignation {
    campo?: CamposNumericosEnum,
    receptor?: GrupoReceptorEnum,
    etiquetaRecep?: string,
    itemVenta?: GrupoItemVentaEnum,
    etiquetaItmVta?: string,
    periodo?: periodos.TipoPeriodos,
    moneda?: string
}

export enum CamposNumericosEnum {
    ventasExentas,
    ventasAfectas,
    ventasNetas,
    ventasBrutas,
    cantDocs,
    cantClientes,
    cantProductos,
    impuestosRetenidos
}

export enum GrupoItemVentaEnum {
    tipoCod,
    codigo,
    nombres
}

export enum GrupoReceptorEnum {
    clientes,
    comunas,
    ciudades,
    paises
}

export interface QueryResponsePoint {
    monedas: QueryResponseGroup
}

export interface QueryResponseGroup {
    [id: string]: {
        grupo?: QueryResponseGroup,
        subTotal: QueryResponseGroupSubTotal
    }
}

export interface QueryResponseGroupSubTotal {
    exento: number
    afecto: number
    neto: number
    bruto: number
    impuestos: { [codigo: string]: number }
    totalImpuesto: number
    clave: string
}


export interface Linea {
    data: QueryResponseGroupSubTotal,
    campos: QueryResponseGroupSubTotal[]
}

export interface DataTable {
    cols: ColumnaDataTable[]
    rows: FilaDataTable[]


}

export interface ColumnaDataTable {
    /**Id debe ser único en la tabla, evitar carcateres que requieran escapes */
    id?: string,
    /**Etiqueta de columna para visualización en algunos gráficos */
    label?: string,
    /**Un patrón de formato para el valor de celdas, sólo como referencia, no tiene uso */
    pattern?: string,
    /**Valores personalizados. Ej p:{style: 'border: 1px solid green;'} */
    p?: any,
    type: 'string' | 'boolean' | 'number' | 'date' | 'datetime' | 'timeofday'
}

export interface FilaDataTable {
    /**Arreglo de celdas */
    c: CeldaDataTable[]
}

export interface CeldaDataTable {
    /**Es el valor asociado a cada columna, debe coincidir con el tipo de dato */
    v?: string | boolean | number | Date,
    /**Es una versión de texto del valor v. Ej v:1000, f:$1,000.00 */
    f?: string,
    /**Valores personalizados. Ej p:{style: 'border: 1px solid green;'} */
    p?: any
}


export interface GruposDeGraficos {
    nombre: string,
    icono: string,
    charts: ChartType[]
}


export interface ChartType {
    nombre: string,
    packages: string,
    className: string,
    scope: string,
    columns: ColumnsDefinition[],
    options?: any,
    icon?: string,
    grupo: string
}

export interface ColumnsDefinition {
    descripcion: string
    opcional: boolean,
    dataType: string[],
    esRepetible: boolean

}
