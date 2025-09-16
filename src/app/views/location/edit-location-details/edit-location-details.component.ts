import { Component, OnInit } from '@angular/core';
import { LocationManagementService } from '../../../services/location-management.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocationTypesService } from '../../../services/location-types.service';
import { LocationAttributeService } from '../../../services/location-attribute.service';
import { LocationStatusService } from '../../../services/location-status.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { BroadcasterService } from '../../../services/broadcaster.service';

@Component({
  selector: 'app-edit-location-details',
  templateUrl: './edit-location-details.component.html',
  styleUrls: ['./edit-location-details.component.scss'],
})
export class EditLocationDetailsComponent implements OnInit {
  model: any = {};
  locationTypes: any[] = [];
  statuses: any[] = [];
  location: any = {
    parentLocation: {
      locationId: 0,
    },
  };
  locationId: any;
  companyId: any;
  typeAttributes: any[] = [];
  locations: any[] = [];
  index: any;
  globalCompany: any;
  companyName: any;
  addedlocations: any[] = [];
  addrequest: any[] = [];
  vendors: any[] = [];
  value: any;
  items: TreeviewItem[] = [];
  itemTypeItems: TreeviewItem[] = [];
  config = TreeviewConfig.create({
    hasFilter: false,
    hasCollapseExpand: false,
  });
  typeId: any;
  locationattr: any = {};
  userName: string | null;
  isReqdAttr: any;
  reqAttrName: any;
  reqAttrValue: any;
  reqAttrValidate: boolean = false;
  helpFlag: any = false;
  dismissible = true;
  loader = false;

