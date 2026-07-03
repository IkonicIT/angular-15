import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyDocumentsService } from '../../../services/index';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CompanyManagementService } from '../../../services/index';
import { CompanynotesService } from '../../../services/index';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-company-notes',
  templateUrl: './company-notes.component.html',
  styleUrls: ['./company-notes.component.scss'],
})
export class CompanyNotesComponent implements OnInit {
  companyId: string = '';
  model: any = {};
  p: number = 1;
  index: string = 'companydocument';
  notes: any[] = [];
  message: string = '';
  modalRef: BsModalRef | null = null;
  companyName: string = '';
  order: string = 'date';
  reverse: string = '';
  companyNotesFilter: any = '';
  itemsForPagination: number = 5;
  loader = false;
  globalCompany: any;

  constructor(
    private modalService: BsModalService,
    private companyDocumentsService: CompanyDocumentsService,
    private companyManagementService: CompanyManagementService,
    private companynotesService: CompanynotesService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.companyId = this.route.snapshot.params['id'] ?? '';

    if (this.companyId) {
      this.getAllNotes(this.companyId);
    }

    this.companyManagementService.globalCompanyChange.subscribe((value: any) => {
      this.globalCompany = value;
      this.companyName = value?.name ?? '';
      this.companyId = value?.companyId ?? '';
    });
  }

  ngOnInit(): void {}

  getAllNotes(companyId: string): void {
    this.spinner.show();
    this.companynotesService.getAllCompanyNotess(companyId).subscribe(
      (response: any) => {
        this.spinner.hide();
        this.notes = response || [];
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  addNotes(): void {
    this.router.navigate(['/company/addNotes/'], {
      queryParams: { q: this.companyId },
    });
  }

  openModal(template: TemplateRef<any>, id: string): void {
    this.index = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();

    this.companynotesService.removeCompanynotess(this.index, this.companyId).subscribe(
      () => {
        this.spinner.hide();
        this.modalRef?.hide();
        this.getAllNotes(this.companyId);

        const currentPage = this.p;
        const notesCount = this.notes.length - 1;
        const maxPageAvailable = Math.ceil(notesCount / this.itemsForPagination);
        if (currentPage > maxPageAvailable) {
          this.p = maxPageAvailable;
        }
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  refresh(): void {
    this.notes = [];
    this.getAllNotes(this.companyId);
  }

  viewCompanyNotes(notes: { journalId: any }): void {
    this.router.navigate(['/company/viewNotes/'], {
      queryParams: { q: this.companyId, a: notes.journalId },
    });
  }

  editCompanyNotes(notes: { journalId: any }): void {
    this.router.navigate(['/company/editNotes/'], {
      queryParams: { q: this.companyId, a: notes.journalId },
    });
  }

  companyNoteAttachments(notes: { journalId: string }): void {
    this.router.navigate([
      '/company/noteAttchments/' + notes.journalId + '/' + notes.journalId,
    ]);
  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef?.hide();
  }

  setOrder(value: string): void {
    if (this.order === value) {
      this.reverse = this.reverse === '' ? '-' : '';
    }
    this.order = value;
  }

  onChange(e: any): void {
    const currentPage = this.p;
    const notesCount = this.notes.length;
    const maxPageAvailable = Math.ceil(notesCount / this.itemsForPagination);
    if (currentPage > maxPageAvailable) {
      this.p = maxPageAvailable;
    }
  }
}
