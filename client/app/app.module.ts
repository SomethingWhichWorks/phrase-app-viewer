import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import './rxjs-extensions';
import { AppRoutingModule, routedComponents } from './app-routing.module';
/**
 * Application components, Any new componenets goes in here
 */
import { AppComponent } from './app.component';
/**
 * Phrase App Imports
 */
import { PhraseAppSearchComponent } from './phrase-app/phrase-app-search/phrase-app-search.component';
import { PhraseAppService } from './phrase-app/services/phrase-app.service';
import { PhraseAppSearchService } from './phrase-app/services/phrase-app-search.service';


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpModule
  ],
  declarations: [
    AppComponent,
    PhraseAppSearchComponent,
    routedComponents
  ],
  providers: [
    PhraseAppService,
    PhraseAppSearchService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
