import { Component, OnInit, TemplateRef } from '@angular/core';
import { CompanyDocumentsService } from '../../../services/company-documents.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CompanyManagementService } from '../../../services/company-management.service';
import { CompanynotesService } from '../../../services/companynotes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-vendor-notes',
  templateUrl: './vendor-notes.component.html',
  styleUrls: ['./vendor-notes.component.scss'],
})
export class VendorNotesComponent implements OnInit {
  companyId: string;
  model: any;
  p: any;
  index: string = 'companydocument';
  notes: any[] = [];
  router: Router;
  message: string;
  modalRef: BsModalRef;
  companyName: string = '';
  vendorName: string = '';
  order: string = 'date';
  reverse: string = '';
  vendorNotesFilter: any = '';
  itemsForPagination: any = 5;
  globalCompany: any;
  helpFlag: any = false;
  constructor(
    private modalService: BsModalService,
    private companyDocumentsService: CompanyDocumentsService,
    private companyManagementService: CompanyManagementService,
    private companynotesService: CompanynotesService,
    router: Router,
    route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.companyId = route.snapshot.params['id'];
    this.router = router;

    console.log('companuyid=' + this.companyId);
    if (this.companyId) {
      this.getAllNotes(this.companyId);
    }
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyName = value.name;
      this.companyId = value.companyid;
      this.getAllNotes(this.companyId);
    });
  }

  ngOnInit() {}

  getAllNotes(companyId: string) {
    this.spinner.show();
    this.companynotesService.getAllCompanyNotess(companyId).subscribe(
      (response: any) => {
        this.spinner.hide();
        console.log(response);
        this.notes = response;
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  addVendorNotes() {
    console.log(this.companyId);
    this.router.navigate(['/vendor/addVendorNotes/'], {
      queryParams: { q: this.companyId },
    });
  }

  openModal(template: TemplateRef<any>, id: string) {
    this.index = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();
    console.log(
      'removeCompanynotess companyId=' +
        this.companyId +
        ',index==' +
        this.index
    );
    this.companynotesService
      .removeCompanynotess(this.index, this.companyId)
      .subscribe(
        (response) => {
          this.spinner.hide();
          this.modalRef.hide();
          this.getAllNotes(this.companyId);
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }

  editVendorNotes(notes: { journalid: any }) {
    this.router.navigate(['/vendor/editNotes/'], {
      queryParams: { q: this.companyId, a: notes.journalid },
    });
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
