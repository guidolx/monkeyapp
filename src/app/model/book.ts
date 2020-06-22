import {Page} from './page';

export interface Book{
    title:string;
    authors:Array<string>;
    tags:Array<string>;
    description:string;
    pages:Array<Page>;
    currentPage:number;
}