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
  @Input() item: any

  constructor() { }

  dibujar() {
    google.charts.load('current', { 'packages': [this.graph.Type.packages] });
    this.Chart = new google[this.graph.Type.scope][this.graph.Type.className](this.div.nativeElement)

    // Set chart options
    var options: {}
    this.Chart.draw(new google.visualization.DataTable(this.graph.Data), options);
  }


}
