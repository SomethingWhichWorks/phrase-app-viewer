import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Message } from '../models/message';
import { PhraseAppService } from '../services/phrase-app.service';

@Component({
  moduleId: module.id,
  selector: 'phrase-app-list',
  /*templateUrl: 'phrase-app-list.component.html',*/
  template: `
  <div class="warning" *ngIf="loadingMessage">{{loadingMessage}}</div>
  <div class="error" *ngIf="error">{{error}}</div>

  <div *ngIf="loadingMessage !== ''">
    <div *ngIf="selectedMessage">
    <h2>Preview Section</h2>
        <h2>
          Phrase App Key :  {{selectedMessage.key | uppercase}}
        </h2>
        <!-- <li *ngFor="let label of selectedMessage.labels">
            {{label}}
        </li> -->
        <pre>
          {{selectedMessage.labels | json }}
        </pre>
        <button (click)="gotoDetail()">View Message Details</button>
      <hr>    
    </div>

    <h2>Phrase App Keys</h2>
    <ul class="phrase-app-keys">
      <li *ngFor="let message of messages" (click)="onSelect(message)" [class.selected]="message === selectedMessage">
        <span class="message-element">
                <span class="badge">  {{message.key}}  </span> <h4> {{message.key}} </h4>
          <br>
        </span>
      </li>
    </ul>
</div>

`/*,
  styleUrls: ['heroes.component.css']*/
})

export class PhraseAppListComponent implements OnInit {
  messages: Message[];
  selectedMessage: Message;
  error: any;
  loadingMessage: string;

  constructor(
    private router: Router,
    private phraseAppService: PhraseAppService) { }

  getMessages(): void {
    this.loadingMessage = 'loading phrase app keys, please wait... ';

    var loadindMessageChanger = setInterval(function() {
      this.loadingMessage = this.loadingMessage + '.'; 
    }, 100);

    this.phraseAppService
      .getMessages()
      .then((messages) => {
        this.messages = messages;
        this.loadingMessage = '';
        clearInterval(loadindMessageChanger);
      })
      .catch((error) => {
        this.error = error
        this.loadingMessage = '';
        clearInterval(loadindMessageChanger);
    });
      
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
