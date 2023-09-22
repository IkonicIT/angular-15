import { Component, TemplateRef, OnInit, SecurityContext } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
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
  modalRef2: BsModalRef;
  message: string;
  companies: Company[] = [];
  index: any;
  order: string = 'name';
  reverse: string = '';
  companyFilter: any = '';
  itemsForPagination: any = 5;
  currentRole: any;
  highestRank: any;
  router: Router;
  helpFlag: any = false;
  p: any;
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
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.companies = this.companyManagementService.getGlobalCompanyList();
    });
  }

  ngOnInit() {
    this.currentRole = sessionStorage.getItem('currentRole');
    this.highestRank = sessionStorage.getItem('highestRank');
    console.log('currentRole is' + this.currentRole);
    console.log('highestRank is' + this.highestRank);
  }

  refresh() {
    this.companies = [];
    this.getAllCompniesList();
  }

  getAllCompniesList() {
    this.spinner.show();
    this.loader = true;
    this.companyManagementService.getAllCompanyDetails().subscribe(
      (response: any) => {
        this.spinner.hide();
        console.log(response);
        this.companies = response;
      },
      (error) => {
        this.spinner.hide();
        this.loader = false;
      }
    );
  }

  companyNotes(company: any) {
    this.companyManagementService.currentCompanyId = company.companyid;
    this.companyManagementService.currentCompanyName = company.name;
    this.router.navigate(['/company/companyNote/' + company.companyid]);
  }

  openModal(template: TemplateRef<any>, id: any) {
    this.index = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  openModal2(template: TemplateRef<any>) {
    this.modalRef2 = this.modalService.show(template, { class: 'second' });
  }

  closeFirstModal() {
    this.modalRef.hide();
    this.modalRef = null;
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();
    this.loader = true;
    this.companyManagementService.removeCompany(this.index).subscribe(
      (response) => {
        this.spinner.hide();
        this.loader = false;
        this.modalRef.hide();
        alert('Company successfully deleted,Refreshing List ');
        this.companyManagementService.setCompaniesListModified(true);
      },
      (error) => {
        this.spinner.hide();
        this.loader = false;
      }
    );
  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef.hide();
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
