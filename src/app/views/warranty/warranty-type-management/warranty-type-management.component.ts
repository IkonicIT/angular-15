import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CompanyManagementService } from '../../../services/company-management.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { WarrantyManagementService } from '../../../services/warranty-management.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-warranty-type-management',
  templateUrl: './warranty-type-management.component.html',
  styleUrls: ['./warranty-type-management.component.scss'],
})
export class WarrantyTypeManagementComponent implements OnInit {
  modalRef: BsModalRef | null;
  modalRef2: BsModalRef;
  message: string;
  warrantyTypes: any[] = [];
  index: number;
  order: string = 'name';
  reverse: string = '';
  warrantyFilter: any = '';
  itemsForPagination: any = 5;
  globalCompany: any;
  companyName: any;
  companyId: any;
  warrantyType: any;
  currentRole: any;
  highestRank: any;
  router: Router;
  helpFlag: any = false;
  userName: any;
  dismissible = true;
  loader = false;
  p: any;
  type: any;
  constructor(
    private modalService: BsModalService,
    private companyManagementService: CompanyManagementService,
    private warrantyManagementService: WarrantyManagementService,
    sanitizer: DomSanitizer,
    private spinner: NgxSpinnerService,
    router: Router
  ) {
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyName = this.globalCompany.name;
    this.companyId = this.globalCompany.companyid;
    this.router = router;
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyName = value.name;
      this.companyId = value.companyid;
    });
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName');
    this.spinner.show();

    this.warrantyManagementService
      .getAllWarrantyTypes(this.companyId)
      .subscribe(
        (response: any) => {
          this.spinner.hide();

          this.warrantyTypes = response;
        },
        (error) => {
          this.spinner.hide();
        }
      );
    this.currentRole = sessionStorage.getItem('currentRole');
    this.highestRank = sessionStorage.getItem('highestRank');
  }

  refresh() {
    this.warrantyTypes = [];
    this.spinner.show();

    this.warrantyManagementService
      .getAllWarrantyTypes(this.companyId)
      .subscribe(
        (response: any) => {
          this.spinner.hide();

          this.warrantyTypes = response;
          const totalWarrantyTypesCount = this.warrantyTypes.length;
          const maxPageAvailable = Math.ceil(
            totalWarrantyTypesCount / this.itemsForPagination
          );

          // Check if the current page exceeds the maximum available page
          if (this.p > maxPageAvailable) {
            this.p = maxPageAvailable;
          }
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }

  saveWarraty() {
    if (!this.warrantyType) {
      this.index = -1;
      window.scroll(0, 0);
    } else {
      var req = {
        companyid: this.companyId,
        warrantytype: this.warrantyType,
        warrantytypeid: 0,
        userName: this.userName,
      };
      this.spinner.show();

      this.warrantyManagementService.saveWarrantyType(req).subscribe(
        (response) => {
          this.warrantyType = undefined;
          this.spinner.hide();

          this.modalRef?.hide();
          this.refresh();
        },
        (error) => {
          this.spinner.hide();
        }
      );
    }
  }

  openModal(template: TemplateRef<any>, id?: any) {
    this.index = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  openModal2(template: TemplateRef<any>) {
    this.modalRef2 = this.modalService.show(template, { class: 'second' });
  }

  closeFirstModal() {
    this.modalRef?.hide();
    this.modalRef = null;
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();

    this.setwarrantyType(this.index);
    this.warrantyManagementService
      .removeWarrantyType(
        this.index,
        this.companyId,
        this.userName,
        this.warrantyType
      )
      .subscribe(
        (response) => {
          this.spinner.hide();

          this.modalRef?.hide();
          this.refresh();
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }

  setwarrantyType(warrantyTypeId: any) {
    this.warrantyTypes.forEach((warrantyType: any) => {
      if (warrantyTypeId == warrantyType.warrantytypeid)
        this.warrantyType = warrantyType.warrantytype;
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

  editWarrantyType(warrantytypeid: string) {
    this.router.navigate(['warranty/editwarrantytype/' + warrantytypeid]);
  }

  help() {
    this.helpFlag = !this.helpFlag;
  }
  onChange(e: any) {
    const currentPage = this.p;
    const warrentytypesCount = this.warrantyTypes.length - 1;
    const maxPageAvailable = Math.ceil(
      warrentytypesCount / this.itemsForPagination
    );
    if (currentPage > maxPageAvailable) {
      this.p = maxPageAvailable;
    }
  }
}
