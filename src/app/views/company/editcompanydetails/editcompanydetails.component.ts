import { Component, OnInit } from '@angular/core';
import { CompanyManagementService } from '../../../services/index';
import { ActivatedRoute } from '@angular/router';
import { Company } from '../../../models/index';
import { CompanyStatusesService } from '../../../services/index';
import { NgxSpinnerService } from 'ngx-spinner';
import { CompanyTypesService } from '../../../services/index';
import { CompanyAttributesServiceService } from '../../../services/index';
import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';
import { isUndefined, isNull } from 'is-what';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { BroadcasterService } from '../../../services/broadcaster.service';
@Component({
  selector: 'app-editcompanydetails',
  templateUrl: './editcompanydetails.component.html',
  styleUrls: ['./editcompanydetails.component.scss'],
})
export class EditcompanydetailsComponent implements OnInit {
  companyId: any;
  model: any = {
    announcement: {
      announcementtext: '',
    },
    type: {},
  };
  index: number = 0;
  eachAttr: any;
  companyName: any;
  company: any = {};
  statuses: any[] = [];
  companyTypes: any = [];
  typeAttributes: any = [];
  typeID: 0;
  file: File;

  items: TreeviewItem[];
  config = TreeviewConfig.create({
    hasFilter: false,
    hasCollapseExpand: false,
  });
  isReqdAttr: any;
  reqAttrName: any;
  reqAttrValue: any;
  reqAttrValidate: any;
  userCompanies: any = [];
  isOwnerAdmin: any;
  loggedInuser: any;
  isDuplicateTag: boolean = false;
  companyList: any = [];
  helpFlag: any = false;
  dismissible = true;
  loader = false;
  constructor(
    private companyManagementService: CompanyManagementService,
    route: ActivatedRoute,
    private companyStatusesService: CompanyStatusesService,
    private spinner: NgxSpinnerService,
    private companyTypesService: CompanyTypesService,
    private companyAttributesServiceService: CompanyAttributesServiceService,
    private router: Router,
    private _location: Location,
    private broadcasterService: BroadcasterService
  ) {
    this.companyId = route.snapshot.params['id'];
  }

