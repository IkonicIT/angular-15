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
  modalRef: BsModalRef | null;
  modalRef2: BsModalRef;
  index: number;
  message: string;
  locationsTypes: any;
  order: string = 'name';
  reverse: string = '';
  locationTypeFilter: any = '';
  itemsForPagination: any = 5;
  companyId: number;
  globalCompany: any = {};
  companyName: any;
  currentRole: any;
  highestRank: any;
  helpFlag: any = false;
  userName: any;
  p: any;
  typeFilter: any = '';
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
    this.companyId = this.globalCompany.companyid;
    this.companyName = this.globalCompany.name;
    this.getAllLocTypes();
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value.companyid;
      this.companyName = value.name;
    });
  }

  getAllLocTypes() {
    this.spinner.show();
    this.loader = true;
    this.itemTypesService
      .getAllItemTypes(this.companyId)
      .subscribe((response) => {
        this.spinner.hide();
        this.loader = false;
        this.locationsTypes = response;
        this.locationsTypes.forEach((type: { parentid: any }) => {
          if (!type.parentid) {
            type.parentid = this.companyName;
          }
        });
      });
  }

  ngOnInit() {
    this.currentRole = sessionStorage.getItem('currentRole');
    this.highestRank = sessionStorage.getItem('highestRank');
    console.log('currentRole is' + this.currentRole);
    console.log('highestRank is' + this.highestRank);
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
    this.loader = true;
    this.userName = sessionStorage.getItem('userName');
    this.itemTypesService
      .removeItemType(this.index, this.userName)
      .subscribe((response) => {
        this.spinner.hide();
        this.loader = false
        this.modalRef?.hide();
        this.refreshCalls();
        const currentPage = this.p;
        const locationTypeCount = this.locationsTypes.length - 1;
        const maxPageAvailable = Math.ceil(locationTypeCount / this.itemsForPagination);
        if (currentPage > maxPageAvailable){
          this.p--;
        }
      });
  }

  refreshCalls() {
    this.getAllLocTypes();
    this.getAllItemTypesWithHierarchy();
  }

  getAllItemTypesWithHierarchy() {
    this.spinner.show();
    this.loader = true;
    this.itemTypesService
      .getAllItemTypesWithHierarchy(this.companyId)
      .subscribe((response) => {
        this.spinner.hide();
        this.loader = false;
        this.broadcasterService.itemTypeHierarchy = response;
      });
  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef?.hide();
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

  print() {
    this.helpFlag = false;
    window.print();
  }

  help() {
    this.helpFlag = !this.helpFlag;
  }

  onChange(e : any){
    const currentPage = this.p;
        const itemTypeCount = this.locationsTypes.length - 1;
        const maxPageAvailable = Math.ceil(itemTypeCount / this.itemsForPagination);
        if (currentPage > maxPageAvailable){
          this.p = maxPageAvailable;
        }
  }
}
