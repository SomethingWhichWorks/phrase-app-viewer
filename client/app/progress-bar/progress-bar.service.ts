import { Injectable, ViewChild, ElementRef } from '@angular/core';

@Injectable()
export class ProgressBarService {
    @ViewChild('progress-bar') element: ElementRef;
    text: string;
    
    constructor() {
    }

    showDialog(dialogText) {
        this.text = dialogText;
        //this.element.nativeElement.modal('show');
        $('#progress-bar').modal('show');
    }
    hideDialog() {
        //this.element.nativeElement.modal('hide');
        $('#progress-bar').modal('hide');
    }

}
