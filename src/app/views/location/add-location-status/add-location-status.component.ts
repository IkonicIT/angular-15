import { Component, OnInit } from '@angular/core';
import { CompanyStatusesService } from '../../../services/company-statuses.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LocationStatusService } from '../../../services/location-status.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-location-status',
  templateUrl: './add-location-status.component.html',
  styleUrls: ['./add-location-status.component.scss'],
})
export class AddLocationStatusComponent implements OnInit {
  model: any = {};
  index: number = 0;
  date = Date.now();
  companyId: number;
  private sub: any;
  id: number;
  userName: any;
  router: any;
  globalCompany: any = {};
  length: any = 0;
  helpFlag: any = false;
  dismissible = true;
  loader = false;
  constructor(
    private locationStatusService: LocationStatusService,
    private companyManagementService: CompanyManagementService,
    router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
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
        companyid: this.globalCompany.companyid,
        lastmodifiedby: this.userName,
        destroyed: true,
        entitytypeid: 0,
        inservice: true,
        moduleType: 'locationtype',
        spare: true,
        status: this.model.status,
        statusid: 0,
        underrepair: true,
      };
      this.spinner.show();
      this.loader = true;
      console.log(JSON.stringify(this.model));
      this.locationStatusService.saveLocationStatus(this.model).subscribe(
        (response) => {
          this.spinner.hide();
          this.loader = false;
          window.scroll(0, 0);
          this.index = 1;
          setTimeout(() => {
            this.index = 0;
          }, 7000);
          this.router.navigate(['/location/status']);
        },
        (error) => {
          this.spinner.hide();
          this.loader = false;
        }
      );
    }
  }

  cancelAddStatus() {
    this.router.navigate(['/location/status']);
  }

  print() {
    this.helpFlag = false;
    window.print();
  }

  help() {
    this.helpFlag = !this.helpFlag;
  }
}
