import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe, Location } from '@angular/common';

import { CompanyDocumentsService } from '../../../services/company-documents.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { CompanynotesService } from '../../../services/companynotes.service';
import { PartsService } from 'src/app/services/parts.service';

@Component({
  selector: 'app-part-notes',
  templateUrl: './part-notes.component.html',
  styleUrls: ['./part-notes.component.scss'],
})
export class PartNotesComponent implements OnInit {
  companyId: string = '';
  model: any = {};
  p: any;
  index: any;
  notes: any[] = [];
  message: string = '';
  modalRef?: BsModalRef;
  companyName: string = '';
  vendorName: string = '';
  order: string = 'date';
  reverse: string = '';
  dismissible: boolean = true;
  vendorNotesFilter: any = '';
  itemsForPagination: number = 5;
  globalCompany: any;
  helpFlag: boolean = false;
  index1: any;
  viewFlag: boolean = false;
  editFlag: boolean = false;
  newFlag: boolean = true;
  highestRank: any;
  partId: any;
  partNoteId: any;
  userName: any;
  frame: any;

  constructor(
    private modalService: BsModalService,
    private companyDocumentsService: CompanyDocumentsService,
    private companyManagementService: CompanyManagementService,
    private location: Location,
    private companynotesService: CompanynotesService,
    private datePipe: DatePipe,
    private partService: PartsService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.partId = this.route.snapshot.params['id'];
    this.getAllNotes(this.partId);
  }

  ngOnInit(): void {
    this.highestRank = sessionStorage.getItem('highestRank');
    this.userName = sessionStorage.getItem('userName');
  }

  getAllNotes(partId: any) {
    this.spinner.show();
    this.partService.getAllPartNotes(partId).subscribe(
      (response) => {
        this.notes = response;
        this.spinner.hide();
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  savePartNotes() {
    if (!this.model.name || !this.model.createdDate) {
      this.index1 = -1;
      window.scroll(0, 0);
      setTimeout(() => {
        this.index1 = 0;
      }, 5000);
    } else {
      this.model = {
        partNoteId: 0,
        createdBy: this.userName,
        createdDate: this.model.createdDate,
        name: this.model.name,
        jobNumber: this.model.jobNumber,
        poNumber: this.model.poNumber,
        details: this.model.details,
        isNew: true,
        partId: this.partId,
      };
      this.spinner.show();
      this.partService.addPartNote(this.model).subscribe(
        () => {
          this.spinner.hide();
          window.scroll(0, 0);
          this.index1 = 1;
          setTimeout(() => {
            this.index1 = 0;
            this.addNotes();
            this.getAllNotes(this.partId);
          }, 3000);
        },
        () => {
          this.spinner.hide();
        }
      );
    }
  }

  openModal(template: TemplateRef<any>, id: any) {
    this.index = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();
    this.partService.deletePartNote(this.partNoteId).subscribe(
      () => {
        this.model = [];
        this.modalRef?.hide();
        this.index1 = 4;
        this.viewFlag = false;
        this.newFlag = true;
        this.editFlag = false;
        this.helpFlag = false;
        this.spinner.hide();
        setTimeout(() => {
          this.index1 = 0;
          this.getAllNotes(this.partId);
        }, 3000);
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  viewPartNote(noteId: any) {
    this.viewFlag = true;
    this.newFlag = false;
    this.editFlag = false;
    this.helpFlag = false;
    this.spinner.show();
    this.partService.getPartNote(noteId).subscribe((response) => {
      this.model = response;
      this.partNoteId = this.model.partNoteId;
      if (this.model.createdDate) {
        const date = this.datePipe.transform(
          this.model.createdDate,
          'MM/dd/yyyy'
        );
        this.model.createdDate = date;
      }
      this.spinner.hide();
    });
    window.scroll(0, 0);
  }

  backToParts() {
    this.location.back();
  }

  goToAttachments(partNoteId: any) {
    this.router.navigateByUrl(`parts/manageAttachements/${partNoteId}`);
  }

  updatePartNotes() {
    if (!this.model.name || !this.model.createdDate) {
      this.index1 = -1;
      window.scroll(0, 0);
      setTimeout(() => {
        this.index1 = 0;
      }, 3000);
    } else {
      const currentDate = new Date();
      const createdDate = this.model.createdDate;
      this.model.createdDate = this.datePipe.transform(
        createdDate,
        "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
      );
      this.model.updatedBy = this.userName;
      this.model.updatedDate = this.datePipe.transform(
        currentDate,
        "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
      );
      this.partService.updatePartNote(this.partNoteId, this.model).subscribe(
        (response) => {
          this.model = response;
          if (this.model.createdDate) {
            const date = this.datePipe.transform(
              this.model.createdDate,
              'MM/dd/yyyy'
            );
            this.model.createdDate = date;
          }
          this.spinner.hide();
          window.scroll(0, 0);
          this.viewFlag = true;
          this.newFlag = false;
          this.editFlag = false;
          this.helpFlag = false;
          this.refreshCall();
          this.index1 = 2;
          setTimeout(() => {
            this.index1 = 0;
          }, 7000);
        },
        () => {
          this.spinner.hide();
        }
      );
    }
  }

  refreshCall() {
    this.getAllNotes(this.partId);
  }

  cancelVendorNotes() {
    this.newFlag = true;
    this.editFlag = false;
    this.viewFlag = false;
    this.helpFlag = false;
    this.model = [];
    this.model.effectiveOn = new Date();
  }

  addNotes() {
    this.newFlag = true;
    this.editFlag = false;
    this.viewFlag = false;
    this.helpFlag = false;
    this.model = [];
    this.model.effectiveOn = new Date();
  }

  editNote() {
    this.editFlag = true;
    this.viewFlag = false;
    this.newFlag = false;
    this.helpFlag = false;
  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef?.hide();
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
}
