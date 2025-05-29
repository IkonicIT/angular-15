import { Component, OnInit, TemplateRef } from '@angular/core';
import { CompanyManagementService } from '../../../services/company-management.service';
import { ItemTypesService } from '../../../services/Items/item-types.service';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ItemRepairItemsService } from '../../../services/Items/item-repair-items.service';

@Component({
  selector: 'app-failuretypemanagement',
  templateUrl: './failuretypemanagement.component.html',
  styleUrls: ['./failuretypemanagement.component.scss'],
})
export class FailuretypemanagementComponent implements OnInit {
  failuretype: any;
  failureTypeId: any;
  causes: any;
  editEnable: number;
  faliurecausetemp: any;
  highestRank: any;
  index: any = 0;
  addFailure: any = 0;
  types: any[] = [];
  atts: any[] = [];
  router: Router;
  message: string;
  companyId: string = '0';
  companyName: string = '';
  typeId: string;
  itemType: string = '';
  itemTypeOne: any;
  listItem: any;
  userName: any;
  itemTypes: any = [];
  model: any = {};
  failureTypes: any = [];
  failurecauses: any = [];
  selectedAttrType: any = {};
  globalCompany: any;
  //addFlag:any = false;
  editDeleteFlag: any = false;
  addEditFlag: any = false;
  newFlag: any = false;
  failureTypesandcauses: any = {};
  failureTypeAndCausesPayload: any = {};
  modalRef: BsModalRef | null;
  value: any;
  helpFlag: any = false;
  dismissible = true;
  items: TreeviewItem[];
  config = TreeviewConfig.create({
    hasFilter: false,
    hasCollapseExpand: false,
  });
  loader = false;

  constructor(
    private companyManagementService: CompanyManagementService,
    router: Router,
    private spinner: NgxSpinnerService,
    private itemTypesService: ItemTypesService,
    private itemRepairItemsService: ItemRepairItemsService,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName');
    this.highestRank = sessionStorage.getItem('highestRank');
    if (this.companyId == '0') {
      this.globalCompany = this.companyManagementService.getGlobalCompany();
      if (this.globalCompany) {
        this.companyName = this.globalCompany.name;
        this.companyId = this.globalCompany.companyid;
      }
    }
    this.pageLoadCalls(this.companyId);
    this.companyManagementService
      .getCompanyDetails(this.companyId)
      .subscribe((response: any) => {
        this.companyName = response.name;
      });
    this.model.name = 'type';
  }

  pageLoadCalls(companyId: string) {
    this.spinner.show();

    this.itemTypesService
      .getAllItemTypesWithHierarchy(companyId)
      .subscribe((response) => {
        this.itemTypes = response;
        var self = this;
        if (this.itemTypes && this.itemTypes.length > 0) {
          self.items = this.generateHierarchy(this.itemTypes);
        }
        this.spinner.hide();
      });
  }

