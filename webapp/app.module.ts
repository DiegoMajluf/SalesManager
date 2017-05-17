import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';

import { GraphComponent } from './componentes/graph.component'
import { InformeComponent } from "./componentes/informe.component";
import { InformesService } from "./servicios/informes.service";
import { QueryDataService } from "./servicios/query-data.service";

@NgModule({
  imports: [BrowserModule, FormsModule, HttpModule],
  declarations: [AppComponent, GraphComponent, InformeComponent],
  bootstrap: [AppComponent],
  providers: [QueryDataService, InformesService]
})
export class AppModule { }
