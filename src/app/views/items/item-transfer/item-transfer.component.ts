import { Component, OnInit, TemplateRef } from '@angular/core';
import { LocationManagementService } from '../../../services/location-management.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationTypesService } from '../../../services/location-types.service';
import { ItemStatusService } from '../../../services/Items/item-status.service';
import { ItemTypesService } from '../../../services/Items/item-types.service';
import { WarrantyManagementService } from '../../../services/warranty-management.service';
import { ItemAttributeService } from '../../../services/Items/item-attribute.service';
import { ItemManagementService } from '../../../services/Items/item-management.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';
import { BroadcasterService } from '../../../services/broadcaster.service';
import { Location } from '@angular/common';
import { LocationStatusService } from '../../../services/location-status.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-item-transfer',
  templateUrl: './item-transfer.component.html',
  styleUrls: ['./item-transfer.component.scss'],
})
export class ItemTransferComponent implements OnInit {
  transfers: any[] = [];
  model: any = {
    vendorCompany: { companyId: 0 },
    effectiveDate: new Date(),
  };
  locationModel: any = {
    pLocationId: 0,
    vendorCompany: { companyId: 0 },
    locationTypeId: 0,
  };
  index: number = 0;
  locationIndex: number = 0;
  itemTypes: any[] = [];
  locationTypes: any[] = [];
  isDuplicateTag = false;
  p: any;
  order: any;
  transferFilter: any;
  itemsForPagination = 10;
  reverse: any;
  statuses: any[] = [];
  location: any;
  companyId: any;
  userName: any;
  typeAttributes: any[] = [];
  locations: any[] = [];
  dateNow: Date = new Date();
  locationId: any;
  globalCompany: any;
  companyName: any;
  warrantyTypes: any[] = [];
  itemId: any;
  item: any;
  tag: any;
  typeName: any;
  currentStatus: any;
  itemRank: any;
  locationStatuses: any[] = [];
  bsConfig: Partial<BsDatepickerConfig>;
  addedLocationId: any = 0;
  locationValue: any;
  locationItems: TreeviewItem[] = [];
  itemTypeItems: TreeviewItem[] = [];
  config = TreeviewConfig.create({
    hasFilter: false,
    hasCollapseExpand: false,
  });
  newLocationFlag: boolean = false;
  existingLocationFlag: boolean = false;
  addLocationFlag: any = 0;
  name: any;
  helpFlag: boolean = false;
  modalRef!: BsModalRef;
  message: string = '';
  transferLogId: any;
  highestRank: any;
  dismissible = true;

