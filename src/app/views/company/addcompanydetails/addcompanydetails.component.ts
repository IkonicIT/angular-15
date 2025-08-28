import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CompanyManagementService } from '../../../services/index';
import { CompanyStatusesService } from '../../../services/index';

@Component({
  selector: 'app-addcompanydetails',
  templateUrl: './addcompanydetails.component.html',
  styleUrls: ['./addcompanydetails.component.scss'],
})
export class AddcompanydetailsComponent implements OnInit {
  model: any = {};
  index: number = 0;
  statuses: any[] = [];
  globalCompany: any = {};

  companyId: number | null = null;
  userName: string | null = null;
  companyList: any[] = [];
  isDuplicateTag = false;
  file?: File;
  dismissible = true;
  helpFlag = false;
  highestRank: number = 0;
  loader = false;

  constructor(
    private companyManagementService: CompanyManagementService,
    private companyStatusesService: CompanyStatusesService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('userName');
    this.highestRank = parseInt(sessionStorage.getItem('highestRank') || '0', 10);
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyId = this.globalCompany?.companyId ?? null;
    // this.getStatuses();
  }

  getStatuses(): void {
    this.spinner.show();
    this.statuses = [];
    if(this.companyId != null){
    this.companyStatusesService.getAllCompanyStatuses(this.companyId).subscribe(
      (response: any) => {
        this.spinner.hide();
        console.log(response);
        this.statuses = response;
      },
      () => {
        this.spinner.hide();
      }
    );
  }
}

  back(): void {
    this.router.navigate(['/company/list']);
  }

  saveCompany(): void {
    if (!this.model.name) {
      this.index = -1;
      window.scroll(0, 0);
      return;
    }

    this.checkCompanyName(this.model.name);

    if (this.isDuplicateTag) {
      this.index = -2;
      window.scroll(0, 0);
      return;
    }

    this.model = {
      address1: this.model.address1 || '',
      address2: this.model.address2 || '',
      announcement: {
        announcementDate: new Date().toISOString(),
        announcementId: 0,
        announcementText: this.model.companyAnnouncements || '',
        company: {},
      },
      city: this.model.city || '',
      companyContentType: this.model.companycontentType || '',
      companyFileName: this.model.companyfileName || '',
      logo: this.model.logo || '',
      companyId: 0,
      userId: sessionStorage.getItem('userId'),
      description: this.model.description || '',
      fax: this.model.fax || '',
      isSandbox: true,
      lastModifiedBy: this.userName,
      name: this.model.name,
      parentCompanyId: 0,
      phone: this.model.phone || '',
      postalCode: this.model.postalCode || '',
      state: this.model.state || '',
      statusId: 0,
      supplyLevelWarning: true,
      type: {
        attributeSearchDisplay: 0,
        description: '',
        entityTypeId: 0,
        hostingFee: 0,
        isHidden: true,
        lastModifiedBy: '',
        name: this.model.primaryContactName || '',
        parentId: 0,
        typeId: 0,
        typemTbs: 0,
        typeSpareRatio: 0,
      },
      url: this.model.url || '',
      vendor: false,
      isPartnerCompany: this.model.isPartnerCompany ? true : false,
    };

    this.spinner.show();
    console.log(this.model);

    this.companyManagementService.saveCompany(this.model).subscribe(
      (response: any) => {
        this.companyId = response.companyId;
        this.spinner.hide();

        window.scroll(0, 0);
       if (this.file && this.companyId !== null) {
          this.AddCompanyLogo(this.companyId.toString());
        }
        alert('Company successfully Added, Refreshing List');
        this.companyManagementService.setCompaniesListModified(true);
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  AddCompanyLogo(companyId: string): void {
    if (!this.file) return;

    const formdata: FormData = new FormData();
    formdata.append('file', this.file);

    this.companyManagementService.saveLogo(formdata, companyId).subscribe(() => {
      this.spinner.hide();
    });
  }

  checkCompanyName(name: string): void {
    this.isDuplicateTag = false;
    this.companyList = this.companyManagementService.getGlobalCompanyList();
    this.companyList.forEach((company) => {
      if (company.name.toLowerCase() === name.toLowerCase()) {
        this.isDuplicateTag = true;
      }
    });
  }

  fileChangeListener($event: Event): void {
    const input = $event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.readThis(input);
    }
  }

  readThis(inputValue: HTMLInputElement): void {
    if (!inputValue.files || inputValue.files.length === 0) return;

    this.file = inputValue.files[0];
    const myReader = new FileReader();

    myReader.readAsDataURL(this.file);

    myReader.onloadend = () => {
      if (typeof myReader.result === 'string') {
        console.log(myReader.result);
        this.model.logo = myReader.result.split(',')[1];
        this.model.companycontentType = myReader.result.split(',')[0].split(':')[1].split(';')[0];
        this.model.companyfileName = this.file?.name;
      }
    };
  }

  print(): void {
    this.helpFlag = false;
    window.print();
  }

  help(): void {
    this.helpFlag = !this.helpFlag;
  }
}
