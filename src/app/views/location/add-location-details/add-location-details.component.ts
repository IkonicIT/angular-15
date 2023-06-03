import { Component, OnInit } from '@angular/core';
import { LocationManagementService } from '../../../services/location-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocationTypesService } from '../../../services/location-types.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LocationAttributeService } from '../../../services/location-attribute.service';
import { LocationStatusService } from '../../../services/location-status.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { BroadcasterService } from '../../../services/broadcaster.service';
import { isUndefined, isNull } from 'is-what';

@Component({
  selector: 'app-add-location-details',
  templateUrl: './add-location-details.component.html',
  styleUrls: ['./add-location-details.component.scss'],
})
export class AddLocationDetailsComponent implements OnInit {
  model: any = {
    pLocationId: 0,
    vendorCompany: {
      companyid: 0,
    },
    locationTypeId: 0,
  };
  index: number = 0;
  locationTypes: any;
  statuses: any;
  parentLocations: any;
  companyId: any;
  typeAttributes: any;
  locations: any;
  globalCompany: any;
  companyName: any;
  addedlocations: any = [];
  vendors: any;
  userName: any;
  value: any;
  items: TreeviewItem[];
  itemTypeItems: TreeviewItem[];
  config = TreeviewConfig.create({
    hasFilter: false,
    hasCollapseExpand: false,
  });
  dismissible = true;
  isReqdAttr: any;
  reqAttrName: any;
  reqAttrValue: any;
  reqAttrValidate: any;
  helpFlag: any = false;
  constructor(
    private locationManagementService: LocationManagementService,
    private companyManagementService: CompanyManagementService,
    private locationStatusService: LocationStatusService,
    private locationAttributeService: LocationAttributeService,
    private locationTypesService: LocationTypesService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private broadcasterService: BroadcasterService
  ) {
    this.companyId = route.snapshot.params['cmpId'];
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyName = this.globalCompany.name;
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value.companyid;
      this.companyName = this.globalCompany.name;
    });
    this.getAllVendors();
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName');
    this.getLocations();
    this.value = -1;
  }

  getLocations() {
    this.locations = this.broadcasterService.locations;
    var self = this;
    if (this.locations && this.locations.length > 0) {
      self.items = [];
      self.items = self.generateHierarchy(this.locations);
    } else {
      self.items = [];
    }
    self.items.unshift(
      new TreeviewItem({
        text: this.companyName,
        value: -1,
      })
    );

    this.getAllLocTypes();
  }

  generateHierarchy(locList: any) {
    var items: any = [];
    locList.forEach((loc: any) => {
      var children = [];
      if (
        loc.parentLocationResourceList &&
        loc.parentLocationResourceList.length > 0
      ) {
        children = this.generateHierarchy(loc.parentLocationResourceList); //children.push({text : childLoc.name, value: childLoc.locationid})
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

  getLocationStatus() {
    this.locationStatusService.getAllLocationStatuses(this.companyId).subscribe(
      (response) => {
        this.statuses = response;
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  getAllVendors() {
    this.companyManagementService.getAllVendors(this.companyId).subscribe(
      (response) => {
        this.vendors = response;
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  saveLocation() {
    if (
      this.model.locationName &&
      this.model.locationTypeId &&
      this.model.locationTypeId != 0
    ) {
      if (this.typeAttributes && this.typeAttributes.length > 0) {
        this.model.attributevalues = [];
        this.typeAttributes.forEach((attr: any) => {
          this.model.attributevalues.push({
            attributename: attr,
            entityid: 0,
            entitytypeid: attr.type.entitytypeid,
            lastmodifiedby: this.userName,
            value: attr.value,
          });
        });
      }

      this.reqAttrValidate = false;
      this.model.attributevalues.forEach((attr: any) => {
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
          console.log('attribute check is' + this.index);
          return;
        }
        console.log('attribute isrequired value is' + this.isReqdAttr);
        console.log('attribute name is' + this.reqAttrName);
        console.log('attribute name value is' + this.reqAttrValue);
        console.log('validate' + this.reqAttrValidate);
      });
      var request = [
        {
          address1: this.model.addressLineOne ? this.model.addressLineOne : '',
          address2: this.model.addressLineTwo ? this.model.addressLineTwo : '',
          city: this.model.city ? this.model.city : '',
          typeId: this.model.locationTypeId ? this.model.locationTypeId : '',
          company: {
            companyid: this.companyId,
          },
          criticalflag: this.model.critical ? this.model.critical : false,
          description: this.model.description ? this.model.description : '',
          desiredspareratio: this.model.sRatio ? this.model.sRatio : 0,
          isvendor: this.model.vLocation ? this.model.vLocation : false,
          lastmodifiedby: this.userName,
          locationid: 0,
          name: this.model.locationName ? this.model.locationName : '',
          parentLocation: {
            locationid: this.value ? this.value : 0,
          },
          postalcode: this.model.postalCode ? this.model.postalCode : '',
          state: this.model.state ? this.model.state : '',
          statusid: this.model.statusid ? this.model.statusid : 0,
          vendorCompany: {
            companyid: this.model.vendorCompany.companyid
              ? this.model.vendorCompany.companyid
              : 0,
          },
          attributevalues: this.model.attributevalues
            ? this.model.attributevalues
            : null,
        },
      ];
      if (this.addedlocations && this.addedlocations.length > 0) {
        this.addedlocations.forEach((loc: any) => {
          if (loc.locationName && loc.locationName != '') {
            request.push({
              address1: this.model.addressLineOne
                ? this.model.addressLineOne
                : '',
              address2: this.model.addressLineTwo
                ? this.model.addressLineTwo
                : '',
              city: this.model.city ? this.model.city : '',
              typeId: this.model.locationTypeId
                ? this.model.locationTypeId
                : '',
              company: {
                companyid: this.companyId,
              },
              criticalflag: this.model.critical ? this.model.critical : false,
              description: this.model.description ? this.model.description : '',
              desiredspareratio: this.model.sRatio ? this.model.sRatio : 0,
              isvendor: this.model.vLocation ? this.model.vLocation : false,
              lastmodifiedby: this.userName,
              locationid: 0,
              name: loc.locationName ? loc.locationName : '',
              parentLocation: {
                locationid: this.value ? this.value : 0,
              },
              postalcode: this.model.postalCode ? this.model.postalCode : '',
              state: this.model.state ? this.model.state : '',
              statusid: this.model.statusid ? this.model.statusid : 0,
              vendorCompany: {
                companyid: 0,
              },
              attributevalues: this.model.attributevalues
                ? this.model.attributevalues
                : null,
            });
          }
        });
      }
      if (this.reqAttrValidate == false) {
        this.spinner.show();
        this.locationManagementService.saveLocation(request).subscribe(
          (response) => {
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
    } else {
      this.index = -1;
      window.scroll(0, 0);
    }
  }

  onValueChange(value: any) {
    this.value = value;
    console.log(value);
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
          value: type.typeid,
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
          this.spinner.hide();
          this.locationTypes = response;
          this.locationTypes.forEach((type: any) => {
            if (!type.parentid) {
              type.parentid = 'Top Level';
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

  getTypeAttributes(typeId: string, event: any) {
    if (typeId && typeId != '0') {
      this.spinner.show();
      this.locationAttributeService.getTypeAttributes(typeId).subscribe(
        (response) => {
          this.typeAttributes = response;
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
          this.model.locationTypeId = typeId;
          this.spinner.hide();
        },
        (error) => {
          this.spinner.hide();
        }
      );
    }
  }

  refreshCalls() {
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
    if (this.model.locationName != undefined) {
      this.spinner.show();
      this.locationManagementService
        .cloneaddressfromParentLoc(this.value, this.companyId)
        .subscribe((response: any) => {
          this.spinner.hide();
          this.index = 3;
          setTimeout(() => {
            this.index = 0;
          }, 7000);
          this.model.addressLineOne = response.address1;
          this.model.addressLineTwo = response.address2;
          this.model.city = response.city;
          this.model.state = response.state;
          this.model.postalCode = response.postalcode;
        });
    } else {
      window.scroll(0, 0);
      this.index = 2;
      setTimeout(() => {
        this.index = 0;
      }, 7000);
      this.spinner.hide();
    }
  }
  print() {
    this.helpFlag = false;
    window.print();
  }
  help() {
    this.helpFlag = !this.helpFlag;
  }
}
