import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ItemTypesService } from '../../../services/Items/item-types.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CompanyManagementService } from '../../../services/company-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BroadcasterService } from '../../../services/broadcaster.service';

@Component({
  selector: 'app-item-types',
  templateUrl: './item-types.component.html',
  styleUrls: ['./item-types.component.scss'],
})
export class ItemTypesComponent implements OnInit {
  modalRef: BsModalRef | null = null;
  index = 0;
  message = '';
  locationsTypes: any[] = [];
  order = 'name';
  reverse = '';
  locationTypeFilter = '';
  itemsForPagination = 5;
  companyId = 0;
  globalCompany: any = {};
  companyName = '';
  currentRole = '';
  highestRank?: string | null;
  get highestRankNum(): number {
    return Number(this.highestRank ?? 0);
  }
  helpFlag = false;
  userName = '';
  p = 1;
  typeFilter = '';
  loader = false;

  constructor(
    private modalService: BsModalService,
    private itemTypesService: ItemTypesService,
    sanitizer: DomSanitizer,
    private companyManagementService: CompanyManagementService,
    private spinner: NgxSpinnerService,
    private broadcasterService: BroadcasterService
  ) {
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany) {
      this.companyId = this.globalCompany.companyId;
      this.companyName = this.globalCompany.name;
    }

    this.getAllLocTypes();

    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value.companyId;
      this.companyName = value.name;
    });
  }

  ngOnInit() {
    this.currentRole = sessionStorage.getItem('currentRole') || '';
    this.highestRank = sessionStorage.getItem('highestRank') || '';
  }

  getAllLocTypes() {
    this.spinner.show();

    this.itemTypesService.getAllItemTypes(this.companyId).subscribe((response) => {
      this.spinner.hide();
      this.locationsTypes = Array.isArray(response) ? response : [];;

      this.locationsTypes.forEach((type: { parentId: any }) => {
        if (!type.parentId) {
          type.parentId = this.companyName;
        }
      });
    });
  }

  openModal(template: TemplateRef<any>, id: number) {
    this.index = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  closeFirstModal() {
    this.modalRef?.hide();
    this.modalRef = null;
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();

    this.userName = sessionStorage.getItem('userName') || '';
    this.itemTypesService.removeItemType(this.index, this.userName).subscribe(() => {
      this.spinner.hide();
      this.modalRef?.hide();
      this.refreshCalls();

      const locationTypeCount = this.locationsTypes.length - 1;
      const maxPageAvailable = Math.ceil(locationTypeCount / this.itemsForPagination);

      if (this.p > maxPageAvailable) {
        this.p = maxPageAvailable;
      }
    });
  }

  refreshCalls() {
    this.getAllLocTypes();
    this.getAllItemTypesWithHierarchy();
  }

  getAllItemTypesWithHierarchy() {
    this.spinner.show();

    this.itemTypesService.getAllItemTypesWithHierarchy(this.companyId).subscribe((response) => {
      this.spinner.hide();
      this.broadcasterService.itemTypeHierarchy = response;
    });
  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef?.hide();
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = this.reverse === '' ? '-' : '';
    }
    this.order = value;
  }

  print() {
    this.helpFlag = false;
    window.print();
  }

  help() {
    this.helpFlag = !this.helpFlag;
  }

  onChange(e: any) {
    const itemTypeCount = this.locationsTypes.length;
    const maxPageAvailable = Math.ceil(itemTypeCount / this.itemsForPagination);
    if (this.p > maxPageAvailable) {
      this.p = maxPageAvailable;
    }
  }
}
