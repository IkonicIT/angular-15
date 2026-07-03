import { Component, OnInit } from '@angular/core';
import { CompanyManagementService } from '../../../services/company-management.service';
import { CompanyStatusesService } from '../../../services/company-statuses.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';
import { AppConfiguration } from 'src/app/configuration';

@Component({
  selector: 'app-edit-vendor',
  templateUrl: './edit-vendor.component.html',
  styleUrls: ['./edit-vendor.component.scss'],
})
export class EditVendorComponent implements OnInit {
  companyId: number;
  vendorId: number;
  model: any = {};
  itemMMS: boolean = false;
  dismissible: boolean = true; 
  index: number = 0;
  statuses: any[] = [];
  globalCompany: any;
  companyName: any;
  helpFlag: any = false;
  router: Router;
  route: ActivatedRoute;
  constructor(
    private companyManagementService: CompanyManagementService,
    route: ActivatedRoute,
    router: Router,
    private companyStatusesService: CompanyStatusesService,
    private http: HttpClient,
    private spinner: NgxSpinnerService
  ) {
    this.router = router;
    this.route = route;
    this.vendorId = route.snapshot.params['id'];
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyName = this.globalCompany.name;
    this.companyId = this.globalCompany.companyId;
    const itemMMSValue = sessionStorage.getItem('itemMMS');
    this.itemMMS = itemMMSValue === 'true' || itemMMSValue === '1';
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyName = value.name;
      this.companyId = value.companyId;
    });
  }

  ngOnInit() {
    this.spinner.show();
    this.getVendors();
  }
  getVendors() {
    if (this.itemMMS) {
      this.getMmsVendor();
      return;
    }

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

  getMmsVendor() {
    this.http
      .get<any[]>(AppConfiguration.locationRestURL + `mms/getMmsVendors/${this.companyId}`)
      .subscribe(
        (response) => {
          const vendors = Array.isArray(response) ? response : [];
          this.model =
            vendors.find(
              (vendor) =>
                String(vendor.vendorNumber || vendor.vendorId) === String(this.vendorId)
            ) || {};
          this.spinner.hide();
        },
        () => {
          this.spinner.hide();
        }
      );
  }

  updateVendor() {
    if (this.itemMMS) {
      this.updateMmsVendor();
      return;
    }

    if (this.model.name === undefined) {
      this.index = -1;
      window.scroll(0, 0);
    } else {
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

  updateMmsVendor() {
    if (!this.model.vendorName) {
      this.index = -1;
      window.scroll(0, 0);
      return;
    }

    const mmsVendorPayload = {
      vendorNumber: this.model.vendorNumber || this.model.vendorId || this.vendorId,
      vendorAbbr: this.model.vendorAbbr ? this.model.vendorAbbr : '',
      vendorName: this.model.vendorName ? this.model.vendorName : '',
      repair: this.model.repair ? Number(this.model.repair) : 0,
      purchase: this.model.purchase ? Number(this.model.purchase) : 0,
      phone: this.model.phone ? this.model.phone : '',
      fax: this.model.fax ? this.model.fax : '',
      address1: this.model.address1 ? this.model.address1 : '',
      address2: this.model.address2 ? this.model.address2 : '',
      city: this.model.city ? this.model.city : '',
      state: this.model.state ? this.model.state : '',
      zip: this.model.zip ? this.model.zip : '',
      comments1024: this.model.comments1024 ? this.model.comments1024 : '',
      companyId:this.companyId,
    };

    this.spinner.show();
    this.http
      .put(
        AppConfiguration.locationRestURL +
          `mms/updateMmsVendors/${this.companyId}`,
        mmsVendorPayload
      )
      .subscribe(
        () => {
          this.spinner.hide();
          window.scroll(0, 0);
          this.index = 1;
          setTimeout(() => {
            this.index = 0;
            this.router.navigate(['/vendor/list/']);
          }, 3000);
        },
        () => {
          this.spinner.hide();
        }
      );
  }
  print() {
    this.helpFlag = false;
    window.print();
  }
  help() {
    this.helpFlag = !this.helpFlag;
  }
}
