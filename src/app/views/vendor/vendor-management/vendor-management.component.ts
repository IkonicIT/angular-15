import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Company } from '../../../models/company';
import { CompanyManagementService } from '../../../services/company-management.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vendor-management',
  templateUrl: './vendor-management.component.html',
  styleUrls: ['./vendor-management.component.scss'],
})
export class VendorManagementComponent implements OnInit {
  modalRef: BsModalRef | null;
  modalRef2: BsModalRef;
  message: string;
  vendors: any;
  index: number;
  order: string = 'name';
  reverse: string = '';
  vendorFilter: any = '';
  itemsForPagination: any = 5;
  globalCompany: any;
  companyName: any;
  companyId: any;
  currentRole: any;
  highestRank: any;
  router: Router;
  locationId: any;
  vendorId: any;
  vendorRepairs: any;
  helpFlag: any = false;
  companies: any;
  p: number = 1;
  constructor(
    private modalService: BsModalService,
    private companyManagementService: CompanyManagementService,
    sanitizer: DomSanitizer,
    router: Router,

    private spinner: NgxSpinnerService
  ) {
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyName = this.globalCompany.name;
    this.companyId = this.globalCompany.companyid;

    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyName = value.name;
      this.companyId = value.companyid;
    });
    this.router = router;
  }

  ngOnInit() {
    this.spinner.show();
    this.companyManagementService.getAllVendorDetails().subscribe(
      (response) => {
        console.log(response);
        setTimeout(() => {
          this.vendors = response;
          this.spinner.hide();
        }, 7000);
      },
      (error) => {
        this.spinner.hide();
      }
    );
    this.currentRole = sessionStorage.getItem('currentRole');
    this.highestRank = sessionStorage.getItem('highestRank');
    console.log('currentRole is' + this.currentRole);
    console.log('highestRank is' + this.highestRank);
  }
  refresh() {
    this.vendors = [];
    this.ngOnInit();
  }

  openModal(template: TemplateRef<any>, id: number) {
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
    this.companyManagementService.removeVendor(this.index).subscribe(
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
