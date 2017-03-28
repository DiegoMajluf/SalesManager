import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { chartDefinitions, chart, columnsAsignations } from '../servicios/informes.service';
import 'google.visualization';
var chartDef = <chartDefinitions>require('../chart-definitions.json')

@Component({
  selector: 'graph',
  template: '<div #div class="grafico"></div>',
})
export class GraphComponent {
  @ViewChild('div') div: ElementRef

  chartType: chart
  colsAsig: columnsAsignations
  Chart: any
  @Input() data: google.visualization.DataTable
  @Input() item: any

  constructor() { }

  dibujar() {
    google.charts.load('current', {'packages':[this.chartType.packages]});
    this.Chart = new google[this.chartType.scope][this.chartType.className](this.div)

    // Set chart options
    var options: {}
    this.Chart.draw(this.data, options);
  }


}
