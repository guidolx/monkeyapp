import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TextService {

  static digrammes = 'AI|CH|OI|AN|ON|OU|IN|GN';

  static consonnes = 'BCDFGHJKLMNPQRSTVXYZ';

  static voyelles = 'AÀÂÁEÉÈÊIÎOÔUÛY';

  static muettes = 'STDPMX';

  static whitespace = ' ';

  wordIndex: number = 0;

  constructor() {
    this.shuffleWords();
  }

  getRandomWords(): Array<string> {
    const a = this.wordList.splice(this.wordIndex, 5);
    if (this.wordIndex + 5 > this.wordList.length) {
      this.shuffleWords();
      this.wordIndex = 0;
    } else {
      this.wordIndex += 5;
    }
    return a;
  }

  parseText(txt: string): { o: string, c:string, u: string, a: string } {
    const result: { o: string, c: string,  u: string, a: string } = { o: txt, c: txt.replace(/_/g,''), u: txt.toUpperCase().replace(/_/g,''), a: '' };

    const classes = { dig: '', norm: '', muet: '' };

    let charIndex = 0;
    let currentChar = 'a';
    let nextChar = 'b';
    let pt = txt.toUpperCase();
    let skipMuette = false, forceMuette = false;
    // iterating over string
    do {
      currentChar = pt.charAt(charIndex);
      nextChar = charIndex + 1 < pt.length ? pt.charAt(charIndex + 1).trim() : '';
      // double underscore - force muette
      if(currentChar == '_' && nextChar == '_'){
        forceMuette = true;
        charIndex +=1;
        console.log("Found forcemuette token");
      // single underscore - skip muette
      }else if(currentChar == '_' ){
        skipMuette = true;
        console.log("Found skipmuette token");
      }
      else if (nextChar != '' && TextService.digrammes.indexOf(currentChar + nextChar) > -1) {
        result.a = result.a + "DD";
        charIndex += 1;
      } else if (
        ((nextChar != "'" && nextChar == nextChar.toLowerCase())
          || nextChar == '') && TextService.muettes.indexOf(currentChar) > -1) {
        if(skipMuette){
          result.a = result.a + "C";
        }else{
          result.a = result.a + "M";
        }
        skipMuette = false;

      } else if (TextService.voyelles.indexOf(currentChar) > -1) {
        result.a = result.a + "V";
      } else if (/\s/.test(currentChar) == false && (currentChar != currentChar.toLowerCase())) {
        if( forceMuette ){
          result.a = result.a + 'M';
        }else{
          result.a = result.a + 'C';
        }
        forceMuette = false;
      } else if(TextService.whitespace.indexOf(currentChar) > -1){
        result.a = result.a + 'W';
      }else{
        result.a = result.a + ' ';
      }
      charIndex++;
    } while (charIndex < pt.length);
    return result;
  }  

  private shuffleWords(): void {
    this.wordList = Array<string>();
    this.words.split(',').forEach(item => this.wordList.push(item.trim()));
    // Fisher-Yates Algorithm
    // https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#Fisher_and_Yates'_original_method 

    for (let i = this.wordList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i)
      const temp = this.wordList[i];
      this.wordList[i] = this.wordList[j]
      this.wordList[j] = temp
    }
  }

  private wordList: Array<string>;

  private words: string = `Alpaga,
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
