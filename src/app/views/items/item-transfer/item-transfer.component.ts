import { Component, OnInit } from '@angular/core';
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
import { TemplateRef, SecurityContext } from '@angular/core';

@Component({
  selector: 'app-item-transfer',
  templateUrl: './item-transfer.component.html',
  styleUrls: ['./item-transfer.component.scss'],
})
export class ItemTransferComponent implements OnInit {
  transfers: any = [];
  model: any = {
    vendorCompany: {
      companyId: 0,
    },
  };
  locationModel: any = {
    pLocationId: 0,
    vendorCompany: {
      companyId: 0,
    },
    locationTypeId: 0,
  };
  index: number = 0;
  locationIndex: number = 0;
  itemTypes: any;
  locationTypes: any;
  isDuplicateTag = false;
  p: any;
  order: any;
  transferFilter: any;
  itemsForPagination = 10;
  reverse: any;
  statuses: any;
  location: any;
  companyId: any;
  userName: any;
  typeAttributes: any;
  locations: any;
  dateNow: Date = new Date();
  locationId: any;
  globalCompany: any;
  companyName: any;
  warrantyTypes: any;
  itemId: any;
  item: any;
  tag: any;
  typeName: any;
  currentStatus: any;
  itemRank: any;
  locationStatuses: any;
  bsConfig: Partial<BsDatepickerConfig>;
  addedLocationId: any = 0;
  locationValue: any;
  locationItems: TreeviewItem[];
  itemTypeItems: TreeviewItem[];
  config = TreeviewConfig.create({
    hasFilter: false,
    hasCollapseExpand: false,
  });
  newLocationFlag: boolean;
  existingLocationFlag: boolean;
  addLocationFlag: any = 0;
  name: any;
  helpFlag: any = false;
  modalRef: BsModalRef;
  message: string;
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
    console.log('date' + this.model.effectiveDate);
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
    this.itemManagementService
      .getAllTransfers(this.itemId)
      .subscribe((response) => {
        this.transfers = response;
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
      (error) => {
        this.spinner.hide();
      }
    );
  }

  getLocations() {
    this.locations = this.broadcasterService.locations;
    if (this.locations && this.locations.length > 0) {
      this.locationItems = [];
      this.locationItems = this.generateHierarchy(this.locations);

      console.log(this.locationItems);
    }
    this.getAllItemTypes();
  }

  getprevLocations() {}

  generateHierarchyForItemTypes(typeList: any[]) {
    var items: TreeviewItem[] = [];
    typeList.forEach((type) => {
      var children: TreeviewItem[] = [];
      if (type.typeList && type.typeList.length > 0) {
        children = this.generateHierarchyForItemTypes(type.typeList);
      }
      items.push(
        new TreeviewItem({
          text: type.name,
          value: type.typeId,
          collapsed: true,
          children: children,
        })
      );
    });
    return items;
  }

