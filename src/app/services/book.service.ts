import { Injectable } from '@angular/core';
import { Book } from '../model/book';
import { Page } from '../model/page';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  static book:Book = BookService.createDefaultBook();

  static createDefaultBook():Book{
    const aBook = {title:undefined,authors:[],tags:[],description:undefined,currentPage:1,pages:[]};
    for(let i = 1; i <= 32; i++){
      aBook.pages.push({num:i,text:undefined,image:undefined,croppedImage:undefined,crop:undefined, canvas:undefined});
    }
    return aBook;
  }

  constructor() { }

  getBook():Book{
    return BookService.book;  
  }

  hasNextPage():boolean{
    return BookService.book.currentPage < 32;
  }

  hasPreviousPage():boolean{
    return BookService.book.currentPage > 1;
  }

  nextPage():Page{
    if(this.hasNextPage()){
      BookService.book.currentPage = BookService.book.currentPage+1;
      return this.getCurrentPage();
    }
  }

  previousPage():Page{
    if(this.hasPreviousPage()){
      BookService.book.currentPage = BookService.book.currentPage-1;
      return this.getCurrentPage();
    }
  }

  getCurrentPage(){
    return BookService.book.pages[BookService.book.currentPage-1];
  }



  
}
