import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule } from '@angular/forms'
import { AppComponent } from './app.component'
import { HttpModule } from '@angular/http'

import { GraphComponent } from './componentes/graph.component'
import { InformeComponent } from "./componentes/informe.component"
import { InformesService } from "./servicios/informes.service"
import { QueryDataService } from "./servicios/query-data.service"
import { GraphEditComponent } from "./componentes/graph-edit.component"
import { ModalModule } from 'ngx-bootstrap/modal'
import { TabsModule } from 'ngx-bootstrap/tabs'

@NgModule({
  imports: [BrowserModule, FormsModule, HttpModule, ModalModule.forRoot(), TabsModule.forRoot()],
  declarations: [AppComponent, GraphComponent, InformeComponent, GraphEditComponent ],
  bootstrap: [AppComponent],
  providers: [QueryDataService, InformesService]
})
export class AppModule { }
