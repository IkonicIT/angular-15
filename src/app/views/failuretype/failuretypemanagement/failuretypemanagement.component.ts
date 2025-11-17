import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { HttpClient } from '@angular/common/http';
import { CompanyManagementService } from '../../../services/company-management.service';
import { ItemTypesService } from '../../../services/Items/item-types.service';
import { ItemRepairItemsService } from '../../../services/Items/item-repair-items.service';


@Component({
  selector: 'app-failuretypemanagement',
  templateUrl: './failuretypemanagement.component.html',
  styleUrls: ['./failuretypemanagement.component.scss'],
})
export class FailuretypemanagementComponent implements OnInit {
  failureType: any;
  failureTypeId: any;
  causes: any;
  editEnable: number = 0;
  faliurecausetemp: any;
  highestRank: any;
  index: number = 0;
  addFailure: number = 0;
  types: any[] = [];
  atts: any[] = [];
  message: string = '';
  companyId: string = '0';
  companyName: string = '';
  typeId: string = '';
  itemType: string = '';
  itemTypeOne: any;
  listItem: any;
  userName: string = '';
  itemTypes: any[] = [];
  model: any = {};
  failureTypes: any[] = [];
  failureCauses: any[] = [];
  selectedAttrType: any = {};
  globalCompany: any;
  editDeleteFlag: any = false;
  addEditFlag: any = false;
  newFlag: any = false;
  failureTypesandcauses: any = {};
  failureTypeAndCausesPayload: any = {};
  modalRef: BsModalRef | null = null;
  value: any;
  helpFlag: boolean = false;
  dismissible: boolean = true;
  items: TreeviewItem[] = [];
  config = TreeviewConfig.create({
    hasFilter: false,
    hasCollapseExpand: false,
  });
  loader: boolean = false;

  constructor(
    private companyManagementService: CompanyManagementService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private itemTypesService: ItemTypesService,
    private itemRepairItemsService: ItemRepairItemsService,
    private modalService: BsModalService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('userName') ?? '';
    this.highestRank = sessionStorage.getItem('highestRank');

    if (this.companyId === '0') {
      this.globalCompany = this.companyManagementService.getGlobalCompany();
      if (this.globalCompany) {
        this.companyName = this.globalCompany.name;
        this.companyId = this.globalCompany.companyId;
      }
    }
    this.http.get('assets/failureTypes/failureTypeManagement.json')
  .subscribe((data: any) => {
    this.failureTypesandcauses = data;
    this.failureTypes = Object.keys(this.failureTypesandcauses);
    this.spinner.hide();
  });
    this.pageLoadCalls(this.companyId);

    this.companyManagementService
      .getCompanyDetails(this.companyId)
      .subscribe((response: any) => {
        this.companyName = response.name;
      });

    this.model.name = 'type';
  }

  pageLoadCalls(companyId: string): void {
    this.spinner.show();

    this.itemTypesService
      .getAllItemTypesWithHierarchy(companyId)
      .subscribe((response) => {
        this.itemTypes = response;
        if (this.itemTypes && this.itemTypes.length > 0) {
          this.items = this.generateHierarchy(this.itemTypes);
        }
        this.spinner.hide();
      });
  }

