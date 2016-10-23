import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Message } from '../models/message';
import { PhraseAppService } from './phrase-app.service';

import * as _ from 'lodash';

@Injectable()
export class PhraseAppSearchService {
    constructor(private phraseAppService: PhraseAppService) { }


    search(term: string): any {
        return this.phraseAppService
            .getMessages(false)
            .then((messages) => {
                return _.filter(messages, function (message) {
                    return compare(message, term);
                });
            });

        function compare(message: Message, searchTerm: string) {
            let flag: boolean = false;
            flag = message.key.toUpperCase().indexOf(searchTerm.toUpperCase()) !== -1;

            /*if (!flag) {
                flag = (message.labels['en-engineering'] && message.labels['en-engineering'].message.toString().toUppperCase().indexOf(searchTerm.toUpperCase()) !== -1) ||
                    (message.labels['sv-SE'] && message.labels['sv-SE'].message.toString().toUppperCase().indexOf(searchTerm.toUpperCase()) !== -1) ||
                    (message.labels['da-dk'] && message.labels['da-dk'].message.toString().toUppperCase().indexOf(searchTerm.toUpperCase()) !== -1) ||
                    (message.labels['fi-FI'] && message.labels['fi-FI'].message.toString().toUppperCase().indexOf(searchTerm.toUpperCase()) !== -1) ||
                    (message.labels['sv-FI'] && message.labels['sv-FI'].message.toString().toUppperCase().indexOf(searchTerm.toUpperCase()) !== -1) ||
                    (message.labels['nb-NO'] && message.labels['nb-NO'].message.toString().toUppperCase().indexOf(searchTerm.toUpperCase()) !== -1)

            }*/

            return flag;
        }

    }
}
