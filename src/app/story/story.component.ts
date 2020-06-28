import { Component, OnInit, ViewChild, ElementRef, Input, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import Cropper from 'cropperjs';
import { BookService } from '../services/book.service';
import { Page } from '../model/page';
import { Book } from '../model/book';
import { LayoutService } from '../services/layout.service';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.css']
})
export class StoryComponent implements OnInit, AfterViewInit {

  @ViewChild("p", { static: false })
  public pageForm: NgForm;

  @ViewChild("image", { static: false })
  public imageElement: ElementRef;

  public imageSource: string | ArrayBuffer;

  public imageDestination: string;

  public nextPageFlag:boolean;

  public prevPageFlag:boolean;

  public currentPageNumber:number;

  private cropper: Cropper;

  public htmlParagraph:string;

  private page:Page;



  constructor(private layoutService:LayoutService, private bookService:BookService) { }

  ngOnInit() {
    console.log("ngOnInit");
    this.page = this.bookService.getCurrentPage();
    this.updatePageNavigation();
  }

  
  ngAfterViewInit(): void {
    setTimeout(() => {
    this.updateCurrentPageData();
    });
  }

  onOpenFile($event: any, maxWidth:number = 800, maxHeight:number = 800): void {
    if ($event.target.files && $event.target.files[0]) {
      const reader: FileReader = new FileReader();
      let img = new Image();
      reader.onload = (e) => {
        img.src = reader.result as string;
        img.onload = (e) => {
          if(img.width > maxWidth || img.height > maxHeight){
            let factor = img.width > img.height ? img.width / maxWidth : img.height / maxHeight;
            let canvas = document.createElement('canvas');
            let context = canvas.getContext('2d');
            canvas.width = img.width / factor;
            canvas.height = img.height / factor;
            context.drawImage(img, 0,0,canvas.width,canvas.height);
            this.imageSource = canvas.toDataURL("image/png");
          }else{
            this.imageSource = img.src;
          }
        }
      };
      reader.readAsDataURL($event.target.files[0]);
    }
  }

  onBooklet(){
    this.layoutService.booklet(this.bookService.getBook());
  }

  onCreatePdf():void{
    this.layoutService.formatBook(this.bookService.getBook());
  }

  onLoadImage():void{
    console.log("onload image");
    this.destroyCropper();
    this.createCropper();         
  }

  onUpdateText(text:string):void{
    if(text != undefined){
      this.htmlParagraph = this.layoutService.layoutHtml(text,true,LayoutService.letterTypeDarkCss);
    }else{
      this.htmlParagraph = '';
    }
    this.page.text = text;
  }

  onDeleteImage():void{
    this.destroyCropper();
    this.imageSource = undefined;
    this.page.croppedImage = undefined;
    this.page.image = undefined;
  }

  
  onNextPage():void{
    this.saveCurrentPageData();
    this.page = this.bookService.nextPage();
    this.updatePageNavigation();
    this.updateCurrentPageData();
    this.diagnostic();
  }

  diagnostic() {
    const book:Book = this.bookService.getBook();
  }

  onPreviousPage():void{
    this.saveCurrentPageData();
    this.page = this.bookService.previousPage();
    this.updatePageNavigation();
    this.updateCurrentPageData();
  }

  private updatePageNavigation() {
    this.currentPageNumber = this.page.num;
    this.nextPageFlag = this.bookService.hasNextPage();
    this.prevPageFlag = this.bookService.hasPreviousPage();
  }

  private saveCurrentPageData():void{
    this.page.text = this.pageForm.form.controls.para2format.value;
    this.page.image = this.imageSource as string;
    this.page.canvas = this.cropper && this.cropper.getCanvasData() != undefined ? this.cropper.getCanvasData():undefined;
    this.page.crop = this.cropper && this.cropper.getCropBoxData() != undefined ? this.cropper.getCropBoxData() : undefined;
    
  }

  private updateCurrentPageData():void{
    this.pageForm.form.controls["para2format"].setValue(this.page.text);
    this.imageSource = undefined;
    this.imageSource = this.page.image;
  }
  
  private createCropper() {
    this.cropper = new Cropper(this.imageElement.nativeElement, {
      zoomable: true,
      scalable: false,
      center: true,
      responsive: true,
      autoCrop: true,
      background: true,
      highlight: true,
      rotatable: true,
      movable: true,
      cropBoxResizable: false,
      cropBoxMovable: true,
      minCropBoxHeight: 284,
      minCropBoxWidth: 380,
      crop: () => {
        const canvas = this.cropper.getCroppedCanvas({width:this.layoutService.MAX_IMAGE_WIDTH,height:294});
        this.imageDestination = canvas.toDataURL("image/png");
        this.page.croppedImage = this.imageDestination;
        this.page.crop = this.cropper.getCropBoxData();
        this.page.canvas = this.cropper.getCanvasData();
        this.page.image = this.imageSource as string;
      },
      ready: () => {
        if(this.page.canvas != undefined){
          this.cropper.setCanvasData(this.page.canvas);
        }
        if(this.page.crop != undefined){
          this.cropper.setCropBoxData(this.page.crop);
        }
      }
    }); 
  }

  private destroyCropper() {
    if (this.cropper != undefined) {
      this.cropper.destroy();
    }
  }

}
