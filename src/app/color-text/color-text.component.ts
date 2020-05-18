import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { ucs2 } from 'punycode';

@Component({
  selector: 'app-color-text',
  templateUrl: './color-text.component.html',
  styleUrls: ['./color-text.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ColorTextComponent implements OnInit {

  @Input() colorText:{text:string,uc:boolean,html:string};

  html = '';

  constructor() { }

  ngOnInit() {
    this.html = this.colorText.html;
  }

}
