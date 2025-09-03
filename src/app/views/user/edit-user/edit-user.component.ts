import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CompanyManagementService } from '../../../services/company-management.service';
import { UserManagementService } from '../../../services/user-management.service';
import { LocationManagementService } from '../../../services/location-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from 'src/app/services';
import { BroadcasterService } from 'src/app/services/broadcaster.service';
import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';
import { UserAttributesService } from '../../../services/user-attributes.service';
import { Company } from 'src/app/models';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent implements OnInit {
  isNameCheckVisible = false;
  isEmailCheckVisible = false;
  isDuplicateTag = false;
  isMinLength = false;
  isDuplicate = true;
  myDate = new Date();
  model: any = {};
  index = 0;
  str = '\u003d';
  companyId: number = 0;
  globalCompany: any;
  userId: any;
  profileId: any;
  locations: any[] = [];
  allVendors: any[] = [];
  allCompanies: any[] = [];
  rolesCompanies: any[] = [];
  loggedInuser: any;
  isVendor = false;
  isUserCompany = false;
  isOwnerAdmin: any;
  locationItems: TreeviewItem[] = [];
  locationsWithHierarchy: any;
  userName: string | null = null;
  typeAttributes: any;
  email: string | null = null;
  helpFlag = false;
  dismissible = true;
  vendorId: any;
  vendors: any[] = [];
  vendorItems: TreeviewItem[] = [];

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

    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany) {
      this.companyId = this.globalCompany.companyId;
    }
  }

  ngOnInit(): void {
    this.loadVendors();
    this.userName = sessionStorage.getItem('userName');
    this.globalCompany = this.companyManagementService.getGlobalCompany();

    if (this.globalCompany) {
      this.companyId = this.globalCompany.companyId;
      this.getUserInfo();
    }
  }

  loadVendors(): void {
    this.spinner.show();
    this.companyManagementService.getAllVendorDetails().subscribe({
      next: (response: any[]) => {
        this.spinner.hide();
        this.vendors = response;
        this.vendorItems = this.convertVendorsToTreeviewItems(this.vendors);
      },
      error: (err) => {
        this.spinner.hide();
        console.error('Error loading vendors:', err);
      },
    });
  }

  convertVendorsToTreeviewItems(vendors: any[]): TreeviewItem[] {
    return vendors.map(
      (vendor) =>
        new TreeviewItem({
          text: vendor.name,
          value: vendor.vendorId,
        })
    );
  }

  onVendorChange(value: any): void {
    if (this.model.vendorResource) {
      this.model.vendorResource.vendorId = value;
    } else {
      this.model.vendorResource = { vendorId: value };
    }
  }

  getUserInfo(): void {
    this.spinner.show();
    this.allCompanies = this.companyManagementService.getGlobalCompanyList();
    this.getLocations();

    this.userManagementService
      .getprofileWithType(this.userId, this.companyId)
      .subscribe({
        next: (response: any) => {
          this.spinner.hide();
          this.model = response;
          this.email = this.model.email;
          this.profileId = response.profileId;
          this.checkCompany();
          this.getTypeAttributes(this.model.userTypeId);
        },
        error: () => {
          this.spinner.hide();
        },
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

  checkUserName(event: any): void {
    this.isNameCheckVisible = true;
    this.isDuplicateTag = false;

    if (!event.target.value || event.target.value.length < 4) {
      this.isMinLength = false;
      return;
    }

    this.isMinLength = true;
    this.userManagementService.getUserId(event.target.value).subscribe({
      next: (response: any) => {
        if (response > 0) {
          this.isDuplicateTag = true;
        }
      },
      error: () => {},
    });
  }

  checkEmail(event: any): void {
    this.isEmailCheckVisible = true;
    this.isDuplicate = false;

    this.userManagementService.getEmail(event.target.value).subscribe({
      next: (response: any) => {
        if (response > 0) {
          this.isDuplicate = true;
        }
      },
      error: () => {},
    });
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
      this.userAttributeService.getTypeAttributes(typeId).subscribe({
        next: (response) => {
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
        error: () => {
          this.spinner.hide();
        },
      });
    }
  }

  generateHierarchy(locList: any[]): TreeviewItem[] {
    return locList.map((loc: any) => {
      const children =
        loc.parentLocationResourceList?.length > 0
          ? this.generateHierarchy(loc.parentLocationResourceList)
          : [];

      return new TreeviewItem({
        text: loc.name,
        value: loc.locationId,
        collapsed: true,
        children,
      });
    });
  }

  editUser(): void {
    if (
      this.model.userName &&
      this.model.email &&
      this.model.companyId &&
      this.model.firstName &&
      this.model.lastName
    ) {
      const req = {
        profileId: this.profileId,
        userId: this.userId,
        userName: this.model.userName,
        email: this.model.email,
        firstName: this.model.firstName || '',
        lastName: this.model.lastName || '',
        jobTitle: this.model.jobTitle,
        department: this.model.department,
        phone: this.model.phone,
        mobilePhone: this.model.mobilePhone,
        fax: this.model.fax,
        acceptedTerms: this.model.acceptedTerms,
        sendReceiveRFQ: this.model.sendReceiveRFQ,
        isOwnerAdmin: this.model.isOwnerAdmin,
        topLocationId: this.model.topLocationId,
        preferredLocationId: this.model.preferredLocationId,
        companyId: this.model.companyId,
        hidePricing: this.model.hidePricing,
        actualCompanyId: this.companyId,
        addedBy: this.userName,
        isVendor: this.model.isVendor,
        vendorResource: {
          vendorId: this.model.vendorResource?.vendorId,
        },
      };

      this.spinner.show();
      this.userManagementService.updateUser(this.userId, req).subscribe({
        next: () => {
          window.scroll(0, 0);
          this.index = 1;
          setTimeout(() => (this.index = 0), 7000);
          this.spinner.hide();
          this.router.navigate(['/user/list']);
        },
        error: () => {
          this.spinner.hide();
        },
      });
    } else {
      window.scroll(0, 0);
      this.index = -1;
    }
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
    this.companyManagementService.getAllVendorDetails().subscribe({
      next: (response: any[]) => {
        this.spinner.hide();
        this.allVendors = response;
      },
      error: () => {
        this.spinner.hide();
      },
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

  print(): void {
    this.helpFlag = false;
    window.print();
  }

  help(): void {
    this.helpFlag = !this.helpFlag;
  }
}
