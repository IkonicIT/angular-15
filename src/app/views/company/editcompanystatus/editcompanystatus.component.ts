import { Component, OnInit } from '@angular/core';
import { CompanyStatusesService } from '../../../services/index';
import { ActivatedRoute, Router } from '@angular/router';
import { Company } from '../../../models';
import { CompanyManagementService } from '../../../services/company-management.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-editcompanystatus',
  templateUrl: './editcompanystatus.component.html',
  styleUrls: ['./editcompanystatus.component.scss'],
})
export class EditcompanystatusComponent implements OnInit {
  model: any = {};
  index: number = 0;
  date = Date.now();
  companyId: number = 0;
  documentId: number = 0;
  private sub: any;
  id: number;
  router: Router;
  userName: any;
  globalCompany: any = {};
  helpFlag: any = false;
  oldStatus: any;
  length: any;
  dismissible = true;
  loader = false
  constructor(
    private companyStatusesService: CompanyStatusesService,
    private companyManagementService: CompanyManagementService,
    router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.companyId = route.snapshot.params['q'];
    console.log('companyid=' + this.companyId);
    this.router = router;
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = this.globalCompany.companyid;
      console.log('compaanyid=' + this.companyId);
    });
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName');
    this.sub = this.route.queryParams.subscribe((params) => {
      this.companyId = +params['q'] || 0;
      console.log('Query params ', this.companyId);
    });

    console.log('companyi=' + this.companyId);
    this.spinner.show();
    this.loader = true;
    this.companyStatusesService.getCompanyStatus(this.companyId).subscribe(
      (response) => {
        this.spinner.hide();
        this.loader = false
        this.model = response;
        this.oldStatus = this.model.status;
      },
      (error) => {
        this.spinner.hide();
        this.loader = false
      }
    );
  }
  updateStatus() {
    if (this.model.status != undefined) {
      this.model.status = this.model.status.trim();
      this.length = this.model.status.length;
      console.log(this.length);
    }
    if (
      this.model.status == '' ||
      this.model.status === this.oldStatus ||
      this.model.status == undefined
    ) {
      this.index = -1;
      window.scroll(0, 0);
    } else if (this.length > 100) {
      this.index = 2;
    } else {
      this.model = {
        companyid: this.globalCompany.companyid,
        lastmodifiedby: this.userName,
        destroyed: false,
        entitytypeid: 0,
        inservice: false,
        spare: false,
        status: this.model.status,
        statusid: this.model.statusid,
        underrepair: false,
        moduleType: 'companytype',
        oldStatus: this.oldStatus,
      };
      this.spinner.show();
      this.loader = true;
      this.companyStatusesService.updateCompanyStatus(this.model).subscribe(
        (response) => {
          this.spinner.hide();
          this.loader = false
          window.scroll(0, 0);
          this.index = 1;
          setTimeout(() => {
            this.index = 0;
          }, 7000);
          this.router.navigate(['/company/statuses']);
        },
        (error) => {
          this.spinner.hide();
          this.loader = false
        }
      );
    }
  }

  cancelUpdateStatus() {
    this.router.navigate(['/company/statuses']);
  }

  help() {
    this.helpFlag = !this.helpFlag;
  }
}
