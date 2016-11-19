import { Injectable, ViewChild, ElementRef } from '@angular/core';

@Injectable()
export class ProgressBarService {
    @ViewChild('progressBar') el: ElementRef;
    constructor() {
    }


    showDialog() {
        //this.el.nativeElement.modal('show');
        $('#progress-bar').modal('show');
    }

    hideDialog() {
        //this.el.nativeElement.modal('hide');
        $('#progress-bar').modal('hide');
    }

}
