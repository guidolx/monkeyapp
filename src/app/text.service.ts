import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';


@Injectable({
  providedIn: 'root'
})
export class TextService {

  static digrammes = 'AI|CH|OI|AN|ON|OU|IN|GN';
  
  static consonnes = 'BCDFGHJKLMNPQRSTVXYZ';

  static voyelles = 'AÀÂÁEÉÈÊIÎOÔUÛY';

  wordIndex:number = 0;

  constructor() { 
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    this.shuffleWords();
  }

  getRandomWords():Array<string>{
    const a = this.wordList.splice(this.wordIndex,5);
    if(this.wordIndex + 5 > this.wordList.length){
      this.shuffleWords();
      this.wordIndex = 0;
    }else{
      this.wordIndex += 5;
    }
    return a;
  }

  formatHtml(text:string, uppercase:boolean):string{
    console.log('formatting text ' + text);
    const textUC = text.toUpperCase();

    let i = 0;
    let uc = '';
    let cls = '', val = '';
    let html = '';
    
    do{
      uc = textUC.slice(i,i+2);
      val = uppercase ? textUC.charAt(i):text.charAt(i);
      cls = 'consonne';
      
      if(uc.length == 2 && TextService.digrammes.indexOf(uc) > -1){
        cls = 'digramme';
        val = uppercase ? uc : text.substring(i,i+2);
        ++i;
      }else if(TextService.voyelles.indexOf(textUC.charAt(i)) > -1){
        cls = 'voyelle';
      }

      i++;
      html = html.concat(`<span class='${cls}'>${val}</span>`);
    }while(i < textUC.length);

    return html;

  }

  formatPdf(texts:Array<{text:string,uc:boolean,html:string}>){
    if(texts == undefined || texts.length == 0){
      return;
    }

    console.log('starting pdf generation');
    
    const dd = this.createDocDefinition();

    texts.forEach(item => {
      dd.content.push(this.formatPdfParagraph(item));
    });

    pdfMake.createPdf(dd).open();
  }
  
  formatPdfParagraph(item: { text: string; uc: boolean; html: string; }): {text:Array<{text:any,style:string}>} {
    const textUC = item.text.toUpperCase();

    let i = 0;
    let uc = '';
    let cls = '', val = '';
    const pdfParagraph = {text:Array<{text:any,style:string}>(),style:'para'};
    
    do{
      uc = textUC.slice(i,i+2);
      val = item.uc ? textUC.charAt(i):item.text.charAt(i);
      cls = 'consonne';
      
      if(uc.length == 2 && TextService.digrammes.indexOf(uc) > -1){
        cls = 'digramme';
        val = item.uc ? uc : item.text.substring(i,i+2);
        ++i;
      }else if(TextService.voyelles.indexOf(textUC.charAt(i)) > -1){
        cls = 'voyelle';
      }
      i++;
      pdfParagraph.text.push({text:val, style:cls});
    }while(i < textUC.length);
    
    return pdfParagraph;
  }


