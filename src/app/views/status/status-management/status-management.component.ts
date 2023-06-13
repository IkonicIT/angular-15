import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { CompanyStatusesService } from "../../../services/company-statuses.service";
import { CompanyManagementService } from "../../../services/company-management.service";

@Component({
  selector: 'app-status-management',
  templateUrl: './status-management.component.html',
  styleUrls: ['./status-management.component.scss']
})
export class StatusManagementComponent implements OnInit {

  statuses: any[] = [];

  companyId: string;
  model: any;
  p: any;
  userName:any;
  index: string = 'companydocument';
  documents: any[] = [];
  router: Router;
  message: string;
  modalRef: BsModalRef;
  companyName: string = '';
  order: string = 'status';
  reverse: string = "";
  statusFilter: any = "";
  itemsForPagination: any = 5;

  globalCompany: any = {};

  constructor(private modalService: BsModalService, private companyManagementService: CompanyManagementService, private companyStatusService: CompanyStatusesService, router: Router, route: ActivatedRoute) {
    this.router = router;
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyId = this.globalCompany.companyid;
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = this.globalCompany.companyid;
      this.documents = [];
      this.getStatuses();
    });
    this.getStatuses();
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName');
  }

  getStatuses() {
    this.companyStatusService.getAllCompanyStatuses(this.companyId).subscribe(response => {
      console.log(response);
      this.statuses = response;
    });
  }

  addStatus() {
    this.router.navigate(['/status/addStatus/']);
  }


  editStatus(status) {
    console.log('statusid=' + status.statusid);
    this.router.navigate(['/status/editStatus/'], { queryParams: { q: status.statusid } });
  }

  openModal(template: TemplateRef<any>, id) {
    this.index = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.companyStatusService.removeCompanyStatus(this.index,this.userName).subscribe(response => {
      this.modalRef.hide();
      this.getStatuses();
    });
  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef.hide();
  }
  setOrder(value: string) {
    if (this.order === value) {
      if (this.reverse == "") {
        this.reverse = "-";
      } else {
        this.reverse = "";
      }
    }
    this.order = value;
  }
}
