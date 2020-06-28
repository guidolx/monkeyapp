import { Component,ViewEncapsulation } from '@angular/core';
import { LayoutService } from './services/layout.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent  {

  
  constructor() {
    LayoutService.initFonts();
  }

  

}
