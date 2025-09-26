import { Component, OnInit } from '@angular/core';
import { LocationManagementService } from '../../../services/location-management.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { ItemManagementService } from '../../../services/Items/item-management.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ItemStatusService } from '../../../services/Items/item-status.service';
import { ItemTypesService } from '../../../services/Items/item-types.service';
import { ItemAttributeService } from '../../../services/Items/item-attribute.service';
import { WarrantyManagementService } from '../../../services/warranty-management.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ItemRepairItemsService } from '../../../services/Items/item-repair-items.service';
import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';
import { BroadcasterService } from '../../../services/broadcaster.service';
import { Location } from '@angular/common';
import { LocationTypesService } from '../../../services/location-types.service';
import { LocationStatusService } from '../../../services/location-status.service';
import { isUndefined, isNull } from 'is-what';

@Component({
  selector: 'app-clone-item',
  templateUrl: './clone-item.component.html',
  styleUrls: ['./clone-item.component.scss'],
})
export class CloneItemComponent implements OnInit {
  model: any = {
    locationId: 0,
    typeId: 0,
    warrantyTypeId: 0,
  };
  locationModel: any = {
    pLocationId: 0,
    vendorCompany: { companyId: 0 },
    locationTypeId: 0,
  };
  index = 0;
  itemTypes: any[] = [];
  isDuplicateTag = false;
  statuses: any[] = [];
  companyId: number = 0;
  typeAttributes: any[] = [];
  locations: any[] = [];
  globalCompany: any;
  companyName = '';
  warrantyTypes: any[] = [];
  bsConfig: Partial<BsDatepickerConfig>;
  itemId: any;
  responseAttributes: any[] = [];
  currentRole: string | null = null;
  highestRank: string | null = null;
  get highestRankNum(): number {
    return Number(this.highestRank ?? 0);
  }
  locationValue: any;
  locationItems: TreeviewItem[] = [];
  itemTypeItems: TreeviewItem[] = [];
  config: TreeviewConfig = TreeviewConfig.create({
    hasFilter: false,
    hasCollapseExpand: false,
  });
  typeName: string = '';
  item: any;
  location: any[] = [];
  dateNow: Date = new Date();
  userName: string | null = null;
  newLocationFlag = false;
  existingLocationFlag = false;
  addLocationFlag: number = 0;
  name: string = '';
  locationStatuses: any[] = [];
  locationTypes: any[] = [];
  locationIndex = 0;
  locationTypeItems: TreeviewItem[] = [];
  addedLocationId = 0;
  isReqdAttr: any;
  reqAttrName: any;
  reqAttrValue: any;
  reqAttrValidate = false;
  helpFlag = false;
  dismissible = true;
  loader = false;