  constructor(
    private locationManagementService: LocationManagementService,
    private companyManagementService: CompanyManagementService,
    private locationStatusService: LocationStatusService,
    private locationTypesService: LocationTypesService,
    private locationAttributeService: LocationAttributeService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private broadcasterService: BroadcasterService
  ) {
    this.locationId = route.snapshot.params['id'];
    this.companyId = route.snapshot.params['cmpId'];
    this.userName = sessionStorage.getItem('userName');
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyName = this.globalCompany.name;
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value.companyId;
      this.companyName = this.globalCompany.name;
    });

    this.getLocation();
  }

  ngOnInit() {
    this.getAllLocTypes();
  }

  getLocations() {
    this.locations = Array.isArray(this.broadcasterService.locations)
      ? this.broadcasterService.locations
      : [];
    if (this.locations && this.locations.length > 0) {
      this.items = this.generateHierarchy(this.locations);
    }
    this.items.unshift(
      new TreeviewItem({
        text: this.companyName,
        value: -1,
      })
    );
    this.getAllVendors();
  }

  generateHierarchy(locList: any[]): TreeviewItem[] {
    return locList.map((loc: any) => {
      const children =
        loc.parentLocationResourceList && loc.parentLocationResourceList.length > 0
          ? this.generateHierarchy(loc.parentLocationResourceList)
          : [];
      return new TreeviewItem({
        text: loc.name,
        value: loc.locationId,
        collapsed: true,
        children: children,
      });
    });
  }

  onValueChange(value: any) {
    this.value = value;
  }

  getLocationStatus() {
    this.locationStatusService.getAllLocationStatuses(this.companyId).subscribe(
      (response) => {
        this.statuses = Array.isArray(response) ? response : [];
        this.getLocations();
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  generateHierarchyForItemTypes(typeList: any[]): TreeviewItem[] {
    return typeList.map((type: any) => {
      const children =
        type.typeList && type.typeList.length > 0
          ? this.generateHierarchyForItemTypes(type.typeList)
          : [];
      return new TreeviewItem({
        text: type.name,
        value: type.typeId,
        collapsed: true,
        children: children,
      });
    });
  }

  getAllLocTypes() {
    this.spinner.show();
    this.locationTypesService
      .getAllLocationTypesWithHierarchy(this.companyId)
      .subscribe(
        (response) => {
          this.locationTypes = Array.isArray(response) ? response : [];
          if (this.locationTypes && this.locationTypes.length > 0) {
            this.itemTypeItems = this.generateHierarchyForItemTypes(
              this.locationTypes
            );
          }
          this.getLocationStatus();
        },
        () => {
          this.spinner.hide();
        }
      );
  }

  getTypeAttributes(typeId: any) {
    if (typeId && typeId !== '0') {
      this.locationAttributeService.getTypeAttributes(typeId).subscribe(
        (response) => {
          this.spinner.hide();
          this.typeAttributes = Array.isArray(response) ? response : [];
          if (
            this.location.attributeValues &&
            this.location.attributeValues.length > 0
          ) {
            this.typeAttributes.forEach((attr: any) => {
              this.location.attributeValues.forEach((ansAttr: any) => {
                if (attr.name == ansAttr.attributeName.name) {
                  ansAttr.attributeName.attributeListItemResource =
                    attr.attributeListItemResource;
                  attr.value = ansAttr.value;
                }
              });
            });
          } else {
            this.typeAttributes.forEach((attr: any) => {
              if (attr.attributeType.attributeTypeId == 4) {
                this.location.attributeValues.push({
                  attributeName: attr,
                  entityId: this.locationId,
                  entitytypeId: attr.type.entitytypeId,
                  lastModifiedBy: attr.type.lastModifiedBy,
                  value: parseInt(attr.value),
                });
              } else {
                this.location.attributeValues.push({
                  attributeName: attr,
                  entityId: this.locationId,
                  entitytypeId: attr.type.entitytypeId,
                  lastModifiedBy: attr.type.lastModifiedBy,
                  value: attr.value,
                });
              }
            });
          }
        },
        () => {
          this.spinner.hide();
        }
      );
    }
  }

  getLocation() {
    this.spinner.show();
    this.locationManagementService
      .getLocationDetails(this.locationId)
      .subscribe(
        (response) => {
          this.location = response;
          if (this.location.parentId == null) {
            this.value = -1;
            this.location.parentLocation = {
              locationId: 0,
            };
          } else {
            this.value = this.location.parentId;
          }
          this.locationManagementService.setSearchedLocationTypeId(
            this.location.typeId
          );
          this.getTypeAttributes(this.location.typeId);
          this.typeId = this.location.typeId;
        },
        () => {
          this.spinner.hide();
        }
      );
  }

  getAllVendors() {
    this.companyManagementService.getAllVendorDetails().subscribe(
      (response) => {
        this.vendors = Array.isArray(response) ? response : [];
        this.spinner.hide();
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  updateLocation() {
    if (
      this.location.name &&
      this.location.typeId &&
      this.location.typeId != 0
    ) {
      if (this.location.locationId == this.value) {
        this.index = -3;
        window.scroll(0, 0);
      } else {
        this.saveLocation();
      }
    } else {
      this.index = -1;
      window.scroll(0, 0);
    }
  }

  saveLocation() {
    this.locationattr.attributeValues = [];
    if (this.typeAttributes && this.typeAttributes.length > 0) {
      this.typeAttributes.forEach((attr: any) => {
        this.locationattr.attributeValues.push({
          attributeName: attr,
          entityId: this.locationId,
          entitytypeId: attr.type.entitytypeId,
          lastModifiedBy: attr.type.lastModifiedBy,
          value: attr.value,
        });
      });
    }
    this.location.attributeValues = this.locationattr.attributeValues;

    this.reqAttrValidate = false;
    if (this.location.attributeValues && this.location.attributeValues.length > 0) {
      for (const attr of this.location.attributeValues) {
        this.isReqdAttr = attr.attributeName.isRequired;
        this.reqAttrName = attr.attributeName.name;
        this.reqAttrValue = attr.value;
        if (
          this.isReqdAttr === true &&
          (this.reqAttrValue === undefined ||
            this.reqAttrValue === null ||
            this.reqAttrValue === '')
        ) {
          this.reqAttrValidate = true;
          break;
        }
      }
    }

    const request = {
      locationId: this.location.locationId,
      address1: this.location.address1 ?? '',
      address2: this.location.address2 ?? '',
      city: this.location.city ?? '',
      typeId: this.location.typeId ?? '',
      company: {
        companyId: this.companyId,
      },
      criticalFlag: this.location.critical ?? false,
      description: this.location.description ?? '',
      desiredSpareRatio: this.location.desiredSpareRatio ?? 0,
      isVendor: this.location.isVendor ?? false,
      lastModifiedBy: this.userName,
      name: this.location.name ?? '',
      parentLocation: {
        locationId: this.value ?? 0,
      },
      postalCode: this.location.postalCode ?? '',
      state: this.location.state ?? '',
      statusId: this.location.statusId ?? 0,
      parentLocationResourceList: this.location.parentLocationResourceList,
      vendorCompany: {
        companyId: 0,
      },
      attributeValues: this.location.attributeValues ?? null,
    };

    if (this.addedlocations && this.addedlocations.length > 0) {
      this.addedlocations.forEach((loc: any) => {
        if (loc.locationName && loc.locationName !== '') {
          this.addrequest.push({
            address1: this.location.address1 ?? '',
            address2: this.location.address2 ?? '',
            city: this.location.city ?? '',
            typeId: this.location.typeId ?? '',
            company: {
              companyId: this.companyId,
            },
            criticalFlag: this.location.critical ?? false,
            description: this.location.description ?? '',
            desiredSpareRatio: this.location.desiredSpareRatio ?? 0,
            isVendor: this.location.isVendor ?? false,
            lastModifiedBy: this.userName,
            locationId: 0,
            name: loc.locationName ?? '',
            parentLocation: {
              locationId: this.value ?? 0,
            },
            postalCode: this.location.postalCode ?? '',
            state: this.location.state ?? '',
            statusId: this.location.statusId ?? 0,
            vendorCompany: {
              companyId: 0,
            },
            attributeValues: this.location.attributeValues ?? null,
          });
        }
      });
    }

    if (!this.reqAttrValidate) {
      this.spinner.show();
      this.locationManagementService.updateLocation(request).subscribe(
        () => {
          if (this.addedlocations && this.addedlocations.length > 0) {
            this.locationManagementService
              .saveLocation(this.addrequest)
              .subscribe(() => {});
          }
          this.spinner.hide();
          this.refreshCalls();
        },
        () => {
          this.spinner.hide();
        }
      );
    } else {
      this.index = -2;
      window.scroll(0, 0);
    }
  }

  refreshCalls() {
    this.spinner.show();
    this.locationManagementService
      .getAllLocationsWithHierarchy(this.companyId)
      .subscribe((response) => {
        this.broadcasterService.locations = response;
        this.router.navigate(['/location/list']);
        this.spinner.hide();
      });
  }

  cloneaddressfromParentLoc() {
    this.spinner.show();
    this.locationManagementService
      .cloneaddressfromParentLoc(this.value, this.companyId)
      .subscribe((response: any) => {
        this.spinner.hide();
        this.location.address1 = response.address1;
        this.location.address2 = response.address2;
        this.location.city = response.city;
        this.location.state = response.state;
        this.location.postalCode = response.postalCode;
      });
    this.index = 2;
    setTimeout(() => {
      this.index = 0;
    }, 7000);
    window.scroll(0, 0);
  }

  print() {
    this.helpFlag = false;
    window.print();
  }

  help() {
    this.helpFlag =!this.helpFlag;
  }
}