  getLocationStatus() {
    this.locationStatusService.getAllLocationStatuses(this.companyId).subscribe(
      (response) => {
        this.locationStatuses = response;
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  getAllLocTypes() {
    this.spinner.show();
    this.locationTypesService
      .getAllLocationTypesWithHierarchy(this.companyId)
      .subscribe(
        (response) => {
          this.spinner.hide();
          this.locationTypes = response;
          this.locationTypes.forEach((type: { parentId: string }) => {
            if (!type.parentId) {
              type.parentId = 'Top Level';
            }
          });
          if (this.locationTypes && this.locationTypes.length > 0) {
            this.itemTypeItems = this.generateHierarchyForItemTypes(
              this.locationTypes
            );
          }
          this.getLocationStatus();
        },
        (error) => {
          this.spinner.hide();
        }
      );
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
    this.model.locationid = value;
    this.addLocationFlag = 1;
  }

  getAllItemTypes() {
    this.itemTypes = this.broadcasterService.itemTypeHierarchy;
    this.getItemStatus();
  }

  getItemStatus() {
    this.spinner.show();
    this.itemStatusService.getAllItemStatuses(this.companyId).subscribe(
      (response) => {
        this.statuses = response;
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  viewItemTransfer(transfer: any) {}

  saveLocation() {
    if (
      this.locationModel.locationName &&
      this.locationModel.locationTypeId &&
      this.locationModel.locationTypeId != 0
    ) {
      if (this.typeAttributes && this.typeAttributes.length > 0) {
        this.locationModel.attributeValues = [];
        this.typeAttributes.forEach(
          (attr: { attributeNameId: any; value: any }) => {
            this.locationModel.attributeValues.push({
              attributeName: {
                attributeNameId: attr.attributeNameId,
              },
              entityId: 0,
              entitytypeId: 0,
              lastModifiedBy: this.userName,
              value: attr.value,
            });
          }
        );
      }
      var request = [
        {
          address1: this.locationModel.addressLineOne ? this.locationModel.addressLineOne : '',
          address2: this.locationModel.addressLineTwo ? this.locationModel.addressLineTwo : '',
          city: this.locationModel.city ? this.locationModel.city : '',
          typeId: this.locationModel.locationTypeId ? this.locationModel.locationTypeId : '',
          company: {
            companyId: this.companyId,
          },
          criticalflag: this.locationModel.critical ? this.locationModel.critical : false,
          description: this.locationModel.description ? this.locationModel.description : '',
          desiredspareratio: this.locationModel.sRatio ? this.locationModel.sRatio : 0,
          isvendor: this.locationModel.vLocation ? this.locationModel.vLocation : false,
          lastModifiedBy: this.userName,
          locationid: 0,
          name: this.locationModel.locationName ? this.locationModel.locationName : '',
          parentLocation: {
            locationid: this.model.locationid ? this.model.locationid : 0,
          },
          postalCode: this.locationModel.postalCode ? this.locationModel.postalCode : '',
          state: this.locationModel.state ? this.locationModel.state : '',
          statusId: this.locationModel.statusId ? this.locationModel.statusId : 0,
          vendorCompany: {
            companyId: 0,
          },
          attributeValues: this.locationModel.attributeValues ? this.locationModel.attributeValues : null,
        },
      ];

      this.spinner.show();
      this.locationManagementService.saveLocation(request).subscribe(
        (location: any) => {
          this.name = location[0].name;
          this.addedLocationId = location[0].locationid;
          this.locationManagementService
            .getAllLocations(this.companyId)
            .subscribe((response) => {
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
        (error) => {
          this.spinner.hide();
        }
      );
    } else {
      this.locationIndex = -1;
    }
  }

  refreshCalls() {
    this.spinner.show();
    this.locationManagementService
      .getAllLocationsWithHierarchy(this.companyId)
      .subscribe((response) => {
        this.broadcasterService.locations = response;
        this.model.toLocation = this.addedLocationId;
        this.getLocations();
        console.log('locations:' + response);
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
      var req = {
        daysinOldStatus: this.model.daysinOldStatus
          ? this.model.daysinOldStatus
          : 0,
        details: this.model.details ? this.model.details : null,
        fromLocation: this.item.locationName,
        fromLocationID: this.item.locationId,
        itemID: this.itemId,
        jobNumber: this.model.jobNumber ? this.model.jobNumber : null,
        newStatus: this.model.newStatus,
        oldStatus: this.item.status ? this.item.status : null,
        shippingNumber: this.model.shippingNumber
          ? this.model.shippingNumber
          : null,
        toLocationID: this.model.toLocation ? this.model.toLocation : 0,
        companyId: this.companyId,
        statusID: this.model.newStatus,
        trackingNumber: this.model.trackingNumber
          ? this.model.trackingNumber
          : null,
        transferDate: this.model.effectiveDate,
        transferredBy: this.userName,
        ponumber: this.model.ponumber ? this.model.ponumber : null,
      };
      this.spinner.show();
      this.itemManagementService.saveTransfer(req).subscribe(
        (response) => {
          this.spinner.hide();
          console.log(response);
          this.itemManagementService
            .getAllTransfers(this.itemId)
            .subscribe((response) => {
              this.transfers = response;
            });
          this.getItem();

          this.index = 1;
          setTimeout(() => {
            this.index = 0;
          }, 7000);
          this.model = {};
          window.scroll(0, 0);
        },
        (error) => {
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
  setOrder(orderType: string) {}
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
    this.itemManagementService
      .deleteItemTransferLog(this.transferLogId)
      .subscribe(
        (response) => {
          this.spinner.hide();
          this.modalRef.hide();
          this.getAllTransfers();
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef.hide();
  }
}
