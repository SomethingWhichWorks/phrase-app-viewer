import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Message } from '../models/message';
import { PhraseAppService } from '../services/phrase-app.service';

@Component({
  moduleId: module.id,
  selector: 'phrase-app-dashboard',
  templateUrl: 'phrase-app-dashboard.component.html',
  styleUrls: ['phrase-app-dashboard.component.css']
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
