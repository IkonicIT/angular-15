import { Component, OnInit } from '@angular/core';
import { CompanyManagementService } from '../../../services/company-management.service';
import { CompanyStatusesService } from '../../../services/company-statuses.service';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-edit-vendor',
  templateUrl: './edit-vendor.component.html',
  styleUrls: ['./edit-vendor.component.scss'],
})
export class EditVendorComponent implements OnInit {
  companyId: number;
  model: any = {};
  index: number = 0;
  statuses: any[] = [];
  helpFlag: any = false;
  dismissible = true;
  loader = false;
  constructor(
    private companyManagementService: CompanyManagementService,
    route: ActivatedRoute,
    private companyStatusesService: CompanyStatusesService,
    private spinner: NgxSpinnerService
  ) {
    this.companyId = route.snapshot.params['id'];
  }

  ngOnInit() {
    this.spinner.show();

    this.companyManagementService.getVendorDetails(this.companyId).subscribe(
      (response) => {
        this.model = response;
        this.companyStatusesService
          .getAllCompanyStatuses(this.companyId)
          .subscribe(
            (response: any) => {
              this.statuses = response;
              this.spinner.hide();
            },
            (error) => {
              this.spinner.hide();
            }
          );
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  updateVendor() {
    if (this.model.name === undefined) {
      this.index = -1;
      window.scroll(0, 0);
    } else {
      if (this.model.status) {
        this.model.statusid = this.model.status.statusid;
        this.model.status = {};
      }
      this.model.parentcompany = {
        companyid: this.model.parentcompany.companyid,
      };
      console.log(JSON.stringify(this.model));
      this.spinner.show();

      this.companyManagementService.updateVendor(this.model).subscribe(
        (response) => {
          this.spinner.hide();

          window.scroll(0, 0);
          this.index = 1;
        },
        (error) => {
          this.spinner.hide();
        }
      );
    }
  }
  print() {
    this.helpFlag = false;
    window.print();
  }
  help() {
    this.helpFlag = !this.helpFlag;
  }
}
