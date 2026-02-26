import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CompanyManagementService } from '../../../services/company-management.service';
import { LocationManagementService } from '../../../services/location-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserManagementService } from '../../../services/user-management.service';
import { TreeviewItem } from 'ngx-treeview';
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
  companyId: number;
  profileId : number;
  loggedInuser: string = '';
  userId!: string;
  profile: any = {};
  transfers: any[] = [];
  locations: any[] = [];
  locationItems: TreeviewItem[] = [];
  globalCompany: any;
  allLocations: any[] = [];
  index!: number;
  userName: string = '';
  dismissible = true;
  helpFlag = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private locationManagementService: LocationManagementService,
    private companyManagementService: CompanyManagementService,
    private spinner: NgxSpinnerService,
    private userManagementService: UserManagementService,
    private broadcasterService: BroadcasterService,
    private _location: Location
  ) {
    this.getProfile();
  }

  ngOnInit(): void {
    this.loggedInuser = sessionStorage.getItem('userId') ?? '';
    this.globalCompany = this.companyManagementService.getGlobalCompany();

    if (this.globalCompany) {
      this.companyId = this.globalCompany.companyId;
    }
  }

  getProfile(): void {
    this.spinner.show();
    this.loggedInuser = sessionStorage.getItem('userId') ?? '';

    this.userManagementService.getProfileWithUser(this.loggedInuser).subscribe({
      next: (response) => {
        this.spinner.hide();
        this.model = response;
        this.getLocationNames(this.loggedInuser, this.companyId);
      },
      error: () => {
        this.spinner.hide();
      },
    });
  }

  getLocationNames(userId: string, companyId: number): void {
    this.locations = this.broadcasterService.locations;

    if (this.locations && this.locations.length > 0) {
      this.locationItems = this.generateHierarchy(this.locations);
    }
  }

  generateHierarchy(locList: any[]): TreeviewItem[] {
    const items: TreeviewItem[] = [];
    locList.forEach((loc) => {
      const children =
        loc.parentResourceList &&
        loc.parentResourceList.length > 0
          ? this.generateHierarchy(loc.parentResourceList)
          : [];

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

  onValueChange(value: string): void {
    this.model.preferredlocationId = value;
  }

  saveProfile(profileId: number, companyId: number, model: any): void {
    if (this.model.email && this.model.userName) {
      this.model.userId = sessionStorage.getItem('userId') ?? '';

      this.userManagementService
        .updateProfile(this.model.profileId, this.model.companyId, this.model)
        .subscribe({
          next: (response: any) => {
            this.profile = response;
            this.userName = response.userName;
            this.index = 1;
            window.scroll(0, 0);
          },
          error: () => {
            this.spinner.hide();
          },
        });
    } else {
      this.index = -1;
    }
  }

  back(): void {
    this._location.back();
  }

  print(): void {
    this.helpFlag = false;
    window.print();
  }

  help(): void {
    this.helpFlag = !this.helpFlag;
  }
}
