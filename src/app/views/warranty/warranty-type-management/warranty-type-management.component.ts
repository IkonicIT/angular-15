import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CompanyManagementService } from '../../../services/company-management.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { WarrantyManagementService } from '../../../services/warranty-management.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-warranty-type-management',
  templateUrl: './warranty-type-management.component.html',
  styleUrls: ['./warranty-type-management.component.scss'],
})
export class WarrantyTypeManagementComponent implements OnInit {
  modalRef: BsModalRef | null = null;
  modalRef2: BsModalRef | null = null;
  message: string = '';
  warrantyTypes: any[] = [];
  index: number = 0;
  order: string = 'name';
  reverse: string = '';
  warrantyFilter: string = '';
  itemsForPagination: number = 5;
  globalCompany: any;
  companyName: string = '';
  companyId: number | null = null;
  warrantyType: any;
  currentRole: string | null = null;
  highestRank: any;
  helpFlag: boolean = false;
  userName: string | null = null;
  dismissible = true;
  loader = false;
  p: number = 1;
  type: any;

  private subscription!: Subscription;

  constructor(
    private modalService: BsModalService,
    private companyManagementService: CompanyManagementService,
    private warrantyManagementService: WarrantyManagementService,
    private sanitizer: DomSanitizer,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany) {
      this.companyName = this.globalCompany.name;
      this.companyId = this.globalCompany.companyId;
    }

    this.subscription = this.companyManagementService.globalCompanyChange.subscribe(
      (value) => {
        this.globalCompany = value;
        this.companyName = value?.name ?? '';
        this.companyId = value?.companyId ?? null;
      }
    );
  }

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('userName');
    this.spinner.show();

    if (this.companyId != null) {
      this.warrantyManagementService.getAllWarrantyTypes(this.companyId).subscribe({
        next: (response: any) => {
          this.spinner.hide();
          this.warrantyTypes = response;
        },
        error: () => {
          this.spinner.hide();
        },
      });
    }

    this.currentRole = sessionStorage.getItem('currentRole');
    this.highestRank = sessionStorage.getItem('highestRank');
  }

  refresh(): void {
    this.warrantyTypes = [];
    this.spinner.show();

    if (this.companyId != null) {
      this.warrantyManagementService.getAllWarrantyTypes(this.companyId).subscribe({
        next: (response: any) => {
          this.spinner.hide();
          this.warrantyTypes = response;
          const totalWarrantyTypesCount = this.warrantyTypes.length;
          const maxPageAvailable = Math.ceil(totalWarrantyTypesCount / this.itemsForPagination);

          if (this.p > maxPageAvailable) {
            this.p = maxPageAvailable;
          }
        },
        error: () => {
          this.spinner.hide();
        },
      });
    }
  }

  saveWarranty(): void {
    if (!this.warrantyType) {
      this.index = -1;
      window.scroll(0, 0);
      return;
    }

    const req = {
      companyId: this.companyId,
      warrantyType: this.warrantyType,
      warrantyTypeId: 0,
      userName: this.userName,
    };

    this.spinner.show();
    this.warrantyManagementService.saveWarrantyType(req).subscribe({
      next: () => {
        this.warrantyType = undefined;
        this.spinner.hide();
        this.modalRef?.hide();
        this.refresh();
      },
      error: () => {
        this.spinner.hide();
      },
    });
  }

  openModal(template: TemplateRef<any>, id?: number): void {
    if (id != null) {
      this.index = id;
    }
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  openModal2(template: TemplateRef<any>): void {
    this.modalRef2 = this.modalService.show(template, { class: 'second' });
  }

  closeFirstModal(): void {
    this.modalRef?.hide();
    this.modalRef = null;
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();

    this.setWarrantyType(this.index);
    this.warrantyManagementService.removeWarrantyType(
      this.index,
      this.companyId!,
      this.userName ?? '',
      this.warrantyType
    ).subscribe({
      next: () => {
        this.spinner.hide();
        this.modalRef?.hide();
        this.refresh();
      },
      error: () => {
        this.spinner.hide();
      },
    });
  }

  setWarrantyType(warrantyTypeId: number): void {
    this.warrantyTypes.forEach((warrantyType: any) => {
      if (warrantyTypeId === warrantyType.warrantyTypeId) {
        this.warrantyType = warrantyType.warrantyType;
      }
    });
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

  editWarrantyType(warrantyTypeId: number): void {
    this.router.navigate([`warranty/editwarrantyType/${warrantyTypeId}`]);
  }

  help(): void {
    this.helpFlag = !this.helpFlag;
  }

  onChange(e: any): void {
    const currentPage = this.p;
    const warrantyTypesCount = this.warrantyTypes.length - 1;
    const maxPageAvailable = Math.ceil(warrantyTypesCount / this.itemsForPagination);

    if (currentPage > maxPageAvailable) {
      this.p = maxPageAvailable;
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
