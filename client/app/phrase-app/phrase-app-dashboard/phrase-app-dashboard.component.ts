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
  constructor(
    private router: Router,
    private phraseAppService: PhraseAppService) {
  }

  ngOnInit(): void {

  }
}
