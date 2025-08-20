import { Component, OnInit } from '@angular/core';
import { CompanyManagementService } from '../../../services/company-management.service';
import { CompanyStatusesService } from '../../../services/company-statuses.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-vendor',
  templateUrl: './add-vendor.component.html',
  styleUrls: ['./add-vendor.component.scss'],
})
export class AddVendorComponent implements OnInit {
  model: any = {};
  index: number = 0;
  statuses: any[] = [];
  dismissible: boolean = true; // Add this line
  globalCompany: any;
  companyName: any;
  router: Router;
  companyId: any;
  helpFlag: any = false;
  constructor(
    private companyManagementService: CompanyManagementService,
    private route: ActivatedRoute,
    router: Router,
    private companyStatusesService: CompanyStatusesService,
    private spinner: NgxSpinnerService
  ) {
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyName = this.globalCompany.name;
    this.companyId = this.globalCompany.companyid;
    this.router = router;

    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyName = value.name;
      this.companyId = value.companyid;
    });
  }

  ngOnInit() {}

  saveVendor() {
    if (!this.model.name) {
      this.index = -1;
      window.scroll(0, 0);
    } else {
      this.model = {
        vendorId: 0,
        name: this.model.name,
        address1: this.model.address1,
        address2: this.model.address2,
        city: this.model.city ? this.model.city : '',
        state: this.model.state ? this.model.state : '',
        postalCode: this.model.postalCode ? this.model.postalCode : '',
        phone: this.model.phone ? this.model.phone : '',
        fax: this.model.fax ? this.model.fax : '',
        url: this.model.url ? this.model.url : '',
        description: this.model.description ? this.model.description : '',
        status: this.model.status ? this.model.status : '',
        lastModifiedBy: sessionStorage.getItem('userName'),
      };
      this.spinner.show();
      this.companyManagementService.saveVendor(this.model).subscribe(
        (response) => {
          this.spinner.hide();
          window.scroll(0, 0);
          this.index = 1;
          setTimeout(() => {
            this.index = 0;
            this.router.navigate(['/vendor/list/']);
          }, 3000);
        },
        (error) => {
          this.spinner.hide();
        }
      );
    }
  }

  fileChangeListener($event: any): void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    var file: File = inputValue.files[0];
    var myReader: FileReader = new FileReader();
    myReader.readAsDataURL(file);
    var self = this;
    myReader.onloadend = function (e) {
      if (myReader.result) {
        console.log(myReader.result);
        self.model.companyimage =
          typeof myReader.result === 'string'
            ? myReader.result.split(',')[1]
            : '';
      }
    };
  }
  print() {
    this.helpFlag = false;
    window.print();
  }
  help() {
    this.helpFlag = !this.helpFlag;
  }
}