  generateHierarchy(typeList: any[]) {
    var items: TreeviewItem[] = [];

    if (typeList.length > 0) {
      typeList.forEach((type) => {
        var children: TreeviewItem[] = [];
        if (type.typeList && type.typeList.length > 0) {
          children = this.generateHierarchy(type.typeList);
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
    }
    return items;
  }

  onValueChange(value: any) {
    this.value = value;

    if (this.value != undefined) {
      this.newFlag = true;
      this.failuretype = '';
      this.failureTypeId = 0;
      this.editDeleteFlag = false;
      this.faliurecausetemp = [];
      this.failurecauses = [];
      this.getFailureTypes(value);
    }
  }

  getFailureTypes(typeId: string) {
    this.spinner.show();

    this.itemRepairItemsService
      .getAllFailureTypes(this.companyId, typeId)
      .subscribe((response) => {
        this.failureTypesandcauses = response;
        this.failureTypes = Object.keys(this.failureTypesandcauses);
        this.spinner.hide();
      });
  }

  getCausesForFailureType(failureType: string) {
    this.failuretype = failureType.split('_')[0];
    this.failureTypeId = failureType.split('_')[1];
    let faliurecausetemp = this.failureTypesandcauses[failureType];
    this.faliurecausetemp = this.failureTypesandcauses[failureType];
    this.failurecauses = faliurecausetemp[0].split('\n');
  }

  addFailureTypeAndCauses() {
    this.addEditFlag = true;
    this.newFlag = false;
    this.addFailure = 1;
    this.editEnable = 0;
    this.editDeleteFlag = false;
    this.failureTypesandcauses = {};
    this.failureTypes = [];
    this.failurecauses = [];
    this.model.failuretype = '';
    this.model.causes = '';
  }

  saveFailureTypeAndCauses() {
    this.typeId = this.value;
    this.spinner.show();

    if (this.model.failuretype && this.typeId != undefined) {
      var request = {
        itemtypeid: this.typeId,
        description: this.model.failuretype,
        lastmodifiedby: this.userName,
        companyId: this.companyId,
        causes: this.model.causes != null ? this.model.causes : '',
      };
      this.itemRepairItemsService
        .saveFailureTypeAndCauses(request)
        .subscribe((response) => {
          this.spinner.hide();

          this.index = 1;
          setTimeout(() => {
            this.index = 0;
          }, 7000);
          window.scroll(0, 0);
          this.failureTypeAndCausesPayload = response;
          this.newFlag = false;
          this.model.failuretype = null;
          this.model.causes = null;
          this.value = null;
          this.failuretype = null;
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

  updateFailureTypeAndCauses() {
    this.typeId = this.value;
    this.causes = this.model.causes;

    this.failureTypeId = parseInt(this.failureTypeId);
    this.spinner.show();

    if (this.model.failuretype && this.typeId != undefined) {
      var request = {
        failuretypeid: this.failureTypeId,
        itemtypeid: this.typeId,
        lastmodifiedby: this.userName,
        companyId: this.companyId,
        description: this.model.failuretype,
        causes: this.model.causes != null ? this.model.causes : '',
      };
      this.itemRepairItemsService
        .updateFailureTypeAndCauses(request, this.failureTypeId)
        .subscribe((response) => {
          this.spinner.hide();

          this.index = 2;
          setTimeout(() => {
            this.index = 0;
          }, 7000);
          window.scroll(0, 0);
          this.failureTypeAndCausesPayload = response;
        });
      this.spinner.hide();

      this.newFlag = false;
      this.addFailure = 0;
      this.model.failuretype = null;
      this.model.causes = null;
      this.value = null;
      this.failuretype = null;
      this.failureTypesandcauses = {};
      this.failureTypes = [];
      this.failurecauses = [];
      this.editEnable = 0;
    } else {
      this.spinner.hide();

      window.scroll(0, 0);
      this.index = -1;
    }
  }

  openModal(template: TemplateRef<any>, id: any) {
    this.failureTypeId = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();

    this.typeId = this.value;
    this.spinner.show();

    this.itemRepairItemsService
      .deleteFailureTypeAndCauses(
        this.failureTypeId,
        this.companyId,
        this.userName
      )
      .subscribe((response) => {
        this.spinner.hide();

        this.index = 3;
        setTimeout(() => {
          this.index = 0;
        }, 7000);
        window.scroll(0, 0);
        this.failureTypeAndCausesPayload = response;
      });
    this.spinner.hide();

    this.modalRef?.hide();
    this.addFailure = 0;
    this.model.failuretype = null;
    this.model.causes = null;
    this.value = null;
    this.failuretype = null;
    this.failureTypesandcauses = {};
    this.failureTypes = [];
    this.failurecauses = [];
    this.newFlag = 'false';
  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef?.hide();
  }

  cancelAdd() {
    this.addFailure = 0;
    this.addEditFlag = false;
    this.editEnable = 0;
    this.newFlag = false;
    this.model.failuretype = null;
    this.model.causes = null;
    this.value = null;
    this.failuretype = null;
    this.failureTypesandcauses = {};
    this.failureTypes = [];
    this.failurecauses = [];
  }

  editFailureType(failureType: string) {
    this.addEditFlag = false;
    this.editDeleteFlag = false;
    this.editEnable = 1;
    this.model.failuretype = this.failuretype || failureType.split('_')[0];
    this.model.causes = this.faliurecausetemp[0];
    this.value = this.value;
    this.addFailure = 1;
  }

  closeFirstModal() {
    this.modalRef?.hide();
    this.modalRef = null;
  }

  print() {
    this.helpFlag = false;
    window.print();
  }

  help() {
    this.helpFlag = !this.helpFlag;
  }
}
