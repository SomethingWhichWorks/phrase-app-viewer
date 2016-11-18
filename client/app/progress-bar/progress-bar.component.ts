import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';



@Component({
  moduleId: module.id,
  selector: 'progress-bar',
  templateUrl: 'progress-bar.component.html',
  styleUrls: ['progress-bar.component.css']
  /*providers: [AuthService]*/
})

export class ProgressBarComponent implements OnInit {
  @ViewChild('progressBar') el: ElementRef;

  constructor() { }
  ngOnInit(): void {
    
  }

  showDialog() {
    this.el.nativeElement.modal('show');
  }

  hideDialog() {
    this.el.nativeElement.modal('show'); 
  }

}
