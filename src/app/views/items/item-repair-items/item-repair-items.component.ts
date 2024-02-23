import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ItemTypesService } from '../../../services/Items/item-types.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CompanyManagementService } from '../../../services/company-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ItemRepairItemsService } from '../../../services/Items/item-repair-items.service';
import { Router } from '@angular/router';
import { BroadcasterService } from '../../../services/broadcaster.service';
import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';

@Component({
  selector: 'app-item-repair-items',
  templateUrl: './item-repair-items.component.html',
  styleUrls: ['./item-repair-items.component.scss'],
})
export class ItemRepairItemsComponent implements OnInit {
  itemTypes: any;
  model: any;
  globalCompany: any;
  companyId: any;
  companyName: any;
  itemType: any = '';
  repairItem: any;
  userName: any;
  repairItems: any;
  repairItemFilter: any;
  itemsForPagination: any = 5;
  index: number;
  order: string = '';
  reverse: string = '';
  modalRef: BsModalRef;
  router: Router;
  currentRole: any;
  highestRank: any;
  itemTypeItems: TreeviewItem[];
  message: string;
  helpFlag: any = false;
  p: any;
  dismissible = true;
  loader = false;
  constructor(
    private modalService: BsModalService,
    private itemTypesService: ItemTypesService,
    sanitizer: DomSanitizer,
    private companyManagementService: CompanyManagementService,
    private spinner: NgxSpinnerService,
    private itemReairItemsService: ItemRepairItemsService,
    router: Router,
    private broadcasterService: BroadcasterService
  ) {
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.router = router;
    if (this.globalCompany) {
      this.companyId = this.globalCompany.companyid;
      this.companyName = this.globalCompany.name;
      this.getAllItemTypes();
    }
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value.companyid;
      this.companyName = value.name;
    });
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName');
    this.currentRole = sessionStorage.getItem('currentRole');
    this.highestRank = sessionStorage.getItem('highestRank');
    console.log('currentRole is' + this.currentRole);
    console.log('highestRank is' + this.highestRank);
  }

  getAllItemTypes() {
    this.itemTypes = this.broadcasterService.itemTypeHierarchy;
    if (this.itemTypes && this.itemTypes.length > 0) {
      this.itemTypeItems = this.generateHierarchyForItemTypes(this.itemTypes);
    }
  }
  generateHierarchyForItemTypes(typeList: any[]) {
    var items: TreeviewItem[] = [];
    typeList.forEach((type) => {
      var children: TreeviewItem[] = [];
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

  getRepairItems() {
    if (this.itemType != '' && this.itemType != undefined) {
      this.spinner.show();
      this.loader = true;
      this.itemReairItemsService
        .getAllItemRepairItems(this.companyId, this.itemType)
        .subscribe((response) => {
          this.spinner.hide();
          this.loader = false;
          this.repairItems = response;
        });
    }
  }

  openModal(template: TemplateRef<any>, id: number) {
    if (this.itemType && this.itemType != '') {
      this.index = id;
      this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
    } else {
      this.index = -1;
    }
  }

  saveRepairItem() {
    if (this.repairItem === undefined) {
      this.index = -1;
    } else {
      this.spinner.show();
      this.loader = true;
      var request = {
        lastmodifiedby: this.userName,
        companyid: this.companyId,
        repairdescription: this.repairItem,
        repairid: 0,
        typeid: this.itemType,
      };
      this.itemReairItemsService
        .saveRepairItemType(request)
        .subscribe((response) => {
          this.repairItem = undefined;
          this.spinner.hide();
          this.loader = false;
          this.modalRef.hide();
          this.getRepairItems();
        });
    }
  }

  setOrder(value: string) {
    if (this.order === value) {
      if (this.reverse == '') {
        this.reverse = '-';
      } else {
        this.reverse = '';
      }
    }
    this.order = value;
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();
    this.loader = true;
    this.itemReairItemsService.removeRepairItem(this.index).subscribe(
      (response) => {
        this.spinner.hide();
        this.loader = false;
        this.modalRef.hide();
        this.getRepairItems();
        const currentPage = this.p;
    const repairItemsCount = this.repairItems.length - 1;
    const maxPageAvailable = Math.ceil(repairItemsCount / this.itemsForPagination);
    if (currentPage > maxPageAvailable){
      this.p = maxPageAvailable;
    }
      },
      (error) => {
        this.spinner.hide();
        this.loader = false;
      }
    );
  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef.hide();
  }

  editItemrepairItem(repairid: string) {
    this.router.navigate(['items/editItemRepairItem/' + repairid]);
  }

  print() {
    this.helpFlag = false;
    window.print();
  }

  help() {
    this.helpFlag = !this.helpFlag;
  }

  onChange(e: any) {
    const currentPage = this.p;
    const repairItemsCount = this.repairItems.length - 1;
    const maxPageAvailable = Math.ceil(repairItemsCount / this.itemsForPagination);
    if (currentPage > maxPageAvailable){
      this.p = maxPageAvailable;
    }
  }
}
