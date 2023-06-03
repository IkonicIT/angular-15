import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyDocumentsService } from '../../../services/index';
import { TemplateRef, SecurityContext } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { CompanyManagementService } from '../../../services/index';
import { CompanynotesService } from '../../../services/index';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-company-notes',
  templateUrl: './company-notes.component.html',
  styleUrls: ['./company-notes.component.scss'],
})
export class CompanyNotesComponent implements OnInit {
  companyId: string;
  model: any;
  p: any;
  index: string = 'companydocument';
  notes: any[] = [];
  router: Router;
  message: string;
  modalRef: BsModalRef;
  companyName: string = '';
  order: string = 'date';
  reverse: string = '';
  companyNotesFilter: any = '';
  itemsForPagination: any = 5;
  globalCompany: any;
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

  addNotes() {
    console.log(this.companyId);
    this.router.navigate(['/company/addNotes/'], {
      queryParams: { q: this.companyId },
    });
  }

  openModal(template: TemplateRef<any>, id: string) {
    this.index = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  confirm(): void {
    this.message = 'Confirmed!';
    console.log(
      'removeCompanynotess companyId=' +
        this.companyId +
        ',index==' +
        this.index
    );
    this.spinner.show();
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

  refresh() {
    this.notes = [];
    this.ngOnInit();
  }

  viewCompanyNotes(notes: { journalid: any }) {
    this.router.navigate(['/company/viewNotes/'], {
      queryParams: { q: this.companyId, a: notes.journalid },
    });
  }

  editCompanyNotes(notes: { journalid: any }) {
    this.router.navigate(['/company/editNotes/'], {
      queryParams: { q: this.companyId, a: notes.journalid },
    });
  }

  companyNoteAttachments(notes: { journalid: string }) {
    this.router.navigate([
      '/company/noteAttchments/' + notes.journalid + '/' + notes.journalid,
    ]);
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
}
