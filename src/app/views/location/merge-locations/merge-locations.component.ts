import { Component, OnInit } from '@angular/core';
import { TreeviewItem } from 'ngx-treeview';
import { BroadcasterService } from '../../../services/broadcaster.service';
import { LocationManagementService } from '../../../services/location-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { CompanyManagementService } from '../../../services/company-management.service';

@Component({
  selector: 'app-merge-locations',
  templateUrl: './merge-locations.component.html',
  styleUrls: ['./merge-locations.component.scss'],
})
export class MergeLocationsComponent implements OnInit {
  locationItems: TreeviewItem[] = [];
  locations: any[] = [];
  model = {
    tolocationId: 0,
    fromlocationId: 0,
    locationName: '',
  };
  index = 0;
  dismissible = true;
  globalCompany: any;
  companyName: string = '';
  companyId: number = 0;
  helpFlag = false;
  loader = false;

  constructor(
    private broadcasterService: BroadcasterService,
    private locationManagementService: LocationManagementService,
    private spinner: NgxSpinnerService,
    private companyManagementService: CompanyManagementService,
    private router: Router
  ) {
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyName = this.globalCompany?.name ?? '';
    this.companyId = this.globalCompany?.companyId ?? 0;
  }

  ngOnInit(): void {
    this.getLocations();
  }

  getLocations(): void {
    this.locations = Array.isArray(this.broadcasterService.locations)
      ? this.broadcasterService.locations
      : [];
    if (this.locations.length > 0) {
      this.locationItems = this.generateHierarchy(this.locations);
    }
  }

  generateHierarchy(locList: any[]): TreeviewItem[] {
    return locList.map((loc) => {
      const children =
        loc.parentResourceList && loc.parentResourceList.length > 0
          ? this.generateHierarchy(loc.parentResourceList)
          : [];
      return new TreeviewItem({
        text: loc.name,
        value: loc.locationId,
        collapsed: true,
        children,
      });
    });
  }

  mergeLocations(): void {
    if (
      this.model.tolocationId &&
      this.model.fromlocationId &&
      this.model.tolocationId === this.model.fromlocationId
    ) {
      this.index = 2;
    } else if (
      this.model.tolocationId &&
      this.model.fromlocationId &&
      this.model.locationName
    ) {
      const req = {
        newLocationId: this.model.tolocationId,
        oldLocationId: this.model.fromlocationId,
        newLocationName: this.model.locationName,
      };
      this.spinner.show();

      this.locationManagementService
        .mergeLocations(req, String(this.companyId))
        .subscribe(
          () => {
            this.spinner.hide();
            this.index = 1;
            setTimeout(() => {
              this.index = 0;
            }, 7000);
            this.refreshCalls();
            window.scroll(0, 0);
          },
          () => {
            this.spinner.hide();
          }
        );
    } else {
      this.index = -1;
      window.scroll(0, 0);
    }
  }

  refreshCalls(): void {
    this.spinner.show();
    this.locationManagementService
      .getAllLocationsWithHierarchy(this.companyId)
      .subscribe((response) => {
        this.broadcasterService.locations = response;
        this.router.navigate(['/location/list']);
        this.spinner.hide();
      });
  }

  help(): void {
    this.helpFlag = !this.helpFlag;
  }
}