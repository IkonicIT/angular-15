import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  templateUrl: 'login.component.html',
})
export class LoginComponent {
  userName: string;
  password: string;
  router: any;
  loginError: any = false;
  loader = false;
  userId: any;
  user: any = {};
  isOwnerAdmin: any;
  date: any;
  loading = false;
  submitted = false;

  constructor(router: Router) {
    this.router = router;
    this.loader = true;

    setTimeout(() => {
      console.log('hide');
      this.loader = false;
    }, 2000);
    if (
      sessionStorage.getItem('auth_token') &&
      sessionStorage.getItem('auth_token') != ''
    ) {
      this.router.navigate(['/dashboard']);
    }
  }

  login() {
    var req = {
      userName: this.userName,
      password: this.password,
    };
    console.log(req);
  }

  getUserIdByNameForLogged() {
    console.log('get');
  }
  getProfile() {
    console.log('get');
  }
}
