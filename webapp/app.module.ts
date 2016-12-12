import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { GraphComponent } from './componentes/graph.component'
@NgModule({
  imports: [BrowserModule],
  declarations: [AppComponent, GraphComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
