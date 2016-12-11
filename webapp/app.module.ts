import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }   from './app.component';
import {componentGraph} from './componentes/graph.component'
@NgModule({
  imports:      [ BrowserModule ],
  declarations: [ AppComponent, componentGraph ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
