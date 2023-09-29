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
import { Company } from '../../../models';

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
  username: any;
  typeAttributes: any;
  email: any;
  helpFlag: any = false;
  dismissible = true;
  loader = false;
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
      this.companyId = this.globalCompany.companyid;
    }
  }

  ngOnInit() {
    this.username = sessionStorage.getItem('userName');
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    //this.locations = this.locationManagementService.getLocations();
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
        this.email = this.model.email;
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

  editUser() {
    console.log(JSON.stringify(this.model));
    if (
      this.model.username &&
      this.model.email &&
      this.model.companyid &&
      this.model.firstname &&
      this.model.lastname
    ) {
      var req = {
        profileid: this.profileId,
        userid: this.userId,
        username: this.model.username,
        email: this.model.email,
        firstname: this.model.firstname ? this.model.firstname : '',
        lastname: this.model.lastname ? this.model.lastname : '',
        jobtitle: this.model.jobtitle,
        department: this.model.department,
        phone: this.model.phone,
        mobilephone: this.model.mobilephone,
        fax: this.model.fax,
        acceptedterms: this.model.acceptedterms,
        sendreceiverfq: this.model.sendreceiverfq,
        isowneradmin: this.model.isowneradmin,
        toplocationid: this.model.toplocationid,
        preferredlocationid: this.model.preferredlocationid,
        companyid: this.model.companyid,
        hidepricing: this.model.hidepricing,
        actualCompanyId: this.companyId,
        addedBy: this.username,
      };
      this.spinner.show();
      this.loader = true;
      this.userManagementService
        .updateUser(this.userId, req)
        .subscribe((response) => {
          window.scroll(0, 0);
          this.index = 1;
          setTimeout(() => {
            this.index = 0;
          }, 7000);
          this.spinner.hide();
          this.loader = false;
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

  print() {
    this.helpFlag = false;
    window.print();
  }

  help() {
    this.helpFlag = !this.helpFlag;
  }
}
