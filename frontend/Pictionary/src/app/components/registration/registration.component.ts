import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { PictionaryService } from 'src/app/pictionary.service';
import { User } from 'src/app/user.model';
import { Request } from 'src/app/request.model';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  ime:String='';
  prezime:string='';
  korisnicko_ime:String='';
  lozinka:String='';
  lozinka2:String='';
  mejl:String='';
  slika:String='';
  poruka:String='';
  imagePath;
  imgURL: any;
  fileToUpload: File = null;

  constructor(private client:HttpClient, private router: Router, private service: PictionaryService) { }

  preview(files) {
    if (files.length === 0)
      return;
 
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.poruka = "Samo slike su dozvoljene.";
      return;
    }
 
    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      this.imgURL = reader.result;
      //alert(this.imgURL) 
    }
  }

  ngOnInit() {
  }

  register(){
    
  
    if(this.ime=='' || this.prezime=='' || this.korisnicko_ime=='' || this.lozinka2=='' || this.lozinka=='' || this.mejl==''){
      this.poruka='Morate popuniti sva polja!';
    }
    else{
        this.service.getUserByUsername(this.korisnicko_ime).subscribe((u:User)=>{
          if(u[0]){
            this.poruka='Korisničko ime već postoji!';
          }
          else{
            if(this.lozinka!=this.lozinka2){
              this.poruka='Lozinke se ne poklapaju!';
            }
            else{
              
                this.service.getMails(this.mejl).subscribe((u:User)=>{
                  if(u[1]){
                    this.poruka='Već postoji korisnik koji koristi ovaj mejl!';
                  }
                  else{
                      
                        this.service.findAllRequests().subscribe((rs:Request[])=>{
                        let flag:Boolean=false;
                        rs.forEach(element => {
                          let r:Request=JSON.parse(JSON.stringify(element));
                          if(r.korisnicko_ime==this.korisnicko_ime){
                          flag=true;
                          }
                        });
              
                        if(flag){
                          this.poruka="Već postoji zahtev za registracijom koji koristi to korisničko ime!"
                        }
                        else{

                          
                            
                              this.service.sendRequest(this.ime,this.prezime,this.korisnicko_ime,this.lozinka,this.mejl,this.imgURL,"korisnik").subscribe((x)=>{
                                //alert(x);
                                this.router.navigate(['/login']);
                                });
                            
                          
                        }
              
                        });
                      
                    
                  }
                
                });
              
            }
                      
            }
          });
      
    }
  }


}
