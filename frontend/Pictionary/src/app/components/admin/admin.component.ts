import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PictionaryService } from 'src/app/pictionary.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  imgURL;
  sub;
  rec;

  constructor(private router: Router, private service: PictionaryService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.imgURL=localStorage.getItem("slika");
    this.sub = this.route.params.subscribe(params => {
      this.rec = params['rec'];
      });
      
    
  }

  best_player(){
    
  }

}
