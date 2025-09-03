import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ItemNotesService } from '../../../services/Items/item-notes.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ItemRepairItemsService } from '../../../services/Items/item-repair-items.service';
import { LocationManagementService } from '../../../services/location-management.service';
import { ItemManagementService } from '../../../services/Items/item-management.service';
import { WarrantyManagementService } from '../../../services';
import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';
import { BroadcasterService } from 'src/app/services/broadcaster.service';

@Component({
  selector: 'app-add-item-repairs',
  templateUrl: './add-item-repairs.component.html',
  styleUrls: ['./add-item-repairs.component.scss'],
})
export class AddItemRepairsComponent implements OnInit {
  failureType: any;
  failureTypeId: any;
  model: any = {
    locationId: 0,
    secondaryTypeAndCauses: [],
  };
  index: number = 0;
  itemId: number = 0;
  private sub: any;
  id: number;
  bsConfig: Partial<BsDatepickerConfig>;
  dismissible = true;
  globalCompany: any;
  companyId: any;
  transfers: any = [];
  warrantyTpes: any = [];
  failureTypes: any = [];
  locations: any = [];
  typeId: any = 0;
  typeName: any = '';
  tag: any = '';
  vendors: any;
  fullVendors: any;
  vendorItems: TreeviewItem[];
  locationItems: TreeviewItem[];
  userName: any;
  failureTypesandcauses: any = {};
  vendor: any = {};
  failureCauseSp: any = [];
  itemRank: any;
  failureCauses: any = {};
  details: any;
  helpFlag: any = false;
  highestRank: any;
  constructor(
    private itemNoteService: ItemNotesService,
    private companyManagementService: CompanyManagementService,
    private locationManagementService: LocationManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private itemRepairItemsService: ItemRepairItemsService,
    private warrantyManagementService: WarrantyManagementService,
    private itemManagementService: ItemManagementService,
    private broadcasterService: BroadcasterService
  ) {
    this.itemId = route.snapshot.params['itemId'];
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyId = this.globalCompany.companyId;
    this.getAllVendors();
    this.locations = this.getLocations();

    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value.companyId;
    });
    // this.spinner.show();
    // this.itemManagementService.getAllTransfers(this.itemId).subscribe(response => {
    //   this.transfers = response;
    //   this.spinner.hide();

    // });
  }

  ngOnInit() {
    this.model.repaircompanyId = this.companyId;
    this.userName = sessionStorage.getItem('userName');
    this.highestRank = sessionStorage.getItem('highestRank');
    this.model.date = new Date();
    this.bsConfig = Object.assign({}, { containerClass: 'theme-red' });
    this.getWarrantyTypes();
  }
  getFailureTypes() {
    this.spinner.show();
    this.itemRepairItemsService
      .getAllFailureTypesForEditItemRepair(this.companyId, this.details.typeId)
      .subscribe((response) => {
        this.failureTypesandcauses = response;
        this.spinner.hide();
        this.failureTypes = Object.keys(this.failureTypesandcauses);
        console.log(this.failureTypesandcauses);
        console.log('new failureType list is' + this.failureTypes);
      });
  }

  getAcMotorFailureTypesAndCauses() {
    this.spinner.show();
    this.itemRepairItemsService
      .getAcMotorFailureTypesAndCauses()
      .subscribe((response: any) => {
        this.failureTypesandcauses = response;
        this.spinner.hide();
        this.failureTypes = Object.keys(this.failureTypesandcauses);
        console.log(this.failureTypesandcauses);
        console.log('new failureType list is' + this.failureTypes);
      });
  }

  getDcMotorFailureTypesAndCauses() {
    this.spinner.show();
    this.itemRepairItemsService
      .getDcMotorFailureTypesAndCauses()
      .subscribe((response: any) => {
        this.failureTypesandcauses = response;
        this.spinner.hide();
        this.failureTypes = Object.keys(this.failureTypesandcauses);
        console.log(this.failureTypesandcauses);
        console.log('new failureType list is' + this.failureTypes);
      });
  }

  getItemDetails() {
    this.spinner.show();
    this.itemManagementService
      .getItemById(this.itemId)
      .subscribe((response: any) => {
        this.model.typeName = response.typeName;
        this.details = response;
        this.model.tag = this.details.tag;
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
        if (this.model.typeName === 'AC Motor') {
          this.getAcMotorFailureTypesAndCauses();
        } else if (this.model.typeName === 'DC Motor') {
          this.getDcMotorFailureTypesAndCauses();
        } else {
          this.getFailureTypes();
        }
        this.spinner.hide();
      });
  }
  setWarrantyType(warrantyTypeId: any) {
    this.warrantyTpes.forEach((element: any) => {
      if (element.warrantyTypeId == warrantyTypeId)
        this.model.warrantyType = element.warrantyType;
    });
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

  getLocations() {
    this.locations = this.broadcasterService.locations;
    if (this.locations && this.locations.length > 0) {
      this.locationItems = [];
      this.locationItems = this.generateHierarchy(this.locations);
    }
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

  getWarrantyTypes() {
    this.spinner.show();
    this.warrantyManagementService
      .getAllWarrantyTypes(this.companyId)
      .subscribe(
        (response) => {
          this.spinner.hide();
          this.warrantyTpes = response;
        },
        (error) => {
          this.spinner.hide();
        }
      );
    this.getItemDetails();
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
    if (this.highestRank == 2) {
      if (
        !this.model.jobNumber ||
        !this.model.poNumber ||
        !this.model.failureDate ||
        this.model.complete == true
       // !this.model.vendorId
      ) {
        if (
          !this.model.jobNumber ||
          !this.model.poNumber ||
          !this.model.failureDate
       //   !this.model.vendorId
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
          if (this.model.failureCause == 0) {
            if (this.model.newFailureCauseSp != undefined)
              this.updateFailureTypeAndCauses(this.model.failureType);
            else {
              this.index = -3;
              window.scroll(0, 0);
              return;
            }
          }
          this.addItemRepair();
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
        this.addItemRepair();
      }
    } else {
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
          if (this.model.failureCause == 0) {
            if (this.model.newFailureCauseSp != undefined)
              this.updateFailureTypeAndCauses(this.model.failureType);
            else {
              this.index = -3;
              window.scroll(0, 0);
              return;
            }
          }
          this.addItemRepair();
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
        this.addItemRepair();
      }
    }
  }

  addItemRepair() {
    this.model = {
      tag: this.model.tag,
      typeName: this.model.typeName,
      actualCompletion:
        this.model.actualCompletion != null
          ? this.model.actualCompletion
          : null,
      complete: this.model.complete ? this.model.complete : false,
      completedBy: this.model.completedby,
      dateAcknowledged: new Date(),
      dateInitiated: new Date(),
      estimatedCompletion:
        this.model.estimatedCompletion != null
          ? this.model.estimatedCompletion
          : null,
      failureCause:
        this.model.failureCause != 0
          ? this.model.failureCause
          : this.model.newFailureCauseSp,
      failureDate:
        this.model.failureDate != null ? this.model.failureDate : null,
      failureType: this.model.failureType ? this.model.failureType : null,
      isWarranty: true,
      itemId: this.itemId,
      itemType: this.model.typeName,
      jobNumber: this.model.jobNumber ? this.model.jobNumber : 0,
      poNumber: this.model.poNumber ? this.model.poNumber : 0,
      repairCompanyId: this.model.repaircompanyId,
      repairCost: this.model.repairCost ? this.model.repairCost : 0,
      repairJobStatus: this.model.repairJobStatus,
      repairLocationId: this.model.repairlocationId
        ? this.model.repairlocationId
        : 0,
      repairLogId: 0,
      repairNotes: this.model.repairNotes ? this.model.repairNotes : '',
      repairVendorNumber: this.model.repairVendorNumber
        ? this.model.repairVendorNumber
        : 0,
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
      secondaryTypeAndCauses: this.model.secondaryTypeAndCauses,
      companyId: this.companyId,
      isActive: 1,
      isVendorWarranty: this.model.isVendorWarranty
        ? this.model.isVendorWarranty
        : 0,
      repairType: this.model.repairType ? this.model.repairType : '',
      vendor: {
        vendorId: this.model.vendorId ? this.model.vendorId : 0,
      },
    };
    console.log(this.model);
    this.spinner.show();
    this.itemRepairItemsService.saveItemRepair(this.model).subscribe(
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

  cancelItemAddRepair() {
    this.router.navigate(['/items/itemRepairs/' + this.itemId]);
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
      this.warrantyTpes.forEach((element: any) => {
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
