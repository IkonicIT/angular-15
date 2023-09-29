import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CompanyManagementService } from '../../../services/company-management.service';
import { UserManagementService } from '../../../services/user-management.service';
import { LocationManagementService } from '../../../services/location-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../../../services';
import { BroadcasterService } from '../../../services/broadcaster.service';
import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';
import { UserAttributesService } from '../../../services/user-attributes.service';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss'],
})
export class ViewUserComponent implements OnInit {
  myDate = new Date();
  model: any = {};
  index: number = 0;
  router: Router;
  str: string = '\u003d';
  companyId: any = 0;
  globalCompany: any;
  userId: any;
  profileId: any;
  locations: any = [];
  allVendors: any = [];
  allCompanies: any = [];
  rolesCompanies: any = [];
  loggedInuser: any;
  isVendor: boolean;
  isUserCompany: boolean;
  isOwnerAdmin: any;
  locationItems: TreeviewItem[];
  locationsWithHierarchy: any;
  username: any;
  loader = false;
  typeAttributes: any;
  dismissible = true;
  constructor(
    router: Router,
    private route: ActivatedRoute,
    private companyManagementService: CompanyManagementService,
    private spinner: NgxSpinnerService,
    private loginService: LoginService,
    private userAttributeService: UserAttributesService,
    private broadcasterService: BroadcasterService,
    private userManagementService: UserManagementService,
    private locationManagementService: LocationManagementService
  ) {
    this.router = router;
    this.userId = route.snapshot.params['userId'];
    this.profileId = route.snapshot.params['profileId'];
    this.username = this.broadcasterService.username;
  }

  ngOnInit() {
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    // this.locations = this.locationManagementService.getLocations();

    if (this.globalCompany) {
      this.companyId = this.globalCompany.companyid;
      this.getUserInfo();
    }
  }

  getUserInfo() {
    this.spinner.show();
    this.loader = true;
    this.allCompanies = this.companyManagementService.getGlobalCompanyList();
    this.getLocations();
    this.spinner.hide();
    this.loader = false;

    this.spinner.show();
    this.loader = true;
    this.userManagementService
      .getprofileWithType(this.userId, this.companyId)
      .subscribe((response: any) => {
        this.spinner.hide();
        this.loader = false;
        this.model = response;
        this.profileId = response.profileid;
        this.checkCompany();
        this.getTypeAttributes(this.model.userTypeId);
        this.spinner.hide();
        this.loader = false;
      });
  }
  checkCompany() {
    var count = 0;
    this.allCompanies.forEach((company: { companyid: any }) => {
      if (company.companyid == this.model.companyid) {
        count++;
      }
    });
    if (count <= 0) {
      this.allCompanies = [];
      this.getVendorCompanies();
      this.model.vendor = true;
    }
  }

  getLocations() {
    this.locationsWithHierarchy = this.broadcasterService.locations;
    if (this.locationsWithHierarchy && this.locationsWithHierarchy.length > 0) {
      this.locationItems = [];
      this.locationItems = this.generateHierarchy(this.locationsWithHierarchy);
    }
  }

  getTypeAttributes(typeId: string) {
    if (typeId && typeId != '0') {
      this.spinner.show();
      this.loader = true;
      this.userAttributeService.getTypeAttributes(typeId).subscribe(
        (response) => {
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
                  entityid: this.profileId,
                  entitytypeid: attr.type.entitytypeid,
                  lastmodifiedby: attr.type.lastmodifiedby,
                  value: attr.value,
                });
              }
            );
          }
        },
        (error) => {
          this.spinner.hide();
          this.loader = false;
        }
      );
    }
  }

  generateHierarchy(locList: any[]) {
    var items: TreeviewItem[] = [];
    locList.forEach((loc) => {
      var children: TreeviewItem[] = [];
      if (
        loc.parentLocationResourceList &&
        loc.parentLocationResourceList.length > 0
      ) {
        children = this.generateHierarchy(loc.parentLocationResourceList);
      }
      items.push(
        new TreeviewItem({
          text: loc.name,
          value: loc.locationid,
          collapsed: true,
          children: children,
        })
      );
    });
    return items;
  }

  checkValue(event: any) {
    console.log(event);
    if (event == 'A') {
      this.getVendorCompanies();
      this.allCompanies = [];
    } else if (event == 'B') {
      this.allVendors = [];
      this.getUserCompaniesList();
    }
  }

  getVendorCompanies() {
    this.spinner.show();
    this.loader = true;
    this.companyManagementService.getAllVendors(this.companyId).subscribe(
      (response) => {
        this.spinner.hide();
        this.loader = false;
        console.log(response);

        this.allVendors = response;
      },
      (error) => {
        this.spinner.hide();
        this.loader = false;
      }
    );
  }
  getUserCompaniesList() {
    this.spinner.show();
    this.loader = true;
    this.allCompanies = this.companyManagementService.getGlobalCompanyList();
    this.getLocations();
    this.spinner.hide();
    this.loader = false;
  }

  cancelUser() {
    this.router.navigate(['/user/list']);
  }
}
