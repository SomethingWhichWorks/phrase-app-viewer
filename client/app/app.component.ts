import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'my-app',
  template: `
    <h1>{{title}}</h1>
    <div class="header-bar"></div>
    <nav>
      <a routerLink="/dashboard" routerLinkActive="active">Phrase App Dashboard</a>
      <a routerLink="/phrase-app-list" routerLinkActive="active">Phrase App Message List</a>
    </nav>

    <router-outlet></router-outlet>
  `/*,
  styleUrls: ['app.component.css']*/
})
export class AppComponent {
  title = 'Phrase App Viewer';
}
