import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ItemAttachmentsService } from '../../../services/Items/item-attachments.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { saveAs } from 'file-saver';
import { CompanyDocumentsService } from '../../../services/index';
import { BroadcasterService } from '../../../services/broadcaster.service';

@Component({
  selector: 'app-note-attachments',
  templateUrl: './note-attachments.component.html',
  styleUrls: ['./note-attachments.component.scss'],
})
export class NoteAttachmentsComponent implements OnInit {
  entityId!: string;
  noteId!: string;
  p: number | undefined;
  companyId!: string;
  companyName!: string;
  model: any;
  index: string = '';
  documents: any[] = [];
  message: string = '';
  modalRef!: BsModalRef;
  order: string = 'description';
  reverse: string = '';
  documentFilter: string = '';
  itemsForPagination: number = 5;
  userName!: string | null;
  globalCompany: any;
  authToken: string | null = null;
  entityName: string = '';
  helpFlag = false;
  loader = false;
  highestRank: any;

  constructor(
    private modalService: BsModalService,
    private itemAttachmentsService: ItemAttachmentsService,
    private companyManagementService: CompanyManagementService,
    private companyDocumentsService: CompanyDocumentsService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private broadcasterService: BroadcasterService
  ) {
    this.entityId = this.route.snapshot.params['entityId'];
    this.noteId = this.route.snapshot.params['noteId'];
    this.authToken = sessionStorage.getItem('auth_token');

    if (this.companyId) {
      this.getAllDocuments(this.entityId, this.noteId);
    } else {
      this.globalCompany = this.companyManagementService.getGlobalCompany();
      this.companyId = this.globalCompany.companyId;
      this.getAllDocuments(this.entityId, this.noteId);
    }

    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyName = value.name;
      this.companyId = value.companyId;
    });
  }

  ngOnInit(): void {
    this.entityName = this.broadcasterService.currentNoteAttachmentTitle;
    this.userName = sessionStorage.getItem('userName');
  }

  getAllDocuments(entityId: string, noteId: string): void {
    this.spinner.show();
    this.itemAttachmentsService.getAllItemNoteDocuments(noteId).subscribe({
      next: (response: any) => {
        this.spinner.hide();
        this.documents = response;
      },
      error: () => this.spinner.hide(),
    });
  }

  refresh(): void {}

  openModal(template: TemplateRef<any>, id: string): void {
    this.index = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  addNoteAttachments(): void {
    this.router.navigate(['/company/addNoteAttchments', this.noteId]);
  }

  editNoteDocument(document: { attachmentId: string }): void {
    this.router.navigate([
      '/company/editNoteAttchments',
      document.attachmentId,
      this.noteId,
    ]);
  }

  back(): void {
    this.router.navigate([
      '/company/companyNote',
      this.companyManagementService.currentCompanyId,
    ]);
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();

    const userLog = {
      noteType: 'companynoteattachment',
      noteName: this.entityName,
    };

    this.companyDocumentsService
      .removeCompanyNoteDocuments(this.index, this.companyId, this.userName ?? '', userLog)
      .subscribe({
        next: () => {
          this.spinner.hide();
          this.modalRef.hide();
          this.getAllDocuments(this.noteId, this.noteId);
        },
        error: () => this.spinner.hide(),
      });
  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef.hide();
  }

  setOrder(value: string): void {
    if (this.order === value) {
      this.reverse = this.reverse === '' ? '-' : '';
    }
    this.order = value;
  }

  download(companyDocument: any): void {
    if (companyDocument.isNew === false) {
      this.downloadFile(companyDocument);
    } else {
      this.downloadDocumentFromDB(companyDocument);
    }
  }

  downloadDocumentFromDB(document: { attachmentId: number }): void {
    this.spinner.show();
    this.companyDocumentsService.getCompanyDocuments(document.attachmentId).subscribe({
      next: (response) => {
        this.spinner.hide();
        this.downloadDocument(response);
      },
      error: () => this.spinner.hide(),
    });
  }

  downloadDocument(companyDocument: any): void {
    const blob = this.companyDocumentsService.b64toBlob(
      companyDocument.attachmentFile,
      companyDocument.contentType
    );
    const fileURL = URL.createObjectURL(blob);
    window.open(fileURL);
  }

  downloadFile(companyDocument: { fileName: string; attachmentId: string }): void {
    const index = companyDocument.fileName.lastIndexOf('.');
    const extension = companyDocument.fileName.slice(index + 1).toLowerCase();

    if (extension === 'pdf' || extension === 'txt') {
      const wnd = window.open('about:blank');
      const pdfStr = `<div style="text-align:center">
      <h4>Pdf viewer</h4>
      <iframe id="iFrame" src="https://docs.google.com/viewer?url=https://gotracrat.com:8088/api/attachment/downloadaudiofile/${
        companyDocument.attachmentId + '?access_token=' + this.authToken
      }&embedded=true" frameborder="0" height="650px" width="100%"></iframe>
      </div>`;
      if (wnd) wnd.document.write(pdfStr);
    } else if (['jpg', 'png', 'jpeg', 'gif'].includes(extension)) {
      const wnd = window.open('about:blank');
      const imgStr = `<div style="text-align:center">
      <h4>Image Viewer</h4>
      <img src="https://gotracrat.com:8088/api/attachment/downloadaudiofile/${
        companyDocument.attachmentId + '?access_token=' + this.authToken
      }" >
      </div>`;
      if (wnd) wnd.document.write(imgStr);
    } else {
      window.open(
        `https://gotracrat.com:8088/api/attachment/downloadaudiofile/${companyDocument.attachmentId}?access_token=${this.authToken}`
      );
    }
  }

  print(): void {
    this.helpFlag = false;
    window.print();
  }

  help(): void {
    this.helpFlag = !this.helpFlag;
  }
}
