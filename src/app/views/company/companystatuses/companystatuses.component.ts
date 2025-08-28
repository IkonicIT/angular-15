import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';

import { CompanyStatusesService } from '../../../services/index';
import { CompanyManagementService } from '../../../services/company-management.service';

@Component({
  selector: 'app-companystatuses',
  templateUrl: './companystatuses.component.html',
  styleUrls: ['./companystatuses.component.scss'],
})
export class CompanystatusesComponent implements OnInit {
  statuses: any[] = [];
  companyId!: string;
  model: any;
  index: string = 'companydocument';
  documents: any[] = [];
  message: string = '';
  modalRef!: BsModalRef;
  companyName: string = '';
  order: string = 'status';
  reverse: string = '';
  statusFilter: any = '';
  itemsForPagination: number = 5;
  index1: number = 0;
  globalCompany: any = {};
  currentRole: any;
  highestRank: any;
  userName: any;
  helpFlag: boolean = false;
  dismissible = true;
  p: number = 1;
  loader = false;

  constructor(
    private modalService: BsModalService,
    private companyManagementService: CompanyManagementService,
    private companyStatusService: CompanyStatusesService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyId = this.globalCompany.companyId;
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = this.globalCompany.companyId;
      this.documents = [];
    });
    this.getStatuses();
  }

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('userName');
    this.currentRole = sessionStorage.getItem('currentRole');
    this.highestRank = sessionStorage.getItem('highestRank');
    console.log('currentRole is ' + this.currentRole);
    console.log('highestRank is ' + this.highestRank);
  }

  getStatuses(): void {
    this.spinner.show();
    this.statuses = [];
    this.companyStatusService.getAllCompanyStatuses(this.companyId).subscribe(
      (response) => {
        this.spinner.hide();
        console.log(response);
        this.statuses = response;
        const totalWarrantyTypesCount = this.statuses.length;
        const maxPageAvailable = Math.ceil(
          totalWarrantyTypesCount / this.itemsForPagination
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

  addStatus(): void {
    this.router.navigate(['/company/addStatus/']);
  }

  editStatus(status: { statusId: string }): void {
    console.log('statusId=' + status.statusId);
    this.router.navigate(['/company/editStatus/'], {
      queryParams: { q: status.statusId },
    });
  }

  openModal(template: TemplateRef<any>, id: string): void {
    console.log(id);
    this.index = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();
    console.log(this.index);
    this.companyStatusService
      .removeCompanyStatus(this.index, this.userName)
      .subscribe(
        () => {
          this.spinner.hide();
          this.modalRef.hide();
          this.index1 = 1;
          setTimeout(() => {
            this.index1 = 0;
          }, 7000);
          this.getStatuses();

          const currentPage = this.p;
          const statusesCount = this.statuses.length - 1;
          const maxPageAvailable = Math.ceil(
            statusesCount / this.itemsForPagination
          );
          if (currentPage > maxPageAvailable) {
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
    this.modalRef.hide();
  }

  setOrder(value: string): void {
    if (this.order === value) {
      this.reverse = this.reverse === '' ? '-' : '';
    }
    this.order = value;
  }

  help(): void {
    this.helpFlag = !this.helpFlag;
  }

  onChange(e: any): void {
    const currentPage = this.p;
    const statusCount = this.statuses.length;
    const maxPageAvailable = Math.ceil(statusCount / this.itemsForPagination);
    if (currentPage > maxPageAvailable) {
      this.p = maxPageAvailable;
    }
  }
}
