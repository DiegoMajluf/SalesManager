import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ChartType, columnsAsignations, ChartDefinitions, GraphDetail } from "../../routes/definiciones";
var chartDef = <ChartDefinitions>require('../chart-definitions.json')

declare var canvg: any

@Component({
  selector: 'graph',
  template: `
  <span #div class="grafico"></span>
  <button (click)='imprimir()'>Descargar Imagen</button>
  `,
  styles: [
    `.grafico {
      height:20px;
      weigth: 20px;
    }`
  ]
})
export class GraphComponent {
  @ViewChild('div') div: ElementRef
  colsAsig: columnsAsignations
  Chart: any
  @Input() graph: GraphDetail

  constructor() { }

  dibujar() {
    this.Chart = new google[this.graph.Type.scope][this.graph.Type.className](this.div.nativeElement)

    // Set chart options
    var options: any = {
      legend: 'none',
      hAxis: {
        textPosition: 'none',
        gridlines: {
          color: 'transparent'
        }
      },
      vAxis: {
        textPosition: 'none',
        gridlines: {
          color: 'transparent'
        }
      },
      chartArea: { width: '100%', height: '100%' },
      width: 100,
      height: 100,
      displayMode: 'markers',
    }
    if (this.graph.Type.options)
      Object
        .keys(this.graph.Type.options)
        .forEach(key => options[key] = this.graph.Type.options[key])
    //this.Chart.draw(this.graph.Data, options);

    this.Chart.draw(
      new google.visualization.DataTable({
        "rows": [
          { "c": [{ "v": "1" }, { "v": 3 }, { "v": 1 }] },
          { "c": [{ "v": "2" }, { "v": 4 }, { "v": 5 }] },
          { "c": [{ "v": "3" },  { "v": 6 }, { "v": 4 }] },
          { "c": [{ "v": "4" },  { "v": 2 }, { "v": 7 }] },
          { "c": [{ "v": "5" },  { "v": 8 }, { "v": 2 }] },
          { "c": [{ "v": "6" },  { "v": 2 }, { "v": 4 }] },
          { "c": [{ "v": "7" },  { "v": 7 }, { "v": 8 }] },
          { "c": [{ "v": "8" },  { "v": 8 }, { "v": 5 }] },
          { "c": [{ "v": "9" },  { "v": 1 }, { "v": 3 }] },
          { "c": [{ "v": "10" },  { "v": 6 }, { "v": 6 }] },
          { "c": [{ "v": "11" },  { "v": 5 }, { "v": 7 }] },
          { "c": [{ "v": "13" },  { "v": 4 }, { "v": 5 }] },
          { "c": [{ "v": "14" },  { "v": 3 }, { "v": 2 }] },
          { "c": [{ "v": "16" }, { "v": 6 }, { "v": 3 }] }
        ],
        "cols": [
          { "label": "mensuales", "type": "string" },
          { "label": "mensuales", "type": "number" },
          { "label": "ventasNetas", "type": "number" }
        ]
      })
      , options);

  }

  imprimir() {
    let a = document.createElement('a')
    document.body.appendChild(a)
    a.style.display = 'none'
    a.download = this.graph.Type.className

    if ('getImageURI' in this.Chart) {
      a.href = this.Chart.getImageURI()
    } else {
      let sv = document.getElementsByTagName('svg')[0]
      let cnv = document.createElement('canvas')
      canvg(cnv, sv.outerHTML)

      a.href = cnv.toDataURL()
    }

    a.click()

  }


}
