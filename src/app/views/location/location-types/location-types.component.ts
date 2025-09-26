import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LocationTypesService } from '../../../services/location-types.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { CompanyTypesService } from '../../../services/company-types.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-location-types',
  templateUrl: './location-types.component.html',
  styleUrls: ['./location-types.component.scss'],
})
export class LocationTypesComponent implements OnInit {
  modalRef: BsModalRef | null = null;
  index: number = 0;
  message: string = '';
  locationsTypes: any[] = [];
  order: string = 'name';
  reverse: string = '';
  locationTypeFilter: string = '';
  itemsForPagination: number = 5;
  companyId: string = '';
  globalCompany: any = {};
  companyName: string = '';
  currentRole: string | null = null;
  highestRank: number = 0;
  helpFlag: boolean = false;
  userName: string = '';
  p: number = 1;
  loader: boolean = false;

  constructor(
    private modalService: BsModalService,
    private locationTypesService: LocationTypesService,
    private companyManagementService: CompanyManagementService,
    private companyTypesService: CompanyTypesService,
    private spinner: NgxSpinnerService
  ) {
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyId = String(this.globalCompany?.companyId ?? '');
    this.companyName = this.globalCompany?.name ?? '';
    this.getAllLocTypes();

    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = String(value.companyId ?? '');
      this.companyName = value?.name ?? '';
    });
  }

  ngOnInit(): void {
    this.currentRole = sessionStorage.getItem('currentRole');
    const rank = sessionStorage.getItem('highestRank');
    this.highestRank = rank ? Number(rank) : 0;
  }

  getAllLocTypes(): void {
    this.spinner.show();
    this.locationsTypes = [];
    this.locationTypesService.getAllLocationTypes(this.companyId).subscribe(
      (response: any) => {
        this.spinner.hide();
        this.locationsTypes = Array.isArray(response) ? response : [];
        this.locationsTypes.forEach((type: { parentId?: string | null }) => {
          if (!type.parentId) {
            type.parentId = this.companyName;
          }
        });
      },
      () => {
        this.spinner.hide();
      }
    );
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
    this.userName = sessionStorage.getItem('userName') ?? '';
    this.locationTypesService.removeLocationType(this.index, this.userName).subscribe(
      () => {
        this.spinner.hide();
        this.modalRef?.hide();
        this.getAllLocTypes();

        const currentPage = this.p;
        const locationTypesCount = this.locationsTypes.length;
        const maxPageAvailable = Math.ceil(
          locationTypesCount / this.itemsForPagination
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
    const locationTypesCount = this.locationsTypes.length;
    const maxPageAvailable = Math.ceil(
      locationTypesCount / this.itemsForPagination
    );

    if (currentPage > maxPageAvailable) {
      this.p = maxPageAvailable;
    }
  }
}