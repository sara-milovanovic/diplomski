import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/user.model';
import { PictionaryService } from 'src/app/pictionary.service';


@Component({
  selector: 'app-prijava',
  templateUrl: './prijava.component.html',
  styleUrls: ['./prijava.component.css']
})
export class PrijavaComponent implements OnInit {

  korisnicko_ime: String='';
  lozinka: String='';
  poruka: String='';

  constructor(private router: Router, private service: PictionaryService) { }

  ngOnInit() {
    localStorage.clear();
    
  }

  login():void{
    
    if(this.korisnicko_ime=='' || this.lozinka==''){
      this.poruka='Morate popuniti sva polja!'
    }
    else{
      this.service.login(this.korisnicko_ime).subscribe((user: User)=>{
        if(user[0]){
          let u:User=JSON.parse(JSON.stringify(user[0]));
    
            if(u.lozinka==this.lozinka){

              localStorage.setItem('username',u.korisnicko_ime);
              localStorage.setItem('password',u.lozinka);
              localStorage.setItem('name',u.ime);
              localStorage.setItem('surname',u.prezime);
              localStorage.setItem('id',u.id);
              localStorage.setItem('slika', u.slika);
              //alert('id='+u.id);
              localStorage.setItem('korisnicko_ime',u.korisnicko_ime);
              if(u.tip=='admin')
                this.router.navigate(['/admin']);
              else {
                this.router.navigate(['/player']);
              }
            }
            else{
              this.poruka="Pogrešna lozinka!";
            }
          
        }
        else{
          this.poruka = "Ne postoji korisničko ime "+this.korisnicko_ime;
        }
       
      })
    }
  }



}
