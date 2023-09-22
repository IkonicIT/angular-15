import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { WarrantyManagementService } from '../../../services/warranty-management.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CompanyManagementService } from '../../../services/company-management.service';

@Component({
  selector: 'app-edit-warranty-type',
  templateUrl: './edit-warranty-type.component.html',
  styleUrls: ['./edit-warranty-type.component.scss'],
})
export class EditWarrantyTypeComponent implements OnInit {
  globalCompany: any;
  companyName: any;
  companyId: any;
  warrantyType: any;
  index: number;
  router: Router;
  route: ActivatedRoute;
  warrantytypeid: any;
  helpFlag: any = false;
  userName: any;
  dismissible = true;
  loader = false;
  constructor(
    private companyManagementService: CompanyManagementService,
    private warrantyManagementService: WarrantyManagementService,
    private spinner: NgxSpinnerService,
    router: Router,
    route: ActivatedRoute
  ) {
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyName = this.globalCompany.name;
    this.companyId = this.globalCompany.companyid;
    this.router = router;
    this.route = route;
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyName = value.name;
      this.companyId = value.companyid;
    });
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName');
    this.warrantytypeid = this.route.snapshot.params['warrantyId'];
    this.spinner.show();
    this.loader = true;
    this.warrantyManagementService
      .getWarrantyType(this.warrantytypeid)
      .subscribe(
        (response: any) => {
          this.spinner.hide();
          this.loader = false;
          this.warrantyType = response.warrantytype;
        },
        (error) => {
          this.spinner.hide();
          this.loader = false;
        }
      );
  }

  UpdateWarrantyType() {
    if (!this.warrantyType) {
      this.index = -1;
      window.scroll(0, 0);
    } else {
      var req = {
        companyid: this.companyId,
        warrantytype: this.warrantyType,
        warrantytypeid: 0,
        userName: this.userName,
      };
      this.spinner.show();
      this.loader = true;
      this.warrantyManagementService
        .updateWarrantyType(req, this.warrantytypeid)
        .subscribe(
          (response) => {
            this.spinner.hide();
            this.loader = false;
            this.index = 1;
          },
          (error) => {
            this.spinner.hide();
            this.loader = false;
          }
        );
    }
  }
  cancel() {
    this.router.navigate(['/warranty/list']);
  }

  help() {
    this.helpFlag = !this.helpFlag;
  }
}
