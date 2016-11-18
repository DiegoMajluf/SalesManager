import { Component } from '@angular/core';
import globals from '../commons/global-variables'

@Component({
  selector: 'my-app',
  templateUrl: './webapp/app.component.html'
})
export class AppComponent {
  appVars = globals;

}
