export interface Page{
    num:number;
    image:string;
    croppedImage:string;
    text:string;
    canvas:{left:number,top:number,width:number,height:number,naturalWidth:number,naturalHeight:number};
    crop:{height:number,width:number,top:number,left:number};
    blankPage?:boolean;
}