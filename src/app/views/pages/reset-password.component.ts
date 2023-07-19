import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, CommonModule } from '@angular/common';
import { ResetPasswordService } from '../../services/reset-password.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from '../../models/user';

@Component({
  selector: 'NgForm',
  templateUrl: 'reset-password.component.html',
})
export class ResetPasswordComponent {
  user = new User();
  email: string = '';
  loginError: any = false;
  public router: any;
  public resetPasswordForm_show: boolean = true;
  public resetTokenfromUrl: string;
  index: number = 0;
  constructor(
    private resetPasswordService: ResetPasswordService,
    private spinner: NgxSpinnerService,
    router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.router = router;
  }

  ngOnInit() {
    this.resetTokenfromUrl = this.activatedRoute.snapshot.queryParams['token'];
    console.log(`access token from URL ${this.resetTokenfromUrl}`);
    if (!this.resetTokenfromUrl) {
      console.log(`we found malware login so we are navigating to login page`);
      this.router.navigate(['/login']);
    }
  }

  resetPassword(formData: { value: { email: string } }) {
    console.log(`forgotPasswordForm data is`, formData.value);
    this.email = formData.value.email;
    if (this.user.password == this.user.repassword) {
      if (
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/.test(
          this.user.password
        )
      ) {
        this.spinner.show();
        let request = {
          password: this.user.password,
          resetToken: this.resetTokenfromUrl,
        };
        this.resetPasswordService.resetPasswordAPI(request).subscribe(
          (response: any) => {
            this.spinner.hide();
            console.log(
              `password reset submitted successfully response is `,
              response
            );
            if (response.status == 'Success') {
              this.index = 0;
              this.router.navigate(['/login']);
            } else if (response.status == 'NotFound') {
              this.loginError = true;
            }
          },
          (error) => {
            console.log(error);
            this.index = 0;
            this.loginError = true;
            this.spinner.hide();
          }
        );
      } else {
        this.index = -1;
      }
    } else {
      this.index = -2;
    }
  }

  toggle_forgotPasswordForm() {
    this.resetPasswordForm_show = !this.resetPasswordForm_show;
  }
}
