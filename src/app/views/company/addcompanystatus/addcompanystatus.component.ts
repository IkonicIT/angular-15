import { Component, OnInit } from '@angular/core';
import { CompanyStatusesService } from '../../../services/index';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyManagementService } from '../../../services/company-management.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-addcompanystatus',
  templateUrl: './addcompanystatus.component.html',
  styleUrls: ['./addcompanystatus.component.scss'],
})
export class AddcompanystatusComponent implements OnInit {
  model: any = {};
  index: number = 0;
  date = Date.now();
  companyId: number;
  private sub: any;
  id: number;
  router: Router;
  globalCompany: any = {};
  length: any = 0;
  userName: any;
  helpFlag: any = false;
  dismissible = true;
  loader = false;
  constructor(
    private companyStatusesService: CompanyStatusesService,
    private companyManagementService: CompanyManagementService,
    router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.router = router;
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = this.globalCompany.companyId;
      console.log('compaanyid=' + this.companyId);
    });
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName');
  }

  saveStatus() {
    if (this.model.status != undefined) {
      this.model.status = this.model.status.trim();
      this.length = this.model.status.length;
      console.log(this.length);
    }
    if (this.model.status == undefined || this.model.status == '') {
      this.index = -1;
      window.scroll(0, 0);
    } else if (this.length > 100) {
      this.index = 2;
    } else {
      this.model = {
        companyId: this.globalCompany.companyId,
        lastModifiedBy: this.userName,
        destroyed: true,
        entityTypeId: 0,
        inService: true,
        spare: true,
        status: this.model.status,
        statusId: 0,
        underRepair: true,
        moduleType: 'companytype',
      };
      console.log(JSON.stringify(this.model));
      this.spinner.show();

      this.companyStatusesService.saveCompanyStatus(this.model).subscribe(
        (response) => {
          this.spinner.hide();

          window.scroll(0, 0);
          this.index = 1;
          setTimeout(() => {
            this.index = 0;
            this.router.navigate(['/company/statuses']);
          }, 1000);
        },
        (error) => {
          this.spinner.hide();

        }
      );
    }
  }

  cancelAddStatus() {
    this.router.navigate(['/company/statuses']);
  }

  help() {
    this.helpFlag = !this.helpFlag;
  }
}
