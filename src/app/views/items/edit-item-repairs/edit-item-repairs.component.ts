import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { CompanyManagementService } from '../../../services/company-management.service';
import { LocationManagementService } from '../../../services/location-management.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ItemRepairItemsService } from '../../../services/Items/item-repair-items.service';
import { ItemManagementService } from '../../../services/Items/item-management.service';
import { WarrantyManagementService } from '../../../services';
import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';
import { BroadcasterService } from 'src/app/services/broadcaster.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-item-repairs',
  templateUrl: './edit-item-repairs.component.html',
  styleUrls: ['./edit-item-repairs.component.scss'],
})
export class EditItemRepairsComponent implements OnInit {
  bsConfig: Partial<BsDatepickerConfig>;
  failureType: any;
  currFailuretype: any;
  failureTypeId: any;
  model: any = {};
  vendor: any = {};
  details: any = {};
  tag: any;
  item: any = {};
  index: number = 0;
  //date = Date.now();
  itemId: number = 0;
  private sub: any;
  id: number;
  dismissible = true;
  globalCompany: any;
  companyId: any;
  itemRepairId: any;
  transfers: any = [];
  highestRank: any;
  warrantyTypes: any = [];
  failureTypes: any = [];
  locations: any = [];
  vendors: any;
  fullVendors: any;
  vendorItems: TreeviewItem[];
  locationItems: TreeviewItem[];
  failureTypesandcauses: any = {};
  failureCauseSp: any = [];

  failureCauses: any = {};
  userName: any;
  helpFlag: any = false;

