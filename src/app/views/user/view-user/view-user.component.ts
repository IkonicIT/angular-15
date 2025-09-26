import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CompanyManagementService } from '../../../services/company-management.service';
import { UserManagementService } from '../../../services/user-management.service';
import { LocationManagementService } from '../../../services/location-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../../../services';
import { BroadcasterService } from '../../../services/broadcaster.service';
import { TreeviewItem } from 'ngx-treeview';
import { UserAttributesService } from '../../../services/user-attributes.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss'],
})
export class ViewUserComponent implements OnInit {
  myDate: Date = new Date();
  model: any = {};
  index = 0;
  str = '\u003d';
  companyId: number = 0;
  globalCompany: any;
  userId!: string;
  profileId!: string | number;
  locations: any[] = [];
  allVendors: any[] = [];
  allCompanies: any[] = [];
  rolesCompanies: any[] = [];
  loggedInuser: any;
  isVendor = false;
  isUserCompany = false;
  isOwnerAdmin: any;
  locationItems: TreeviewItem[] = [];
  locationsWithHierarchy: any[] = [];
  userName: any;
  loader = false;
  typeAttributes: any[] = [];
  dismissible = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private companyManagementService: CompanyManagementService,
    private spinner: NgxSpinnerService,
    private loginService: LoginService,
    private userAttributeService: UserAttributesService,
    private broadcasterService: BroadcasterService,
    private userManagementService: UserManagementService,
    private locationManagementService: LocationManagementService
  ) {
    this.userId = this.route.snapshot.params['userId'];
    this.profileId = this.route.snapshot.params['profileId'];
    this.userName = this.broadcasterService.userName;
  }

  ngOnInit(): void {
    this.globalCompany = this.companyManagementService.getGlobalCompany();

    if (this.globalCompany) {
      this.companyId = this.globalCompany.companyId;
      this.getUserInfo();
    }
  }

  getUserInfo(): void {
    this.spinner.show();

    this.allCompanies = this.companyManagementService.getGlobalCompanyList();
    this.getLocations();
    this.spinner.hide();

    this.spinner.show();

    this.userManagementService
      .getprofileWithType(this.userId, this.companyId)
      .pipe(take(1))
      .subscribe({
        next: (response: any) => {
          this.spinner.hide();
          this.model = response;
          this.profileId = response.profileId;
          this.checkCompany();
          this.getTypeAttributes(this.model.userTypeId);
        },
        error: () => this.spinner.hide(),
      });
  }

  checkCompany(): void {
    let count = 0;
    this.allCompanies.forEach((company: { companyId: any }) => {
      if (company.companyId === this.model.companyId) {
        count++;
      }
    });
    if (count <= 0) {
      this.allCompanies = [];
      this.getVendorCompanies();
      this.model.vendor = true;
    }
  }

  getLocations(): void {
    this.locationsWithHierarchy = this.broadcasterService.locations;
    if (this.locationsWithHierarchy?.length > 0) {
      this.locationItems = this.generateHierarchy(this.locationsWithHierarchy);
    }
  }

  getTypeAttributes(typeId: string): void {
    if (typeId && typeId !== '0') {
      this.spinner.show();

      this.userAttributeService
        .getTypeAttributes(typeId)
        .pipe(take(1))
        .subscribe({
          next: (response: any[]) => {
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
              this.model.attributeValues = [];
              this.typeAttributes.forEach((attr: any) => {
                this.model.attributeValues.push({
                  attributeName: attr,
                  entityId: this.profileId,
                  entitytypeId: attr.type.entitytypeId,
                  lastModifiedBy: attr.type.lastModifiedBy,
                  value: attr.value,
                });
              });
            }
            this.spinner.hide();
          },
          error: () => this.spinner.hide(),
        });
    }
  }

  generateHierarchy(locList: any[]): TreeviewItem[] {
    const items: TreeviewItem[] = [];
    locList.forEach((loc) => {
      let children: TreeviewItem[] = [];
      if (loc.parentLocationResourceList?.length > 0) {
        children = this.generateHierarchy(loc.parentLocationResourceList);
      }
      items.push(
        new TreeviewItem({
          text: loc.name,
          value: loc.locationId,
          collapsed: true,
          children,
        })
      );
    });
    return items;
  }

  checkValue(event: any): void {
    if (event === 'A') {
      this.getVendorCompanies();
      this.allCompanies = [];
    } else if (event === 'B') {
      this.allVendors = [];
      this.getUserCompaniesList();
    }
  }

  getVendorCompanies(): void {
    this.spinner.show();

    this.companyManagementService
      .getAllVendorDetails()
      .pipe(take(1))
      .subscribe({
        next: (response: any) => {
          this.spinner.hide();
          this.allVendors = response;
        },
        error: () => this.spinner.hide(),
      });
  }

  getUserCompaniesList(): void {
    this.spinner.show();
    this.allCompanies = this.companyManagementService.getGlobalCompanyList();
    this.getLocations();
    this.spinner.hide();
  }

  cancelUser(): void {
    this.router.navigate(['/user/list']);
  }
}