  ngOnInit() {
    this.isOwnerAdmin = sessionStorage.getItem('IsOwnerAdmin');

    this.spinner.show();

    this.companyManagementService.getCompanyDetails(this.companyId).subscribe(
      (response: any) => {
        this.model = response;

        this.companyName = this.model.name;
        if (this.isOwnerAdmin == 'true') {
          this.model.tracratAnnouncements =
            this.broadcasterService.tracratAnnouncement;
        }
        if (response.attributevalues && response.attributevalues.length > 0) {
        }
        this.getAttributes(this.model.typeId);
        this.companyStatusesService
          .getAllCompanyStatuses(this.companyId)
          .subscribe((response: any) => {
            this.statuses = response;
            this.getAllTypes(this.companyId);
          });
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  getAllTypes(companyId: number) {
    this.companyTypesService
      .getAllCompanyTypesWithHierarchy(companyId)
      .subscribe(
        (response) => {
          this.companyTypes = response;
          if (this.companyTypes && this.companyTypes.length > 0) {
            this.items = this.generateHierarchy(this.companyTypes);
          }
          this.spinner.hide();
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }

  generateHierarchy(typeList: any) {
    var items: any = [];
    typeList.forEach((type: any) => {
      var children = [];
      if (type.typeList && type.typeList.length > 0) {
        children = this.generateHierarchy(type.typeList);
      }
      items.push(
        new TreeviewItem({
          text: type.name,
          value: type.typeid,
          collapsed: true,
          children: children,
        })
      );
    });
    return items;
  }

  getAttributes(typeId: any) {
    if (
      typeId &&
      typeId != '' &&
      typeId != undefined &&
      typeId != 'undefined' &&
      typeId != 0
    ) {
      this.spinner.show();

      this.companyAttributesServiceService.getTypeAttributes(typeId).subscribe(
        (response) => {
          this.spinner.hide();

          this.typeAttributes = response;
          if (
            this.model.attributevalues &&
            this.model.attributevalues.length > 0
          ) {
            this.typeAttributes.forEach(
              (attr: {
                name: any;
                attributelistitemResource: any;
                value: any;
              }) => {
                this.model.attributevalues.forEach(
                  (ansAttr: {
                    attributename: {
                      name: any;
                      attributelistitemResource: any;
                    };
                    value: any;
                  }) => {
                    if (attr.name == ansAttr.attributename.name) {
                      ansAttr.attributename.attributelistitemResource =
                        attr.attributelistitemResource;
                      attr.value = ansAttr.value;
                    }
                  }
                );
              }
            );
          } else {
            this.model.attributevalues = [];
            this.typeAttributes.forEach((attr: any) => {
              this.model.attributevalues.push({
                attributename: attr,
                entityid: this.companyId,
                entitytypeid: attr.type.entitytypeid,
                lastmodifiedby: attr.type.lastmodifiedby,
                value: attr.value,
                tooltip: attr.tooltip,
              });
            });
          }

          this.spinner.hide();
        },
        (error) => {
          this.spinner.hide();
        }
      );
    } else {
      this.typeAttributes = [];
    }
  }
  RefreshAll() {
    this.isOwnerAdmin = sessionStorage.getItem('IsOwnerAdmin');
    if (this.isOwnerAdmin == 'true') {
      this.companyManagementService
        .getAllCompanyDetails()
        .subscribe((response) => {
          this.userCompanies = response;
          this.companyManagementService.setGlobalCompanyList(
            this.userCompanies
          );
        });
    } else {
      this.loggedInuser = sessionStorage.getItem('userId');
      this.companyManagementService
        .getCompanyNames(this.loggedInuser)
        .subscribe((response) => {
          this.userCompanies = response;
          this.companyManagementService.setGlobalCompanyList(
            this.userCompanies
          );
        });
    }
  }

  checkCompanyName(name: any) {
    this.isDuplicateTag = false;
    this.companyList = this.companyManagementService.getGlobalCompanyList();
    console.log('name' + this.companyName);
    this.companyList.forEach((company: { name: any }) => {
      if (company.name == name && company.name != this.companyName) {
        this.isDuplicateTag = true;
      }
    });
  }
  updateCompany() {
    this.company.attributevalues = [];
    this.typeAttributes.forEach((attr: any) => {
      this.company.attributevalues.push({
        attributename: attr,
        entityid: this.companyId,
        entitytypeid: attr.type.entitytypeid,
        lastmodifiedby: attr.type.lastmodifiedby,
        value: attr.value,
        tooltip: attr.tooltip,
      });
    });
    this.model.attributevalues = this.company.attributevalues;
    this.reqAttrValidate = false;
    this.model.attributevalues.forEach(
      (attr: { attributename: { isrequired: any; name: any }; value: any }) => {
        this.isReqdAttr = attr.attributename.isrequired;
        this.reqAttrName = attr.attributename.name;
        this.reqAttrValue = attr.value;
        if (
          this.isReqdAttr == true &&
          (isUndefined(this.reqAttrValue) ||
            isNull(this.reqAttrValue) ||
            this.reqAttrValue == '')
        ) {
          this.reqAttrValidate = true;
          console.log('attribute check is' + this.index);
          return;
        }
        console.log('attribute isrequired value is' + this.isReqdAttr);
        console.log('attribute name is' + this.reqAttrName);
        console.log('attribute name value is' + this.reqAttrValue);
        console.log('validate' + this.reqAttrValidate);
      }
    );

    if (
      this.model.name === undefined ||
      this.model.name == '' ||
      this.reqAttrValidate == true
    ) {
      this.index = -1;
      console.log('name' + this.companyName);
      window.scroll(0, 0);
    } else {
      this.checkCompanyName(this.model.name);
      if (this.isDuplicateTag == true) {
        this.index = -2;
        window.scroll(0, 0);
      } else {
        if (this.model.statusid) {
          this.model.statusid = this.model.statusid;
          this.model.status = {};
        }

        if (this.model.typeId) {
          this.model.typeId = this.model.typeId;
        } else {
          this.model.typeId = 0;
        }

        this.model.attributevalues = this.company.attributevalues;
        this.spinner.show();

        console.log(JSON.stringify(this.model));
        this.model.announcement.announcementdate = new Date().toISOString();
        this.companyManagementService.updateCompany(this.model).subscribe(
          (response) => {
            this.spinner.hide();

            window.scroll(0, 0);
            this.index = 1;
            setTimeout(() => {
              this.index = 0;
            }, 7000);
            this.router.navigate(['/company/view/' + this.model.companyid]);
            if (this.file != null) {
              this.AddCompanyLogo(this.companyId);
            }
            alert('Company updated successfully,Refreshing List');
            this.companyManagementService.setCompaniesListModified(true);
          },
          (error) => {
            this.spinner.hide();
          }
        );
      }
    }
  }
  AddCompanyLogo(companyId: any) {
    const formdata: FormData = new FormData();
    formdata.append('file', this.file);
    this.companyManagementService
      .saveLogo(formdata, companyId)
      .subscribe((response) => {
        this.spinner.hide();
      });
  }

  saveMessage() {
    var req = {
      announcementdate: new Date().toISOString(),
      announcementid: 3,
      announcementtext: this.model.tracratAnnouncements
        ? this.model.tracratAnnouncements
        : '',
      companyid: -1,
    };
    this.spinner.show();

    this.companyManagementService
      .saveTracratAnnouncements(req)
      .subscribe((response) => {
        this.spinner.hide();
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
  cancel() {
    this._location.back();
  }
  print() {
    this.helpFlag = false;
    window.print();
  }
  help() {
    this.helpFlag = !this.helpFlag;
  }
}
