import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserManagementService } from '../../services/user-management.service';

@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  userName: string;
  password: string;
  showPassword: boolean = true;
  router: any;
  loginError: any = false;
  loader = false;
  userId: any;
  user: any = {};
  isOwnerAdmin: any;
  date: any;
  loading = false;
  submitted = false;
  constructor(
    router: Router,
    private loginService: LoginService,
    private spinner: NgxSpinnerService,
    private userManagementService: UserManagementService
  ) {
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
    this.loader = true;
    this.loginService.loginAuth(req).subscribe(
      (response) => {
        sessionStorage.setItem('auth_token', response.access_token);
        console.log(response.access_token);
        this.loader = false;
        this.getUserIdByNameForLogged();
      },
      (error) => {
        console.log(error);
        this.loginError = true;
        this.loader = false;
      }
    );
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit(event: Event) {
    event.preventDefault();
    // Add any additional form submission logic if needed
  }

  getUserIdByNameForLogged() {
    this.loginService.getUserIdByName(this.userName).subscribe(
      (response) => {
        console.log(response.userid);
        this.userId = response.userid;
        sessionStorage.setItem('userId', response.userid);
        sessionStorage.setItem('userName', response.username);
        this.getProfile();
        this.spinner.hide();
        this.loader = false;
      },
      (error) => {
        console.log(error);
        this.loginError = true;
        this.spinner.hide();
        this.loader = false;
      }
    );
  }

  getProfile() {
    this.loginService.getProfileByUserId(this.userId).subscribe(
      (response) => {
        sessionStorage.setItem('IsOwnerAdmin', response.isowneradmin);
        sessionStorage.setItem('IsOwnerAdminReadOnly', response.acceptedterms);

        this.date = new Date();
        this.user.userid = this.userId;
        this.userManagementService.updateLoginDate(this.user).subscribe(
          (response) => {},
          (error) => {
            console.log(error);
            this.loginError = true;
            this.spinner.hide();
            this.loader = false;
          }
        );

        this.router.navigate(['/dashboard']);
      },
      (error) => {
        this.spinner.hide();
        this.loader = false;
      }
    );
  }
}
