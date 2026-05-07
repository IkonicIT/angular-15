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
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppConfiguration } from 'src/app/configuration';
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
  
  // Dropdown search filters
  drivenMachineSearchFilter: string = '';
  customerProcessSearchFilter: string = '';
  
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
  
    //  workOrderNumber: any;
    // cusWorkOrderNumber: any;
    //  cusReqNumber: any;
    //  cusRfqNumber: any;
    //  cusPoNumber: any;
    //  vendorAssignedTo: any;
    //  tagNumber: any;
    //  cusPrcControlNumber: any;
    //  cusDmControlNumber: any;
  itemMMS: boolean = false;
  index = 0;
  itemId = 0;
  bsConfig: Partial<BsDatepickerConfig>;
  dismissible = true;
  globalCompany: any;
  companyId = 0;
  transfers: any[] = [];
  warrantyTpes: any[] = [];
  failureTypes: any[] = [];
  locations: any[] = [];
  typeId = 0;
  typeName = '';
  tag = '';
  vendors: any;
  fullVendors: any[] = [];
  fullDrivenMachineNames: any[] = [];
  fullCustomerProcessNames: any[] = [];
  vendorItems: TreeviewItem[] = [];
  drivenMachineItems: TreeviewItem[] = [];
  customerProcessItems: TreeviewItem[] = [];
  locationItems: TreeviewItem[] = [];
  userName: string | null = null;
  failureTypesandcauses: any = {};
  vendor: any = {};
  failureCauseSp: any[] = [];
  itemRank: any;
  failureCauses: any = {};
  details: any;
  helpFlag = false;
 highestRank: string | null = null;
  get highestRankNum(): number {
    return Number(this.highestRank ?? 0);
  }

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
    private broadcasterService: BroadcasterService,
    private http: HttpClient
  ) {
    this.itemId = Number(route.snapshot.params['itemId']);
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany) {
      this.companyId = this.globalCompany.companyId;
    }
    const itemMMSValue = sessionStorage.getItem('itemMMS');
    this.itemMMS = itemMMSValue === 'true' || itemMMSValue === '1';
    
    if(this.itemMMS)
    {
      this.getMMSVendors();
      this.getMMSDrivenMachineNames();
      this.getMMSCustomerProcessNames();
    }
    else
    {
    this.getAllVendors();
    }
    this.getLocations();

    this.companyManagementService.globalCompanyChange.subscribe(value => {
      this.globalCompany = value;
      this.companyId = value.companyId;
    });
  }

  ngOnInit(): void {
    this.model.repaircompanyId = this.companyId;
    this.userName = sessionStorage.getItem('userName');
    this.highestRank = sessionStorage.getItem('highestRank');
    
    
    this.model.date = new Date();
    this.bsConfig = { containerClass: 'theme-red' };
    this.getWarrantyTypes();
  }

  getFailureTypes(): void {
  this.spinner.show();
  this.itemRepairItemsService
    .getAllFailureTypesForEditItemRepair(String(this.companyId), this.details.typeId)
    .subscribe(response => {
      this.failureTypesandcauses = response;
      this.spinner.hide();
      this.failureTypes = Object.keys(this.failureTypesandcauses);
    });
}
  getMMSVendors(): void {
      this.spinner.show();
      this.http.get(AppConfiguration.locationRestURL + `mms/getMmsVendors/${this.companyId}`).subscribe(
        (response: any) => {
          this.spinner.hide();
          this.fullVendors = Array.isArray(response) ? response : [];
        this.vendorItems = this.generateVendorHierarchyMMS(this.fullVendors);
        this.spinner.hide();
        },
        (error) => {
          this.spinner.hide();
        }
      );
    }
    getMMSDrivenMachineNames(keyword: string = ''): void {
      this.spinner.show();
      const params = new HttpParams()
        .set('companyId', String(this.companyId))
        .set('keyword', keyword || '')
        .set('page', '0')
        .set('size', '250');
      this.http
        .get(AppConfiguration.locationRestURL + `mms/driven-machines`, { params })
        .subscribe(
          (response: any) => {
            this.fullDrivenMachineNames = Array.isArray(response)
              ? response
              : response?.content ?? [];
            this.drivenMachineItems = this.generateDrivenMachineHierarchy(this.fullDrivenMachineNames);
            this.spinner.hide();
          },
          () => {
            this.spinner.hide();
          }
        );
    }
    getMMSCustomerProcessNames(keyword: string = ''): void {
      this.spinner.show();
      const params = new HttpParams()
        .set('companyId', String(this.companyId))
        .set('keyword', keyword || '')
        .set('page', '0')
        .set('size', '250');
      this.http
        .get(AppConfiguration.locationRestURL + `mms/processes`, { params })
        .subscribe(
          (response: any) => {
            this.fullCustomerProcessNames = Array.isArray(response)
              ? response
              : response?.content ?? [];
            this.customerProcessItems = this.generateCustomerProcessHierarchy(this.fullCustomerProcessNames);
            this.spinner.hide();
          },
          () => {
            this.spinner.hide();
          }
        );
    }
  getAcMotorFailureTypesAndCauses(): void {
    this.spinner.show();
    this.itemRepairItemsService
      .getAcMotorFailureTypesAndCauses()
      .subscribe((response: any) => {
        this.failureTypesandcauses = response;
        this.spinner.hide();
        this.failureTypes = Object.keys(this.failureTypesandcauses);
      });
  }

  getDcMotorFailureTypesAndCauses(): void {
    this.spinner.show();
    this.itemRepairItemsService
      .getDcMotorFailureTypesAndCauses()
      .subscribe((response: any) => {
        this.failureTypesandcauses = response;
        this.spinner.hide();
        this.failureTypes = Object.keys(this.failureTypesandcauses);
      });
  }

  getItemDetails(): void {
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
          this.model.warrantyExpiration = new Date(this.model.warrantyExpiration);
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

  setWarrantyType(warrantyTypeId: any): void {
    this.warrantyTpes.forEach((element: any) => {
      if (element.warrantyTypeId == warrantyTypeId)
        this.model.warrantyType = element.warrantyType;
    });
  }

  getAllVendors(): void {
    this.spinner.show();
    this.companyManagementService.getAllVendorDetails().subscribe(
      response => {
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
      vendor =>
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
          value: vendor.vendorNumber,
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
    this.model.vendorNumber=value;
  }

  onVendorAssignedChange(value: any): void {
    this.model.vendorAssignedTo = value;
  }

  getLocations(): void {
    this.locations = Array.isArray(this.broadcasterService.locations) ? this.broadcasterService.locations : [];
    if (this.locations.length > 0) {
      this.locationItems = this.generateHierarchy(this.locations);
    }
  }

  onValueChange(failureType: string | number): void {
    this.failureCauseSp = [];
    this.model.failureCause = ' ';
    const faliurecausetemp = this.failureTypesandcauses[failureType];
    const failureCauseSp = faliurecausetemp[0].split('\n');
    failureCauseSp.forEach((element: string | any[]) => {
      if (element.length > 0) {
        this.failureCauseSp.push(element);
      }
    });
  }

  generateHierarchy(locList: any[]): TreeviewItem[] {
    return locList.map(loc => {
      const children =
        loc.parentResourceList && loc.parentResourceList.length > 0
          ? this.generateHierarchy(loc.parentResourceList)
          : [];
      return new TreeviewItem({
        text: loc.name,
        value: loc.locationId,
        collapsed: true,
        children,
      });
    });
  }

  getWarrantyTypes(): void {
    this.spinner.show();
    this.warrantyManagementService
      .getAllWarrantyTypes(this.companyId)
      .subscribe(
        response => {
          this.spinner.hide();
          this.warrantyTpes = Array.isArray(response) ? response : [];
        },
        () => {
          this.spinner.hide();
        }
      );
    this.getItemDetails();
  }

  updateFailureTypeAndCauses(failureType: string | number): void {
    const faliurecausetemp = this.failureTypesandcauses[failureType];
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

  saveItemRepair(): void {
    if (this.highestRank == '2') {
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
          this.model.completedBy = this.model.complete == true ? this.userName : null;
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
        this.model.completedBy = this.model.complete == true ? this.userName : null;
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
          this.model.completedBy = this.model.complete == true ? this.userName : null;
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
        this.model.completedBy = this.model.complete == true ? this.userName : null;
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

  addItemRepair(): void {
    const tempMMS = sessionStorage.getItem('itemMMS') === 'true' || sessionStorage.getItem('itemMMS') === '1';
    const repairlogMmsResource ={
          workOrderNumber: this.model.workOrderNumber ?? '',
          cusWorkOrderNumber: this.model.cusWorkOrderNumber ?? '',
          cusReqNumber:this.model.cusReqNumber ?? '',
          cusRfqNumber:this.model.cusRfqNumber ?? '',
          cusPoNumber:this.model.cusPoNumber ?? '',
          vendorAssignedTo:this.model.vendorAssignedTo ?? '',
          cusPrcControlNumber:this.model.cusPrcControlNumber ?? '',
          cusDmControlNumber:this.model.cusDmControlNumber ?? '',
          tagNumber:this.model.tagNumber ?? ''
        }
    const request = {
      tag: this.model.tag,
      typeName: this.model.typeName,
      actualCompletion: this.model.actualCompletion ?? null,
      complete: this.model.complete ?? false,
      completedBy: this.model.completedBy,
      dateAcknowledged: new Date(),
      dateInitiated: new Date(),
      estimatedCompletion: this.model.estimatedCompletion ?? null,
      failureCause: this.model.failureCause != 0 ? this.model.failureCause : this.model.newFailureCauseSp,
      failureDate: this.model.failureDate ?? null,
      failureType: this.model.failureType ?? null,
      isWarranty: true,
      itemId: this.itemId,
      itemType: this.model.typeName,
      jobNumber: this.model.jobNumber ?? 0,
      poNumber: this.model.poNumber ?? 0,
      repairCompanyId: this.model.repaircompanyId,
      repairCost: this.model.repairCost ?? 0,
      repairJobStatus: this.model.repairJobStatus,
      repairLocationId: this.model.repairLocationId ?? 0,
      repairLogId: 0,
      repairNotes: this.model.repairNotes ?? '',
      repairVendorNumber: this.model.repairVendorNumber ?? 0,
      rfqNumber: 0,
      title: this.model.title ?? '',
      transferLogId: 0,
      warrantyType: this.model.warrantyType ?? '',
      warrantyTypeId: this.model.warrantyTypeId ?? 0,
      warrantyExpiration: this.model.warrantyExpiration ?? null,
      userName: this.userName,
      secondaryTypeAndCauses: this.model.secondaryTypeAndCauses,
      companyId: this.companyId,
      isActive: 1,
      isVendorWarranty: this.model.isVendorWarranty ?? 0,
      repairType: this.model.repairType ?? '',
      vendor: {
        vendorId: this.model.vendorId ?? 0,
      },
      
    };
  let fullRequest = {
  ...request,
  ...(tempMMS && { repairlogMmsResource })
};
    this.spinner.show();
    this.itemRepairItemsService.saveItemRepair(fullRequest).subscribe(
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

  cancelItemAddRepair(): void {
    this.router.navigate(['/items/itemRepairs/' + this.itemId]);
  }

  addSecondaryFindings(): void {
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

  removeSecondaryFindings(i: number): void {
    this.model.secondaryTypeAndCauses.splice(i, 1);
  }

  getFailureCause(ft: any): string[] | null {
    if (ft.length > 0) return this.failureTypesandcauses[ft][0].split('\n');
    else return null;
  }

  checkValue(event: any): void {
    if (event == 'A') this.model.actualCompletion = new Date();
    else if (event == 'B') this.model.actualCompletion = null;
  }

  setWarrantyTypeID(): void {
    if (this.model.warrantyType && this.model.warrantyType != '') {
      this.warrantyTpes.forEach((element: any) => {
        if (element.warrantyType == this.model.warrantyType)
          this.model.warrantyTypeId = element.warrantyTypeId;
        });
    }
  }

  print(): void {
    this.helpFlag = false;
    window.print();
  }

  help(): void {
    this.helpFlag = !this.helpFlag;
  }
  
  onCustomerProcessSelect(value: any): void {
    this.model.cusPrcControlNumber = value;
  }

  onDrivenMachineSelect(value: any): void {
    this.model.cusDmControlNumber = value;
  }

  trackByControlNumber(index: number, item: any): any {
    return item?.cusPrcControlNumber ?? item?.cusDmControlNumber ?? index;
  }
  
  trackByIndex(index: number): number {
    return index;
  }
}
