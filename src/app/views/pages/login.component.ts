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

    setTimeout(() => {
      this.spinner.hide();
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
    this.spinner.show();
    this.loginService.loginAuth(req).subscribe(
      (response) => {
        sessionStorage.setItem('auth_token', response.access_token);
        this.getUserIdByNameForLogged();
      },
      (error) => {
        this.loginError = true;
        this.spinner.hide();
      }
    );
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit(event: Event) {
    event.preventDefault();
  }

  getUserIdByNameForLogged() {
    this.loginService.getUserIdByName(this.userName).subscribe(
      (response) => {
        this.userId = response.userId;
        sessionStorage.setItem('userId', response.userId);
        sessionStorage.setItem('userName', response.userName);
        this.getProfile();
      },
      (error) => {
        this.loginError = true;
        this.spinner.hide();
      }
    );
  }

  getProfile() {
    this.loginService.getProfileByUserId(this.userId).subscribe(
      (response) => {
        sessionStorage.setItem('IsOwnerAdmin', response.isOwnerAdmin);
        sessionStorage.setItem('IsOwnerAdminReadOnly', response.acceptedTerms);

        this.date = new Date();
        this.user.userId = this.userId;
        this.userManagementService.updateLoginDate(this.user).subscribe(
          (response) => {},
          (error) => {
            this.loginError = true;

            this.spinner.hide();
          }
        );
        this.spinner.hide();
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
}
