import { Component, OnInit, ViewChild, ElementRef, Input, AfterViewInit, HostListener, SecurityContext } from '@angular/core';
import { NgForm } from '@angular/forms';
import Cropper from 'cropperjs';
import { BookService } from '../services/book.service';
import { Page } from '../model/page';
import { Book } from '../model/book';
import { LayoutService } from '../services/layout.service';
import { DomSanitizer} from '@angular/platform-browser';

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

  @ViewChild("para2format", { static: false })
  public inputElement: ElementRef;


  public imageSource: string | ArrayBuffer;

  public imageDestination: string;

  public nextPageFlag: boolean;

  public prevPageFlag: boolean;

  public currentPageNumber: number;

  private cropper: Cropper;

  public htmlParagraph: string;

  private page: Page;

  public numCharsLeft: number = 120;



  constructor(private layoutService: LayoutService, private bookService: BookService, private sanitizer:DomSanitizer) { }

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

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent): void {
    if (event.key == undefined) {
      return;
    }
    switch (event.keyCode) {
      case 37:
        if (this.prevPageFlag) {
          this.onPreviousPage();
        }
        break;
      case 39:
        if (this.nextPageFlag) {
          this.onNextPage();
        }
        break;
    }
  }

  onSaveStoryJson(): void {
    let dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(this.bookService.getBookAsJson());
    //let name = this.bookService.getBook().title + getFormattedTime();
    let name = this.getFormattedTime();
    let a = document.getElementById('export-file');
    a.setAttribute("href", dataUri);
    a.setAttribute("download", `coco-${name}.json`);
    a.click();
  }

  onLoadStoryJson(): void {
    document.getElementById('import-file').click();
  }

  parseLocalFile() {
    console.log("ParseLocalFile");
    let fileElement = <HTMLInputElement>document.getElementById('import-file');
    let files = fileElement.files;
    let f = files[0];
    let reader = new FileReader();
    reader.onload = (f) => {
      console.log("Parsing book");
      if (this.bookService.parseBook(reader.result as string)) {
        console.log('Opening page');
        this.openCurrentPage();
      }
    };

    reader.readAsText(f);
  }

  onOpenFile($event: any, maxWidth: number = 800, maxHeight: number = 800): void {
    if ($event.target.files && $event.target.files[0]) {
      const reader: FileReader = new FileReader();
      let img = new Image();
      reader.onload = (e) => {
        img.src = reader.result as string;
        img.onload = (e) => {
          if (img.width > maxWidth || img.height > maxHeight) {
            let factor = img.width > img.height ? img.width / maxWidth : img.height / maxHeight;
            let canvas = document.createElement('canvas');
            let context = canvas.getContext('2d');
            canvas.width = img.width / factor;
            canvas.height = img.height / factor;
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
            this.imageSource = canvas.toDataURL("image/png");
          } else {
            this.imageSource = img.src;
          }
        }
      };
      reader.readAsDataURL($event.target.files[0]);
    }
  }

  onBooklet() {
    this.layoutService.booklet(this.bookService.getBook());
  }

  
  onLoadImage(): void {
    this.destroyCropper();
    this.createCropper();
  }

  onUpdateText(text: string): void {
    text = this.filterText(text);
      
    if (text != undefined) {
      this.htmlParagraph = this.layoutService.layoutHtml(text, true, LayoutService.letterTypeDarkCss);

    } else {
      this.htmlParagraph = '';
    }
    this.page.text = text != undefined && text.length > 0 ? text: undefined;
    this.numCharsLeft = text != undefined ? 120 - text.length : 120;
  }

  
  onDeleteImage(): void {
    this.destroyCropper();
    this.imageSource = undefined;
    this.page.croppedImage = undefined;
    this.page.image = undefined;
    this.page.crop = undefined;
    this.page.canvas = undefined;
  }


  onNextPage(): void {
    this.saveCurrentPageData();
    this.page = this.bookService.nextPage();
    this.updatePageNavigation();
    this.updateCurrentPageData();
    this.focusTextarea();
  }


  onPreviousPage(): void {
    this.saveCurrentPageData();
    this.page = this.bookService.previousPage();
    this.updatePageNavigation();
    this.updateCurrentPageData();
    this.focusTextarea();
  }

  private updatePageNavigation() {
    this.currentPageNumber = this.page.num;
    this.nextPageFlag = this.bookService.hasNextPage();
    this.prevPageFlag = this.bookService.hasPreviousPage();
  }

  private saveCurrentPageData(): void {
    const input = this.pageForm.form.controls.para2format;
    this.page.text = input.value && input.value.length > 0 ? input.value : undefined ;
    this.page.image = this.imageSource as string;
    if (this.imageSource != undefined) {
      this.page.canvas = this.cropper && this.cropper.getCanvasData() != undefined ? this.cropper.getCanvasData() : undefined;
      this.page.crop = this.cropper && this.cropper.getCropBoxData() != undefined ? this.cropper.getCropBoxData() : undefined;
    }
  }

  private updateCurrentPageData(): void {
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
      autoCrop: false,
      background: true,
      highlight: true,
      rotatable: true,
      movable: true,
      cropBoxResizable: false,
      cropBoxMovable: true,
      minCropBoxHeight: 284,
      minCropBoxWidth: 380,
      crop: () => {
        const canvas = this.cropper.getCroppedCanvas({ width: this.layoutService.MAX_IMAGE_WIDTH, height: 294 });
        this.imageDestination = canvas.toDataURL("image/png");
        this.page.croppedImage = this.imageDestination;
        this.page.crop = this.cropper.getCropBoxData();
        this.page.canvas = this.cropper.getCanvasData();
        this.page.image = this.imageSource as string;
      },
      ready: () => {
        if (this.page.canvas != undefined) {
          this.cropper.setCanvasData(this.page.canvas);
        }
        if (this.page.crop != undefined) {
          this.cropper.setCropBoxData(this.page.crop);
        }
        this.cropper.crop();
      }
    });
  }

  private destroyCropper() {
    if (this.cropper != undefined) {
      this.cropper.destroy();
    }
  }

  private openCurrentPage() {
    this.page = this.bookService.getCurrentPage();
    this.updatePageNavigation();
    this.updateCurrentPageData();
  }

  private getFormattedTime(): string {
    let today = new Date();
    let y = today.getFullYear();
    // JavaScript months are 0-based.
    let m = today.getMonth() + 1;
    let d = today.getDate();
    let h = today.getHours();
    let mi = today.getMinutes();
    let s = today.getSeconds();
    return y + "-" + m + "-" + d + "-" + h + "-" + mi + "-" + s;
  }

  private focusTextarea() {
    this.inputElement.nativeElement.focus();
  }

  private filterText(text: string):string {
    if(text == undefined ){
      return text;
    }
    return text.replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/(\r\n|\n|\r)/gm,"");
  }


}
