import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/user.model';
import { Router } from '@angular/router';
import { PictionaryService } from 'src/app/pictionary.service';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.css']
})
export class DeleteAccountComponent implements OnInit {

  allUsers:User[]=[];
  imgURL;
  id;

  constructor(private router: Router, private service: PictionaryService) { }
  

  ngOnInit() {
    this.imgURL=localStorage.getItem("slika");

    this.service.findAllUsers().subscribe((u: User[]) => {
      u.forEach(element => {
        let us=JSON.parse(JSON.stringify(element));
        if(us.korisnicko_ime==localStorage.getItem("korisnicko_ime")){
          this.imgURL=us.slika;
          //alert(this.imgURL);
        }
        let user: User = JSON.parse(JSON.stringify(element));

        this.allUsers.push(user);
      });
    });
  }

  delete(user){
    this.allUsers.forEach(u => {
      if(u.korisnicko_ime===user){
        this.id=u.id;
      }
    });
    this.service.deleteUser(user).subscribe(()=>{
      this.allUsers=[];
      this.service.findAllUsers().subscribe((us:User[])=>{
        us.forEach(element => {
          let user:User=JSON.parse(JSON.stringify(element));
  
          this.allUsers.push(user);
  
        });
        this.service.deleteResult(this.id).subscribe(()=>{
          
        });
      });
    });
  }

}
