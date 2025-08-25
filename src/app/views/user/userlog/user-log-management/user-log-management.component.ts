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
  companyId: any;
  globalCompany: any;
  results: any;
  userlogs: any;
  itemsForPagination: any = 5;
  loggedinuserscount: number = 0;
  order: string = 'firstname';
  reverse: string = '';
  userFilter: any = '';
  message: string;
  modalRef: BsModalRef;
  helpFlag: any = false;
  p: any;
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

  ngOnInit() {}
  users() {
    this.spinner.show();

    this.userManagementService
      .getUserview(this.companyId)
      .subscribe((response) => {
        this.userlogs = response;
        this.spinner.hide();

        this.results = response;
        this.setusercount();
      });
  }

  setusercount() {
    this.results.forEach((userlog: { isLoggedIn: boolean }) => {
      if (userlog.isLoggedIn == true) {
        this.loggedinuserscount++;
      }
    });
  }
  setOrder(value: string) {
    if (this.order === value) {
      if (this.reverse == '') {
        this.reverse = '-';
      } else {
        this.reverse = '';
      }
    }
    this.order = value;
  }

  viewUser(result: { userName: string }) {
    this.router.navigate(['user/viewuserlog/' + result.userName]);
  }

  confirm(): void {}

  decline(): void {
    this.message = 'Declined!';
    this.modalRef.hide();
  }

  print() {
    this.helpFlag = false;
    window.print();
  }

  help() {
    this.helpFlag = !this.helpFlag;
  }
  onChange(e: any) {
    const totalUserLogCount = this.userlogs.length;
    const maxPageAvailable = Math.ceil(
      totalUserLogCount / this.itemsForPagination
    );
    // Check if the current page exceeds the maximum available page
    if (this.p > maxPageAvailable) {
      this.p = maxPageAvailable;
    }
  }
}
