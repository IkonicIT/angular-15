import { Component, OnInit } from '@angular/core';
import { LocationStatusService } from '../../../services/location-status.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CompanyManagementService } from '../../../services/company-management.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-edit-location-status',
  templateUrl: './edit-location-status.component.html',
  styleUrls: ['./edit-location-status.component.scss'],
})
export class EditLocationStatusComponent implements OnInit {
  index: number = 0;
  date = Date.now();
  statusId: number = 0;
  private sub: any;
  userName: any;
  id: number;
  router: Router;
  globalCompany: any = {};
  companyId: number;
  helpFlag: any = false;
  oldStatus: any;
  length: number;
  model: any = {};
  dismissible = true;
  loader = false;
  constructor(
    private locationStatusService: LocationStatusService,
    private companyManagementService: CompanyManagementService,
    router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.statusId = route.snapshot.params['id'];
    console.log('companyid=' + this.statusId);
    this.router = router;
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyId = this.globalCompany.companyid;
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = this.globalCompany.companyid;
      console.log('compaanyid=' + this.companyId);
    });
    this.spinner.show();

    this.locationStatusService.getLocationStatus(this.statusId).subscribe(
      (response) => {
        this.spinner.hide();

        this.model = response;
        this.oldStatus = this.model.status;
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName');
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
        companyId: this.globalCompany.companyid,
        lastModifiedBy: this.userName,
        destroyed: false,
        entityTypeId: 0,
        inService: false,
        moduleType: 'locationtype',
        spare: false,
        status: this.model.status,
        statusId: this.model.statusId,
        underRepair: false,
        oldStatus: this.oldStatus,
      };
      this.spinner.show();

      this.locationStatusService.updateLocationStatus(this.model).subscribe(
        (response) => {
          this.spinner.hide();

          window.scroll(0, 0);
          this.index = 1;
          setTimeout(() => {
            this.index = 0;
          }, 7000);
          this.router.navigate(['/location/status']);
        },
        (error) => {
          this.spinner.hide();
        }
      );
    }
  }
  cancelUpdateStatus() {
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
