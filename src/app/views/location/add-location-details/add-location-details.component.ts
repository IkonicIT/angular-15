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

@Component({
  selector: 'app-add-location-details',
  templateUrl: './add-location-details.component.html',
  styleUrls: ['./add-location-details.component.scss'],
})
export class AddLocationDetailsComponent implements OnInit {
  model: any = {
    pLocationId: 0,
    vendorCompany: { companyId: 0 },
    locationTypeId: 0,
  };
  index: number = 0;
  locationTypes: any[] = [];
  statuses: any[] = [];
  parentLocations: any[] = [];
  companyId: any;
  typeAttributes: any[] = [];
  locations: any[] = [];
  globalCompany: any;
  companyName: any;
  addedlocations: any[] = [];
  vendors: any[] = [];
  userName: any;
  value: any;
  items: TreeviewItem[] = [];
  itemTypeItems: TreeviewItem[] = [];
  config = TreeviewConfig.create({
    hasFilter: false,
    hasCollapseExpand: false,
  });
  dismissible = true;
  isReqdAttr: any;
  reqAttrName: any;
  reqAttrValue: any;
  reqAttrValidate: boolean = false;
  helpFlag: boolean = false;
  loader = false;

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
    this.companyName = this.globalCompany?.name ?? '';
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value.companyId;
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
    this.locations = Array.isArray(this.broadcasterService.locations)
      ? this.broadcasterService.locations
      : [];
    if (this.locations && this.locations.length > 0) {
      this.items = this.generateHierarchy(this.locations);
    } else {
      this.items = [];
    }
    this.items.unshift(
      new TreeviewItem({
        text: this.companyName,
        value: -1,
      })
    );
    this.getAllLocTypes();
  }

  generateHierarchy(locList: any[]): TreeviewItem[] {
    return locList.map((loc: any) => {
      const children =
        loc.parentResourceList && loc.parentResourceList.length > 0
          ? this.generateHierarchy(loc.parentResourceList)
          : [];
      return new TreeviewItem({
        text: loc.name,
        value: loc.locationId,
        collapsed: true,
        children: children,
      });
    });
  }

  getLocationStatus() {
    this.locationStatusService.getAllLocationStatuses(this.companyId).subscribe(
      (response) => {
        this.statuses = Array.isArray(response) ? response : [];
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
      },
      () => {
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
        this.model.attributeValues = [];
        this.typeAttributes.forEach((attr: any) => {
          this.model.attributeValues.push({
            attributeName: attr,
            entityId: 0,
            entitytypeId: attr.type?.entitytypeId ?? 0,
            lastModifiedBy: this.userName,
            value: attr.value,
          });
        });
      }

      this.reqAttrValidate = false;
      if (this.model.attributeValues) {
        for (const attr of this.model.attributeValues) {
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

      const request: any[] = [
        {
          address1: this.model.addressLineOne ?? '',
          address2: this.model.addressLineTwo ?? '',
          city: this.model.city ?? '',
          typeId: this.model.locationTypeId ?? '',
          company: { companyId: this.companyId },
          criticalFlag: this.model.critical ?? false,
          description: this.model.description ?? '',
          desiredSpareRatio: this.model.sRatio ?? 0,
          isVendor: this.model.vLocation ?? false,
          lastModifiedBy: this.userName,
          locationId: 0,
          name: this.model.locationName ?? '',
          parentLocation: { locationId: this.value ?? 0 },
          postalCode: this.model.postalCode ?? '',
          state: this.model.state ?? '',
          statusId: this.model.statusId ?? 0,
          vendorCompany: {
            companyId: this.model.vendorCompany.companyId ?? 0,
          },
          attributeValues: this.model.attributeValues ?? null,
        },
      ];

      if (this.addedlocations && this.addedlocations.length > 0) {
        this.addedlocations.forEach((loc: any) => {
          if (loc.locationName && loc.locationName !== '') {
            request.push({
              address1: this.model.addressLineOne ?? '',
              address2: this.model.addressLineTwo ?? '',
              city: this.model.city ?? '',
              typeId: this.model.locationTypeId ?? '',
              company: { companyId: this.companyId },
              criticalFlag: this.model.critical ?? false,
              description: this.model.description ?? '',
              desiredSpareRatio: this.model.sRatio ?? 0,
              isVendor: this.model.vLocation ?? false,
              lastModifiedBy: this.userName,
              locationId: 0,
              name: loc.locationName ?? '',
              parentLocation: { locationId: this.value ?? 0 },
              postalCode: this.model.postalCode ?? '',
              state: this.model.state ?? '',
              statusId: this.model.statusId ?? 0,
              vendorCompany: { companyId: 0 },
              attributeValues: this.model.attributeValues ?? null,
            });
          }
        });
      }

      if (!this.reqAttrValidate) {
        this.spinner.show();
        this.locationManagementService.saveLocation(request).subscribe(
          () => {
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
    } else {
      this.index = -1;
      window.scroll(0, 0);
    }
  }

  onValueChange(value: any) {
    this.value = value;
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
          this.spinner.hide();
          this.locationTypes = Array.isArray(response) ? response : [];
          this.locationTypes.forEach((type: any) => {
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
        () => {
          this.spinner.hide();
        }
      );
  }

  getTypeAttributes(typeId: string, event: any) {
    if (typeId && typeId !== '0') {
      this.spinner.show();
      this.locationAttributeService.getTypeAttributes(typeId).subscribe(
        (response) => {
          this.typeAttributes = Array.isArray(response) ? response : [];
          this.model.attributeValues = [];
          this.typeAttributes.forEach((attr: any) => {
            this.model.attributeValues.push({
              attributeName: attr,
              entityId: 0,
              entitytypeId: 0,
              lastModifiedBy: this.userName,
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

  refreshCalls() {
    this.locationManagementService
      .getAllLocationsWithHierarchy(this.companyId)
      .subscribe((response) => {
        this.broadcasterService.locations = response;
        this.router.navigate(['/location/list']);
        this.spinner.hide();
      });
  }

  cloneaddressfromParentLoc() {
    if (this.model.locationName !== undefined) {
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
          this.model.postalCode = response.postalCode;
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