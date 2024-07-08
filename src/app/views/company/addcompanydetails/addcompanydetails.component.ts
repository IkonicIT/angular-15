import { Component, OnInit } from '@angular/core';
import { CompanyManagementService } from '../../../services/index';
import { CompanyStatusesService } from '../../../services/index';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addcompanydetails',
  templateUrl: './addcompanydetails.component.html',
  styleUrls: ['./addcompanydetails.component.scss'],
})
export class AddcompanydetailsComponent implements OnInit {
  model: any = {};
  index: number = 0;
  statuses: any = [];
  globalCompany: any = {};
  
  companyId: any;
  userName: any;
  companyList: any[] = [];
  isDuplicateTag = false;
  file: File;
  dismissible = true;
  helpFlag: any = false;
  loader = false;

  constructor(
    private companyManagementService: CompanyManagementService,
    private companyStatusesService: CompanyStatusesService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName');
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyId = this.globalCompany.companyid;
    this.getStatuses()
  }

  getStatuses() {
    this.spinner.show();
    this.loader = true;
    this.statuses = [];
    this.companyStatusesService.getAllCompanyStatuses(this.companyId).subscribe(
      (response) => {
        this.spinner.hide();
        this.loader = false;
        console.log(response);
        this.statuses = response;
      },
      (error) => {
        this.spinner.hide();
        this.loader = false;
      }
    );
  }

  back() {
    this.router.navigate(['/company/list']);
  }

  saveCompany() {
    if (this.model.name == undefined || this.model.name == '') {
      this.index = -1;
      window.scroll(0, 0);
    } else {
      this.checkCompanyName(this.model.name);
      if (this.isDuplicateTag == true) {
        this.index = -2;
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
          logo: this.model.logo ? this.model.logo : '',
          companyid: 0,
          userid: sessionStorage.getItem('userId'),
          description: this.model.description ? this.model.description : '',
          fax: this.model.fax ? this.model.fax : '',
          issandbox: true,
          lastmodifiedby: this.userName,
          name: this.model.name,
          parentcompanyid: 0,
          phone: this.model.phone ? this.model.phone : '',
          postalcode: this.model.postalcode ? this.model.postalcode : '',
          state: this.model.state ? this.model.state : '',
          statusid: 0,
          supplylevelwarning: true,
          type: {
            attributesearchdisplay: 0,
            description: '',
            entitytypeid: 0,
            hostingfee: 0,
            ishidden: true,
            lastmodifiedby: '',
            name: this.model.primaryContactName ? this.model.primaryContactName:'',
            parentid: 0,
            typeid: 0,
            typemtbs: 0,
            typespareratio: 0,
          },
          url: this.model.url ? this.model.url : '',
          vendor: false,
        };
        this.spinner.show();
        this.loader = true
        this.companyManagementService.saveCompany(this.model).subscribe(
          (response: any) => {
            this.companyId = response.companyid;
            this.spinner.hide();
            this.loader = false
            window.scroll(0, 0);
            if (this.file != null) {
              this.AddCompanyLogo(this.companyId);
            }
            alert('Company successfully Added,Refreshing List');
            this.companyManagementService.setCompaniesListModified(true);
          },
          (error) => {
            this.spinner.hide();
            this.loader = false
          }
        );
      }
    }
  }

  AddCompanyLogo(companyId: string) {
    const formdata: FormData = new FormData();
    formdata.append('file', this.file);
    this.companyManagementService
      .saveLogo(formdata, companyId)
      .subscribe((response) => {
        this.spinner.hide();
        this.loader = false
      });
  }

  checkCompanyName(name: string) {
    this.isDuplicateTag = false;
    this.companyList = this.companyManagementService.getGlobalCompanyList();
    this.companyList.forEach((company) => {
      if (company.name.toLowerCase() == name.toLowerCase()) {
        this.isDuplicateTag = true;
      }
    });
  }

  fileChangeListener($event: { target: any }): void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    this.file = inputValue.files[0];
    var myReader: any = new FileReader();
    myReader.readAsDataURL(this.file);
    var self = this;
    myReader.onloadend = function (e: any) {
      console.log(myReader.result);
      self.model.logo = myReader.result.split(',')[1];
      self.model.companycontenttype = myReader.result
        .split(',')[0]
        .split(':')[1]
        .split(';')[0];
      self.model.companyfilename = self.file.name;
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
