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
    locationid: 0,
    typeId: 0,
    warrantytypeid: 0,
  };
  locationModel: any = {
    pLocationId: 0,
    vendorCompany: {
      companyid: 0,
    },
    locationTypeId: 0,
  };

  locationIndex: number = 0;
  index: number = 0;
  itemTypes: any;
  isDuplicateTag = false;
  statuses: any;
  companyId: any;
  typeAttributes: any;
  locations: any;
  globalCompany: any;
  companyName: any;
  warrantyTypes: any;
  currentRole: any;
  highestRank: any;
  userName: any;
  typeName: any;
  location: any = [];
  dateNow: Date = new Date();
  bsConfig: Partial<BsDatepickerConfig>;

  locationValue: any;
  locationItems: TreeviewItem[];
  itemTypeItems: TreeviewItem[];
  config = TreeviewConfig.create({
    hasFilter: false,
    hasCollapseExpand: false,
  });
  locationTypeItems: TreeviewItem[];
  attributevalues: any[];
  newLocationFlag: boolean;
  existingLocationFlag: boolean;
  addLocationFlag: any = 0;
  name: any;
  locationStatuses: any;
  locationTypes: any;
  addedLocationId: any = 0;
  isReqdAttr: any;
  reqAttrName: any;
  reqAttrValue: any;
  reqAttrValidate: any;
  helpFlag: any = false;
  dismissible = true;

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
    var globalCompanyName = sessionStorage.getItem('globalCompany');
    if (this.globalCompany) {
      this.companyName = this.globalCompany.name;
      this.companyId = this.globalCompany.companyid;
    }
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value.companyid;
      this.companyName = this.globalCompany.name;
    });
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName');

    if (this.companyId) {
      this.getLocations();
    }
    this.currentRole = sessionStorage.getItem('currentRole');
    this.highestRank = sessionStorage.getItem('highestRank');
  }

  getItemTypeAttributesClone(typeId: string) {
    if (typeId && typeId != '0') {
      this.spinner.show();
      this.itemAttributeService.getTypeAttributes(typeId).subscribe(
        (response) => {
          this.typeAttributes = response;
          if (
            this.model.attributevalues &&
            this.model.attributevalues.length > 0
          ) {
            this.typeAttributes.forEach(
              (attr: { name: any; attributelistitemResource: any }) => {
                this.model.attributevalues.forEach(
                  (ansAttr: {
                    attributename: {
                      name: any;
                      attributelistitemResource: any;
                    };
                  }) => {
                    if (attr.name == ansAttr.attributename.name) {
                      ansAttr.attributename.attributelistitemResource =
                        attr.attributelistitemResource;
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
                entityid: 0,
                entitytypeid: 0,
                lastmodifiedby: this.userName,
                value: '',
              });
            });
          }
          this.model.locationTypeId = typeId;
          this.spinner.hide();
        },
        (error) => {
          this.spinner.hide();
        }
      );
    }
  }

  getLocations() {
    this.locations = this.broadcasterService.locations;
    if (this.locations && this.locations.length > 0) {
      this.locationItems = [];
      this.locationItems = this.generateHierarchy(this.locations);
    }

    this.getAllItemTypes();
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
          this.locationTypes.forEach((type: { parentid: string }) => {
            if (!type.parentid) {
              type.parentid = 'Top Level';
            }
          });
          if (this.locationTypes && this.locationTypes.length > 0) {
            this.locationTypeItems = this.generateHierarchyForItemTypes(
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
          value: loc.locationid,
          collapsed: true,
          children: children,
        })
      );
    });
    return items;
  }

  onValueChange(value: any) {
    if (value != undefined) {
      this.model.locationid = value;
      this.addLocationFlag = 1;
    }
  }

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
          value: type.typeid,
          collapsed: true,
          children: children,
        })
      );
    });
    return items;
  }

  getAllItemTypes() {
    this.spinner.show();
    this.itemTypesService
      .getAllItemTypesWithHierarchy(this.companyId)
      .subscribe(
        (response) => {
          this.spinner.hide();
          this.itemTypes = response;
          if (this.itemTypes && this.itemTypes.length > 0) {
            this.itemTypeItems = this.generateHierarchyForItemTypes(
              this.itemTypes
            );
          }
          this.getItemStatus();
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }

  getItemStatus() {
    this.itemStatusService.getAllItemStatuses(this.companyId).subscribe(
      (response) => {
        this.statuses = response;
        this.getWarrantyTypes();
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  getWarrantyTypes() {
    this.spinner.show();
    this.warrantyManagementService
      .getAllWarrantyTypes(this.companyId)
      .subscribe(
        (response) => {
          this.spinner.hide();
          this.warrantyTypes = response;
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }

  getItemTypeAttributes(typeId: string, event: any) {
    this.getTypeName(typeId);
    if (typeId && typeId != '0') {
      this.spinner.show();
      this.itemAttributeService.getTypeAttributes(typeId).subscribe(
        (response) => {
          this.typeAttributes = response;
          this.model.attributevalues = [];
          this.typeAttributes.forEach((attr: any) => {
            this.model.attributevalues.push({
              attributename: attr,
              entityid: 0,
              entitytypeid: 0,
              lastmodifiedby: 'Yogi Patel',
              value: '',
            });
          });
          this.model.locationTypeId = typeId;
          this.spinner.hide();
        },
        (error) => {
          this.spinner.hide();
        }
      );
    }
  }

  getTypeName(typeId: any) {
    this.itemTypes.forEach(
      (type: { typeid: any; name: any; typeList: any[] }) => {
        if (type.typeid == typeId) {
          this.typeName = type.name;
        } else if (type.typeList.length >= 1) {
          type.typeList.forEach((type) => {
            if (type.typeid == typeId) {
              this.typeName = type.name;
            }
          });
        }
      }
    );
  }

  checkItemTag(event: any) {
    this.itemManagementService
      .checkTag(event.target.value, this.model.typeId)
      .subscribe(
        (response: any) => {
          this.isDuplicateTag = response.length > 0 ? true : false;
        },
        (error) => {}
      );
  }

  saveLocation() {
    if (
      this.locationModel.locationName &&
      this.locationModel.locationTypeId &&
      this.locationModel.locationTypeId != 0
    ) {
      if (this.typeAttributes && this.typeAttributes.length > 0) {
        this.locationModel.attributevalues = [];
        this.typeAttributes.forEach(
          (attr: { type: { entitytypeid: any }; value: any }) => {
            this.locationModel.attributevalues.push({
              attributename: attr,
              entityid: 0,
              entitytypeid: attr.type.entitytypeid,
              lastmodifiedby: this.userName,
              value: attr.value,
            });
          }
        );
      }
      var request = [
        {
          address1: this.locationModel.addressLineOne
            ? this.locationModel.addressLineOne
            : '',
          address2: this.locationModel.addressLineTwo
            ? this.locationModel.addressLineTwo
            : '',
          city: this.locationModel.city ? this.locationModel.city : '',
          typeId: this.locationModel.locationTypeId
            ? this.locationModel.locationTypeId
            : '',
          company: {
            companyid: this.companyId,
          },
          criticalflag: this.locationModel.critical
            ? this.locationModel.critical
            : false,
          description: this.locationModel.description
            ? this.locationModel.description
            : '',
          desiredspareratio: this.locationModel.sRatio
            ? this.locationModel.sRatio
            : 0,
          isvendor: this.locationModel.vLocation
            ? this.locationModel.vLocation
            : false,
          lastmodifiedby: this.userName,
          locationid: 0,
          name: this.locationModel.locationName
            ? this.locationModel.locationName
            : '',
          parentLocation: {
            locationid: this.model.locationid ? this.model.locationid : 0,
          },
          postalcode: this.locationModel.postalCode
            ? this.locationModel.postalCode
            : '',
          state: this.locationModel.state ? this.locationModel.state : '',
          statusid: this.locationModel.statusid
            ? this.locationModel.statusid
            : 0,
          vendorCompany: {
            companyid: 0,
          },
          attributevalues: this.locationModel.attributevalues
            ? this.locationModel.attributevalues
            : null,
        },
      ];

      this.spinner.show();
      this.locationManagementService.saveLocation(request).subscribe(
        (response: any) => {
          this.addedLocationId = response[0].locationid;
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
        this.model.locationid = this.addedLocationId;
        this.getLocations();
        this.spinner.hide();
      });
  }

  saveItem() {
    if (
      this.model.typeId &&
      this.model.typeId != 0 &&
      this.model.tag &&
      this.model.tag != '' &&
      this.model.statusid &&
      this.model.statusid != 0 &&
      !this.isDuplicateTag &&
      this.model.locationid
    ) {
      if (this.typeAttributes && this.typeAttributes.length > 0) {
        this.model.attributevalues = [];
        this.typeAttributes.forEach(
          (attr: { type: { entitytypeid: any }; value: null }) => {
            this.model.attributevalues.push({
              attributename: attr,
              entityid: 0,
              entitytypeid: attr.type.entitytypeid,
              lastmodifiedby: this.userName,
              value: attr.value != null ? attr.value : '',
            });
          }
        );
      }
      this.reqAttrValidate = false;
      this.model.attributevalues.forEach(
        (attr: {
          attributename: { isrequired: any; name: any };
          value: any;
        }) => {
          this.isReqdAttr = attr.attributename.isrequired;
          this.reqAttrName = attr.attributename.name;
          this.reqAttrValue = attr.value;
          if (
            this.isReqdAttr == true &&
            (isUndefined(this.reqAttrValue) ||
              isNull(this.reqAttrValue) ||
              this.reqAttrValue == '')
          ) {
            this.reqAttrValidate = true;
            return;
          }
        }
      );
      var req = {
        attributevalues: this.model.attributevalues,
        defaultimageattachmentid: 0,
        description: this.model.description ? this.model.description : '',
        desiredspareratio: this.model.spareRatio ? this.model.spareRatio : 0,
        inserviceon: this.dateNow,
        isinrepair: false,
        isstale: false,
        itemid: 0,
        lastmodifiedby: this.userName,
        locationid: this.model.locationid ? this.model.locationid : 0,
        manufacturerid: null,
        meantimebetweenservice: this.model.mtbs ? this.model.mtbs : 0,
        modelnumber: 'string',
        name: this.model.name ? this.model.name : '',
        purchasedate: this.model.purchasedate ? this.model.purchasedate : '',
        purchaseprice: this.model.purchaseprice ? this.model.purchaseprice : 0,
        repairqual: 0,
        serialnumber: '',
        companyid: this.companyId,
        statusid: this.model.statusid ? this.model.statusid : 0,
        tag: this.model.tag ? this.model.tag : '',
        typeId: this.model.typeId ? this.model.typeId : 0,
        warrantyexpiration: this.model.warrantyexpiration
          ? this.model.warrantyexpiration
          : '',
        warrantytypeid: this.model.warrantytypeid
          ? this.model.warrantytypeid
          : 0,
        userid: sessionStorage.getItem('userId'),
        typeName: this.typeName,
        locationName: this.model.locationName,
        statusname: this.model.statusName,
        createdDate: new Date().toISOString(),
      };
      if (this.reqAttrValidate == false) {
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
          (error) => {
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

  getLocationNameAndStatusNameFromId(locationid: any, statusid: any) {
    this.locations.forEach((element: { locationid: any; name: any }) => {
      if (element.locationid == locationid) {
        this.model.locationName = element.name;
      }
    });

    this.statuses.forEach((element: { statusid: any; status: any }) => {
      if (element.statusid == statusid) {
        this.model.statusName = element.status;
      }
    });
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

  print() {
    this.helpFlag = false;
    window.print();
  }

  help() {
    this.helpFlag = !this.helpFlag;
  }
}
