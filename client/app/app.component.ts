import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'my-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  providers: [AuthService]
})
export class AppComponent {
  title = 'Phrase App Viewer';

   constructor(
    private authService: AuthService,
    private router: Router) { }

}
