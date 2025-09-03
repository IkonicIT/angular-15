import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CompanyManagementService } from '../../../services/company-management.service';
import { LocationManagementService } from '../../../services/location-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserManagementService } from '../../../services/user-management.service';
import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';
import { BroadcasterService } from '../../../services/broadcaster.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
})
export class MyProfileComponent implements OnInit {
  loader = false;
  model: any = {};
  companyId: any = 0;
  profileId: any;
  loggedInuser: any;
  userId: any;
  profile: any = {};
  transfers: any = [];
  router: Router;
  locations: any = [];
  locationItems: TreeviewItem[];
  globalCompany: any;
  allLocations: any = [];
  index: any;
  userName: any;
  dismissible = true;
  helpFlag: any = false;
  constructor(
    router: Router,
    private route: ActivatedRoute,
    private locationManagementService: LocationManagementService,
    private companyManagementService: CompanyManagementService,
    private spinner: NgxSpinnerService,
    private userManagementService: UserManagementService,
    private broadcasterService: BroadcasterService,
    private _location: Location
  ) {
    this.router = router;
    this.getProfile();
  }

  ngOnInit() {
    this.loggedInuser = sessionStorage.getItem('userId');
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany) {
      this.companyId = this.globalCompany.companyId;
      console.log('userId=' + this.loggedInuser);
      console.log('companyId=' + this.companyId);
    }
  }

  getProfile() {
    this.spinner.show();

    this.loggedInuser = sessionStorage.getItem('userId');
    this.userManagementService.getProfileWithUser(this.loggedInuser).subscribe(
      (response) => {
        this.spinner.hide();

        this.model = response;
        console.log('user  profile ' + this.model.profileId);
        this.getLocationNames(this.loggedInuser, this.companyId);
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  getLocationNames(userId: any, companyId: any) {
    this.locations = this.broadcasterService.locations;
    console.log('user  profile ' + this.locations);
    if (this.locations && this.locations.length > 0) {
      this.locationItems = [];
      this.locationItems = this.generateHierarchy(this.locations);
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
          value: loc.locationId,
          collapsed: true,
          children: children,
        })
      );
    });
    return items;
  }

  onValueChange(value: any) {
    this.model.preferredlocationId = value;

    console.log(value);
  }

  saveProfile(profileId: any, companyId: any, model: any) {
    if (this.model.email && this.model.userName) {
      this.model.userId = sessionStorage.getItem('userId');
      this.userManagementService
        .updateProfile(this.model.profileId, this.model.companyId, this.model)
        .subscribe(
          (response: any) => {
            this.profile = response;
            this.userName = response.userName;
            this.index = 1;
            window.scroll(0, 0);
            console.log('user status roles ' + this.profile);
          },
          (error) => {
            this.spinner.hide();
          }
        );
    } else {
      this.index = -1;
    }
  }

  back() {
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
