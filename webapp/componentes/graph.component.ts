import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import  'google.visualization';

declare var System: any

@Component({
  selector: 'graph',
  templateUrl: './webapp/componentes/graph.component.html',
})
export class componentGraph {

  chart: google.visualization.LineChart | google.visualization.ComboChart | google.visualization.PieChart
  data: google.visualization.DataTable

  constructor() {
    System.import('https://www.gstatic.com/charts/loader.js')
  }

 dibujar() {
 }



}
