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
import { LocationStatusService } from '../../../services/location-status.service';
import { Location } from '@angular/common';
import { isUndefined, isNull } from 'is-what';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss'],
})
export class AddItemComponent implements OnInit {
  model: any = {
    locationId: 0,
    typeId: 0,
    warrantyTypeId: 0,
  };
  locationModel: any = {
    pLocationId: 0,
    vendorCompany: {
      companyId: 0,
    },
    locationTypeId: 0,
  };

  locationIndex = 0;
  index = 0;
  itemTypes: any[] = [];
  isDuplicateTag = false;
  statuses: any[] = [];
  companyId = 0;
  typeAttributes: any[] = [];
  locations: any[] = [];
  globalCompany: any;
  companyName = '';
  warrantyTypes: any[] = [];
  currentRole: string | null = null;
  highestRank: string | null = null;
  get highestRankNum(): number {
    return Number(this.highestRank ?? 0);
  }
  userName: string | null = null;
  typeName = '';
  location: any[] = [];
  dateNow: Date = new Date();
  bsConfig: Partial<BsDatepickerConfig>;
  locationValue: any;
  locationItems: TreeviewItem[] = [];
  itemTypeItems: TreeviewItem[] = [];
  config: TreeviewConfig = TreeviewConfig.create({
    hasFilter: false,
    hasCollapseExpand: false,
  });
  locationTypeItems: TreeviewItem[] = [];
  attributeValues: any[] = [];
  newLocationFlag = false;
  existingLocationFlag = false;
  addLocationFlag = 0;
  name = '';
  locationStatuses: any[] = [];
  locationTypes: any[] = [];
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
    private _location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private broadcasterService: BroadcasterService
  ) {
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
    if (this.companyId) {
      this.getLocations();
    }
    this.currentRole = sessionStorage.getItem('currentRole');
    this.highestRank = sessionStorage.getItem('highestRank');
  }

  getItemTypeAttributesClone(typeId: string): void {
    if (typeId && typeId !== '0') {
      this.spinner.show();
      this.itemAttributeService.getTypeAttributes(typeId).subscribe(
        response => {
          this.typeAttributes = Array.isArray(response) ? response : [];
          if (this.model.attributeValues && this.model.attributeValues.length > 0) {
            this.typeAttributes.forEach((attr: { name: any; attributeListItemResource: any }) => {
              this.model.attributeValues.forEach((ansAttr: { attributeName: { name: any; attributeListItemResource: any } }) => {
                if (attr.name === ansAttr.attributeName.name) {
                  ansAttr.attributeName.attributeListItemResource = attr.attributeListItemResource;
                }
              });
            });
          } else {
            this.model.attributeValues = [];
            this.typeAttributes.forEach((attr: any) => {
              this.model.attributeValues.push({
                attributeName: attr,
                entityId: 0,
                entitytypeId: 0,
                lastModifiedBy: this.userName ?? '',
                value: '',
              });
            });
          }
          this.model.locationTypeId = typeId;
          this.spinner.hide();
        },
        () => {
          this.spinner.hide();
        }
      );
    }
  }

  getLocations(): void {
    console.log(this.broadcasterService.locations);
    this.locations = this.broadcasterService.locations;
    if (this.locations && this.locations.length > 0) {
      this.locationItems = this.generateHierarchy(this.locations);
    }
    this.getAllItemTypes();
  }

  getLocationStatus(): void {
    this.locationStatusService.getAllLocationStatuses(String(this.companyId)).subscribe(
      response => {
        this.locationStatuses =Array.isArray(response) ? response : [];;
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  getAllLocTypes(): void {
    this.spinner.show();
    this.locationTypesService.getAllLocationTypesWithHierarchy(this.companyId).subscribe(
      response => {
        this.spinner.hide();
        this.locationTypes = Array.isArray(response) ? response : [];;
        this.locationTypes.forEach((type: { parentId: string }) => {
          if (!type.parentId) {
            type.parentId = 'Top Level';
          }
        });
        if (this.locationTypes && this.locationTypes.length > 0) {
          this.locationTypeItems = this.generateHierarchyForItemTypes(this.locationTypes);
        }
        this.getLocationStatus();
      },
      () => {
        this.spinner.hide();
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
    this.itemTypesService.getAllItemTypesWithHierarchy(this.companyId).subscribe(
      response => {
        this.spinner.hide();
        this.itemTypes = Array.isArray(response) ? response : [];;
        if (this.itemTypes && this.itemTypes.length > 0) {
          this.itemTypeItems = this.generateHierarchyForItemTypes(this.itemTypes);
        }
        this.getItemStatus();
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  getItemStatus(): void {
    this.itemStatusService.getAllItemStatuses(String(this.companyId)).subscribe(
      response => {
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
      response => {
        this.spinner.hide();
        this.warrantyTypes = Array.isArray(response) ? response : [];
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  getItemTypeAttributes(typeId: string, event: any): void {
    this.getTypeName(typeId);
    if (typeId && typeId !== '0') {
      this.spinner.show();
      this.itemAttributeService.getTypeAttributes(typeId).subscribe(
        response => {
          this.typeAttributes =Array.isArray(response) ? response : [];
          this.model.attributeValues = [];
          this.typeAttributes.forEach((attr: any) => {
            this.model.attributeValues.push({
              attributeName: attr,
              entityId: 0,
              entitytypeId: 0,
              lastModifiedBy: this.userName ?? '',
              value: '',
            });
          });
          this.model.locationTypeId = typeId;
          this.spinner.hide();
        },
        () => {
          this.spinner.hide();
        }
      );
    }
  }

  getTypeName(typeId: any): void {
    this.itemTypes.forEach((type: any) => {
      if (type.typeId === typeId) {
        this.typeName = type.name;
      } else if (type.typeList?.length >= 1) {
        type.typeList.forEach((subType: any) => {
          if (subType.typeId === typeId) {
            this.typeName = subType.name;
          }
        });
      }
    });
  }

  checkItemTag(event: any): void {
    this.itemManagementService.checkTag(event.target.value, this.model.typeId).subscribe(
      (response: any) => {
        this.isDuplicateTag = response.length > 0;
      },
      () => {}
    );
  }

  saveLocation(): void {
    if (
      this.locationModel.locationName &&
      this.locationModel.locationTypeId &&
      this.locationModel.locationTypeId !== 0
    ) {
      if (this.typeAttributes && this.typeAttributes.length > 0) {
        this.locationModel.attributeValues = [];
        this.typeAttributes.forEach((attr: any) => {
          this.locationModel.attributeValues.push({
            attributeName: attr,
            entityId: 0,
            entitytypeId: attr.type.entitytypeId,
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
    this.locationManagementService.getAllLocationsWithHierarchy(this.companyId).subscribe(response => {
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
      if (this.typeAttributes && this.typeAttributes.length > 0) {
        this.model.attributeValues = [];
        this.typeAttributes.forEach((attr: any) => {
          this.model.attributeValues.push({
            attributeName: attr,
            entityId: 0,
            entitytypeId: attr.type.entitytypeId,
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
        attributeValues: this.model.attributeValues,
        defaultImageAttachmentId: 0,
        description: this.model.description ?? '',
        desiredSpareRatio: this.model.spareRatio ?? 0,
        inServiceOn: this.dateNow,
        isInRepair: false,
        isStale: false,
        itemId: 0,
        lastModifiedBy: this.userName ?? '',
        locationId: this.model.locationId ?? 0,
        manufacturerId: null,
        meanTimeBetweenService: this.model.mtbs ?? 0,
        modelNumber: 'string',
        name: this.model.name ?? '',
        purchaseDate: this.model.purchaseDate ?? '',
        purchasePrice: this.model.purchasePrice ?? 0,
        repairQual: 0,
        serialNumber: '',
        companyId: this.companyId,
        statusId: this.model.statusId ?? 0,
        tag: this.model.tag ?? '',
        typeId: this.model.typeId ?? 0,
        warrantyExpiration: this.model.warrantyExpiration ?? '',
        warrantyTypeId: this.model.warrantyTypeId ?? 0,
        userId: sessionStorage.getItem('userId'),
        typeName: this.typeName,
        locationName: this.model.locationName,
        statusName: this.model.statusName,
        createdDate: new Date().toISOString(),
      };
      if (!this.reqAttrValidate) {
        this.spinner.show();
        this.itemManagementService.saveItem(req).subscribe(
          (response: any) => {
            this.spinner.hide();
            this.index = 1;
            window.scroll(0, 0);
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