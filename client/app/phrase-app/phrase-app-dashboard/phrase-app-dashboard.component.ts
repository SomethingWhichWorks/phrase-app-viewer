import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import * as $ from 'jquery';

import { Message } from '../models/message';
import { PhraseAppService } from '../../services/phrase-app.service';


@Component({
  moduleId: module.id,
  selector: 'phrase-app-dashboard',
  templateUrl: 'phrase-app-dashboard.component.html',
  styleUrls: ['phrase-app-dashboard.component.css']
})

export class PhraseAppDashboardComponent implements OnInit {
  disableAll: boolean;
  lastLoadedTime: string;
  @ViewChild('progressBar') progressBar: ElementRef;
  constructor(
    private router: Router,
    private phraseAppService: PhraseAppService) {
  }

  ngOnInit(): void {
    var currentDate = moment().format();
    this.lastLoadedTime = currentDate;

  }

  refreshKeys(): void {
    this.showProgressBar();
    console.log('Refreshing keys ');
    this.disableAll = true;
    this.phraseAppService.getMessages(true).then(() => {
        var currentDate = moment().format();
        this.lastLoadedTime = currentDate;
        this.disableAll = false;
        this.hideProgressBar();
    }, () => {
       this.disableAll = false;
    });
  }

  getLastLoaded() {
    return moment(this.lastLoadedTime).calendar();
  }

  showProgressBar() {
    console.log('showProgressBar');
    this.progressBar.nativeElement.modal('show');
  }

  hideProgressBar() {
    console.log('hideProgressBar');
    this.progressBar.nativeElement.modal('hide');
  }
}
