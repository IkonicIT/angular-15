import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CompanyManagementService } from '../../../services/company-management.service';
import { LocationStatusService } from '../../../services/location-status.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ItemStatusService } from '../../../services/Items/item-status.service';

@Component({
  selector: 'app-item-status',
  templateUrl: './item-status.component.html',
  styleUrls: ['./item-status.component.scss'],
})
export class ItemStatusComponent implements OnInit {
  statuses: any[] = [];
  companyId: string;
  model: any;
  documents: any[] = [];
  router: Router;
  message: string;
  userName: any;
  modalRef: BsModalRef;
  companyName: string = '';
  order: string = 'status';
  reverse: string = '';
  statusFilter: any = '';
  itemsForPagination: any = 5;
  index: number;
  globalCompany: any = {};
  currentRole: any;
  highestRank: any;
  helpFlag: any = false;
  p: any;
  loader = false;
  constructor(
    private modalService: BsModalService,
    private companyManagementService: CompanyManagementService,
    private itemStatusService: ItemStatusService,
    router: Router,
    route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.router = router;
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyId = this.globalCompany.companyId;
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = this.globalCompany.companyId;
      this.documents = [];
    });
    this.getStatuses();
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName');
    this.currentRole = sessionStorage.getItem('currentRole');
    this.highestRank = sessionStorage.getItem('highestRank');
    console.log('currentRole is' + this.currentRole);
    console.log('highestRank is' + this.highestRank);
  }

  getStatuses() {
    this.spinner.show();

    this.itemStatusService
      .getAllItemStatuses(this.companyId)
      .subscribe((response: any) => {
        this.spinner.hide();

        console.log(response);
        this.statuses = response;
      });
  }

  addStatus() {
    this.router.navigate(['/items/addItemStatus/']);
  }

  editStatus(status: { statusId: string }) {
    console.log('statusId=' + status.statusId);
    this.router.navigate(['/items/editItemStatus/' + status.statusId]);
  }

  openModal(template: TemplateRef<any>, id: number) {
    this.index = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();

    this.itemStatusService
      .removeItemStatus(this.index, this.userName)
      .subscribe((response) => {
        this.spinner.hide();

        this.modalRef.hide();
        this.getStatuses();
        const currentPage = this.p;
        const statusCount = this.statuses.length - 1;
        const maxPageAvailable = Math.ceil(
          statusCount / this.itemsForPagination
        );
        if (currentPage > maxPageAvailable) {
          this.p = maxPageAvailable;
        }
      });
  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef.hide();
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

  help() {
    this.helpFlag = !this.helpFlag;
  }
  onChange(e: any) {
    const currentPage = this.p;
    const statusCount = this.statuses.length - 1;
    const maxPageAvailable = Math.ceil(statusCount / this.itemsForPagination);
    if (currentPage > maxPageAvailable) {
      this.p = maxPageAvailable;
    }
  }
}
