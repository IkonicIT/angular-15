import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserManagementService } from '../../../services/user-management.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  model: any = {};
  showPassword: { current: boolean; new: boolean; confirm: boolean } = {
    current: false,
    new: false,
    confirm: false,
  };
  user: any = {};
  index: number = 0;
  dismissible = true;
  loader = false;

  constructor(
    private userManagementService: UserManagementService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.model.date = new Date();
  }

  changePassword(): void {
    if (
      this.model.currentPassword &&
      this.model.newPassword &&
      this.model.confirmPassword &&
      this.model.newPassword === this.model.confirmPassword
    ) {
      const req = {
        currentPassword: this.model.currentPassword,
        newPassword: this.model.newPassword,
        confirmPassword: this.model.confirmPassword,
        lastPasswordChangedDate: this.model.date,
        userId: sessionStorage.getItem('userId'),
      };

      const passwordPattern =
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;

      if (passwordPattern.test(this.model.newPassword)) {
        this.spinner.show();

        this.userManagementService.changePassword(req).subscribe({
          next: (response) => {
            this.spinner.hide();
            this.user = response;
            this.index = 1;
            window.scroll(0, 0);

            if (this.user?.email == null) {
              this.index = -4;
              window.scroll(0, 0);
            }

            this.model = {};
          },
          error: () => {
            this.spinner.hide();
          },
        });
      } else {
        this.index = -3;
        window.scroll(0, 0);
      }
    } else {
      window.scroll(0, 0);
      this.index = -1;

      if (this.model.newPassword !== this.model.confirmPassword) {
        this.index = -2;
      }
    }
  }

  togglePasswordVisibility(field: 'current' | 'new' | 'confirm'): void {
    this.showPassword[field] = !this.showPassword[field];
  }
}
