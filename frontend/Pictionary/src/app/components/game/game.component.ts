import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { timer } from 'rxjs';

import io from "socket.io-client"
import { Xliff } from '@angular/compiler';
import { ActivatedRoute, Router } from '@angular/router';
import { Form } from '@angular/forms';
import { PictionaryService } from 'src/app/pictionary.service';
import { Room } from 'src/app/room.model';
import { by } from 'protractor';
import { Word } from 'src/app/word.model';
import { Room_words } from 'src/app/roomwords';
import { Word_c } from 'src/app/word-class.model';
import { User } from 'src/app/user.model';
import { LiteralMapEntry } from '@angular/compiler/src/output/output_ast';
import { Participant } from 'src/app/participant.model';
import { User_c } from 'src/app/user_class.model';
//import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GameComponent implements OnInit {

  public canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('canvas2');
  public context: CanvasRenderingContext2D;

  public clickX: number[] = [];
  public clickY: number[] = [];
  public lineWidth: number[] = [];
  public color: CanvasRenderingContext2D["strokeStyle"][] = [];
  public clickDrag: boolean[] = [];

  public eraserActive: boolean = false;
  public paint: boolean;
  public cleared: boolean = false;

  public currentWidth = 5;
  public tekst = ''; 

  public socket: any; 

  username;
  room;
  sub;
  messageText;

  messageArray=[{
    message:"poruka1", user: "sara"
  }];

  allWords_class:Word[]=[];
  guessedWords_class:Room_words[]=[];
  allWords:string[]=[];
  guessedWords:string[]=[];
  diff:Word_c[]=[];
  currentPlayer=false;

  constructor(public route:ActivatedRoute, public router: Router, public service: PictionaryService) {

  }

  time: number=10;
  timeLeft: number = this.time;
  interval;

  startTimer() {
    //alert("start");
    this.timeLeft=this.time;
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        if(this.timeLeft===0){
          this.timeLeft--;
          //alert("time!");
          this.tekst="Vreme isteklo!";
          this.nextPlayer();
        }
        else{
          this.timeLeft = -1;
        }
      }
    },1000)
  }

  pauseTimer() {
    clearInterval(this.interval);
  }

  nextPlayer(){
    let next=null;
    let f=2;
    this.service.findAllParticipants(localStorage.getItem('room')).subscribe((users:Participant[])=>{
      users.forEach(element => {
        let user=JSON.parse(JSON.stringify(element));
        //alert("current: "+user.id_igraca+" lS: "+localStorage.getItem('id')+", f: "+f);
        if(user.id_igraca==localStorage.getItem('id')){
          f=0;
          
        }
        if(f==1){
          next=user;
        }
        f++;
      });
      if(next!=null) {
        alert("next painter: "+next.id_igraca);
        this.service.findAllUsers().subscribe((users:User[])=>{
          users.forEach(element => {
            let user=JSON.parse(JSON.stringify(element));
            if(user.id==next.id_igraca){
              //alert("setCurrent "+user.korisnicko_ime);
              this.setCurrentPlayer(user.korisnicko_ime);
            }
          });
        });
      }
      else{
        //alert("poslednji igrac crtao");
        next=JSON.parse(JSON.stringify(users[0]));
        //alert("next painter: "+next.id_igraca);
        this.service.updateRound(localStorage.getItem('room')).subscribe((rooms:Room[])=>{
          let r=JSON.parse(JSON.stringify(rooms[0]));
          if(r.runda<2){
            //alert("true");
            this.service.findAllUsers().subscribe((users:User[])=>{
              users.forEach(element => {
                let user=JSON.parse(JSON.stringify(element));
                if(user.id==next.id_igraca){
                  //alert("setCurrent "+user.korisnicko_ime);
                  this.setCurrentPlayer(user.korisnicko_ime);
                }
              });
            });
          }
          else{
            //alert("false");
            this.setCurrentPlayer('');
          }
        });
      }
      
    });
  }

  updateCurrentPlayer(){
    this.service.getCurrentWord(localStorage.getItem('room')).subscribe((r:Room[])=>{
      //alert('r='+r);
      let f=false;
      r.forEach(element => {
        if(f===false){
          let room=JSON.parse(JSON.stringify(element));
          //alert('trenutno_crta='+room.trenutno_crta);
          f=false;
          if(room.trenutno_crta==localStorage.getItem('username')){
            this.currentPlayer=true;
          }
          else{
            this.currentPlayer=false;
          }
        }
      });
    });
  }

  setCurrentPlayer(player){
    this.service.setCurrentPainter(player, localStorage.getItem('room')).subscribe(()=>{
      //this.updateCurrentPlayer();
      //alert("emit");
      this.socket.emit("updateCurrentPlayer", player);
      this.updateCurrentPlayer();
    });

  }

  sendMessage(byPictionary){

    
    localStorage.setItem("currentMessage", this.messageText);

    let m='';
    let u='';
    if(!byPictionary) {
      m=this.messageText;
      u=localStorage.getItem('username');
    }
    else {
      m=this.tekst;
      u='Pictionary';
    }
    this.socket.emit("message", {message: m, user:u});
    this.messageArray.push({message: m, user:u});
    const div=document.createElement('div');
    div.className="message";
    var d = new Date(); // for now
    
    div.innerHTML=`<p class="meta">${u} <span>${d.getHours()}:${d.getMinutes()}</span></p>
    <p class="text">
        ${m}
    </p>`;
    
    this.messageText='';
    this.tekst='';
    this.service.getCurrentWord(localStorage.getItem('room')).subscribe((rooms:Room[])=>{
      let f=false;
      rooms.forEach(element => {
        let elem=JSON.parse(JSON.stringify(element));
        //alert("current message is "+localStorage.getItem("currentMessage"));
        //alert(elem.trenutna_rec+" poredi sa "+localStorage.getItem('currentMessage'))
        if(f===false){
          f=true;
          if(elem.trenutna_rec==localStorage.getItem('currentMessage')){
            //alert("pogodak!");
            div.innerHTML=`<p class="meta">${u} <span>${d.getHours()}:${d.getMinutes()}</span></p>
            <p class="text">
                POGODAK!
            </p>`;
          }
          else{
            //alert("pogresna")
            
          }
          document.querySelector(".chat-messages").appendChild(div);
        }
      });
    });
  }

  public ngOnInit() {
    this.socket = io("http://localhost:3000");
    this.sub = this.route.params.subscribe(params => {
      this.username = params['username'];
      this.room = params['room'];
      //alert(this.room);
      });

    /*if(localStorage.getItem('activated') != '1') */this.socket.emit("join_room", {username:this.username, room:this.room});
  }

  public ngAfterViewInit() {

    this.dohvatiReci();

    let canvas = document.getElementById('canvas') as
      HTMLCanvasElement;
    let context = canvas.getContext("2d");

    this.context = context;
    this.canvas = canvas;

    this.start();

    this.socket.on('user_activity', m => {
      this.tekst=m.text+m.user;
      //*********************//
      /*alert("message emitted");
      this.socket.emit("message", {message: this.tekst, user:'Pictionary'});
      */
     this.messageArray.push(m);
     const div=document.createElement('div');
     div.classList.add('message');
     var d = new Date(); // for now
     div.innerHTML=`<p class="meta">${m.user} <span>${d.getHours()}:${d.getMinutes()}</span></p>
     <p class="text">
         ${m.text}
     </p>`;
     document.querySelector('.chat-messages').appendChild(div);
    });

    //localStorage.setItem('room',this.room);
    this.service.findIdForRoom(this.room).subscribe((r:Room[])=>{
      let f=true;
      //alert("r: "+r);
      r.forEach(element => {
        if(f){
          let rm=JSON.parse(JSON.stringify(element));
          localStorage.setItem('room',rm.id);
          //alert('room id: '+localStorage.getItem('room'));
          
        }
        f=false;
      });
      //alert('-room='+localStorage.getItem('room'));
      this.updateCurrentPlayer();
    });
    

    this.socket.on("position", position => {
      this.paint = true;

      this.clickX.push(position.x - 15);
      this.clickY.push(position.y);
      this.color.push(this.context.strokeStyle);
      this.lineWidth.push(this.currentWidth);
      this.clickDrag.push(position.dragging);

      this.cleared = false;

      this.redraw();
    });

    this.socket.on("color_change", c => {
      this.setColor(c, 5);
    });

    this.socket.on("eraser_change", e => {
      this.setEraser();
    });

    this.socket.on("clear_change", c => {
      this.deleteAll();
      this.pen();
    });

    this.socket.on("paint_change", p => {
      this.paint = p;
    });

    this.socket.on("update", p => {
      //alert("game.ts on update");
      this.updateCurrentPlayer();
    });

    this.socket.on("add_message", m => {
      this.messageArray.push(m);
      const div=document.createElement('div');
      div.classList.add('message');
      var d = new Date(); // for now
      div.innerHTML=`<p class="meta">${m.user} <span>${d.getHours()}:${d.getMinutes()}</span></p>
      <p class="text">
          ${m.message}
      </p>`;
      document.querySelector('.chat-messages').appendChild(div);
      });
     

  }

  public setColor(c, w) {
    this.currentWidth = w;
    this.context.strokeStyle = c;

    this.setImages(true, false);
  }

  public setEraser() {
    this.currentWidth = 10;
    this.eraserActive = true;
    this.context.strokeStyle = 'white';

    this.setImages(false, true);
  }

  public move(direction: string) {
    this.emitMove(direction);
  }

  public addCoordinate(xx: number, yy: number, d: any) {
    const coordinates = {
      x: xx,
      y: yy,
      dragging: d
    };
    this.emitPush(coordinates);
  }

  public start() {
    let canvas = document.getElementById('canvas') as
      HTMLCanvasElement;
    let context = canvas.getContext("2d");

    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = 'black';
    context.lineWidth = 5;

    this.canvas = canvas;
    this.context = context;

    this.drawBg();

    this.createUserEvents();
  }

  public changeColor(color) {

    if (color == 'white') {
      this.setEraser();
      this.socket.emit("eraser", true);
    }
    else {
      if (this.eraserActive == false) {
        this.setColor(color, 5);
        this.socket.emit("color", color);
      }
    }
  }

  public pen() {
    this.eraserActive = false;
    this.currentWidth = 5;
    this.setImages(true, false);
  }

  public createUserEvents() {
    let canvas = this.canvas;

    canvas.addEventListener("mousedown", this.pressEventHandler);
    canvas.addEventListener("mousemove", this.dragEventHandler);
    canvas.addEventListener("mouseup", this.releaseEventHandler);
    canvas.addEventListener("mouseout", this.cancelEventHandler);

    canvas.addEventListener("touchstart", this.pressEventHandler);
    canvas.addEventListener("touchmove", this.dragEventHandler);
    canvas.addEventListener("touchend", this.releaseEventHandler);
    canvas.addEventListener("touchcancel", this.cancelEventHandler);

    document.getElementById('clear')
      .addEventListener("click", this.clearEventHandler);
  }

  public redraw() {
    if (!this.cleared) {
      let clickX = this.clickX;
      let context = this.context;
      let clickDrag = this.clickDrag;
      let clickY = this.clickY;
      for (let i = 0; i < clickX.length; ++i) {
        context.beginPath();
        if (clickDrag[i] && i) {
          context.moveTo(clickX[i - 1], clickY[i - 1]);
        } else {
          context.moveTo(clickX[i] - 1, clickY[i]);
        }
        context.strokeStyle = this.color[i];
        context.lineWidth = this.lineWidth[i];
        context.lineTo(clickX[i], clickY[i]);
        context.stroke();
      }
      context.closePath();
    }
  }

  public addClick(x: number, y: number, dragging: boolean) {
    this.clickX.push(x - 15);
    this.clickY.push(y);
    this.addCoordinate(x - 15, y, dragging);
    this.color.push(this.context.strokeStyle);
    this.lineWidth.push(this.currentWidth);
    this.clickDrag.push(dragging);
  }

  public drawBg() {
    this.setImages(true, false);
    this.context.fillStyle = "white";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  public setImages(pen, eraser) {
    if (pen) {
      (document.getElementById('pen') as HTMLImageElement).src = "../../../assets/pen.png";
    }
    else {
      (document.getElementById('pen') as HTMLImageElement).src = "../../../assets/pen2.png";
    }

    if (eraser) {
      (document.getElementById('eraser') as HTMLImageElement).src = "../../../assets/eraser.png";
    }
    else {
      (document.getElementById('eraser') as HTMLImageElement).src = "../../../assets/eraser2.png";
    }
  }

  public deleteAll() {
    this.cleared = true;
    this.drawBg();
    this.clickX = [];
    this.clickY = [];
    this.clickDrag = [];
    this.color = [];
    this.lineWidth = [];
    this.context.strokeStyle = "black";
  }

  public clearCanvas() {
    this.deleteAll();
    this.emitClear(true);
  }

  public clearEventHandler = () => {
    this.clearCanvas();
  }

  public emitMove(d){
    this.socket.emit("move", d);
  }

  public emitPush(c) {
    this.socket.emit("push", c);
  }

  public emitPaint(flag) {
    this.socket.emit("paint", flag);
  }

  public emitClear(flag) {
    this.socket.emit("clear", flag);
  }

  public releaseEventHandler = () => {
    //this.tekst = 'release';
    this.paint = false;
    this.emitPaint(false);
    this.redraw();
  }

  public cancelEventHandler = () => {
    //this.tekst = 'cancel';
    this.paint = false;
    this.emitPaint(false);
  }

  public pressEventHandler = (e: MouseEvent | TouchEvent) => {
    //this.tekst = 'press';
    let mouseX = (e as TouchEvent).changedTouches ?
      (e as TouchEvent).changedTouches[0].pageX :
      (e as MouseEvent).pageX;
    let mouseY = (e as TouchEvent).changedTouches ?
      (e as TouchEvent).changedTouches[0].pageY :
      (e as MouseEvent).pageY;
    mouseX -= this.canvas.offsetLeft;
    mouseY -= this.canvas.offsetTop;

    this.paint = true;
    this.emitPaint(true);
    this.addClick(mouseX, mouseY, false);
    this.cleared = false;
    this.redraw();
  }

  public dragEventHandler = (e: MouseEvent | TouchEvent) => {
    //this.tekst = 'drag';
    let mouseX = (e as TouchEvent).changedTouches ?
      (e as TouchEvent).changedTouches[0].pageX :
      (e as MouseEvent).pageX;
    let mouseY = (e as TouchEvent).changedTouches ?
      (e as TouchEvent).changedTouches[0].pageY :
      (e as MouseEvent).pageY;
    mouseX -= this.canvas.offsetLeft;
    mouseY -= this.canvas.offsetTop;

    if (this.paint) {
      this.addClick(mouseX, mouseY, true);
      this.redraw();
    }

    e.preventDefault();
  }

  biraj(rec){
    //alert("biraj");

    //alert(id_reci);
    localStorage.setItem("currentMessage", rec);

    this.service.setCurrentPainter(localStorage.getItem("username"), localStorage.getItem("room")).subscribe(()=>{
      
    });
    this.service.setCurrentWord(rec, localStorage.getItem("room")).subscribe(()=>{
        
    });
    this.router.navigate(['/game', localStorage.getItem("room"), localStorage.getItem("username")]);

    this.updateCurrentPlayer();
    
    this.startTimer();
  }

  dohvatiReci(){
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

  startGame(){
    this.service.runGame(localStorage.getItem("room")).subscribe(()=>{

    });
    localStorage.setItem('activated','1');
  }

}