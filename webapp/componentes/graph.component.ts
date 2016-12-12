import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'google.visualization';

@Component({
  selector: 'graph',
  template: '<div #div class="grafico"></div>',
})
export class GraphComponent {
  @ViewChild('div') div: ElementRef

  chart: google.visualization.LineChart | google.visualization.ComboChart | google.visualization.PieChart
  @Input() data: google.visualization.DataTable
  @Input() item: any

  constructor() { }

  dibujar() {
    this.chart = new google.visualization.PieChart(this.div.nativeElement);

    // Set chart options
    var options: google.visualization.PieChartOptions = {
      'title': this.item.Titulo,
      'width': 400,
      'height': 300
    };
    (<google.visualization.PieChart>this.chart).draw(this.data, options);
  }


}
