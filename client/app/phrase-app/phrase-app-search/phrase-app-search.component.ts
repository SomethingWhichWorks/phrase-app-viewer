import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { PhraseAppSearchService } from '../services/phrase-app-search.service';
import { Message } from '../models/message';

@Component({
  moduleId: module.id,
  selector: 'phrase-app-search',
  /*templateUrl: 'phrase-app-search.component.html',*/
  template: `
  <div id="phrase-app-search-component">
  <h4>Phrase App Message Key Search </h4>
  <input #searchBox id="search-box" (keyup)="search(searchBox.value)" />
  <div>
    <div *ngFor="let message of messages | async"
         (click)="gotoDetail(message)" class="search-result" >
      {{message.key}}
    </div>
  </div>
</div>
`,
providers: [PhraseAppSearchService]
/*
  styleUrls: ['hero-search.component.css'],*/
  
})
export class PhraseAppSearchComponent implements OnInit {
  messages: Observable<Message[]>;
  private searchTerms = new Subject<string>();

  constructor(
    private phraseAppSearchService: PhraseAppSearchService,
    private router: Router) { }

  search(term: string): void {
    // Push a search term into the observable stream.
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.messages = this.searchTerms
      .debounceTime(300)        // wait for 300ms pause in events
      .distinctUntilChanged()   // ignore if next search term is same as previous
      .switchMap(term => term   // switch to new observable each time
        // return the http search observable
        ? this.phraseAppSearchService.search(term)
        // or the observable of empty heroes if no search term
        : Observable.of<Message[]>([]))
      .catch(error => {
        // TODO: real error handling
        console.log(error);
        return Observable.of<Message[]>([]);
      });
  }

  gotoDetail(message: Message): void {
    let link = ['/messageDetails', message.key];
    this.router.navigate(link);
  }
}
