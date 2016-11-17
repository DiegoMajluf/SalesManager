import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import  'google.visualization'


@Component({
  selector: 'grafico',
  templateUrl: './app/componentes/dte-recibidos.component.html',
})
export class componentVentas {

  chart: google.visualization.LineChart | google.visualization.ComboChart
  data: google.visualization.DataTable


 dibujar() {
   this.data.
   this.chart.draw()
 }



}
