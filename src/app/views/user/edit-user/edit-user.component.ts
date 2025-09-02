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
  userName: any;
  typeAttributes: any;
  email: any;
  helpFlag: any = false;
  dismissible = true;
  vendorId: any;
  vendors: any;
  vendorItems: TreeviewItem[]; // Add this property

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

    this.globalCompany = this.companyManagementService.getGlobalCompany();

    if (this.globalCompany) {
      this.companyId = this.globalCompany.companyId;
    }
  }

  ngOnInit() {
    this.loadVendors();
    this.userName = sessionStorage.getItem('userName');
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    //this.locations = this.locationManagementService.getLocations();
    if (this.globalCompany) {
      this.companyId = this.globalCompany.companyId;
      this.getUserInfo();
    }

    // this.companyManagementService.getAllVendorDetails().subscribe(
    //   (response) => {
    //     this.spinner.hide();
    //     console.log(response);
    //     this.vendors = response;
    //   },
    //   (error) => {
    //     this.spinner.hide();
    //   }
    // );
  }

  loadVendors() {
    this.spinner.show();
    this.companyManagementService.getAllVendorDetails().subscribe(
      (response) => {
        this.spinner.hide();
        this.vendors = response;
        this.vendorItems = this.convertVendorsToTreeviewItems(this.vendors);
      },
      (error) => {
        this.spinner.hide();
        console.error('Error loading vendors:', error);
      }
    );
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

  onVendorChange(value: any) {
    if (this.model.vendorResource) {
      this.model.vendorResource.vendorId = value;
    } else {
      this.model.vendorResource = { vendorId: value };
    }
  }

  getUserInfo() {
    this.spinner.show();
    this.allCompanies = this.companyManagementService.getGlobalCompanyList();
    this.getLocations();
    this.spinner.hide();

    this.spinner.show();
    this.userManagementService
      .getprofileWithType(this.userId, this.companyId)
      .subscribe((response: any) => {
        this.spinner.hide();
        this.model = response;
        this.email = this.model.email;
        //  this.vendorId = this.model.vendorResource.vendorId;
        this.profileId = response.profileid;
        this.checkCompany();
        this.getTypeAttributes(this.model.userTypeId);
        this.spinner.hide();
      });
  }
  checkCompany() {
    var count = 0;
    this.allCompanies.forEach((company: { companyId: any }) => {
      if (company.companyId == this.model.companyId) {
        count++;
      }
    });
    if (count <= 0) {
      this.allCompanies = [];
      this.getVendorCompanies();
      this.model.vendor = true;
    }
  }

  checkUserName(event: any) {
    this.isNameCheckVisible = true;
    this.isDuplicateTag = false;
    console.log('event' + event.target.value);
    if (
      event.target.value.length < 4 ||
      event.target.value == null ||
      event.target.value == ''
    ) {
      this.isMinLength = false;
    } else {
      this.isMinLength = true;
      this.userManagementService.getUserId(event.target.value).subscribe(
        (response: any) => {
          if (response > 0) {
            this.isDuplicateTag = true;
          }
        },
        (error) => {}
      );
    }
  }

  checkEmail(event: any) {
    this.isEmailCheckVisible = true;
    this.isDuplicate = false;
    var email = '^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$';
    console.log('event' + event.target.value);
    if (event.target.value.match(email)) {
    }
    this.userManagementService.getEmail(event.target.value).subscribe(
      (response: any) => {
        if (response > 0) {
          this.isDuplicate = true;
        }
      },
      (error) => {}
    );
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
      this.userAttributeService.getTypeAttributes(typeId).subscribe(
        (response) => {
          this.typeAttributes = response;
          if (
            this.model.attributeValues &&
            this.model.attributeValues.length > 0
          ) {
            this.typeAttributes.forEach(
              (attr: {
                name: any;
                attributeListItemResource: any;
                value: any;
              }) => {
                this.model.attributeValues.forEach(
                  (ansAttr: {
                    attributeName: {
                      name: any;
                      attributeListItemResource: any;
                    };
                    value: any;
                  }) => {
                    if (attr.name == ansAttr.attributeName.name) {
                      ansAttr.attributeName.attributeListItemResource =
                        attr.attributeListItemResource;
                      attr.value = ansAttr.value;
                    }
                  }
                );
              }
            );
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
        },
        (error) => {
          this.spinner.hide();
        }
      );
    }
  }
  generateHierarchy(locList: any) {
    var items: TreeviewItem[] = [];
    locList.forEach((loc: any) => {
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
          value: loc.locationId,
          collapsed: true,
          children: children,
        })
      );
    });
    return items;
  }

  editUser() {
    console.log(JSON.stringify(this.model));
    if (
      this.model.userName &&
      this.model.email &&
      this.model.companyId &&
      this.model.firstName &&
      this.model.lastName
    ) {
      var req = {
        profileid: this.profileId,
        userId: this.userId,
        userName: this.model.userName,
        email: this.model.email,
        firstName: this.model.firstname ? this.model.firstname : '',
        lastName: this.model.lastname ? this.model.lastname : '',
        jobTitle: this.model.jobtitle,
        department: this.model.department,
        phone: this.model.phone,
        mobilePhone: this.model.mobilephone,
        fax: this.model.fax,
        acceptedTerms: this.model.acceptedterms,
        sendReceiverFq: this.model.sendreceiverfq,
        isOwnerAdmin: this.model.isOwnerAdmin,
        topLocationId: this.model.toplocationId,
        preferredLocationId: this.model.preferredlocationId,
        companyId: this.model.companyId,
        hidePricing: this.model.hidepricing,
        actualCompanyId: this.companyId,
        addedBy: this.userName,
        isVendor: this.model.isVendor,
        vendorResource: {
          vendorId: this.model.vendorResource.vendorId,
        },
      };
      this.spinner.show();
      this.userManagementService
        .updateUser(this.userId, req)
        .subscribe((response) => {
          window.scroll(0, 0);
          this.index = 1;
          setTimeout(() => {
            this.index = 0;
          }, 7000);
          this.spinner.hide();
          this.router.navigate(['/user/list']);
        });
    } else {
      window.scroll(0, 0);
      this.index = -1;
    }
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
    this.companyManagementService.getAllVendorDetails().subscribe(
      (response) => {
        this.spinner.hide();
        console.log(response);

        this.allVendors = response;
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
  getUserCompaniesList() {
    this.spinner.show();
    this.allCompanies = this.companyManagementService.getGlobalCompanyList();
    this.getLocations();
    this.spinner.hide();
  }

  cancelUser() {
    this.router.navigate(['/user/list']);
  }

  print() {
    this.helpFlag = false;
    window.print();
  }
  help() {
    this.helpFlag = !this.helpFlag;
  }
}
