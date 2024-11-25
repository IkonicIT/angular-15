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
  failuretype: any;
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
  failurecausesp: any = [];

  failurecauses: any = {};
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
    this.companyId = this.globalCompany.companyid;
    this.getAllVendors();
    this.locations = this.getLocations();
    if (this.companyId) {
      this.getWarrantyTypes();
    }
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value.companyid;
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

        if (this.model.failuretype == '') {
          this.model.failuretype = null;
        }
        if (this.model.estimatedcompletion) {
          this.model.estimatedcompletion = new Date(
            this.model.estimatedcompletion
          );
        }
        if (this.model.failuredate) {
          this.model.failuredate = new Date(this.model.failuredate);
        }
        if (this.model.actualcompletion) {
          this.model.actualcompletion = new Date(this.model.actualcompletion);
        }

        this.model.repairvendornumber = parseInt(this.model.repairvendornumber);
        if (this.model.failuretype != null && this.model.failuretype != '') {
          let faliurecausetemp =
            this.failureTypesandcauses[this.model.failuretype];
          let failurecausesp = faliurecausetemp[0].split('\n');

          failurecausesp.forEach((element: string | any[]) => {
            if (element.length > 1) {
              this.failurecausesp.push(element);
            }
          });

          console.log('fc is:' + this.model.failurecause);
          this.failurecausesp.forEach((element: string) => {
            if (element == this.model.failurecause)
              console.log('fcp is:' + element + '=' + this.model.failurecause);
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
        this.model.itemtype = response.typeName;
        this.details = response;
        if (response.warrantyTypeId != 0) {
          this.model.warrantytypeid = response.warrantyTypeId;
          this.setWarrantyType(response.warrantyTypeId);
        }
        this.model.warrantyexpiration = response.warrantyExpiration;
        if (this.model.warrantyexpiration) {
          this.model.warrantyexpiration = new Date(
            this.model.warrantyexpiration
          );
        }
        if (this.model.itemtype === 'AC Motor') {
          this.getAcMotorFailureTypesAndCauses();
        } else if (this.model.itemtype === 'DC Motor') {
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
        console.log('new failuretype list is' + this.failureTypes);
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
        console.log('new failuretype list is' + this.failureTypes);
        this.getItemRepairDetails();
      });
  }

  setWarrantyType(warrantytypeid: any) {
    this.warrantyTypes.forEach((element: any) => {
      if (element.warrantytypeid == warrantytypeid)
        this.model.warrantytype = element.warrantytype;
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
          value: loc.locationid,
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
    this.failurecausesp = [];
    this.model.failurecause = ' ';
    let faliurecausetemp = this.failureTypesandcauses[failureType];
    let failurecausesp = faliurecausetemp[0].split('\n');

    failurecausesp.forEach((element: string | any[]) => {
      if (element.length > 0) {
        this.failurecausesp.push(element);
      }
    });
  }

  updateFailureTypeAndCauses(failuretype: string | number) {
    let faliurecausetemp = this.failureTypesandcauses[failuretype];
    let causes = faliurecausetemp[0];
    causes = causes + '\n' + this.model.newfailurecause;
    this.spinner.show();
    var request = {
      failuretypeid: 0,
      itemtypeid: this.details.typeId,
      description: failuretype,
      causes: causes,
    };
    this.itemRepairItemsService
      .updateFailureTypeAndCauses(request, request.failuretypeid)
      .subscribe((response) => {
        this.spinner.hide();
      });
  }
  saveItemRepair() {
    if (
      !this.model.jobnumber ||
      !this.model.ponumber ||
      !this.model.failuredate ||
      this.model.complete == true
    ) {
      if (
        !this.model.jobnumber ||
        !this.model.ponumber ||
        !this.model.failuredate ||
        !this.model.vendor.vendorId
      ) {
        this.index = -1;
        window.scroll(0, 0);
      } else if (
        this.model.complete == true &&
        this.model.failuretype == null &&
        this.model.failurecause == null
      ) {
        this.index = -2;
        window.scroll(0, 0);
      } else {
        if (this.model.complete == true) {
          this.model.completedby = this.userName;
        } else {
          this.model.completedby = null;
        }
        if (this.model.failuretype != null && this.model.failurecause == 0) {
          if (this.model.newfailurecause != undefined)
            this.updateFailureTypeAndCauses(this.model.failuretype);
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

      if (this.model.failuretype != null && this.model.failurecause == 0) {
        if (this.model.newfailurecause != undefined)
          this.updateFailureTypeAndCauses(this.model.failuretype);
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
      actualcompletion: this.model.actualcompletion
        ? this.model.actualcompletion
        : null,
      complete: this.model.complete ? this.model.complete : false,
      completedby: this.model.completedby,
      dateacknowledged: this.model.dateacknowledged,
      dateinitiated: this.model.dateinitiated,
      estimatedcompletion: this.model.estimatedcompletion
        ? this.model.estimatedcompletion
        : null,
      failurecause:
        this.model.failurecause != 0
          ? this.model.failurecause
          : this.model.newfailurecause,
      failuredate:
        this.model.failuredate != null ? this.model.failuredate : null,
      failuretype:
        this.model.failuretype != null ? this.model.failuretype : null,
      iswarranty: true,
      itemid: this.itemId,
      itemtype: this.model.itemtype,
      jobnumber: this.model.jobnumber ? this.model.jobnumber : 0,
      ponumber: this.model.ponumber ? this.model.ponumber : 0,
      repaircompanyid: this.model.repaircompanyid,
      repaircost: this.model.repaircost ? this.model.repaircost : 0,
      repairjobstatus: this.model.repairjobstatus,
      repairlocationid: this.model.repairlocationid
        ? this.model.repairlocationid
        : 0,
      repairlogid: this.model.repairlogid,
      repairnotes: this.model.repairnotes ? this.model.repairnotes : '',
      repairvendornumber: this.model.repairvendornumber
        ? this.model.repairvendornumber
        : 0,
      repairVendorName: this.vendor.name ? this.vendor.name : '',
      rfqnumber: 0,
      title: this.model.title ? this.model.title : '',
      transferlogid: 0,
      warrantytype: this.model.warrantytype ? this.model.warrantytype : '',
      warrantytypeid:
        this.model.warrantytypeid != undefined ? this.model.warrantytypeid : 0,
      warrantyexpiration: this.model.warrantyexpiration
        ? this.model.warrantyexpiration
        : null,
      userName: this.userName,
      tag: this.model.tag,
      secondaryTypeAndCauses: this.model.secondaryTypeAndCauses,
      companyId: this.companyId,
      isactive: 1,
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
            response.itemid +
            '/' +
            response.repairlogid,
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
      failuretype: '',
      failurecause: '',
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
    if (event == 'A') this.model.actualcompletion = new Date();
    else if (event == 'B') this.model.actualcompletion = null;
  }
  setWarrantyTypeID() {
    if (this.model.warrantytype && this.model.warrantytype != '') {
      this.warrantyTypes.forEach((element: any) => {
        if (element.warrantytype == this.model.warrantytype)
          this.model.warrantytypeid = element.warrantytypeid;
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
