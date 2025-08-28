import { Component, TemplateRef, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CompanyManagementService } from '../../../services/index';
import { Company } from '../../../models/index';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-companymanagement',
  templateUrl: './companymanagement.component.html',
  styleUrls: ['./companymanagement.component.scss'],
})
export class CompanymanagementComponent implements OnInit {
  modalRef: any;
  modalRef2: BsModalRef | null = null;   // nullable, prevents strict errors
  message: string = '';
  companies: Company[] = [];
  index: any;
  order: string = 'name';
  reverse: string = '';
  companyFilter: string = '';
  itemsForPagination: number = 5;
  currentRole: string | null = null;     // sessionStorage returns string | null
  highestRank: string | null = null;     // keep same functionality
  router: Router;
  helpFlag: boolean = false;
  p: number = 1;
  loader = false;

  constructor(
    private modalService: BsModalService,
    private companyManagementService: CompanyManagementService,
    sanitizer: DomSanitizer,
    private spinner: NgxSpinnerService,
    router: Router,
    route: ActivatedRoute
  ) {
    this.router = router;
    this.companies = this.companyManagementService.getGlobalCompanyList();
    this.companyManagementService.globalCompanyChange.subscribe(() => {
      this.companies = this.companyManagementService.getGlobalCompanyList();
    });
  }

  ngOnInit() {
    this.currentRole = sessionStorage.getItem('currentRole');
    this.highestRank = sessionStorage.getItem('highestRank');
    console.log('currentRole is ' + this.currentRole);
    console.log('highestRank is ' + this.highestRank);
  }

  refresh() {
    this.companies = [];
    this.getAllCompniesList();
  }

  getAllCompniesList() {
    this.spinner.show();

    this.companyManagementService.getAllCompanyDetails().subscribe(
      (response: Company[]) => {
        this.spinner.hide();
        console.log(response);
        this.companies = response;
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  companyNotes(company: Company) {
    console.log(company);
    this.companyManagementService.currentCompanyId = company.companyId;
    this.companyManagementService.currentCompanyName = company.name;
    this.router.navigate(['/company/companyNote/' + company.companyId]);
  }

  openModal(template: TemplateRef<any>, id: any) {
    this.index = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  openModal2(template: TemplateRef<any>) {
    this.modalRef2 = this.modalService.show(template, { class: 'second' });
  }

  closeFirstModal() {
    if (this.modalRef) {
      this.modalRef.hide();
      this.modalRef = null;
    }
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();

    this.companyManagementService.removeCompany(this.index).subscribe(
      () => {
        this.spinner.hide();

        if (this.modalRef) {
          this.modalRef.hide();
        }
        alert('Company successfully deleted,Refreshing List ');
        this.companyManagementService.setCompaniesListModified(true);

        const currentPage = this.p;
        const companiesCount = this.companies.length;
        const maxPageAvailable = Math.ceil(
          companiesCount / this.itemsForPagination
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
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = this.reverse === '' ? '-' : '';
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
    const companiesCount = this.companies.length;
    const maxPageAvailable = Math.ceil(
      companiesCount / this.itemsForPagination
    );
    if (currentPage > maxPageAvailable) {
      this.p = maxPageAvailable;
    }
  }
}