  constructor(
    private companyManagementService: CompanyManagementService,
    private locationManagementService: LocationManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private itemRepairItemsService: ItemRepairItemsService,
    private itemManagementService: ItemManagementService,
    private warrantyManagementService: WarrantyManagementService,
    private broadcasterService: BroadcasterService,
    private _location: Location
  ) {
    this.itemId = route.snapshot.params['itemId'];
    this.itemRepairId = route.snapshot.params['repairId'];
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyId = this.globalCompany.companyId;
    this.getAllVendors();
    this.locations = this.getLocations();
    if (this.companyId) {
      this.getWarrantyTypes();
    }
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value.companyId;
    });
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName');
    this.bsConfig = Object.assign({}, { containerClass: 'theme-red' });
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
    this.getItemDetails();
  }

  getItemRepairDetails() {
    this.spinner.show();
    this.itemRepairItemsService
      .getRepairDetailsForView(this.itemRepairId)
      .subscribe((response) => {
        this.spinner.hide();
        this.model = response;

        if (this.model.failureType == '') {
          this.model.failureType = null;
        }
        if (this.model.estimatedCompletion) {
          this.model.estimatedCompletion = new Date(
            this.model.estimatedCompletion
          );
        }
        if (this.model.failureDate) {
          this.model.failureDate = new Date(this.model.failureDate);
        }
        if (this.model.actualCompletion) {
          this.model.actualCompletion = new Date(this.model.actualCompletion);
        }

        this.model.repairVendorNumber = parseInt(this.model.repairVendorNumber);
        if (this.model.failureType != null && this.model.failureType != '') {
          let faliurecausetemp =
            this.failureTypesandcauses[this.model.failureType];
          let failureCauseSp = faliurecausetemp[0].split('\n');

          failureCauseSp.forEach((element: string | any[]) => {
            if (element.length > 1) {
              this.failureCauseSp.push(element);
            }
          });

          console.log('fc is:' + this.model.failureCause);
          this.failureCauseSp.forEach((element: string) => {
            if (element == this.model.failureCause)
              console.log('fcp is:' + element + '=' + this.model.failureCause);
          });
        } else {
          let faliurecausetemp = this.failureTypesandcauses;
        }
      });
  }
  getItemDetails() {
    this.spinner.show();
    this.itemManagementService
      .getItemById(this.itemId)
      .subscribe((response: any) => {
        this.model.itemType = response.typeName;
        this.details = response;
        if (response.warrantyTypeId != 0) {
          this.model.warrantyTypeId = response.warrantyTypeId;
          this.setWarrantyType(response.warrantyTypeId);
        }
        this.model.warrantyExpiration = response.warrantyExpiration;
        if (this.model.warrantyExpiration) {
          this.model.warrantyExpiration = new Date(
            this.model.warrantyExpiration
          );
        }
        if (this.model.itemType === 'AC Motor') {
          this.getAcMotorFailureTypesAndCauses();
        } else if (this.model.itemType === 'DC Motor') {
          this.getDcMotorFailureTypesAndCauses();
        } else {
          this.getFailureTypes();
        }
        this.spinner.hide();
      });
  }

  getAcMotorFailureTypesAndCauses() {
    this.spinner.show();
    this.itemRepairItemsService
      .getAcMotorFailureTypesAndCauses()
      .subscribe((response) => {
        this.failureTypesandcauses = response;
        this.spinner.hide();
        this.failureTypes = Object.keys(this.failureTypesandcauses);
        console.log(this.failureTypesandcauses);
        console.log('new failureType list is' + this.failureTypes);
        this.getItemRepairDetails();
      });
  }

  getDcMotorFailureTypesAndCauses() {
    this.spinner.show();
    this.itemRepairItemsService
      .getDcMotorFailureTypesAndCauses()
      .subscribe((response) => {
        this.failureTypesandcauses = response;
        this.spinner.hide();
        this.failureTypes = Object.keys(this.failureTypesandcauses);
        console.log(this.failureTypesandcauses);
        console.log('new failureType list is' + this.failureTypes);
        this.getItemRepairDetails();
      });
  }

  setWarrantyType(warrantyTypeId: any) {
    this.warrantyTypes.forEach((element: any) => {
      if (element.warrantyTypeId == warrantyTypeId)
        this.model.warrantyType = element.warrantyType;
    });
  }
  getLocations() {
    this.locations = this.broadcasterService.locations;
    if (this.locations && this.locations.length > 0) {
      this.locationItems = [];
      this.locationItems = this.generateHierarchy(this.locations);
    }
  }

  generateHierarchy(locList: any[]) {
    var items: TreeviewItem[] = [];
    this.transfers.forEach((pre: { toLocation: any; toLocationID: any }) => {
      items.push(
        new TreeviewItem({
          text: pre.toLocation,
          value: pre.toLocationID,
          collapsed: true,
        })
      );
    });
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
  getAllVendors() {
    this.spinner.show();
    this.companyManagementService.getAllVendorDetails().subscribe(
      (response) => {
        this.fullVendors = response;
        this.vendorItems = this.generateVendorHierarchy(this.fullVendors);
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  generateVendorHierarchy(vendors: any[]): TreeviewItem[] {
    return vendors.map(
      (vendor) =>
        new TreeviewItem({
          text: vendor.name,
          value: vendor.vendorId,
          collapsed: true,
          children: [],
        })
    );
  }

  onVendorChange(value: any) {
    this.model.vendorId = value;
    // Add any additional logic you want to perform when the vendor selection changes
  }

  getFailureTypes() {
    this.itemRepairItemsService
      .getAllFailureTypesForEditItemRepair(this.companyId, this.details.typeId)
      .subscribe((response) => {
        this.failureTypesandcauses = response;
        this.failureTypes = Object.keys(this.failureTypesandcauses);
        this.getItemRepairDetails();
      });
  }

  onValueChange(failureType: string | number) {
    this.failureCauseSp = [];
    this.model.failureCause = ' ';
    let faliurecausetemp = this.failureTypesandcauses[failureType];
    let failureCauseSp = faliurecausetemp[0].split('\n');

    failureCauseSp.forEach((element: string | any[]) => {
      if (element.length > 0) {
        this.failureCauseSp.push(element);
      }
    });
  }

  updateFailureTypeAndCauses(failureType: string | number) {
    let faliurecausetemp = this.failureTypesandcauses[failureType];
    let causes = faliurecausetemp[0];
    causes = causes + '\n' + this.model.newFailureCauseSp;
    this.spinner.show();
    var request = {
      failureTypeId: 0,
      itemTypeId: this.details.typeId,
      description: failureType,
      causes: causes,
    };
    this.itemRepairItemsService
      .updateFailureTypeAndCauses(request, request.failureTypeId)
      .subscribe((response) => {
        this.spinner.hide();
      });
  }
  saveItemRepair() {
    if (
      !this.model.jobNumber ||
      !this.model.poNumber ||
      !this.model.failureDate ||
      this.model.complete == true
    ) {
      if (
        !this.model.jobNumber ||
        !this.model.poNumber ||
        !this.model.failureDate
   //     !this.model.vendor.vendorId
      ) {
        this.index = -1;
        window.scroll(0, 0);
      } else if (
        this.model.complete == true &&
        this.model.failureType == null &&
        this.model.failureCause == null
      ) {
        this.index = -2;
        window.scroll(0, 0);
      } else {
        if (this.model.complete == true) {
          this.model.completedby = this.userName;
        } else {
          this.model.completedby = null;
        }
        if (this.model.failureType != null && this.model.failureCause == 0) {
          if (this.model.newFailureCauseSp != undefined)
            this.updateFailureTypeAndCauses(this.model.failureType);
          else {
            this.index = -3;
            window.scroll(0, 0);
            return;
          }
        }
        this.updateItemRepair();
      }
    } else {
      if (this.model.complete == true) {
        this.model.completedby = this.userName;
      } else {
        this.model.completedby = null;
      }

      if (this.model.failureType != null && this.model.failureCause == 0) {
        if (this.model.newFailureCauseSp != undefined)
          this.updateFailureTypeAndCauses(this.model.failureType);
        else {
          this.index = -3;
          window.scroll(0, 0);
          return;
        }
      }
      this.updateItemRepair();
    }
  }

  updateItemRepair() {
    this.model = {
      actualCompletion: this.model.actualCompletion
        ? this.model.actualCompletion
        : null,
      complete: this.model.complete ? this.model.complete : false,
      completedBy: this.model.completedby,
      dateAcknowledged: this.model.dateacknowledged,
      dateInitiated: this.model.dateinitiated,
      estimatedCompletion: this.model.estimatedCompletion
        ? this.model.estimatedCompletion
        : null,
      failureCause:
        this.model.failureCause != 0
          ? this.model.failureCause
          : this.model.newFailureCauseSp,
      failureDate:
        this.model.failureDate != null ? this.model.failureDate : null,
      failureType:
        this.model.failureType != null ? this.model.failureType : null,
      isWarranty: true,
      itemId: this.itemId,
      itemType: this.model.itemType,
      jobNumber: this.model.jobNumber ? this.model.jobNumber : 0,
      poNumber: this.model.poNumber ? this.model.poNumber : 0,
      repairCompanyId: this.model.repaircompanyId,
      repairCost: this.model.repairCost ? this.model.repairCost : 0,
      repairJobStatus: this.model.repairJobStatus,
      repairLocationId: this.model.repairlocationId
        ? this.model.repairlocationId
        : 0,
      repairLogId: this.model.repairLogId,
      repairNotes: this.model.repairNotes ? this.model.repairNotes : '',
      repairVendorNumber: this.model.repairVendorNumber
        ? this.model.repairVendorNumber
        : 0,
      repairVendorName: this.vendor.name ? this.vendor.name : '',
      rfqNumber: 0,
      title: this.model.title ? this.model.title : '',
      transferLogId: 0,
      warrantyType: this.model.warrantyType ? this.model.warrantyType : '',
      warrantyTypeId:
        this.model.warrantyTypeId != undefined ? this.model.warrantyTypeId : 0,
      warrantyExpiration: this.model.warrantyExpiration
        ? this.model.warrantyExpiration
        : null,
      userName: this.userName,
      tag: this.model.tag,
      secondaryTypeAndCauses: this.model.secondaryTypeAndCauses,
      companyId: this.companyId,
      isActive: 1,
      isVendorWarranty: this.model.isVendorWarranty
        ? this.model.isVendorWarranty
        : 0,
      repairType: this.model.repairType ? this.model.repairType : '',
      vendor: {
        vendorId: this.model.vendor.vendorId,
      },
    };
    console.log(JSON.stringify(this.model));
    this.spinner.show();
    this.itemRepairItemsService.updateItemRepair(this.model).subscribe(
      (response: any) => {
        this.spinner.hide();
        window.scroll(0, 0);
        this.index = 1;
        setTimeout(() => {
          this.index = 0;
        }, 7000);
        this.router.navigate([
          '/items/viewItemRepair/' +
            response.itemId +
            '/' +
            response.repairLogId,
        ]);
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
  cancelItemEditRepair() {
    this._location.back();
  }

  addSecondaryFindings() {
    const item = {
      repairLogMappingId: 0,
      repairLogId: 0,
      failureType: '',
      failureCause: '',
      addedDate: new Date(),
      updatedDate: new Date(),
      isActive: true,
    };
    this.model.secondaryTypeAndCauses.push(item);
  }
  removeSecondaryFindings(i: number) {
    this.model.secondaryTypeAndCauses.splice(i, 1);
  }

  getFailureCause(ft: any) {
    if (ft.length > 0) return this.failureTypesandcauses[ft][0].split('\n');
    else return null;
  }
  checkValue(event: any) {
    console.log(event);
    if (event == 'A') this.model.actualCompletion = new Date();
    else if (event == 'B') this.model.actualCompletion = null;
  }
  setWarrantyTypeID() {
    if (this.model.warrantyType && this.model.warrantyType != '') {
      this.warrantyTypes.forEach((element: any) => {
        if (element.warrantyType == this.model.warrantyType)
          this.model.warrantyTypeId = element.warrantyTypeId;
      });
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
