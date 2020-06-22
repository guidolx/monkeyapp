import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TextService } from '../services/text.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements AfterViewInit {

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
    const text = this.lectureForm.form.value.text2format;
    const uc: boolean = this.lectureForm.form.value.majuscule;
    this.texts.push({ 'text': text, 'uc': uc, html: this.textService.formatHtml(text, uc,TextService.letterTypeColorCss) });
    this.lectureForm.form.setValue({ 'text2format': '', majuscule: this.state });
  }

  onReset() {
    this.texts = this.texts.splice(0, 0);
    console.log(this.texts);
  }

  onPdf() {
    this.textService.formatPdf(this.texts);
  }

  onRandomWords() {
    this.audioPlayerRef.nativeElement.play();
    this.texts = this.texts.splice(0,0);
    const a: Array<string> = this.textService.getRandomWords();
    const uc: boolean = this.lectureForm.form.value.majuscule;
    a.forEach(text => this.texts.push({ 'text': text, 'uc': uc, html: this.textService.formatHtml(text, uc,TextService.letterTypeColorCss) }));
  }

}