  generateHierarchy(typeList: any[]): TreeviewItem[] {
    const items: TreeviewItem[] = [];

    if (typeList.length > 0) {
      typeList.forEach((type) => {
        let children: TreeviewItem[] = [];
        if (type.typeList && type.typeList.length > 0) {
          children = this.generateHierarchy(type.typeList);
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
    }
    return items;
  }

  onValueChange(value: any): void {
    this.value = value;

    if (this.value !== undefined) {
      this.newFlag = true;
      this.failureType = '';
      this.failureTypeId = 0;
      this.editDeleteFlag = false;
      this.faliurecausetemp = [];
      this.failureCauses = [];
      this.getFailureTypes(value);
    }
  }
  getFailureTypes(typeId: string): void {
  this.spinner.show();

  this.failureTypes = Object.keys(this.failureTypesandcauses);
  this.spinner.hide();
}

  getCausesForFailureType(failureType: string): void {
  this.failureType = failureType; 
  this.failureCauses = this.failureTypesandcauses[failureType] || [];
  this.editDeleteFlag = true;
}

  addFailureTypeAndCauses(): void {
    this.addEditFlag = true;
    this.newFlag = false;
    this.addFailure = 1;
    this.editEnable = 0;
    this.editDeleteFlag = false;

    this.failureTypesandcauses = {};
    this.failureTypes = [];
    this.failureCauses = [];

    this.model.failureType = '';
    this.model.causes = '';
  }

  saveFailureTypeAndCauses(): void {
    this.typeId = this.value;
    this.spinner.show();

    if (this.model.failureType && this.typeId !== undefined) {
      const request = {
        itemTypeId: this.typeId,
        description: this.model.failureType,
        lastModifiedBy: this.userName,
        companyId: this.companyId,
        causes: this.model.causes ?? '',
      };

      this.itemRepairItemsService
        .saveFailureTypeAndCauses(request)
        .subscribe((response) => {
          this.spinner.hide();
          this.index = 1;
          setTimeout(() => (this.index = 0), 7000);
          window.scroll(0, 0);
          this.failureTypeAndCausesPayload = response;
          this.newFlag = false;
          this.model.failureType = null;
          this.model.causes = null;
          this.value = null;
          this.failureType = null;
          this.addEditFlag = false;
          this.editDeleteFlag = false;
          this.addFailure = 0;
        });
    } else {
      this.spinner.hide();
      window.scroll(0, 0);
      this.index = -1;
    }
  }

  updateFailureTypeAndCauses(): void {
    this.typeId = this.value;
    this.causes = this.model.causes;
    this.failureTypeId = parseInt(this.failureTypeId, 10);
    this.spinner.show();

    if (this.model.failureType && this.typeId !== undefined) {
      const request = {
        failureTypeId: this.failureTypeId,
        itemTypeId: this.typeId,
        lastModifiedBy: this.userName,
        companyId: this.companyId,
        description: this.model.failureType,
        causes: this.model.causes ?? '',
      };

      this.itemRepairItemsService
        .updateFailureTypeAndCauses(request, this.failureTypeId)
        .subscribe((response) => {
          this.spinner.hide();
          this.index = 2;
          setTimeout(() => (this.index = 0), 7000);
          window.scroll(0, 0);
          this.failureTypeAndCausesPayload = response;
        });

      this.newFlag = false;
      this.addFailure = 0;
      this.model.failureType = null;
      this.model.causes = null;
      this.value = null;
      this.failureType = null;
      this.failureTypesandcauses = {};
      this.failureTypes = [];
      this.failureCauses = [];
      this.editEnable = 0;
    } else {
      this.spinner.hide();
      window.scroll(0, 0);
      this.index = -1;
    }
  }

  openModal(template: TemplateRef<any>, id: any): void {
    this.failureTypeId = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();
    this.typeId = this.value;

    this.itemRepairItemsService
      .deleteFailureTypeAndCauses(this.failureTypeId, this.companyId, this.userName)
      .subscribe((response) => {
        this.spinner.hide();
        this.index = 3;
        setTimeout(() => (this.index = 0), 7000);
        window.scroll(0, 0);
        this.failureTypeAndCausesPayload = response;
      });

    this.modalRef?.hide();
    this.addFailure = 0;
    this.model.failureType = null;
    this.model.causes = null;
    this.value = null;
    this.failureType = null;
    this.failureTypesandcauses = {};
    this.failureTypes = [];
    this.failureCauses = [];
    this.newFlag = false;
  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef?.hide();
  }

  cancelAdd(): void {
    this.addFailure = 0;
    this.addEditFlag = false;
    this.editEnable = 0;
    this.newFlag = false;
    this.model.failureType = null;
    this.model.causes = null;
    this.value = null;
    this.failureType = null;
    this.failureTypesandcauses = {};
    this.failureTypes = [];
    this.failureCauses = [];
  }

  editFailureType(failureType: string): void {
    this.addEditFlag = false;
    this.editDeleteFlag = false;
    this.editEnable = 1;
    this.model.failureType = this.failureType || failureType.split('_')[0];
    this.model.causes = this.faliurecausetemp[0];
    this.addFailure = 1;
  }

  closeFirstModal(): void {
    this.modalRef?.hide();
    this.modalRef = null;
  }

  print(): void {
    this.helpFlag = false;
    window.print();
  }

  help(): void {
    this.helpFlag = !this.helpFlag;
  }
}
