import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Message } from '../models/message';
import { PhraseAppService } from '../services/phrase-app.service';

@Component({
  moduleId: module.id,
  selector: 'phrase-app-list',
  /*templateUrl: 'phrase-app-list.component.html',*/
  template: `
  <h2>Phrase App Keys</h2>
  <ul class="phrase-app-keys">
  <li *ngFor="let message of messages" (click)="onSelect(message)" [class.selected]="message === selectedMessage">
    <span class="message-element">
      <span class="badge">{{message.key}}</span> {{message.key}}
      <br>
    </span>
  </li>
</ul>

<div class="error" *ngIf="error">{{error}}</div>

<div *ngIf="selectedMessage">
  <h2>
    Phrase App Key :  {{selectedMessage.Key | uppercase}}
  </h2>
  <li *ngFor="let label of labels">
      {{label}}
  </li>
    <button (click)="gotoDetail()">View Message Details</button>
</div>
`/*,
  styleUrls: ['heroes.component.css']*/
})

export class PhraseAppListComponent implements OnInit {
  messages: Message[];
  selectedMessage: Message;
  error: any;

  constructor(
    private router: Router,
    private phraseAppService: PhraseAppService) { }

  getMessages(): void {
    this.phraseAppService
      .getMessages()
      .then(messages => this.messages = messages)
      .catch(error => this.error = error);
  }
  
  ngOnInit(): void {
    this.getMessages();
  }

  onSelect(message: Message): void {
    this.selectedMessage = message;
  }

  gotoDetail(): void {
    this.router.navigate(['/messageDetails', this.selectedMessage.key]);
  }
}