  private createDocDefinition():{content: any,styles:any}{
    var docDefinition = {
      content: [{
          svg: '<svg width="41px" height="37px" viewBox="0 0 41 37" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Desktop" transform="translate(-32.000000, -32.000000)" fill="#F9F9F9"><g id="fm" transform="translate(32.000000, 32.000000)"><path d="M20.375,0 C13.50071,0 7.41887,3.9133474 6.09375,10.0625 C5.47129,9.3799925 4.74051,8.96875 3.9375,8.96875 C1.76169,8.96875 0,11.881346 0,15.5 C0,19.118654 1.76169,22.0625 3.9375,22.0625 C4.09482,22.0625 4.25377,22.0612 4.40625,22.03125 C1.96987,29.249401 9.04823,37 20.375,37 C31.73143,37 38.83661,29.202987 36.34375,21.96875 C36.55025,22.02454 36.75277,22.0625 36.96875,22.0625 C39.14456,22.0625 40.90625,19.118654 40.90625,15.5 C40.90625,11.881346 39.14456,8.96875 36.96875,8.96875 C36.10951,8.96875 35.33458,9.4462069 34.6875,10.21875 C33.43153,3.9813073 27.30646,0 20.375,0 Z M14.1875,5 C14.30277,4.9929 14.44579,5 14.5625,5 C17.01343,5 19.18794,6.594866 20.3749976,8.96875 C21.56207,6.594866 23.70532,5 26.15625,5 C29.89101,5 32.8749976,8.460342 32.8749976,13 C32.8749976,14.915168 32.37294,16.914199 31.46875,18.3125 C33.58203,20.077752 34.877,21.504523 34.8749976,24.84375 C34.872,30.451556 29.37501,34.9983 20.3749976,35.0000005 C11.37501,35.0017 5.878,30.451556 5.87499763,24.84375 C5.873,21.504523 7.13673,20.077752 9.25,18.3125 C8.34581,16.914199 7.87499763,14.915169 7.87499763,13 C7.87499763,8.602208 10.61426,5.2204 14.1875,5 Z M4.5,11.03125 C4.99392,11.03125 5.46219,11.217633 5.875,11.53125 C5.69997,13.510395 5.99085,15.679116 6.875,18 C6.29239,18.621453 5.81205,19.255153 5.40625,19.90625 C5.12183,20.03972 4.81297,20.125 4.5,20.125 C2.83082,20.125 1.5,18.079086 1.5,15.5625 C1.5,13.045914 2.83082,11.03125 4.5,11.03125 Z M36.40625,11.03125 C38.07543,11.03125 39.40625,13.045914 39.40625,15.5625 C39.40625,18.079086 38.07543,20.125 36.40625,20.125 C36.01262,20.125 35.62689,20.019401 35.28125,19.8125 C34.88725,19.194302 34.42915,18.59109 33.875,18 C34.74079,15.727298 35.02713,13.602222 34.875,11.65625 C35.32424,11.264172 35.84955,11.03125 36.40625,11.03125 Z M15.4375,11.40625 C13.89644,11.40625 12.65625,12.838384 12.65625,14.59375 C12.65625,16.349116 13.89644,17.78125 15.4375,17.78125 C16.97856,17.78125 18.21875,16.349116 18.21875,14.59375 C18.21875,12.838384 16.97856,11.40625 15.4375,11.40625 Z M25.1875,11.40625 C23.64644,11.40625 22.375,12.838384 22.375,14.59375 C22.375,16.349116 23.64644,17.78125 25.1875,17.78125 C26.72856,17.78125 27.96875,16.349116 27.96875,14.59375 C27.96875,12.838384 26.72856,11.40625 25.1875,11.40625 Z M15.8125,11.9375 C16.38953,11.9375 16.875,12.391722 16.875,12.96875 C16.875,13.545778 16.38953,14.03125 15.8125,14.03125 C15.23547,14.03125 14.78125,13.545778 14.78125,12.96875 C14.78125,12.391722 15.23547,11.9375 15.8125,11.9375 Z M25.5625,11.9375 C26.13953,11.9375 26.59375,12.391722 26.59375,12.96875 C26.59375,13.545778 26.13953,14.03125 25.5625,14.03125 C24.98547,14.03125 24.5,13.545778 24.5,12.96875 C24.5,12.391722 24.98547,11.9375 25.5625,11.9375 Z M30.3125,24.375 C30.1554454,24.3974889 30.0114772,24.4750102 29.90625,24.59375 C26.93258,26.522549 23.91903,27.859069 20.78125,28.0625 C17.64347,28.265931 14.3628,27.339084 10.6875,24.59375 C10.5361994,24.4785392 10.3430492,24.4330921 10.15625,24.46875 C9.88145188,24.507139 9.65879155,24.7110199 9.59640054,24.9813809 C9.53400954,25.2517419 9.64481262,25.5325758 9.875,25.6875 C13.74774,28.580309 17.41256,29.63073 20.875,29.40625 C24.33744,29.18177 27.5451,27.685197 30.625,25.6875 C30.9873985,25.6011718 31.2112143,25.2374257 31.1249266,24.8750175 C31.0386389,24.5126093 30.6749179,24.2887529 30.3125,24.375 L30.3125,24.375 Z" id="path3755"></path></g></g></g></svg>',
          fit: [50, 45],
          margin:[5,5,5,25]

        }
      ],

      styles: {
        digramme: {
          fontSize: 30,
          bold: true,
          color: 'green'
        },
        consonne: {
          fontSize: 30,
          bold: true,
          color: 'blue'
        },
        voyelle:{
          fontSize: 30,
          bold: true,
          color: 'red'
        },
        para:{
          lineHeight: 2
        }
      }
    };
    return docDefinition;
  }

  private shuffleWords():void{
    this.wordList = Array<string>();
    this.words.split(',').forEach(item => this.wordList.push(item.trim()));
    // Fisher-Yates Algorithm
    // https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#Fisher_and_Yates'_original_method 
    
    for(let i = this.wordList.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * i)
      const temp = this.wordList[i];
      this.wordList[i] = this.wordList[j]
      this.wordList[j] = temp
    }
  }

  private wordList:Array<string>;

  private words:string = `Alpaga,
  Arc,
  Ananas,
  As,
  Balai,
  Bavoir,
  Bébé,
  Bidon,
  Bijou,
  Blé,
  Bocal,
  Bol,
  Bonbon,
  Bouchon,
  Boulon,
  Bouton,
  Bus,
  Cactus,
  Café,
  Caméléon,
  Caméra,
  Canapé,
  Canari,
  Car,
  Carton,
  Castor,
  Clé,
  Cheval,
  Chignon,
  Chips,
  Chou,
  Clou,
  Cochon,
  Col,
  Dé,
  Domino,
  Dragon, 
  Écran,
  Écrou,
  Fil,
  Flan,
  Four,
  Fourmi,
  Iris,
  Jardin,
  Jeton,
  Kaki,
  Kiwi,
  Kayak,
  Koala,
  Lac,
  Lama,
  Lapin,
  Lavabo,
  Lutin,
  Magnolia,
  Maman,
  Melon,
  Maracas,
  Ours,
  Panda,
  Pantalon,
  Papa,
  Parasol, 
  Marin,
  Micro,	
  Miroir,
  Moto,
  Mouchoir,
  Mouton,
  Mur,
  Nounours,
  Os,
  Parc,
  Piano,
  Patin,
  Pélican,
  Pingouin,
  Pluton,
  Puma,
  Radio,
  Roi,
  Sac,
  Sapin,
  Savon,
  Tatou,
  Tiroir,
  Tournesol, 	
  Tricotin,
  Uranus,
  Urinoir,
  Vélo,
  Vénus,
  Vis,
  Violon,
  Volcan,
  Yaourt,
  Zébu`;


}
