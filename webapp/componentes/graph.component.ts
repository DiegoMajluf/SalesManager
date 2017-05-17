import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ChartType, columnsAsignations, ChartDefinitions, GraphDetail } from "../../routes/definiciones";
var chartDef = <ChartDefinitions>require('../chart-definitions.json')

@Component({
  selector: 'graph',
  template: '<div #div class="grafico"></div>',
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
    var options: any = {}
    if (this.graph.Type.options)
      Object
        .keys(this.graph.Type.options)
        .forEach(key => options[key] = this.graph.Type.options[key])
    this.Chart.draw(this.graph.Data, options);

  }


}
