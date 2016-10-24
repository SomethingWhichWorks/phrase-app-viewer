import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})

export class LoginComponent implements OnInit {

  userName: string;
  password: string;

  constructor(
    private router: Router) {
  }

  ngOnInit(): void {
  }

  validateUser() {
    console.log('authenticating user');
    this.router.navigate(['/phrase-app-dashboard']);
  }
}
