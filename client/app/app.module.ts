import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { InMemoryWebApiModule } from 'angular-in-memory-web-api/in-memory-web-api.module';
import { InMemoryDataService } from './in-memory-data.service';

import './rxjs-extensions';
import { AppRoutingModule, routedComponents } from './app-routing.module';
/**
 * Application components, Any new componenets goes in here
 */
import { AppComponent } from './app.component';
import { HeroService } from './hero.service';
import { HeroSearchComponent } from './hero-search.component';

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
    HttpModule,
    InMemoryWebApiModule.forRoot(InMemoryDataService, { delay: 600 })
  ],
  declarations: [
    AppComponent,
    HeroSearchComponent,
    PhraseAppSearchComponent,
    routedComponents
  ],
  providers: [
    HeroService,
    PhraseAppService,
    PhraseAppSearchService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
