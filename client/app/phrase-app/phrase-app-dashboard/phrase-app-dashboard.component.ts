import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Message } from '../models/message';
import { PhraseAppService } from '../services/phrase-app.service';

@Component({
  moduleId: module.id,
  selector: 'phrase-app-dashboard',
  /* templateUrl: 'dashboard.component.html',*/
  template: `<h2>Phrase App Dashboard</h2>
<!-- <div class="grid grid-pad">
  <div *ngFor="let message of messages" (click)="gotoDetail(message)" class="col-1-4">
    <div class="module phrase-app-list">
      <h4>{{message.key}}</h4>
    </div>
  </div>
</div>  -->

<h3> Search for phrase App Key : </h3>
<phrase-app-search></phrase-app-search>
`/*,
  styleUrls: ['phrase-app-dashboard.component.css']*/
})
export class PhraseAppDashboardComponent implements OnInit {
  messages: Message[] = [];

  constructor(
    private router: Router,
    private phraseAppService: PhraseAppService) {
  }

  ngOnInit(): void {
    this.phraseAppService.getMessages()
      .then(messages => this.messages = messages.slice(1, 5));
  }

  gotoDetail(message: Message): void {
    let link = ['/messageDetails', message.key];
    this.router.navigate(link);
  }
}
