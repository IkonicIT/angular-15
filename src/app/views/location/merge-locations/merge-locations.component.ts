import { Component, OnInit } from '@angular/core';
import { TreeviewItem } from 'ngx-treeview';
import { BroadcasterService } from '../../../services/broadcaster.service';
import { LocationManagementService } from '../../../services/location-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { CompanyManagementService } from '../../../services/company-management.service';

@Component({
  selector: 'app-merge-locations',
  templateUrl: './merge-locations.component.html',
  styleUrls: ['./merge-locations.component.scss'],
})
export class MergeLocationsComponent implements OnInit {
  locationItems: TreeviewItem[];
  locations: any;
  model: any = {
    tolocationid: 0,
    fromlocationid: 0,
    locationname: '',
  };
  index: number;
  dismissible = true;
  globalCompany: any;
  companyName: any;
  companyId: any;
  helpFlag: any = false;
  loader = false;
  constructor(
    private broadcasterService: BroadcasterService,
    private locationManagementService: LocationManagementService,
    private spinner: NgxSpinnerService,
    private companyManagementService: CompanyManagementService,
    private router: Router
  ) {
    this.router = router;
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyName = this.globalCompany.name;
    this.companyId = this.globalCompany.companyid;
  }

  ngOnInit() {
    this.getLocations();
  }
  getLocations() {
    this.locations = this.broadcasterService.locations;
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
          value: loc.locationid,
          collapsed: true,
          children: children,
        })
      );
    });
    return items;
  }

  mergeLocations() {
    if (
      this.model.tolocationid &&
      this.model.tolocationid != 0 &&
      this.model.fromlocationid &&
      this.model.fromlocationid != 0 &&
      this.model.tolocationid == this.model.fromlocationid
    ) {
      this.index = 2;
    } else if (
      this.model.tolocationid &&
      this.model.tolocationid != 0 &&
      this.model.fromlocationid &&
      this.model.fromlocationid != 0 &&
      this.model.locationname &&
      this.model.locationname != ''
    ) {
      var req = {
        newLocationId: this.model.tolocationid,
        oldLocationId: this.model.fromlocationid,
        newLocationName: this.model.locationname,
      };
      this.spinner.show();
      this.loader = true;
      this.locationManagementService
        .mergeLocations(req, this.companyId)
        .subscribe(
          (response) => {
            this.spinner.hide();
            this.loader = false;
            this.index = 1;
            setTimeout(() => {
              this.index = 0;
            }, 7000);
            this.refreshCalls();
            window.scroll(0, 0);
          },
          (error) => {
            this.spinner.hide();
            this.loader = false;
          }
        );
    } else {
      console.log(`please fill required feilds`);
      this.index = -1;
      window.scroll(0, 0);
    }
  }
  refreshCalls() {
    this.spinner.show();
    this.loader = true;
    this.locationManagementService
      .getAllLocationsWithHierarchy(this.companyId)
      .subscribe((response) => {
        this.broadcasterService.locations = response;
        this.router.navigate(['/location/list']);
        console.log('locations:' + response);
        this.spinner.hide();
        this.loader = false;
      });
  }

  help() {
    this.helpFlag = !this.helpFlag;
  }
}
