import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';

import { CompanyManagementService } from '../../../services/index';
import { CompanyStatusesService } from '../../../services/index';
import { CompanyTypesService } from '../../../services/index';
import { CompanyAttributesServiceService } from '../../../services/index';
import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';
import { isUndefined, isNull } from 'is-what';
import { BroadcasterService } from '../../../services/broadcaster.service';

@Component({
  selector: 'app-editcompanydetails',
  templateUrl: './editcompanydetails.component.html',
  styleUrls: ['./editcompanydetails.component.scss'],
})
export class EditcompanydetailsComponent implements OnInit {
  companyId: string;
  model: any = {
    announcement: { announcementText: '' },
    type: {},
  };

  index: number = 0;
  eachAttr: any;
  companyName: string | null = null;
  company: any = {};
  statuses: any[] = [];
  companyTypes: any[] = [];
  typeAttributes: any[] = [];
  typeID: number = 0;
  file: File | null = null;

  items: TreeviewItem[] = [];
  config = TreeviewConfig.create({
    hasFilter: false,
    hasCollapseExpand: false,
  });

  isReqdAttr: any;
  reqAttrName: any;
  reqAttrValue: any;
  reqAttrValidate: boolean = false;
  userCompanies: any[] = [];
  isOwnerAdmin: string | null = null;
  loggedInuser: string | null = null;
  isDuplicateTag: boolean = false;
  companyList: any[] = [];
  helpFlag: boolean = false;
  dismissible: boolean = true;
  loader: boolean = false;

  constructor(
    private companyManagementService: CompanyManagementService,
    private route: ActivatedRoute,
    private companyStatusesService: CompanyStatusesService,
    private spinner: NgxSpinnerService,
    private companyTypesService: CompanyTypesService,
    private companyAttributesServiceService: CompanyAttributesServiceService,
    private router: Router,
    private location: Location,
    private broadcasterService: BroadcasterService
  ) {
    this.companyId = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.isOwnerAdmin = sessionStorage.getItem('IsOwnerAdmin');
    this.spinner.show();

    this.companyManagementService.getCompanyDetails(this.companyId).subscribe(
      (response: any) => {
        this.model = response;
        this.companyName = this.model.name ?? null;

        if (this.isOwnerAdmin === 'true') {
          this.model.tracratAnnouncements =
            this.broadcasterService.tracratAnnouncement;
        }

        this.getAttributes(this.model.typeId);

        this.companyStatusesService.getAllCompanyStatuses(this.companyId).subscribe(
          (statuses: any) => {
            this.statuses = statuses;
            this.getAllTypes(this.companyId);
          },
          () => this.spinner.hide()
        );
      },
      () => this.spinner.hide()
    );
  }

  getAllTypes(companyId: string): void {
    this.companyTypesService.getAllCompanyTypesWithHierarchy(companyId).subscribe(
      (response: any) => {
        this.companyTypes = response;
        if (this.companyTypes.length > 0) {
          this.items = this.generateHierarchy(this.companyTypes);
        }
        this.spinner.hide();
      },
      () => this.spinner.hide()
    );
  }

  generateHierarchy(typeList: any[]): TreeviewItem[] {
    return typeList.map((type: any) => {
      const children = type.typeList?.length
        ? this.generateHierarchy(type.typeList)
        : [];
      return new TreeviewItem({
        text: type.name,
        value: type.typeId,
        collapsed: true,
        children,
      });
    });
  }

  getAttributes(typeId: any): void {
    if (typeId && typeId !== 0 && typeId !== '0') {
      this.spinner.show();
      this.companyAttributesServiceService.getTypeAttributes(typeId).subscribe(
        (response: any) => {
          this.typeAttributes = response;

          if (this.model.attributeValues?.length > 0) {
            this.typeAttributes.forEach((attr: any) => {
              this.model.attributeValues.forEach((ansAttr: any) => {
                if (attr.name === ansAttr.attributeName.name) {
                  ansAttr.attributeName.attributeListItemResource =
                    attr.attributeListItemResource;
                  attr.value = ansAttr.value;
                }
              });
            });
          } else {
            this.model.attributeValues = this.typeAttributes.map((attr: any) => ({
              attributeName: attr,
              entityId: this.companyId,
              entitytypeId: attr.type.entitytypeId,
              lastModifiedBy: attr.type.lastModifiedBy,
              value: attr.value,
              tooltip: attr.tooltip,
            }));
          }

          this.spinner.hide();
        },
        () => this.spinner.hide()
      );
    } else {
      this.typeAttributes = [];
    }
  }

