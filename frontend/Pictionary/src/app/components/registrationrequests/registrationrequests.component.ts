import { Component, OnInit } from '@angular/core';
import { PictionaryService } from 'src/app/pictionary.service';
import { Router } from '@angular/router';
import { User } from 'src/app/user.model';
import { Request } from 'src/app/request.model';
import { User_c } from 'src/app/user_class.model';

@Component({
  selector: 'app-registrationrequests',
  templateUrl: './registrationrequests.component.html',
  styleUrls: ['./registrationrequests.component.css']
})
export class RegistrationrequestsComponent implements OnInit {

  allRequests: Request[] = [];
  allUsers: User[] = [];
  imgURL;

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
      });
    });

    this.service.findAllUsers().subscribe((us: User[]) => {
      us.forEach(element => {
        let user: User = JSON.parse(JSON.stringify(element));

        this.allUsers.push(user);

      });
    });

    this.service.findAllRequests().subscribe((re: Request[]) => {
      re.forEach(element => {
        let req: Request = JSON.parse(JSON.stringify(element));

        this.allRequests.push(req);

      });
    });

  }

  reject(korisnicko_ime) {
    this.service.deleteRequest(korisnicko_ime).subscribe(() => {
      this.allRequests = [];
      this.service.findAllRequests().subscribe((re: Request[]) => {
        re.forEach(element => {
          let req: Request = JSON.parse(JSON.stringify(element));

          this.allRequests.push(req);

        });
      });
    });
  }

  accept(korisnicko_ime) {
    let u: Request;
    this.allRequests.forEach(element => {
      if (element.korisnicko_ime == korisnicko_ime) {
        u = element;
      }
    });
    let max = 0;
    this.allUsers.forEach(element => {
      if (parseInt(element.id) > max) max = parseInt(element.id);
    });
    max++;
    let user: User_c = new User_c(max + '', false, u.ime, u.prezime, u.korisnicko_ime, u.lozinka, 'korisnik', u.slika, u.mejl);
    this.service.deleteRequest(korisnicko_ime).subscribe(() => {
      this.allRequests = [];
      this.service.findAllRequests().subscribe((re: Request[]) => {
        re.forEach(element => {
          let req: Request = JSON.parse(JSON.stringify(element));

          this.allRequests.push(req);

        });
        this.service.addUser(user.id, false, user.ime, u.prezime, u.korisnicko_ime, u.lozinka, 'korisnik', u.slika, u.mejl).subscribe(() => {
          this.allUsers = [];
          this.service.findAllUsers().subscribe((us: User[]) => {
            us.forEach(element => {
              let user: User = JSON.parse(JSON.stringify(element));

              this.allUsers.push(user);

            });
            //DODATI PRAZAN REZULTAT
          });
        });
      });
    });
  }

}