  constructor(
    private locationManagementService: LocationManagementService,
    private locationTypesService: LocationTypesService,
    private locationStatusService: LocationStatusService,
    private companyManagementService: CompanyManagementService,
    private itemManagementService: ItemManagementService,
    private itemStatusService: ItemStatusService,
    private itemTypesService: ItemTypesService,
    private itemAttributeService: ItemAttributeService,
    private warrantyManagementService: WarrantyManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private _location: Location,
    private spinner: NgxSpinnerService,
    private itemRepairItemsService: ItemRepairItemsService,
    private broadcasterService: BroadcasterService
  ) {
    this.itemId = route.snapshot.params['itemId'];
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany) {
      this.companyName = this.globalCompany.name;
      this.companyId = this.globalCompany.companyId;
    }
    this.companyManagementService.globalCompanyChange.subscribe(value => {
      this.globalCompany = value;
      this.companyId = value.companyId;
      this.companyName = value.name;
    });
  }

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('userName');
    if (this.itemId) {
      this.getAllLocationsWithHierarchy();
    }
    this.getAllItemTypes();
    this.currentRole = sessionStorage.getItem('currentRole');
    this.highestRank = sessionStorage.getItem('highestRank');
    
    
  }

  getLocations(): void {
    this.locations = Array.isArray(this.broadcasterService.locations) ? this.broadcasterService.locations : [];
    if (this.locations.length > 0) {
      this.locationItems = this.generateHierarchy(this.locations);
    }
    this.getAllItemTypes();
  }

  getLocationStatus(): void {
    this.locationStatusService.getAllLocationStatuses(String(this.companyId)).subscribe(
      response => {
        this.locationStatuses = Array.isArray(response) ? response : [];
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  getAllLocTypes(): void {
    this.spinner.show();
    this.locationTypesService.getAllLocationTypesWithHierarchy(String(this.companyId)).subscribe(
      response => {
        this.spinner.hide();
        this.locationTypes = Array.isArray(response) ? response : [];
        this.locationTypes.forEach((type: { parentId: string }) => {
          if (!type.parentId) {
            type.parentId = 'Top Level';
          }
        });
        if (this.locationTypes.length > 0) {
          this.locationTypeItems = this.generateHierarchyForItemTypes(this.locationTypes);
        }
        this.getLocationStatus();
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  getAllLocationsWithHierarchy(): void {
    this.locations = Array.isArray(this.broadcasterService.locations) ? this.broadcasterService.locations : [];
    if (this.locations.length > 0) {
      this.locationItems = this.generateHierarchy(this.locations);
    }
    this.getItemDetails();
  }

  checkItemTag(event: any): void {
    this.itemManagementService.checkTag(event.target.value, this.model.typeId).subscribe(
      (response: any) => {
        this.isDuplicateTag = Array.isArray(response) && response.length > 0;
      }
    );
  }

  generateHierarchy(locList: any[]): TreeviewItem[] {
    return locList.map(loc => {
      const children = loc.parentLocationResourceList?.length
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

  onValueChange(value: any): void {
    if (value !== undefined) {
      this.model.locationId = value;
      this.addLocationFlag = 1;
    }
  }

  getItemDetails(): void {
    this.spinner.show();
    this.itemManagementService.getItemById(this.itemId).subscribe(
      (response: any) => {
        this.spinner.hide();
        this.model = response;
        this.model.name = null;
        this.model.statusId = null;
        this.model.locationId = null;
        this.model.tag = null;
        if (this.model.purchaseDate) {
          this.model.purchaseDate = new Date(this.model.purchaseDate);
        }
        if (this.model.warrantyExpiration) {
          this.model.warrantyExpiration = new Date(this.model.warrantyExpiration);
        }
        this.getItemTypeAttributes(this.model.typeId);
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  generateHierarchyForItemTypes(typeList: any[]): TreeviewItem[] {
    return typeList.map(type => {
      const children = type.typeList?.length
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

  getAllItemTypes(): void {
    this.spinner.show();
    this.itemTypes = Array.isArray(this.broadcasterService.itemTypeHierarchy) ? this.broadcasterService.itemTypeHierarchy : [];
    if (this.itemTypes.length > 0) {
      this.itemTypeItems = this.generateHierarchyForItemTypes(this.itemTypes);
    }
    this.getItemStatus();
  }

  getItemStatus(): void {
    this.itemStatusService.getAllItemStatuses(String(this.companyId)).subscribe(
      (response: any) => {
        this.statuses = Array.isArray(response) ? response : [];
        this.getWarrantyTypes();
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  getWarrantyTypes(): void {
    this.spinner.show();
    this.warrantyManagementService.getAllWarrantyTypes(this.companyId).subscribe(
      (response: any) => {
        this.spinner.hide();
        this.warrantyTypes = Array.isArray(response) ? response : [];
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  getItemTypeAttributes(typeId: string): void {
    if (typeId && typeId !== '0') {
      this.spinner.show();
      this.itemAttributeService.getTypeAttributes(typeId).subscribe(
        (response: any) => {
          this.typeAttributes = Array.isArray(response) ? response : [];
          if (
            Array.isArray(this.model.attributeValues) &&
            this.model.attributeValues.length > 0 &&
            this.typeAttributes.length > 0
          ) {
            this.typeAttributes.forEach((attr: { name: any; value: any }) => {
              this.model.attributeValues.forEach((ansAttr: { name: any; value: any }) => {
                if (attr.name === ansAttr.name) {
                  attr.value = ansAttr.value;
                }
              });
            });
          }
          this.spinner.hide();
        },
        () => {
          this.spinner.hide();
        }
      );
    }
  }

  saveLocation(): void {
    if (
      this.locationModel.locationName &&
      this.locationModel.locationTypeId &&
      this.locationModel.locationTypeId !== 0
    ) {
      if (this.typeAttributes.length > 0) {
        this.locationModel.attributeValues = [];
        this.typeAttributes.forEach((attr: { attributeNameId: any; value: any }) => {
          this.locationModel.attributeValues.push({
            attributeName: { attributeNameId: attr.attributeNameId },
            entityId: 0,
            entityTypeId: 0,
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
        (response: any) => {
          this.addedLocationId = response[0].locationId;
          this.locationManagementService.getAllLocations(this.companyId).subscribe(resp => {
            this.locationManagementService.setLocations(resp);
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

  refreshCalls(): void {
    this.spinner.show();
    this.locationManagementService.getAllLocationsWithHierarchy(String(this.companyId)).subscribe(response => {
      this.broadcasterService.locations = response;
      this.model.locationId = this.addedLocationId;
      this.getLocations();
      this.spinner.hide();
    });
  }

  saveItem(): void {
    if (
      this.model.typeId &&
      this.model.typeId !== 0 &&
      this.model.tag &&
      this.model.tag !== '' &&
      this.model.statusId &&
      this.model.statusId !== 0 &&
      !this.isDuplicateTag &&
      this.model.locationId
    ) {
      this.model.attributeValues = [];
      if (this.typeAttributes.length > 0) {
        this.typeAttributes.forEach((attr: any) => {
          this.model.attributeValues.push({
            attributeName: attr,
            entityId: this.itemId,
            entityTypeId: attr.type.entityTypeId,
            lastModifiedBy: this.userName ?? '',
            value: attr.value ?? '',
          });
        });
      }
      this.reqAttrValidate = false;
      this.model.attributeValues.forEach((attr: { attributeName: { isRequired: any; name: any }; value: any }) => {
        this.isReqdAttr = attr.attributeName.isRequired;
        this.reqAttrName = attr.attributeName.name;
        this.reqAttrValue = attr.value;
        if (
          this.isReqdAttr === true &&
          (isUndefined(this.reqAttrValue) || isNull(this.reqAttrValue) || this.reqAttrValue === '')
        ) {
          this.reqAttrValidate = true;
          return;
        }
      });
      const req = {
        attributeValues: this.model.attributeValues ?? null,
        defaultImageAttachmentId: 0,
        description: this.model.description ?? '',
        desiredSpareRatio: this.model.desiredSpareRatio ?? 0,
        inServiceOn: this.dateNow,
        isInRepair: false,
        isStale: false,
        itemId: 0,
        lastModifiedBy: this.userName ?? '',
        locationId: this.model.locationId ?? 0,
        companyId: this.companyId,
        manufacturerId: null,
        meanTimeBetweenService: this.model.meanTimeBetweenService ?? 0,
        modelNumber: 'string',
        name: this.model.name ?? '',
        purchaseDate: this.model.purchaseDate ?? '',
        purchasePrice: this.model.purchasePrice ?? 0,
        repairQual: 0,
        serialNumber: '',
        statusId: this.model.statusId ?? 0,
        tag: this.model.tag ?? '',
        typeId: this.model.typeId ?? 0,
        warrantyExpiration: this.model.warrantyExpiration ?? '',
        warrantyTypeId: this.model.warrantyTypeId ?? 0,
        typeName: this.model.typeName,
        locationName: this.model.locationName,
        statusName: this.model.statusName,
        createdDate: new Date().toISOString(),
      };
      if (!this.reqAttrValidate) {
        this.spinner.show();
        this.itemManagementService.saveItem(req).subscribe(
          (response: any) => {
            this.spinner.hide();
            this.router.navigate(['/items/viewItem/' + response.itemId]);
            this.index = 1;
            this.itemManagementService.setSearchedItemTag(response.tag);
            this.itemManagementService.setSearchedItemTypeId(response.typeId);
            this.itemManagementService.itemSearchResults = [];
            this.router.navigate(['/items/lists/all']);
            window.scroll(0, 0);
          },
          () => {
            this.spinner.hide();
          }
        );
      } else {
        this.index = -2;
        window.scroll(0, 0);
      }
    } else {
      this.index = -1;
      window.scroll(0, 0);
    }
  }

  getLocationNameAndStatusNameFromId(locationId: any, statusId: any): void {
    this.locations.forEach((element: { locationId: any; name: any }) => {
      if (element.locationId === locationId) {
        this.model.locationName = element.name;
      }
    });
    this.statuses.forEach((element: { statusId: any; status: any }) => {
      if (element.statusId === statusId) {
        this.model.statusName = element.status;
      }
    });
  }

  newLocation(): void {
    this.getAllLocTypes();
    this.newLocationFlag = true;
  }

  existingLocation(): void {
    this.newLocationFlag = false;
    this.existingLocationFlag = true;
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