import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TextService } from './text.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit {

  @ViewChild('f', { static: false }) lectureForm: NgForm;
  @ViewChild('text2format', { static: false }) inputElt: ElementRef;
  @ViewChild('player', { static: false }) audioPlayerRef: ElementRef;
  title = 'lecture';
  texts = new Array<{ text: string, uc: boolean, html: string }>();
  state: boolean = true;

  constructor(protected textService: TextService) {

  }

  ngAfterViewInit(): void {
    this.inputElt.nativeElement.focus();
  }

  onSubmit() {
    console.log(this.lectureForm);
    console.log(this.lectureForm.form.value);
    const text = this.lectureForm.form.value.text2format;
    const uc: boolean = this.lectureForm.form.value.majuscule;
    this.texts.push({ 'text': text, 'uc': uc, html: this.textService.formatHtml(text, uc) });
    this.lectureForm.form.setValue({ 'text2format': '', majuscule: this.state });
  }

  onReset() {
    console.log('onReset');
    this.texts = this.texts.splice(0, 0);
    console.log(this.texts);
  }

  onPdf() {
    console.log('Guido')
    this.textService.formatPdf(this.texts);
  }

  onRandomWords() {
    this.audioPlayerRef.nativeElement.play();
    this.texts = this.texts.splice(0,0);
    const a: Array<string> = this.textService.getRandomWords();
    const uc: boolean = this.lectureForm.form.value.majuscule;
    a.forEach(text => this.texts.push({ 'text': text, 'uc': uc, html: this.textService.formatHtml(text, uc) }));
  }

}
