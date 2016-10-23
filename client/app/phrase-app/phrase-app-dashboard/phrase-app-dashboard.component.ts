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
   
  disableSyncButton: boolean;
  constructor(
    private router: Router,
    private phraseAppService: PhraseAppService) {
  }

  ngOnInit(): void {

  }

  refreshKeys(): void {
    console.log('Refreshing keys ');
    this.disableSyncButton = true;
    this.phraseAppService.getMessages(true).then(() => {
        this.disableSyncButton = false;
    }, () => {
       this.disableSyncButton = false;
    });
  }
}
