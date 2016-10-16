import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Message } from '../models/message';
import { PhraseAppService } from './phrase-app.service';

@Injectable()
export class PhraseAppSearchService {
    constructor(private phraseAppService: PhraseAppService) { }


    search(term: string): any {
        return this.phraseAppService
            .getMessages()
            .then((messages) => {
                return messages;
            });
    }
}
