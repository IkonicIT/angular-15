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
import { HttpClient , HttpParams} from '@angular/common/http';
import { AppConfiguration } from 'src/app/configuration';
@Component({
  selector: 'app-edit-item-repairs',
  templateUrl: './edit-item-repairs.component.html',
  styleUrls: ['./edit-item-repairs.component.scss'],
})
export class EditItemRepairsComponent implements OnInit {
  bsConfig: Partial<BsDatepickerConfig>;
  drivenMachineSearchFilter: string = '';
  customerProcessSearchFilter: string = '';
  fullDrivenMachineNames: any[] = [];
  fullCustomerProcessNames: any[] = [];
  get filteredDrivenMachines(): any[] {
    if (!this.drivenMachineSearchFilter.trim()) {
      return this.fullDrivenMachineNames;
    }
    const filter = this.drivenMachineSearchFilter.toLowerCase();
    return this.fullDrivenMachineNames.filter(m => 
      m.drivenMachineName?.toLowerCase().includes(filter)
    );
  }
  
  get filteredCustomerProcesses(): any[] {
    if (!this.customerProcessSearchFilter.trim()) {
      return this.fullCustomerProcessNames;
    }
    const filter = this.customerProcessSearchFilter.toLowerCase();
    return this.fullCustomerProcessNames.filter(p => 
      p.processName?.toLowerCase().includes(filter)
    );
  }
  itemMMS: boolean = false;
  public selectedDeptNumber: number | null = null;
   public isloaded = false;
   public deptData: any[] = [];
  failureType: any;
  mmsDetails: any;
  currFailuretype: any;
  failureTypeId: any;
  model: any = {};
  vendor: any = {};
  details: any = {};
  tag: any;
  item: any = {};
  index: number = 0;
  itemId: number = 0;
  id: number;
  dismissible = true;
  globalCompany: any;
  companyId: any;
  itemRepairId: any;
  transfers: any[] = [];
  highestRank: any;
  warrantyTypes: any[] = [];
  failureTypes: any[] = [];
  locations: any[] = [];
  vendors: any;
  fullVendors: any;
  vendorItems: TreeviewItem[] = [];
  drivenMachineItems: TreeviewItem[] = [];
  customerProcessItems: TreeviewItem[] = [];
  locationItems: TreeviewItem[] = [];
  failureTypesandcauses: any = {};
  failureCauseSp: any[] = [];
  failureCauses: any = {};
  userName: any;
  helpFlag: boolean = false;
  
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
    private _location: Location,
    private http: HttpClient
  ) {
    this.itemId = route.snapshot.params['itemId'];
    this.itemRepairId = route.snapshot.params['repairId'];
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyId = this.globalCompany.companyId;
    const itemMMSValue = sessionStorage.getItem('itemMMS');
    this.itemMMS = itemMMSValue === 'true' || itemMMSValue === '1';
    if(this.itemMMS)
    {
      this.getMMSVendors();
      this.getMmsRepairDetails();
      this.getDeptData();
    }
    else
    {
    this.getAllVendors();
    }
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
   getMMSVendors(): void {
        this.spinner.show();
        this.http.get(AppConfiguration.locationRestURL + `mms/getMmsVendors/${this.companyId}`).subscribe(
          (response: any) => {
            this.fullVendors = Array.isArray(response) ? response : [];
            this.vendorItems = this.generateVendorHierarchyMMS(this.fullVendors);
            this.syncSelectedMMSVendor();
            this.spinner.hide();
          },
          (error) => {
            this.spinner.hide();
          }
        );
      }

  syncSelectedMMSVendor(): void {
    if (!this.fullVendors?.length || !this.mmsDetails) {
      return;
    }
    const vendorName = this.mmsDetails.vendorName?.trim();
    const vendorNumber = this.mmsDetails.vendorNumber ?? this.mmsDetails.vendorAssignedTo ?? this.mmsDetails.vendorId;
    let vendorMatch = null;
    if (vendorNumber != null) {
      vendorMatch = this.fullVendors.find(
        (v: any) => v.vendorNumber?.toString() === vendorNumber.toString()
      );
    }
    if (!vendorMatch && vendorName) {
      vendorMatch = this.fullVendors.find(
        (v: any) => v.vendorName?.trim() === vendorName
      );
    }
    if (vendorMatch) {
      const normalizedValue = vendorMatch.vendorNumber != null ? vendorMatch.vendorNumber.toString() : vendorMatch.vendorNumber;
      this.model.vendorName = normalizedValue;
      this.model.vendorAssignedTo = normalizedValue;
    }
  }

  getWarrantyTypes() {
    this.spinner.show();
    this.warrantyManagementService
      .getAllWarrantyTypes(this.companyId)
      .subscribe(
        (response) => {
          this.spinner.hide();
          this.warrantyTypes = Array.isArray(response) ? response : [];
        },
        () => {
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
         if (this.model.warrantyExpiration)
          this.model.warrantyExpiration = new Date(this.model.warrantyExpiration);
        if (this.model.failureType === '') {
          this.model.failureType = null;
        }
        if (this.model.estimatedCompletion) {
          this.model.estimatedCompletion = new Date(this.model.estimatedCompletion);
        }
        if (this.model.failureDate) {
          this.model.failureDate = new Date(this.model.failureDate);
        }
        if (this.model.actualCompletion) {
          this.model.actualCompletion = new Date(this.model.actualCompletion);
        }

        this.model.repairVendorNumber = parseInt(this.model.repairVendorNumber);
        if (this.model.failureType != null && this.model.failureType !== '') {
          let faliurecausetemp = this.failureTypesandcauses[this.model.failureType];
          let failureCauseSp = faliurecausetemp[0].split('\n');
          failureCauseSp.forEach((element: string) => {
            if (element.length > 1) {
              this.failureCauseSp.push(element);
            }
          });
        }
      });
  }
  getDeptData(): void {
        this.spinner.show();
        this.itemManagementService.getDepartmentData(this.companyId).subscribe(
          (response: any) => {
            this.deptData = Array.isArray(response) ? response.map(d =>
              new TreeviewItem({ text: d.deptName.trim(), value: d.deptNumber, children: [] })
            ) : [];
            this.spinner.hide();
            this.isloaded = true;
          },
          () => {
            this.spinner.hide();
            this.isloaded = true;
          }
        );
      }
      onDeptChange(deptNumber: number) {
    this.selectedDeptNumber = deptNumber;
    console.log('Selected deptNumber:', deptNumber);
    // Refresh driven machine and process names with selected deptNumber
    this.getMMSDrivenMachineNames('', deptNumber);
    this.getMMSCustomerProcessNames('', deptNumber);
  }
  getMMSDrivenMachineNames(keyword: string = '', deptNumber?: number): void {
      this.spinner.show();
      let params = new HttpParams()
        .set('companyId', String(this.companyId))
        .set('deptNumber',String(deptNumber))
        .set('keyword', keyword || '')
        .set('page', '0')
        .set('size', '250');
      // if (deptNumber != null) {
      //   params = params.set('deptNumber', String(deptNumber));
      // }
      this.http
        .get(AppConfiguration.locationRestURL + `mms/driven-machines`, { params })
        .subscribe(
          (response: any) => {
            this.fullDrivenMachineNames = Array.isArray(response)
              ? response
              : response?.content ?? [];
              if (this.mmsDetails?.cusDmControlNumber != null) {
        const match = this.fullDrivenMachineNames.find(
          m => m.cusDmControlNumber === this.mmsDetails.cusDmControlNumber ||
               m.drivenMachineName?.trim() === this.mmsDetails.drivenMachineName?.trim()
        );
        if (match) {
          this.model.cusDmControlNumber = match.cusDmControlNumber;
        } else {
          this.model.cusDmControlNumber = this.mmsDetails.cusDmControlNumber;
          if (this.mmsDetails.drivenMachineName) {
            this.fullDrivenMachineNames.unshift({
              cusDmControlNumber: this.mmsDetails.cusDmControlNumber,
              drivenMachineName: this.mmsDetails.drivenMachineName,
            });
          }
        }
      }

            this.spinner.hide();
            this.drivenMachineItems = this.generateDrivenMachineHierarchy(this.fullDrivenMachineNames);
          },
          () => {
            this.spinner.hide();
          }
        );
    }
    getMMSCustomerProcessNames(keyword: string = '', deptNumber?: number): void {
      this.spinner.show();
      let params = new HttpParams()
        .set('companyId', String(this.companyId))
        .set('keyword', keyword || '')
        .set('page', '0')
        .set('size', '250');
      if (deptNumber != null) {
        params = params.set('deptNumber', String(deptNumber));
      }
      this.http
        .get(AppConfiguration.locationRestURL + `mms/processes`, { params })
        .subscribe(
          (response: any) => {
            this.fullCustomerProcessNames = Array.isArray(response)
              ? response
              : response?.content ?? [];
              if (this.mmsDetails?.cusPrcControlNumber != null) {
        const match = this.fullCustomerProcessNames.find(
          p => p.cusPrcControlNumber === this.mmsDetails.cusPrcControlNumber ||
               p.processName?.trim() === this.mmsDetails.processName?.trim()
        );
        if (match) {
          this.model.cusPrcControlNumber = match.cusPrcControlNumber;
        } else {
          this.model.cusPrcControlNumber = this.mmsDetails.cusPrcControlNumber;
          if (this.mmsDetails.processName) {
            this.fullCustomerProcessNames.unshift({
              cusPrcControlNumber: this.mmsDetails.cusPrcControlNumber,
              processName: this.mmsDetails.processName,
            });
          }
        }
      }
            this.spinner.hide();
            this.customerProcessItems = this.generateCustomerProcessHierarchy(this.fullCustomerProcessNames);
          },
          () => {
            this.spinner.hide();
          }
        );
    }
    trackByControlNumber(index: number, item: any): any {
      return item?.cusPrcControlNumber ?? item?.cusDmControlNumber ?? index;
    }
    trackByIndex(index: number): number {
    return index;
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
          this.model.warrantyExpiration = new Date(this.model.warrantyExpiration);
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
    this.locations = Array.isArray(this.broadcasterService.locations)
      ? this.broadcasterService.locations
      : [];
    if (this.locations && this.locations.length > 0) {
      this.locationItems = this.generateHierarchy(this.locations);
    }
    return this.locations;
  }

  generateHierarchy(locList: any[]): TreeviewItem[] {
    const items: TreeviewItem[] = [];
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
      let children: TreeviewItem[] = [];
      if (
        loc.parentResourceList &&
        loc.parentResourceList.length > 0
      ) {
        children = this.generateHierarchy(loc.parentResourceList);
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
        this.fullVendors = Array.isArray(response) ? response : [];
        this.vendorItems = this.generateVendorHierarchy(this.fullVendors);
        this.spinner.hide();
      },
      () => {
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

    generateVendorHierarchyMMS(vendors: any[]): TreeviewItem[] {
      return vendors.map(
        vendor =>
          new TreeviewItem({
            text: vendor.vendorName,
            value: vendor.vendorNumber != null ? vendor.vendorNumber.toString() : vendor.vendorNumber,
            collapsed: true,
            children: [],
          })
      );
    }

    generateDrivenMachineHierarchy(machines: any[]): TreeviewItem[] {
      return machines.map(
        machine =>
          new TreeviewItem({
            text: machine.drivenMachineName,
            value: machine.cusDmControlNumber,
            collapsed: true,
            children: [],
          })
      );
    }

    generateCustomerProcessHierarchy(processes: any[]): TreeviewItem[] {
      return processes.map(
        process =>
          new TreeviewItem({
            text: process.processName,
            value: process.cusPrcControlNumber,
            collapsed: true,
            children: [],
          })
      );
    }
  
    onVendorChange(value: any): void {
      this.model.vendorId = value;
      this.model.vendorNumber = value;
    }

    onVendorAssignedChange(value: any): void {
      const normalizedValue = value != null ? value.toString() : value;
      this.model.vendorAssignedTo = normalizedValue;
      this.model.vendorName = normalizedValue;
      this.model.vendorNumber = normalizedValue;
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
    failureCauseSp.forEach((element: string) => {
      if (element.length > 0) {
        this.failureCauseSp.push(element);
      }
    });
  }
  getMmsRepairDetails(): void {
  this.spinner.show();

  this.itemRepairItemsService
    .getItemMmsDetails(this.itemRepairId)
    .subscribe(
      (response: any) => {
        console.log('MMS Repair Details response:', response);
        this.mmsDetails = response;
        this.model.cusPrcControlNumber = response.cusPrcControlNumber;
        this.model.cusDmControlNumber = response.cusDmControlNumber;
        this.model.vendorAssignedTo = response.vendorAssignedTo ?? response.vendorNumber ?? response.vendorId ?? null;
        this.model.vendorNumber = response.vendorNumber ?? null;
        this.model.vendorName = response.vendorNumber != null ? response.vendorNumber.toString() : (response.vendorAssignedTo != null ? response.vendorAssignedTo.toString() : null);
        this.customerProcessSearchFilter = response.processName ?? '';
        this.drivenMachineSearchFilter = response.drivenMachineName ?? '';
        this.syncSelectedMMSVendor();
        // Load process and machine names after MMS details are loaded
        this.getMMSDrivenMachineNames();
        this.getMMSCustomerProcessNames();
        this.spinner.hide();
      },
      (error) => {
        console.error('Error fetching MMS Repair Details:', error);
        this.spinner.hide();
      }
    );
}
  updateFailureTypeAndCauses(failureType: string | number) {
    let faliurecausetemp = this.failureTypesandcauses[failureType];
    let causes = faliurecausetemp[0];
    causes = causes + '\n' + this.model.newFailureCauseSp;
    this.spinner.show();
    const request = {
      failureTypeId: 0,
      itemTypeId: this.details.typeId,
      description: failureType,
      causes: causes,
    };
    this.itemRepairItemsService
      .updateFailureTypeAndCauses(request, request.failureTypeId)
      .subscribe(() => {
        this.spinner.hide();
      });
  }

  saveItemRepair() {
    if (
      !this.model.jobNumber ||
      !this.model.poNumber ||
      !this.model.failureDate ||
      this.model.complete === true
    ) {
      if (
        !this.model.jobNumber ||
        !this.model.poNumber ||
        !this.model.failureDate
      ) {
        this.index = -1;
        window.scroll(0, 0);
      } else if (
        this.model.complete === true &&
        this.model.failureType == null &&
        this.model.failureCause == null
      ) {
        this.index = -2;
        window.scroll(0, 0);
      } else {
        if (this.model.complete === true) {
          this.model.completedBy = this.userName;
        } else {
          this.model.completedBy = null;
        }
        if (this.model.failureType != null && this.model.failureCause == 0) {
          if (this.model.newFailureCauseSp !== undefined)
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
      if (this.model.complete === true) {
        this.model.completedBy = this.userName;
      } else {
        this.model.completedBy = null;
      }

      if (this.model.failureType != null && this.model.failureCause == 0) {
        if (this.model.newFailureCauseSp !== undefined)
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
    const tempMMS = sessionStorage.getItem('itemMMS') === 'true' || sessionStorage.getItem('itemMMS') === '1';
    const repairlogMmsResource ={
          workOrderNumber: this.mmsDetails.workOrderNumber ?? '',
          cusWorkOrderNumber: this.mmsDetails.cusWorkOrderNumber ?? '',
          cusReqNumber:this.mmsDetails.cusReqNumber ?? '',
          cusRfqNumber:this.mmsDetails.cusRfqNumber ?? '',
          cusPoNumber:this.mmsDetails.cusPoNumber ?? '',
          vendorAssignedTo:this.model.vendorNumber ?? this.mmsDetails.vendorNumber ?? '',
          vendorNumber: this.model.vendorNumber ?? this.mmsDetails.vendorNumber ?? '',
          cusPrcControlNumber:this.model.cusPrcControlNumber ?? this.mmsDetails.cusPrcControlNumber ?? '',
          cusDmControlNumber:this.model.cusDmControlNumber ?? this.mmsDetails.cusDmControlNumber ?? '',
          tagNumber:this.mmsDetails.tagNumber ?? '',
          
        }
    const request = {
      actualCompletion: this.model.actualCompletion ?? null,
      complete: this.model.complete ?? false,
      completedBy: this.model.completedBy,
      dateAcknowledged: this.model.dateAcknowledged,
      dateInitiated: this.model.dateInitiated,
      estimatedCompletion: this.model.estimatedCompletion ?? null,
      failureCause:
        this.model.failureCause != 0
          ? this.model.failureCause
          : this.model.newFailureCauseSp,
      failureDate: this.model.failureDate ?? null,
      failureType: this.model.failureType ?? null,
      isWarranty: true,
      itemId: this.itemId,
      itemType: this.model.itemType,
      jobNumber: this.model.jobNumber ?? 0,
      poNumber: this.model.poNumber ?? 0,
      repairCompanyId: this.model.repairCompanyId,
      repairCost: this.model.repairCost ?? 0,
      repairJobStatus: this.model.repairJobStatus,
      repairLocationId: this.model.repairLocationId ?? 0,
      repairLogId: this.model.repairLogId,
      repairNotes: this.model.repairNotes ?? '',
      repairVendorNumber: this.model.repairVendorNumber ?? 0,
      repairVendorName: this.vendor.name ?? '',
      rfqNumber: 0,
      title: this.model.title ?? '',
      transferLogId: 0,
      warrantyType: this.model.warrantyType ?? '',
      warrantyTypeId: this.model.warrantyTypeId ?? 0,
      warrantyExpiration: this.model.warrantyExpiration ?? null,
      userName: this.userName,
      tag: this.model.tag,
      secondaryTypeAndCauses: this.model.secondaryTypeAndCauses,
      companyId: this.companyId,
      isActive: 1,
      isVendorWarranty: this.model.isVendorWarranty ?? 0,
      repairType: this.model.repairType ?? '',
      
      vendor: {
        vendorId: this.model.vendor.vendorId,
      },
    };
     let fullRequest = {
  ...request,
  ...(tempMMS && { repairlogMmsResource })
};
    this.spinner.show();
    this.itemRepairItemsService.updateItemRepair(fullRequest).subscribe(
      (response: any) => {
        this.spinner.hide();
        window.scroll(0, 0);
        this.index = 1;
        setTimeout(() => {
          this.index = 0;
        }, 7000);
        this.router.navigate([
          '/items/viewItemRepair/' + response.itemId + '/' + response.repairLogId,
        ]);
      },
      () => {
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
    if (event == 'A') this.model.actualCompletion = new Date();
    else if (event == 'B') this.model.actualCompletion = null;
  }

  setWarrantyTypeID() {
    if (this.model.warrantyType && this.model.warrantyType !== '') {
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
