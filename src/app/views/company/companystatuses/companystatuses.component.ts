import { CompanyStatusesService } from '../../../services/index';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-companystatuses',
  templateUrl: './companystatuses.component.html',
  styleUrls: ['./companystatuses.component.scss'],
})
export class CompanystatusesComponent implements OnInit {
  statuses: any = [];
  companyId: string;
  model: any;
  index: string = 'companydocument';
  documents: any[] = [];
  router: Router;
  message: string;
  modalRef: BsModalRef;
  companyName: string = '';
  order: string = 'status';
  reverse: string = '';
  statusFilter: any = '';
  itemsForPagination: any = 5;
  index1: number = 0;
  globalCompany: any = {};
  currentRole: any;
  highestRank: any;
  userName: any;
  helpFlag: any = false;
  dismissible = true;
  p: any;
  loader = false;
  constructor(
    private modalService: BsModalService,
    private companyManagementService: CompanyManagementService,
    private companyStatusService: CompanyStatusesService,
    router: Router,
    route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.router = router;
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyId = this.globalCompany.companyid;
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = this.globalCompany.companyid;
      this.documents = [];
    });
    this.getStatuses();
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName');
    this.currentRole = sessionStorage.getItem('currentRole');
    this.highestRank = sessionStorage.getItem('highestRank');
    console.log('currentRole is' + this.currentRole);
    console.log('highestRank is' + this.highestRank);
  }

  getStatuses() {
    this.spinner.show();
    this.loader = true;
    this.statuses = [];
    this.companyStatusService.getAllCompanyStatuses(this.companyId).subscribe(
      (response) => {
        this.spinner.hide();
        this.loader = false;
        console.log(response);
        this.statuses = response;
      },
      (error) => {
        this.spinner.hide();
        this.loader = false;
      }
    );
  }

  addStatus() {
    this.router.navigate(['/company/addStatus/']);
  }

  editStatus(status: { statusid: string }) {
    console.log('statusid=' + status.statusid);
    this.router.navigate(['/company/editStatus/'], {
      queryParams: { q: status.statusid },
    });
  }

  openModal(template: TemplateRef<any>, id: string) {
    this.index = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();
    this.loader = true;
    this.companyStatusService
      .removeCompanyStatus(this.index, this.userName)
      .subscribe(
        (response) => {
          this.spinner.hide();
          this.loader = false;
          this.modalRef.hide();
          this.index1 = 1;
          setTimeout(() => {
            this.index1 = 0;
          }, 7000);
          this.getStatuses();
          const currentPage = this.p;
        const statusesCount = this.statuses.length - 1;
        const maxPageAvailable = Math.ceil(statusesCount / this.itemsForPagination);
        if (currentPage > maxPageAvailable){
          this.p--;
        }
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

  help() {
    this.helpFlag = !this.helpFlag;
  }
}
