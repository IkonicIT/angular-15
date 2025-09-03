import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserManagementService } from '../../../../services/user-management.service';
import { CompanyManagementService } from '../../../../services/company-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-user-log-management',
  templateUrl: './user-log-management.component.html',
  styleUrls: ['./user-log-management.component.scss'],
})
export class UserLogManagementComponent implements OnInit {
  companyId: number | null = null;
  globalCompany: any;
  results: any[] = [];
  userlogs: any[] = [];
  itemsForPagination = 5;
  loggedinuserscount = 0;
  order = 'firstname';
  reverse = '';
  userFilter = '';
  message = '';
  modalRef: BsModalRef | null = null;
  helpFlag = false;
  p = 1;
  loader = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userManagementService: UserManagementService,
    private companyManagementService: CompanyManagementService,
    private spinner: NgxSpinnerService
  ) {
    this.globalCompany = this.companyManagementService.getGlobalCompany();

    if (this.globalCompany) {
      this.companyId = this.globalCompany.companyId;
      this.users();
    }
  }

  ngOnInit(): void {}

  users(): void {
    if (!this.companyId) return;

    this.spinner.show();
    this.userManagementService.getUserview(this.companyId).subscribe({
      next: (response: any[]) => {
        this.userlogs = response;
        this.results = response;
        this.setusercount();
        this.spinner.hide();
      },
      error: () => {
        this.spinner.hide();
      },
    });
  }

  setusercount(): void {
    this.loggedinuserscount = this.results.filter(
      (userlog: { isLoggedIn: boolean }) => userlog.isLoggedIn === true
    ).length;
  }

  setOrder(value: string): void {
    if (this.order === value) {
      this.reverse = this.reverse === '' ? '-' : '';
    }
    this.order = value;
  }

  viewUser(result: { userName: string }): void {
    this.router.navigate(['user/viewuserlog', result.userName]);
  }

  confirm(): void {}

  decline(): void {
    this.message = 'Declined!';
    this.modalRef?.hide();
  }

  print(): void {
    this.helpFlag = false;
    window.print();
  }

  help(): void {
    this.helpFlag = !this.helpFlag;
  }

  onChange(e: any): void {
    const totalUserLogCount = this.userlogs.length;
    const maxPageAvailable = Math.ceil(
      totalUserLogCount / this.itemsForPagination
    );

    if (this.p > maxPageAvailable) {
      this.p = maxPageAvailable;
    }
  }
}
