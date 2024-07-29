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
  modalRef: BsModalRef | null;
  index: number;
  message: string;
  userTypes: any;
  order: string = 'name';
  reverse: string = '';
  userTypeFilter: any = '';
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
    private userTypesService: UserTypesService,
    sanitizer: DomSanitizer,
    private companyManagementService: CompanyManagementService,
    private companyTypesService: CompanyTypesService,
    private spinner: NgxSpinnerService
  ) {
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyId = this.globalCompany.companyid;
    this.companyName = this.globalCompany.name;
    this.getAllUserTypes();
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value.companyid;
      this.companyName = value.name;
      this.getAllUserTypes();
    });
  }

  getAllUserTypes() {
    this.spinner.show();
    this.loader = true;
    this.userTypes = [];
    this.userTypesService.getAllUserTypes(this.companyId).subscribe(
      (response) => {
        this.spinner.hide();
        this.loader = false;
        this.userTypes = response;
        const totalWarrantyTypesCount = this.userTypes.length;
        const maxPageAvailable = Math.ceil(
          totalWarrantyTypesCount / this.itemsForPagination
        );
        // Check if the current page exceeds the maximum available page
        if (this.p > maxPageAvailable) {
          this.p = maxPageAvailable;
        }
        this.userTypes.forEach((type: { parentid: any }) => {
          if (!type.parentid) {
            type.parentid = this.companyName;
          }
        });
      },
      (error) => {
        this.spinner.hide();
        this.loader = false;
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
    this.loader = true;
    this.userName = sessionStorage.getItem('userName');
    this.userTypesService.removeUserType(this.index, this.userName).subscribe(
      (response) => {
        this.spinner.hide();
        this.loader = false;
        this.modalRef?.hide();
        this.getAllUserTypes();
      },
      (error) => {
        this.spinner.hide();
        this.loader = false;
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
}
