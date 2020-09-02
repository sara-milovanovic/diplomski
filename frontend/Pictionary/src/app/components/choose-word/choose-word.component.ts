import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PictionaryService } from 'src/app/pictionary.service';
import { Word } from 'src/app/word.model';
import { Room_words } from 'src/app/roomwords';
import { Lexer } from '@angular/compiler';
import { Word_c } from 'src/app/word-class.model';

@Component({
  selector: 'app-choose-word',
  templateUrl: './choose-word.component.html',
  styleUrls: ['./choose-word.component.css']
})
export class ChooseWordComponent implements OnInit {

  allWords_class:Word[]=[];
  guessedWords_class:Room_words[]=[];
  allWords:string[]=[];
  guessedWords:string[]=[];
  diff:Word_c[]=[];

  constructor(private router: Router, private service: PictionaryService) { }

  ngOnInit() {
    this.service.runGame(localStorage.getItem("room")).subscribe(()=>{

    });
    localStorage.setItem('activated','1');
    this.service.findAllWords().subscribe((w: Word[]) => {
      w.forEach(element => {
        let word=JSON.parse(JSON.stringify(element));
        this.allWords.push(word.id);
        this.allWords_class.push(word);
      });
      //alert(this.allWords);
      let room=localStorage.getItem('room');
      //alert(room);
      this.service.findWordsForRoom(room).subscribe((rw:Room_words[])=>{
        rw.forEach(element => {
          let word=JSON.parse(JSON.stringify(element));
          this.guessedWords.push(word.id_reci);
          this.guessedWords_class.push(word);
        });
        this.guessedWords.forEach(gw => {
          //alert(gw);
        });
        this.difference();
      });
    });
  }

  difference(){
    let missing = this.allWords.filter(item => this.guessedWords.indexOf(item) < 0);
    missing.forEach(element => {
      let item = this.allWords_class.find(i => i.id === element);
      let word=new Word_c(element,item.rec);
      this.diff.push(word);
    });
    this.shuffle(this.diff);
    //alert(this.diff);
  }

  shuffle(array){
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

  }

  biraj(rec){
    //alert(id_reci);
    this.service.setCurrentPainter(localStorage.getItem("username"), localStorage.getItem("room")).subscribe(()=>{
      
    });
    this.service.setCurrentWord(rec, localStorage.getItem("room")).subscribe(()=>{
        
    });
    this.router.navigate(['/game', localStorage.getItem("room"), localStorage.getItem("username")])
  }

}
