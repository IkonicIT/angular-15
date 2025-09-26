import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CompanyManagementService } from '../../../services/company-management.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocationStatusService } from '../../../services/location-status.service';

@Component({
  selector: 'app-location-status',
  templateUrl: './location-status.component.html',
  styleUrls: ['./location-status.component.scss'],
})
export class LocationStatusComponent implements OnInit {
  statuses: any[] = [];
  companyId: string = '';
  model: any = {};
  documents: any[] = [];
  message: string = '';
  modalRef: BsModalRef | null = null;
  companyName: string = '';
  order: string = 'status';
  reverse: string = '';
  statusFilter: string = '';
  itemsForPagination: number = 5;
  index: number = 0;
  globalCompany: any = {};
  currentRole: string | null = null;
  userName: string = '';
  highestRank: number = 0;
  helpFlag: boolean = false;
  p: number = 1;
  loader: boolean = false;

  constructor(
    private modalService: BsModalService,
    private companyManagementService: CompanyManagementService,
    private locationStatusService: LocationStatusService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyId = String(this.globalCompany?.companyId ?? '');
    this.companyName = this.globalCompany?.name ?? '';

    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = String(value.companyId ?? '');
      this.companyName = value?.name ?? '';
      this.documents = [];
    });

    this.getStatuses();
  }

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('userName') ?? '';
    this.currentRole = sessionStorage.getItem('currentRole');
    const rank = sessionStorage.getItem('highestRank');
    this.highestRank = rank ? Number(rank) : 0;
  }

  getStatuses(): void {
    this.spinner.show();
    this.statuses = [];
    this.locationStatusService.getAllLocationStatuses(this.companyId).subscribe(
      (response: any) => {
        this.spinner.hide();
        this.statuses = Array.isArray(response) ? response : [];
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  addStatus(): void {
    this.router.navigate(['/location/addLocationStatus/']);
  }

  editStatus(status: { statusId: string }): void {
    this.router.navigate(['/location/editLocationStatus/', status.statusId]);
  }

  openModal(template: TemplateRef<any>, id: number): void {
    this.index = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();
    this.locationStatusService.removeLocationStatus(this.index, this.userName).subscribe(
      () => {
        this.spinner.hide();
        this.modalRef?.hide();
        this.getStatuses();

        const currentPage = this.p;
        const statusesCount = this.statuses.length - 1;
        const maxPageAvailable = Math.ceil(statusesCount / this.itemsForPagination);

        if (currentPage > maxPageAvailable) {
          this.p = Math.max(maxPageAvailable, 1);
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

  setOrder(value: string): void {
    if (this.order === value) {
      this.reverse = this.reverse === '' ? '-' : '';
    }
    this.order = value;
  }

  print(): void {
    this.helpFlag = false;
    window.print();
  }

  help(): void {
    this.helpFlag = !this.helpFlag;
  }

  onChange(e: any): void {
    const currentPage = this.p;
    const statusesCount = this.statuses.length - 1;
    const maxPageAvailable = Math.ceil(statusesCount / this.itemsForPagination);

    if (currentPage > maxPageAvailable) {
      this.p = Math.max(maxPageAvailable, 1);
    }
  }
}