import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ChartType, columnsAsignations, ChartDefinitions, GraphDetail } from "../../routes/definiciones";
var chartDef = <ChartDefinitions>require('../chart-definitions.json')

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
      legend: { position: 'none' },
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
      pieSliceText: 'none'
    }
    if (this.graph.Type.options)
      Object
        .keys(this.graph.Type.options)
        .forEach(key => options[key] = this.graph.Type.options[key])
    //this.Chart.draw(this.graph.Data, options);

    this.Chart.draw(
      new google.visualization.DataTable({
        "rows": [
          { "c": [{ "v": "201701" }, { "v": 10 }, { "v": 30 }] },
          { "c": [{ "v": "201702" }, { "v": 25 }, { "v": 20 }] },
          { "c": [{ "v": "201703" }, { "v": 15 }, { "v": 10 }] },
          { "c": [{ "v": "201704" }, { "v": 30 }, { "v": 7 }] }
        ],
        "cols": [
          { "label": "mensuales", "type": "string" },
          { "label": "ventasNetas", "type": "number" },
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
    a.href = this.Chart.getImageURI()
    a.click()
  }


}
