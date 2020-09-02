import { Component, OnInit } from '@angular/core';
import { Word_request } from 'src/app/word_request.model';
import { Router } from '@angular/router';
import { PictionaryService } from 'src/app/pictionary.service';

@Component({
  selector: 'app-wordsrequests',
  templateUrl: './wordsrequests.component.html',
  styleUrls: ['./wordsrequests.component.css']
})
export class WordsrequestsComponent implements OnInit {

  allRequests: Word_request[] = [];
  imgURL;

  constructor(private router: Router, private service: PictionaryService) { }

  ngOnInit() {
    this.imgURL=localStorage.getItem("slika");
    this.service.findAllWordsRequests().subscribe((re: Word_request[]) => {
      re.forEach(element => {
        let req: Word_request = JSON.parse(JSON.stringify(element));

        this.allRequests.push(req);

      });
    });
  }

  accept(id){

  }

  reject(id){

  }

}
