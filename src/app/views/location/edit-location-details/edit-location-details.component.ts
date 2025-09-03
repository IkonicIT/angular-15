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
import { isUndefined, isNull } from 'is-what';
import { focusTrapModule } from 'ngx-bootstrap/modal/modal.module';

@Component({
  selector: 'app-edit-location-details',
  templateUrl: './edit-location-details.component.html',
  styleUrls: ['./edit-location-details.component.scss'],
})
export class EditLocationDetailsComponent implements OnInit {
  model: any = {};
  locationTypes: any;
  statuses: any;
  location: any = {
    parentLocation: {
      locationId: 0,
    },
  };
  locationId: any;
  companyId: any;
  typeAttributes: any;
  locations: any;
  index: any;
  globalCompany: any;
  companyName: any;
  addedlocations: any = [];
  addrequest: any = [];
  vendors: any;
  value: any;
  items: TreeviewItem[];
  itemTypeItems: TreeviewItem[];
  config = TreeviewConfig.create({
    hasFilter: false,
    hasCollapseExpand: false,
  });
  typeID: any;
  locationattr: any = {};
  userName: string | null;
  isReqdAttr: any;
  reqAttrName: any;
  reqAttrValue: any;
  reqAttrValidate: any;
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
    this.locations = this.broadcasterService.locations;
    var self = this;
    if (this.locations && this.locations.length > 0) {
      self.items = this.generateHierarchy(this.locations);
    }
    self.items.unshift(
      new TreeviewItem({
        text: this.companyName,
        value: -1,
      })
    );

    this.getAllVendors();
  }

  generateHierarchy(locList: any) {
    var items: any = [];
    locList.forEach((loc: any) => {
      var children = [];
      if (
        loc.parentLocationResourceList &&
        loc.parentLocationResourceList.length > 0
      ) {
        children = this.generateHierarchy(loc.parentLocationResourceList); //children.push({text : childLoc.name, value: childLoc.locationId})
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
    this.value = value;
    console.log(value);
  }

  getLocationStatus() {
    this.locationStatusService.getAllLocationStatuses(this.companyId).subscribe(
      (response) => {
        this.statuses = response;

        this.getLocations();
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  generateHierarchyForItemTypes(typeList: any) {
    var items: any = [];
    typeList.forEach((type: any) => {
      var children = [];
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

  getAllLocTypes() {
    this.spinner.show();

    this.locationTypesService
      .getAllLocationTypesWithHierarchy(this.companyId)
      .subscribe(
        (response) => {
          this.locationTypes = response;
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

  getTypeAttributes(typeId: any) {
    if (typeId && typeId != '0') {
      this.locationAttributeService.getTypeAttributes(typeId).subscribe(
        (response) => {
          this.spinner.hide();

          this.typeAttributes = response;
          console.log('attrlength ' + this.location.attributeValues.length);
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
                  console.log('attrvalue  ' + attr.value);
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
        (error) => {
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
          this.typeID = this.location.typeId;
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }
  getAllVendors() {
    this.companyManagementService.getAllVendorDetails().subscribe(
      (response) => {
        this.vendors = response;
        this.spinner.hide();
      },
      (error) => {
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
    if (this.typeAttributes != undefined) {
      this.typeAttributes.forEach((attr: any) => {
        this.locationattr.attributeValues.push({
          attributeName: attr,
          entityId: this.locationId,
          entitytypeId: attr.type.entitytypeId,
          lastModifiedby: attr.type.lastModifiedBy,
          value: attr.value,
        });
      });
    }
    this.location.attributeValues = this.locationattr.attributeValues;

    this.reqAttrValidate = false;
    this.location.attributeValues.forEach((attr: any) => {
      this.isReqdAttr = attr.attributeName.isRequired;
      this.reqAttrName = attr.attributeName.name;
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
    });
    var request = {
      locationId: this.location.locationId,
      address1: this.location.address1 ? this.location.address1 : '',
      address2: this.location.address2 ? this.location.address2 : '',
      city: this.location.city ? this.location.city : '',
      typeId: this.location.typeId ? this.location.typeId : '',
      company: {
        companyId: this.companyId,
      },
      criticalFlag: this.location.critical ? this.location.critical : false,
      description: this.location.description ? this.location.description : '',
      desiredSpareRatio: this.location.desiredSpareRatio
        ? this.location.desiredSpareRatio
        : 0,
      isVendor: this.location.isVendor ? this.location.isVendor : false,
      lastModifiedBy: this.userName,
      name: this.location.name ? this.location.name : '',
      parentLocation: {
        locationId: this.value ? this.value : 0,
      },
      postalCode: this.location.postalCode ? this.location.postalCode : '',
      state: this.location.state ? this.location.state : '',
      statusId: this.location.statusId ? this.location.statusId : 0,
      parentLocationResourceList: this.location.parentLocationResourceList,
      vendorCompany: {
        companyId: 0,
      },
      attributeValues: this.location.attributeValues
        ? this.location.attributeValues
        : null,
    };
    if (this.addedlocations && this.addedlocations.length > 0) {
      this.addedlocations.forEach((loc: any) => {
        if (loc.locationName && loc.locationName != '') {
          this.addrequest.push({
            address1: this.location.address1 ? this.location.address1 : '',
            address2: this.location.address2 ? this.location.address2 : '',
            city: this.location.city ? this.location.city : '',
            typeId: this.location.typeId ? this.location.typeId : '',
            company: {
              companyId: this.companyId,
            },
            criticalFlag: this.location.critical
              ? this.location.critical
              : false,
            description: this.location.description
              ? this.location.description
              : '',
            desiredSpareRatio: this.location.desiredSpareRatio
              ? this.location.desiredSpareRatio
              : 0,
            isVendor: this.location.isVendor ? this.location.isVendor : false,
            lastModifiedBy: this.userName,
            locationId: 0,
            name: loc.locationName ? loc.locationName : '',
            parentLocation: {
              locationId: this.value ? this.value : 0,
            },
            postalCode: this.location.postalCode
              ? this.location.postalCode
              : '',
            state: this.location.state ? this.location.state : '',
            statusId: this.location.statusId ? this.location.statusId : 0,
            vendorCompany: {
              companyId: 0,
            },
            attributeValues: this.location.attributeValues
              ? this.location.attributeValues
              : null,
          });
        }
      });
    }
    if (this.reqAttrValidate == false) {
      this.spinner.show();
      console.log("@395",request);
      this.locationManagementService.updateLocation(request).subscribe(
        (response) => {
          if (this.addedlocations && this.addedlocations.length > 0) {
            this.locationManagementService
              .saveLocation(this.addrequest)
              .subscribe((response) => {});
          }
          this.spinner.hide();

          this.refreshCalls();
        },
        (error) => {
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
        console.log('locations:' + response);
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
    this.helpFlag = !this.helpFlag;
  }
}