  RefreshAll(): void {
    this.isOwnerAdmin = sessionStorage.getItem('IsOwnerAdmin');
    if (this.isOwnerAdmin === 'true') {
      this.companyManagementService.getAllCompanyDetails().subscribe((response: any[]) => {
        this.userCompanies = response;
        this.companyManagementService.setGlobalCompanyList(this.userCompanies);
      });
    } else {
      this.loggedInuser = sessionStorage.getItem('userId');
      if (this.loggedInuser) {
        this.companyManagementService.getCompanyNames(this.loggedInuser).subscribe((response: any) => {
          this.userCompanies = response;
          this.companyManagementService.setGlobalCompanyList(this.userCompanies);
        });
      }
    }
  }

  checkCompanyName(name: string): void {
    this.isDuplicateTag = false;
    this.companyList = this.companyManagementService.getGlobalCompanyList();
    this.companyList.forEach((company: { name: string }) => {
      if (company.name === name && company.name !== this.companyName) {
        this.isDuplicateTag = true;
      }
    });
  }

  updateCompany(): void {
    this.company.attributeValues = this.typeAttributes.map((attr: any) => ({
      attributeName: attr,
      entityId: this.companyId,
      entitytypeId: attr.type.entitytypeId,
      lastModifiedBy: attr.type.lastModifiedBy,
      value: attr.value,
      tooltip: attr.tooltip,
    }));

    this.model.attributeValues = this.company.attributeValues;
    this.reqAttrValidate = false;

    this.model.attributeValues.forEach((attr: any) => {
      this.isReqdAttr = attr.attributeName.isRequired;
      this.reqAttrName = attr.attributeName.name;
      this.reqAttrValue = attr.value;

      if (
        this.isReqdAttr &&
        (isUndefined(this.reqAttrValue) ||
          isNull(this.reqAttrValue) ||
          this.reqAttrValue === '')
      ) {
        this.reqAttrValidate = true;
        return;
      }
    });

    if (!this.model.name || this.reqAttrValidate) {
      this.index = -1;
      window.scroll(0, 0);
    } else {
      this.checkCompanyName(this.model.name);
      if (this.isDuplicateTag) {
        this.index = -2;
        window.scroll(0, 0);
      } else {
        if (!this.model.typeId) {
          this.model.typeId = 0;
        }
        this.spinner.show();
        this.model.announcement.announcementDate = new Date().toISOString();

        this.companyManagementService.updateCompany(this.model).subscribe(
          () => {
            this.spinner.hide();
            window.scroll(0, 0);
            this.index = 1;
            setTimeout(() => (this.index = 0), 7000);

            this.router.navigate(['/company/view/' + this.model.companyId]);
            if (this.file) {
              this.AddCompanyLogo(this.companyId);
            }
            alert('Company updated successfully, Refreshing List');
            this.companyManagementService.setCompaniesListModified(true);
          },
          () => this.spinner.hide()
        );
      }
    }
  }

  AddCompanyLogo(companyId: string): void {
    if (this.file) {
      const formdata: FormData = new FormData();
      formdata.append('file', this.file);
      this.companyManagementService.saveLogo(formdata, companyId).subscribe(() => {
        this.spinner.hide();
      });
    }
  }

  saveMessage(): void {
    const req = {
      announcementDate: new Date().toISOString(),
      announcementId: 3,
      announcementText: this.model.tracratAnnouncements || '',
      companyId: -1,
    };

    this.spinner.show();
    this.companyManagementService.saveTracratAnnouncements(req).subscribe(
      () => this.spinner.hide(),
      () => this.spinner.hide()
    );
  }

  fileChangeListener($event: Event): void {
    const target = $event.target as HTMLInputElement;
    if (target?.files?.length) {
      this.readThis(target);
    }
  }

  readThis(inputValue: HTMLInputElement): void {
    if (!inputValue.files?.length) return;
    this.file = inputValue.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(this.file);

    reader.onloadend = () => {
      const result = reader.result as string;
      this.model.logo = result.split(',')[1];
      this.model.companycontentType = result.split(',')[0].split(':')[1].split(';')[0];
      this.model.companyfileName = this.file?.name;
    };
  }

  cancel(): void {
    this.location.back();
  }

  print(): void {
    this.helpFlag = false;
    window.print();
  }

  help(): void {
    this.helpFlag = !this.helpFlag;
  }
}
