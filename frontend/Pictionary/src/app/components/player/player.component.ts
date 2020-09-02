import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PictionaryService } from 'src/app/pictionary.service';
import { User } from 'src/app/user.model';
import { Room } from 'src/app/room.model';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {

  imgURL;
  korisnicko_ime;
  link;
  new_room='';
  password;
  rooms:Room[]=[];
  max;
  lozinka;
  activated;

  constructor(private router: Router, private service: PictionaryService) { }

  ngOnInit() {
    this.korisnicko_ime=localStorage.getItem("korisnicko_ime");
    this.service.findAllUsers().subscribe((u: User[]) => {
      u.forEach(element => {
        let us=JSON.parse(JSON.stringify(element));
        if(us.korisnicko_ime==localStorage.getItem("korisnicko_ime")){
          this.imgURL=us.slika;
          //alert(this.imgURL);
        }
      });
      this.service.findAllRooms().subscribe((r: Room[])=>{
        r.forEach(room => {
          this.rooms.push(room);
          
        });
        
      });
    });
  }

  play(){
    localStorage.setItem('activated','0');
    this.service.findIdForRoom(this.link).subscribe((r:Room[])=>{
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
      let flag=false;
      let correctPassword=false;
      this.rooms=[];
      this.service.findAllRooms().subscribe((r: Room[])=>{
        r.forEach(room => {
          this.rooms.push(room);
          if(room.naziv===this.link){
            if(room.lozinka===this.lozinka){
              correctPassword=true;
              this.activated=room.aktivna_igra;
            }
            flag=true;
          }
        });
        if(flag && correctPassword && this.activated=='0'){
          //alert('add to  room: '+localStorage.getItem('room'));
          this.service.addParticipant(localStorage.getItem('room'), localStorage.getItem('id')).subscribe(()=>{
            //alert("Participant "+localStorage.getItem("username")+" added to room "+localStorage.getItem("room"));
          });
          this.router.navigate(['/game', this.link, this.korisnicko_ime]);
        }
        else{
          if(correctPassword===true && this.activated!='1') alert("Ta soba ne postoji!");
          else{
            if(this.activated=='1'){
              alert('Igra je u toku!');
            }
            else{
              alert("Lozinka netačna!");
            }
          }
        }
      });
    });
    
    
  }

  create_room(){
    if(this.new_room==''){
      alert("Soba mora imati naziv!");
    }
    else{
      let flag=false;
      this.max=0;
      this.rooms.forEach(room => {
        if(room.id>this.max){
          this.max=room.id;
        }
        if(room.naziv===this.new_room){
          alert("Soba sa tim nazivom vec postoji!");
          flag=true;
        }
      });
      if(!flag){
        //alert('max: '+this.max);
        this.max++;
        //alert('max++: '+this.max);
        this.service.addRoom(this.max, this.new_room, this.password, localStorage.getItem("username")).subscribe(()=>{
          this.link=this.new_room;
          this.lozinka=this.password;
          this.play();
        });
      }
    }
  }

}
