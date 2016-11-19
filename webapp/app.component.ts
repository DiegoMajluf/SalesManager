import { Component } from '@angular/core';
import {appData} from 'core-sales-manager'

@Component({
  selector: 'my-app',
  templateUrl: './webapp/app.component.html'
})
export class AppComponent {
  appVars = appData;

}
