import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LocationManagementService } from '../../../services/location-management.service';
import { DomSanitizer } from '@angular/platform-browser';
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
  modalRef: BsModalRef | null;
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
  loader = false;
  constructor(
    private modalService: BsModalService,
    private locationTypesService: LocationTypesService,
    sanitizer: DomSanitizer,
    private companyManagementService: CompanyManagementService,
    private companyTypesService: CompanyTypesService,
    private spinner: NgxSpinnerService
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

    this.locationsTypes = [];
    this.locationTypesService.getAllLocationTypes(this.companyId).subscribe(
      (response) => {
        this.spinner.hide();

        this.locationsTypes = response;
        this.locationsTypes.forEach((type: { parentid: any }) => {
          if (!type.parentid) {
            type.parentid = this.companyName;
          }
        });
      },
      (error) => {
        this.spinner.hide();
      }
    );
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

    this.userName = sessionStorage.getItem('userName');
    this.locationTypesService
      .removeLocationType(this.index, this.userName)
      .subscribe(
        (response) => {
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
        (error) => {
          this.spinner.hide();
        }
      );
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

  onChange(e: any) {
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
