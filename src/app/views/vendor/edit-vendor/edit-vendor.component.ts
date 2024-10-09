import { Component, OnInit } from '@angular/core';
import { CompanyManagementService } from '../../../services/company-management.service';
import { CompanyStatusesService } from '../../../services/company-statuses.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-edit-vendor',
  templateUrl: './edit-vendor.component.html',
  styleUrls: ['./edit-vendor.component.scss'],
})
export class EditVendorComponent implements OnInit {
  companyId: number;
  vendorId: number;
  model: any = {};
  dismissible: boolean = true; // Add this line
  index: number = 0;
  statuses: any[] = [];
  helpFlag: any = false;
  router: Router;
  route: ActivatedRoute;
  constructor(
    private companyManagementService: CompanyManagementService,
    route: ActivatedRoute,
    router: Router,
    private companyStatusesService: CompanyStatusesService,
    private spinner: NgxSpinnerService
  ) {
    this.router = router;
    this.route = route;
    this.vendorId = route.snapshot.params['id'];
  }

  ngOnInit() {
    this.spinner.show();
    this.getVendors();
  }
  getVendors() {
    this.companyManagementService.getVendorDetails(this.vendorId).subscribe(
      (response) => {
        this.model = response;
        this.spinner.hide();
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
      console.log(JSON.stringify(this.model));
      this.spinner.show();
      this.companyManagementService.updateVendor(this.model).subscribe(
        (response) => {
          this.spinner.hide();
          window.scroll(0, 0);
          this.index = 1;
          setTimeout(() => {
            this.index = 0;
            this.getVendors();
            this.router.navigate(['/vendor/list/']);
          }, 3000);
          this.spinner.hide();
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
