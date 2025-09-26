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
  itemTypes: any[] = [];
  model: any = {};
  globalCompany: any = {};
  companyId = 0;
  companyName = '';
  itemType = 0;
  repairItem = '';
  userName = '';
  repairItems: any[] = [];
  repairItemFilter = '';
  itemsForPagination = 5;
  index = 0;
  order = '';
  reverse = '';
  modalRef: BsModalRef | null = null;
  currentRole = '';
  highestRank = 0;
  itemTypeItems: TreeviewItem[] = [];
  message = '';
  helpFlag = false;
  p = 1;
  dismissible = true;
  loader = false;

  constructor(
    private modalService: BsModalService,
    private itemTypesService: ItemTypesService,
    sanitizer: DomSanitizer,
    private companyManagementService: CompanyManagementService,
    private spinner: NgxSpinnerService,
    private itemRepairItemsService: ItemRepairItemsService,
    private router: Router,
    private broadcasterService: BroadcasterService
  ) {
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany) {
      this.companyId = this.globalCompany.companyId;
      this.companyName = this.globalCompany.name;
      this.getAllItemTypes();
    }

    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value.companyId;
      this.companyName = value.name;
    });
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName') ?? '';
    this.currentRole = sessionStorage.getItem('currentRole') ?? '';
    this.highestRank = Number(sessionStorage.getItem('highestRank') ?? 0);
  }

  getAllItemTypes() {
    this.itemTypes = this.broadcasterService.itemTypeHierarchy ?? [];
    if (this.itemTypes.length > 0) {
      this.itemTypeItems = this.generateHierarchyForItemTypes(this.itemTypes);
    }
  }

  generateHierarchyForItemTypes(typeList: any[]): TreeviewItem[] {
    return typeList.map((type) => {
      const children = type.typeList?.length
        ? this.generateHierarchyForItemTypes(type.typeList)
        : [];
      return new TreeviewItem({
        text: type.name,
        value: type.typeId,
        collapsed: true,
        children,
      });
    });
  }

  getRepairItems() {
    if (this.itemType) {
      this.spinner.show();
      this.itemRepairItemsService
        .getAllItemRepairItems(String(this.companyId), String(this.itemType))
        .subscribe((response) => {
          this.spinner.hide();
          this.repairItems = Array.isArray(response) ? response : [];
        });
    }
  }

  openModal(template: TemplateRef<any>, id: number) {
    if (this.itemType) {
      this.index = id;
      this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
    } else {
      this.index = -1;
    }
  }

  saveRepairItem() {
    if (!this.repairItem) {
      this.index = -1;
      return;
    }

    this.spinner.show();
    const request = {
      lastModifiedBy: this.userName,
      companyId: this.companyId,
      repairDescription: this.repairItem,
      repairId: 0,
      typeId: this.itemType,
    };

    this.itemRepairItemsService.saveRepairItemType(request).subscribe(() => {
      this.repairItem = '';
      this.spinner.hide();
      this.modalRef?.hide();
      this.getRepairItems();
    });
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = this.reverse === '' ? '-' : '';
    }
    this.order = value;
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();

    this.itemRepairItemsService.removeRepairItem(this.index).subscribe(
      () => {
        this.spinner.hide();
        this.modalRef?.hide();
        this.getRepairItems();

        const repairItemsCount = this.repairItems.length - 1;
        const maxPageAvailable = Math.ceil(
          repairItemsCount / this.itemsForPagination
        );

        if (this.p > maxPageAvailable) {
          this.p = maxPageAvailable;
        }
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef?.hide();
  }

  editItemRepairItem(repairId: string) {
    this.router.navigate(['items/editItemRepairItem/' + repairId]);
  }

  print() {
    this.helpFlag = false;
    window.print();
  }

  help() {
    this.helpFlag = !this.helpFlag;
  }

  onChange() {
    const repairItemsCount = this.repairItems.length;
    const maxPageAvailable = Math.ceil(
      repairItemsCount / this.itemsForPagination
    );

    if (this.p > maxPageAvailable) {
      this.p = maxPageAvailable;
    }
  }
}
