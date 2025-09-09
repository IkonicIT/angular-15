import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LocationManagementService } from '../../../services/location-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CompanyManagementService } from '../../../services/company-management.service';
import { BroadcasterService } from '../../../services/broadcaster.service';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-location-management',
  templateUrl: './location-management.component.html',
  styleUrls: ['./location-management.component.scss'],
})
export class LocationManagementComponent implements OnInit {
  modalRef: BsModalRef | null = null;
  index: number = 0;
  message: string = '';
  locations: any[] = [];
  locationsWithHierarchy: any[] = [];
  order: string = 'name';
  reverse: string = '';
  userName: string = '';
  locationFilter: string = '';
  itemsForPagination: number = 5;
  companyId: number = 0;
  locationId: number = 0;
  globalCompany: any;
  companyName: string = '';
  currentRole: string = '';
highestRank?: string | null;
  
  get highestRankNum(): number {
    return Number(this.highestRank ?? 0);
  }
  items: TreeviewItem[] = [];
  config = TreeviewConfig.create({
    hasFilter: false,
    hasCollapseExpand: false,
  });
  advancedsearchflag: number = 0;
  searchresults: any = {};
  isOwnerAdmin: string = '';
  loggedInuser: string = '';
  helpFlag: boolean = false;
  p: number = 0;
  loader: boolean = false;

  constructor(
    private modalService: BsModalService,
    private companyManagementService: CompanyManagementService,
    private locationManagementService: LocationManagementService,
    private _location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private broadcasterService: BroadcasterService,
    private spinner: NgxSpinnerService
  ) {
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany) {
      this.companyName = this.globalCompany.name ?? '';
      this.companyId = this.globalCompany.companyId ?? 0;
    }

    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyName = value?.name ?? '';
      this.companyId = value?.companyId ?? 0;
    });

    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        this.InitData();
        this.router.navigated = false;
        window.scroll(0, 0);
      }
    });
  }

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('userName') ?? '';
    this.currentRole = sessionStorage.getItem('currentRole') ?? '';
    this.highestRank = sessionStorage.getItem('highestRank') ?? '';
    this.isOwnerAdmin = sessionStorage.getItem('IsOwnerAdmin') ?? '';
    this.loggedInuser = sessionStorage.getItem('userId') ?? '';
    this.getLocations();
  }

  getLocations(): void {
    this.spinner.show();
    this.locations = [];

    this.locationManagementService.getAllLocations(this.companyId).subscribe({
  next: (response: any) => {
    this.spinner.hide();
    this.locations = (response as any[]) ?? [];
  },
  error: () => {
    this.spinner.hide();
  },
});

  }

  refreshCalls(): void {
    this.locationManagementService
      .getAllLocationsWithHierarchy(this.companyId)
      .subscribe({
        next: (response) => {
          this.broadcasterService.locations = response ?? [];
          this.spinner.hide();
        },
        error: () => {
          this.spinner.hide();
        },
      });
  }

  locationNotes(location: { locationId: number; name: string }): void {
    this.locationManagementService.currentLocationId = location.locationId;
    this.locationManagementService.currentLocationName = location.name;
    this.router.navigate(['/location/locationNote/' + location.locationId]);
  }

  InitData(): void {
    this.locationsWithHierarchy = this.broadcasterService.locations ?? [];

    if (this.locationsWithHierarchy.length > 0) {
      this.items = this.generateHierarchy(this.locationsWithHierarchy);
    }
  }

  back(): void {
    this._location.back();
  }

  generateHierarchy(locList: any[]): TreeviewItem[] {
    return locList.map((loc) => {
      const children =
        loc.parentLocationResourceList && loc.parentLocationResourceList.length > 0
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

  onValueChange(val: number): void {
    this.locationId = val;
    this.router.navigate(['/location/editLocation/' + val + '/' + this.companyId]);
  }

  openModal(template: TemplateRef<any>, id: number): void {
    this.locationId = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  closeFirstModal(): void {
    this.modalRef?.hide();
    this.modalRef = null;
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();

    this.locationManagementService
      .removeLocation(this.locationId, this.companyId, this.userName)
      .subscribe({
        next: () => {
          this.modalRef?.hide();
          this.getLocations();
          this.refreshCalls();
        },
        error: () => {
          this.spinner.hide();
        },
      });
  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef?.hide();
  }

  setOrder(value: string): void {
    if (this.order === value) {
      this.reverse = this.reverse === '' ? '-' : '';
    }
    this.order = value;
  }

  print(): void {
    this.helpFlag = false;
    window.print();
  }

  help(): void {
    this.helpFlag = !this.helpFlag;
  }
}
