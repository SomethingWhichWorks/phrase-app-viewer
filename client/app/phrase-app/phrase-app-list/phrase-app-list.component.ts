import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Message } from '../models/message';
import { PhraseAppService } from '../services/phrase-app.service';

@Component({
  moduleId: module.id,
  selector: 'phrase-app-list',
  templateUrl: 'phrase-app-list.component.html',
  styleUrls: ['phrase-app-list.component.css']
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

    this.phraseAppService
      .getMessages()
      .then((messages) => {
        this.messages = messages;
        this.loadingMessage = '';
      })
      .catch((error) => {
        this.messages = [];
        this.error = error
        this.loadingMessage = '';
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
