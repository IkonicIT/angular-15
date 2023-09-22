import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ForgotPasswordService } from '../../services/forgot-password.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from '../../models/user';

@Component({
  templateUrl: 'forgot-password.component.html',
  styleUrls: ['forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  user = new User();
  email: string = '';
  username: string = '';
  loginError: any = false;
  public forgotPasswordForm_show: boolean = true;
  loader = false;
  index: number;
  constructor(
    private forgotPasswordService: ForgotPasswordService,
    private spinner: NgxSpinnerService,
    router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {}

  forgotPassword(formData: { value: { email: string; username: string } }) {
    this.email = formData.value.email;
    this.username = formData.value.username;
    this.spinner.show();
    this.loader = true;
    this.forgotPasswordService.forgotPasswordAPI(this.user.username).subscribe(
      (response: any) => {
        this.spinner.hide();
        this.loader = false;
        this.loginError = false;
        if (response.status == 'Success') {
          this.email = formData.value.email;
          this.toggle_forgotPasswordForm();
        } else if (response.status == 'NotFound') {
          this.loginError = true;
        }
      },
      (error) => {
        console.log(error);

        this.spinner.hide();
        this.loader = false;
      }
    );
  }

  toggle_forgotPasswordForm() {
    this.forgotPasswordForm_show = !this.forgotPasswordForm_show;
  }
}
