import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserManagementService } from '../../../../services/user-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CompanyManagementService } from '../../../../services/company-management.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-viewuser-log',
  templateUrl: './viewuser-log.component.html',
  styleUrls: ['./viewuser-log.component.scss'],
})
export class ViewuserLogComponent implements OnInit {
  router: Router;
  companyId: any;
  globalCompany: any;
  results: any = [];
  itemsForPagination: any = 5;
  userName: any;
  message: string;
  modalRef: BsModalRef;
  userFilter: any = '';
  helpFlag: any = false;
  p: any;
  loader = false;
  constructor(
    router: Router,
    private route: ActivatedRoute,
    private companyManagementService: CompanyManagementService,
    private spinner: NgxSpinnerService,
    private userManagementService: UserManagementService
  ) {
    this.router = router;
    this.userName = route.snapshot.params['userName'];
  }

  ngOnInit() {
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany) {
      this.companyId = this.globalCompany.companyId;
      this.getUserLogInfo();
    }
  }

  getUserLogInfo() {
    this.spinner.show();

    this.userManagementService
      .getUserlogData(this.companyId, this.userName)
      .subscribe((response) => {
        this.results = response;
        this.spinner.hide();
      });
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
}