  constructor(
    private locationManagementService: LocationManagementService,
    private companyManagementService: CompanyManagementService,
    private itemManagementService: ItemManagementService,
    private locationTypesService: LocationTypesService,
    private itemStatusService: ItemStatusService,
    private locationStatusService: LocationStatusService,
    private itemTypesService: ItemTypesService,
    private itemAttributeService: ItemAttributeService,
    private _location: Location,
    private warrantyManagementService: WarrantyManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private broadcasterService: BroadcasterService,
    private modalService: BsModalService
  ) {
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.itemId = route.snapshot.params['itemId'];
    sessionStorage.setItem('transferItemId', this.itemId);
    this.model.effectiveDate = this.dateNow;
    if (this.globalCompany) {
      this.companyName = this.globalCompany.name;
      this.companyId = this.globalCompany.companyId;
      this.userName = sessionStorage.getItem('userName');
    }
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value.companyId;
      this.companyName = this.globalCompany.name;
      this.userName = sessionStorage.getItem('userName');
    });

    this.spinner.show();
    this.getAllTransfers();
    this.getItem();
  }

  ngOnInit() {
    this.itemRank = this.broadcasterService.itemRank;
    this.highestRank = sessionStorage.getItem('highestRank');
    if (this.companyId) {
      this.getLocations();
      this.getprevLocations();
    }
  }

  getAllTransfers() {
    this.itemManagementService.getAllTransfers(this.itemId).subscribe((response) => {
      this.transfers = Array.isArray(response) ? response : [];
      this.spinner.hide();
    });
  }

  getItem() {
    this.spinner.show();
    this.itemManagementService.getItemById(this.itemId).subscribe(
      (response) => {
        this.spinner.hide();
        this.item = response;
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  getLocations() {
    this.locations = Array.isArray(this.broadcasterService.locations) ? this.broadcasterService.locations : [];
    if (this.locations && this.locations.length > 0) {
      this.locationItems = this.generateHierarchy(this.locations);
    }
    this.getAllItemTypes();
  }

  getprevLocations() {
    
  }

  generateHierarchyForItemTypes(typeList: any[]): TreeviewItem[] {
    return typeList.map((type) => {
      const children =
        type.typeList && type.typeList.length > 0
          ? this.generateHierarchyForItemTypes(type.typeList)
          : [];
      return new TreeviewItem({
        text: type.name,
        value: type.typeId,
        collapsed: true,
        children,
      });
    });
  }

  getLocationStatus() {
    this.locationStatusService.getAllLocationStatuses(this.companyId).subscribe(
      (response) => {
        this.locationStatuses = Array.isArray(response) ? response : [];
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  getAllLocTypes() {
    this.spinner.show();
    this.locationTypesService.getAllLocationTypesWithHierarchy(this.companyId).subscribe(
      (response) => {
        this.spinner.hide();
        this.locationTypes = Array.isArray(response) ? response : [];
        this.locationTypes.forEach((type: { parentId: string }) => {
          if (!type.parentId) {
            type.parentId = 'Top Level';
          }
        });
        if (this.locationTypes && this.locationTypes.length > 0) {
          this.itemTypeItems = this.generateHierarchyForItemTypes(this.locationTypes);
        }
        this.getLocationStatus();
      },
      () => {
        this.spinner.hide();
      }
    );
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

  onValueChange(value: any) {
    this.model.locationId = value;
    this.addLocationFlag = 1;
  }

  getAllItemTypes() {
    this.itemTypes = Array.isArray(this.broadcasterService.itemTypeHierarchy)
      ? this.broadcasterService.itemTypeHierarchy
      : [];
    this.getItemStatus();
  }

  getItemStatus() {
    this.spinner.show();
    this.itemStatusService.getAllItemStatuses(this.companyId).subscribe(
      (response) => {
        this.statuses = Array.isArray(response) ? response : [];
        this.spinner.hide();
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  viewItemTransfer(transfer: any) {
    
  }

  saveLocation() {
    if (
      this.locationModel.locationName &&
      this.locationModel.locationTypeId &&
      this.locationModel.locationTypeId != 0
    ) {
      if (this.typeAttributes && this.typeAttributes.length > 0) {
        this.locationModel.attributeValues = [];
        this.typeAttributes.forEach((attr: { attributeNameId: any; value: any }) => {
          this.locationModel.attributeValues.push({
            attributeName: { attributeNameId: attr.attributeNameId },
            entityId: 0,
            entitytypeId: 0,
            lastModifiedBy: this.userName ?? '',
            value: attr.value,
          });
        });
      }
      const request = [
        {
          address1: this.locationModel.addressLineOne ?? '',
          address2: this.locationModel.addressLineTwo ?? '',
          city: this.locationModel.city ?? '',
          typeId: this.locationModel.locationTypeId ?? '',
          company: { companyId: this.companyId },
          criticalFlag: this.locationModel.critical ?? false,
          description: this.locationModel.description ?? '',
          desiredSpareRatio: this.locationModel.sRatio ?? 0,
          isVendor: this.locationModel.vLocation ?? false,
          lastModifiedBy: this.userName ?? '',
          locationId: 0,
          name: this.locationModel.locationName ?? '',
          parentLocation: { locationId: this.model.locationId ?? 0 },
          postalCode: this.locationModel.postalCode ?? '',
          state: this.locationModel.state ?? '',
          statusId: this.locationModel.statusId ?? 0,
          vendorCompany: { companyId: 0 },
          attributeValues: this.locationModel.attributeValues ?? null,
        },
      ];

      this.spinner.show();
      this.locationManagementService.saveLocation(request).subscribe(
        (location: any) => {
          this.name = location[0].name;
          this.addedLocationId = location[0].locationId;
          this.locationManagementService.getAllLocations(this.companyId).subscribe((response) => {
            this.locationManagementService.setLocations(response);
            this.spinner.hide();
            this.locationIndex = 1;
            setTimeout(() => {
              this.index = 0;
            }, 7000);
            this.refreshCalls();
            this.newLocationFlag = false;
            this.locationModel = [];
          });
        },
        () => {
          this.spinner.hide();
        }
      );
    } else {
      this.locationIndex = -1;
    }
  }

  refreshCalls() {
    this.spinner.show();
    this.locationManagementService.getAllLocationsWithHierarchy(this.companyId).subscribe((response) => {
      this.broadcasterService.locations = response;
      this.model.toLocation = this.addedLocationId;
      this.getLocations();
      this.spinner.hide();
    });
  }

  saveTransfer() {
    if (
      this.model.newStatus == undefined ||
      this.model.toLocation == undefined ||
      this.model.effectiveDate == undefined
    ) {
      this.index = -1;
      window.scroll(0, 0);
    } else {
      const req = {
        daysinOldStatus: this.model.daysinOldStatus ?? 0,
        details: this.model.details ?? null,
        fromLocation: this.item.locationName,
        fromLocationId: this.item.locationId,
        itemId: this.itemId,
        jobNumber: this.model.jobNumber ?? null,
        newStatus: this.model.newStatus,
        oldStatus: this.item.status ?? null,
        shippingNumber: this.model.shippingNumber ?? null,
        toLocationId: this.model.toLocation ?? 0,
        companyId: this.companyId,
        statusId: this.model.newStatus,
        trackingNumber: this.model.trackingNumber ?? null,
        transferDate: this.model.effectiveDate,
        transferredBy: this.userName ?? '',
        poNumber: this.model.poNumber ?? null,
      };
      this.spinner.show();
      this.itemManagementService.saveTransfer(req).subscribe(
        (response) => {
          this.spinner.hide();
          this.itemManagementService.getAllTransfers(this.itemId).subscribe((response) => {
            this.transfers = Array.isArray(response) ? response : [];
          });
          this.getItem();
          this.index = 1;
          setTimeout(() => {
            this.index = 0;
          }, 7000);
          this.model = {};
          window.scroll(0, 0);
        },
        () => {
          this.spinner.hide();
        }
      );
    }
  }

  newLocation() {
    this.getAllLocTypes();
    this.newLocationFlag = true;
  }

  existingLocation() {
    this.newLocationFlag = false;
    this.existingLocationFlag = true;
  }

  back() {
    this._location.back();
  }

  setOrder(orderType: string) {
  
  }

  backToViewItem() {
    this.router.navigate(['/items/viewItem/' + this.itemId]);
  }

  help() {
    this.helpFlag = !this.helpFlag;
  }

  openModal(template: TemplateRef<any>, id: any) {
    this.transferLogId = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();
    this.itemManagementService.deleteItemTransferLog(this.transferLogId).subscribe(
      () => {
        this.spinner.hide();
        this.modalRef.hide();
        this.getAllTransfers();
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef.hide();
  }
}