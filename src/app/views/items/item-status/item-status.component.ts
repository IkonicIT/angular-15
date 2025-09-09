import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CompanyManagementService } from '../../../services/company-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ItemStatusService } from '../../../services/Items/item-status.service';

@Component({
  selector: 'app-item-status',
  templateUrl: './item-status.component.html',
  styleUrls: ['./item-status.component.scss'],
})
export class ItemStatusComponent implements OnInit {
  statuses: any[] = [];
  documents: any[] = [];

  companyId: number | null = null;
  companyName: string = '';
  globalCompany: any = {};

  userName: string | null = null;
  currentRole: string | null = null;
  highestRank: string | null | undefined;

  order: string = 'status';
  reverse: string = '';
  statusFilter: string = '';
  itemsForPagination = 5;
  p = 1;

  index: number = 0;
  message: string = '';
  helpFlag = false;

  modalRef?: BsModalRef;
  loader = false;

  constructor(
    private modalService: BsModalService,
    private companyManagementService: CompanyManagementService,
    private itemStatusService: ItemStatusService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany) {
      this.companyId = this.globalCompany.companyId;
      this.companyName = this.globalCompany.name;
    }

    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = this.globalCompany.companyId;
      this.companyName = this.globalCompany.name;
      this.documents = [];
    });

    this.getStatuses();
  }

  get highestRankNum(): number {
    return Number(this.highestRank ?? 0);
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName');
    this.currentRole = sessionStorage.getItem('currentRole');
    this.highestRank = sessionStorage.getItem('highestRank');

    
    
  }

  getStatuses() {
    if (!this.companyId) return;
    this.spinner.show();
    this.itemStatusService.getAllItemStatuses(String(this.companyId)).subscribe(
      (response: any) => {
        this.spinner.hide();
        this.statuses = Array.isArray(response) ? response : [];
      },
      () => this.spinner.hide()
    );
  }

  addStatus() {
    this.router.navigate(['/items/addItemStatus/']);
  }

  editStatus(status: { statusId: string }) {
    this.router.navigate(['/items/editItemStatus/' + status.statusId]);
  }

  openModal(template: TemplateRef<any>, id: number) {
    this.index = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  confirm(): void {
    if (!this.index || !this.userName) return;
    this.message = 'Confirmed!';
    this.spinner.show();
    this.itemStatusService.removeItemStatus(this.index, this.userName).subscribe(
      () => {
        this.spinner.hide();
        this.modalRef?.hide();
        this.getStatuses();
        this.adjustPagination();
      },
      () => this.spinner.hide()
    );
  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef?.hide();
  }

  setOrder(value: string) {
    this.reverse = this.order === value && this.reverse === '' ? '-' : '';
    this.order = value;
  }

  help() {
    this.helpFlag = !this.helpFlag;
  }

  onChange() {
    this.adjustPagination();
  }

  private adjustPagination() {
    const statusCount = this.statuses.length - 1;
    const maxPageAvailable = Math.ceil(statusCount / this.itemsForPagination);
    if (this.p > maxPageAvailable) {
      this.p = maxPageAvailable > 0 ? maxPageAvailable : 1;
    }
  }
}
