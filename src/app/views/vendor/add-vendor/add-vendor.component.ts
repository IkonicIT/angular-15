import { Component, OnInit } from '@angular/core';
import { CompanyManagementService } from '../../../services/company-management.service';
import { CompanyStatusesService } from '../../../services/company-statuses.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient , HttpParams} from '@angular/common/http';
import { AppConfiguration } from 'src/app/configuration';
@Component({
  selector: 'app-add-vendor',
  templateUrl: './add-vendor.component.html',
  styleUrls: ['./add-vendor.component.scss'],
})
export class AddVendorComponent implements OnInit {
  model: any = {};
  itemMMS: boolean = false;
  index: number = 0;
  statuses: any[] = [];
  dismissible: boolean = true; 
  mmsVendorFieldRows: any[][] = [
    [
      { name: 'vendorAbbr', label: 'Vendor Abbr', type: 'text', placeholder: 'Enter Vendor Abbr' },
      { name: 'vendorName', label: 'Vendor Name', type: 'text', placeholder: 'Enter Vendor Name', required: true },
    ],
    [
      { name: 'vendorName2', label: 'Vendor Name 2', type: 'text', placeholder: 'Enter Vendor Name 2' },
      { name: 'repair', label: 'Repair', type: 'number', placeholder: '0' },
    ],
    [
      { name: 'purchase', label: 'Purchase', type: 'number', placeholder: '0' },
      { name: 'appTypeNumber', label: 'App Type Number', type: 'number', placeholder: '0' },
    ],
    [
      { name: 'phone', label: 'Phone', type: 'text', placeholder: 'Enter Phone' },
      { name: 'fax', label: 'Fax', type: 'text', placeholder: 'Enter Fax' },
    ],
    [
      { name: 'address1', label: 'Address Line1', type: 'text', placeholder: 'Enter Address 1' },
      { name: 'address2', label: 'Address Line2', type: 'text', placeholder: 'Enter Address 2' },
    ],
    [
      { name: 'city', label: 'City', type: 'text', placeholder: 'Enter City' },
      { name: 'state', label: 'State', type: 'text', placeholder: 'Enter State' },
    ],
    [
      { name: 'zip', label: 'Zip', type: 'text', placeholder: 'Enter Zip' },
      { name: 'country', label: 'Country', type: 'text', placeholder: 'Enter Country' },
    ],
    [
      { name: 'county', label: 'County', type: 'text', placeholder: 'Enter County' },
      { name: 'rtAddress1', label: 'RT Address Line1', type: 'text', placeholder: 'Enter RT Address 1' },
    ],
    [
      { name: 'rtAddress2', label: 'RT Address Line2', type: 'text', placeholder: 'Enter RT Address 2' },
      { name: 'rtCity', label: 'RT City', type: 'text', placeholder: 'Enter RT City' },
    ],
    [
      { name: 'rtState', label: 'RT State', type: 'text', placeholder: 'Enter RT State' },
      { name: 'rtZip', label: 'RT Zip', type: 'text', placeholder: 'Enter RT Zip' },
    ],
    [
      { name: 'rtCountry', label: 'RT Country', type: 'text', placeholder: 'Enter RT Country' },
      { name: 'rtCounty', label: 'RT County', type: 'text', placeholder: 'Enter RT County' },
    ],
    [
      { name: 'repairTurnaroundDays', label: 'Repair Turnaround Days', type: 'number', placeholder: '0' },
      { name: 'employeeIdUpdated', label: 'Employee Id Updated', type: 'number', placeholder: '0' },
    ],
    [
      { name: 'created', label: 'Created', type: 'datetime-local' },
      { name: 'updated', label: 'Updated', type: 'datetime-local' },
    ],
    [
      { name: 'comments1024', label: 'Comments', type: 'textarea', placeholder: 'Enter Comments' },
      { name: 'warrantyRepairLengthDefault', label: 'Warranty Repair Length Default', type: 'number', placeholder: '0' },
    ],
    [
      { name: 'warrantyRepairBasedOn', label: 'Warranty Repair Based On', type: 'text', placeholder: 'Enter Warranty Repair Based On' },
      { name: 'stampIdCompanyId', label: 'Stamp Id Company Id', type: 'number', placeholder: '0' },
    ],
    [
      { name: 'status', label: 'Status', type: 'text', placeholder: 'Enter Status' },
    ],
  ];
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
    private http: HttpClient,
    private spinner: NgxSpinnerService
  ) {
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyName = this.globalCompany.name;
    this.companyId = this.globalCompany.companyId;
    this.router = router;
    const itemMMSValue = sessionStorage.getItem('itemMMS');
    this.itemMMS = itemMMSValue === 'true' || itemMMSValue === '1';
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyName = value.name;
      this.companyId = value.companyId;
    });
  }

  ngOnInit() {}

  saveVendor() {
    if (this.itemMMS) {
      this.saveMmsVendor();
      return;
    }

    if (!this.model.name) {
      this.index = -1;
      window.scroll(0, 0);
    } else {
      this.model = {
        vendorId: 0,
        name: this.model.name || this.model.vendorName,
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

  saveMmsVendor() {
    if (!this.model.vendorName) {
      this.index = -1;
      window.scroll(0, 0);
      return;
    }

   const mmsVendorPayload = {
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
  companyId:this.companyId,

  comments1024: this.model.comments1024
    ? this.model.comments1024
    : '',

};
    this.spinner.show();
    this.http.post(
      AppConfiguration.locationRestURL + `mms/createMmsVendors/${this.companyId}`,
      mmsVendorPayload
    ).subscribe(
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
