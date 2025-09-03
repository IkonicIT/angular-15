import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DomSanitizer } from '@angular/platform-browser';
import { CompanyManagementService } from '../../../services/company-management.service';
import { CompanyTypesService } from '../../../services/company-types.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserTypesService } from '../../../services/user-types.service';

@Component({
  selector: 'app-user-types',
  templateUrl: './user-types.component.html',
  styleUrls: ['./user-types.component.scss'],
})
export class UserTypesComponent implements OnInit {
  modalRef: BsModalRef | null = null;
  index: number | null = null;
  message: string = '';
  userTypes: any[] = [];
  order: string = 'name';
  reverse: string = '';
  userTypeFilter: string = '';
  itemsForPagination: number = 5;
  companyId: number = 0;
  globalCompany: any = {};
  companyName: string = '';
  currentRole: string | null = null;
  highestRank: any; 
  helpFlag: boolean = false;
  userName: string | null = null;
  p: number = 1;
  loader = false;

  constructor(
    private modalService: BsModalService,
    private userTypesService: UserTypesService,
    sanitizer: DomSanitizer,
    private companyManagementService: CompanyManagementService,
    private companyTypesService: CompanyTypesService,
    private spinner: NgxSpinnerService
  ) {
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyId = this.globalCompany?.companyId ?? 0;
    this.companyName = this.globalCompany?.name ?? '';

    this.getAllUserTypes();

    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value?.companyId ?? 0;
      this.companyName = value?.name ?? '';
      this.getAllUserTypes();
    });
  }

  ngOnInit(): void {
    this.currentRole = sessionStorage.getItem('currentRole');
    const highestRankStr = sessionStorage.getItem('highestRank');
    this.highestRank = highestRankStr ? Number(highestRankStr) : null;

    console.log('currentRole is', this.currentRole);
    console.log('highestRank is', this.highestRank);
  }

  getAllUserTypes(): void {
    this.spinner.show();
    this.userTypes = [];

    this.userTypesService.getAllUserTypes(this.companyId).subscribe({
      next: (response) => {
        this.spinner.hide();
        this.userTypes = response;

        const totalUserTypesCount = this.userTypes.length;
        const maxPageAvailable = Math.ceil(totalUserTypesCount / this.itemsForPagination);

        if (this.p > maxPageAvailable) {
          this.p = maxPageAvailable;
        }

        this.userTypes.forEach((type: { parentId?: string }) => {
          if (!type.parentId) {
            type.parentId = this.companyName;
          }
        });
      },
      error: () => {
        this.spinner.hide();
      },
    });
  }

  openModal(template: TemplateRef<any>, id: number): void {
    this.index = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  closeFirstModal(): void {
    this.modalRef?.hide();
    this.modalRef = null;
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();
    this.userName = sessionStorage.getItem('userName');

    if (this.index !== null && this.userName) {
      this.userTypesService.removeUserType(this.index, this.userName).subscribe({
        next: () => {
          this.spinner.hide();
          this.modalRef?.hide();
          this.getAllUserTypes();
        },
        error: () => {
          this.spinner.hide();
        },
      });
    } else {
      this.spinner.hide();
    }
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

  onChange(event: any): void {
    const totalUserTypesCount = this.userTypes.length;
    const maxPageAvailable = Math.ceil(totalUserTypesCount / this.itemsForPagination);

    if (this.p > maxPageAvailable) {
      this.p = maxPageAvailable;
    }
  }
}
