import { Component, OnInit } from '@angular/core';
import { CompanyManagementService } from '../../../services/company-management.service';
import { CompanyStatusesService } from '../../../services/company-statuses.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-vendor',
  templateUrl: './add-vendor.component.html',
  styleUrls: ['./add-vendor.component.scss'],
})
export class AddVendorComponent implements OnInit {
  model: any = {};
  index: number = 0;
  statuses: any[] = [];
  globalCompany: any;
  companyName: any;
  companyId: any;
  helpFlag: any = false;
  dismissible = true;
  loader = false;
  constructor(
    private companyManagementService: CompanyManagementService,
    private companyStatusesService: CompanyStatusesService,
    private spinner: NgxSpinnerService
  ) {
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyName = this.globalCompany.name;
    this.companyId = this.globalCompany.companyid;
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
        address1: this.model.address1 ? this.model.address1 : '',
        address2: this.model.address2 ? this.model.address2 : '',
        announcement: {
          announcementdate: new Date().toISOString(),
          announcementid: 0,
          announcementtext: this.model.companyAnnouncements
            ? this.model.companyAnnouncements
            : '',
          company: {},
        },
        city: this.model.city ? this.model.city : '',
        companycontenttype: this.model.companycontenttype
          ? this.model.companycontenttype
          : '',
        companyfilename: this.model.companyfilename
          ? this.model.companyfilename
          : '',
        companyid: 0,
        companyimage: this.model.companyimage ? this.model.companyimage : '',
        description: this.model.description ? this.model.description : '',
        fax: this.model.fax ? this.model.fax : '',
        issandbox: true,
        lastmodifiedby: '',
        name: this.model.name,
        parentcompany: {
          companyid: this.companyId,
        },
        phone: this.model.phone ? this.model.phone : '',
        postalcode: this.model.postalcode ? this.model.postalcode : '',
        state: 'AP',
        statusid: 0,
        supplylevelwarning: true,
        type: {
          attributesearchdisplay: 0,
          description: '',
          entitytypeid: 0,
          hostingfee: 0,
          ishidden: true,
          lastmodifiedby: '',
          name: '',
          parentid: 0,
          typeid: 0,
          typemtbs: 0,
          typespareratio: 0,
        },
        url: this.model.url ? this.model.url : '',
        vendor: true,
      };
      this.spinner.show();
      this.loader = true;
      this.companyManagementService.saveVendor(this.model).subscribe(
        (response) => {
          this.spinner.hide();
          this.loader = false;
          window.scroll(0, 0);
          this.index = 1;
        },
        (error) => {
          this.spinner.hide();
          this.loader = false;
        }
      );
    }
  }

  fileChangeListener($event: { target: any }): void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    var file: File = inputValue.files[0];
    var myReader: any = new FileReader();
    myReader.readAsDataURL(file);
    var self = this;
    myReader.onloadend = function (e: any) {
      console.log(myReader.result);
      self.model.companyimage = myReader.result.split(',')[1];
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
