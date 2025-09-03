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
  companyId: number | null = null;
  globalCompany: any;
  results: any[] = [];
  itemsForPagination = 5;
  userName = '';
  message = '';
  modalRef: BsModalRef | null = null;
  userFilter = '';
  helpFlag = false;
  p = 1;
  loader = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private companyManagementService: CompanyManagementService,
    private spinner: NgxSpinnerService,
    private userManagementService: UserManagementService
  ) {
    this.userName = this.route.snapshot.params['userName'];
  }

  ngOnInit(): void {
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany) {
      this.companyId = this.globalCompany.companyId;
      this.getUserLogInfo();
    }
  }

  getUserLogInfo(): void {
    if (!this.companyId || !this.userName) return;

    this.spinner.show();
    this.userManagementService.getUserlogData(this.companyId, this.userName).subscribe({
      next: (response: any[]) => {
        this.results = response;
        this.spinner.hide();
      },
      error: () => {
        this.spinner.hide();
      },
    });
  }

  // TODO: Add confirm logic if needed
  confirm(): void {}

  decline(): void {
    this.message = 'Declined!';
    this.modalRef?.hide();
  }

  print(): void {
    this.helpFlag = false;
    window.print();
  }
}
