import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyDocumentsService, CompanyManagementService } from '../../../services/index';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-companydocuments',
  templateUrl: './companydocuments.component.html',
  styleUrls: ['./companydocuments.component.scss'],
})
export class CompanydocumentsComponent implements OnInit {
  companyId: string = '';
  model: any;
  index: string = 'companydocument';
  documents: any[] = [];
  message: string = '';
  userName: string | null = null;
  modalRef!: BsModalRef;
  companyName: string = '';
  order: string = 'description';
  reverse: string = '';
  documentFilter: string = '';
  itemsForPagination: number = 5;
  globalCompany: any;
  authToken: string | null = null;
  currentRole: string | null = null;
  highestRank: number = 0;
  helpFlag: boolean = false;
  p: number = 1;
  loader = false;

  constructor(
    private modalService: BsModalService,
    private companyDocumentsService: CompanyDocumentsService,
    private companyManagementService: CompanyManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.companyId = this.route.snapshot.params['id'];
    this.authToken = sessionStorage.getItem('auth_token');

    if (this.companyId) {
      this.getAllDocuments(this.companyId);
    } else {
      this.globalCompany = this.companyManagementService.getGlobalCompany();
      if (this.globalCompany) {
        this.companyName = this.globalCompany.name;
        this.companyId = this.globalCompany.companyId;
        this.getAllDocuments(this.globalCompany.companyId);
      }
    }

    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyName = value.name;
      this.companyId = value.companyId;
    });
  }

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('userName');
    this.currentRole = sessionStorage.getItem('currentRole');
    const rankStr = sessionStorage.getItem('highestRank');
    this.highestRank = rankStr !== null ? +rankStr : 0;
  }

  getAllDocuments(companyId: string): void {
    this.spinner.show();
    this.companyDocumentsService.getAllCompanyDocuments(companyId).subscribe({
      next: (response: any[]) => {
        this.spinner.hide();
        this.documents = response;
      },
      error: () => {
        this.spinner.hide();
      },
    });
  }

  refresh(): void {
    this.documents = [];
    this.getAllDocuments(this.companyId);
  }

  openModal(template: TemplateRef<any>, id: string): void {
    this.index = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  addDocument(): void {
    this.router.navigate(['/company/addDocument/'], {
      queryParams: { q: this.companyId },
    });
  }

  editDocument(document: { attachmentId: string }): void {
    this.router.navigate(['/company/editDocument/'], {
      queryParams: { q: this.companyId, a: document.attachmentId },
    });
  }

  confirm(): void {
    if (!this.userName) return;

    this.message = 'Confirmed!';
    this.spinner.show();

    this.companyDocumentsService.removeCompanyDocuments(this.index, this.companyId, this.userName).subscribe({
      next: () => {
        this.spinner.hide();
        this.modalRef?.hide();
        this.refresh();

        const documentCount = this.documents.length - 1;
        const maxPageAvailable = Math.ceil(documentCount / this.itemsForPagination);
        if (this.p > maxPageAvailable) {
          this.p = maxPageAvailable;
        }
      },
      error: () => {
        this.spinner.hide();
      },
    });
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

  download(companyDocument: any): void {
    if (!companyDocument.isNew) {
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

    if (['pdf', 'txt'].includes(extension)) {
      const wnd = window.open('about:blank');
      const pdfStr = `<div style="text-align:center">
        <h4>Pdf viewer</h4>
        <iframe id="iFrame" src="https://docs.google.com/viewer?url=https://gotracrat.com:8088/api/attachment/downloadaudiofile/${
          companyDocument.attachmentId + '?access_token=' + this.authToken
        }&embedded=true" frameborder="0" height="650px" width="100%"></iframe>
      </div>`;
      wnd?.document.write(pdfStr);
    } else if (['jpg', 'png', 'jpeg', 'gif'].includes(extension)) {
      const wnd = window.open('about:blank');
      const imgStr = `<div style="text-align:center">
        <h4>Image Viewer</h4>
        <img src="https://gotracrat.com:8088/api/attachment/downloadaudiofile/${
          companyDocument.attachmentId + '?access_token=' + this.authToken
        }&embedded=true">
      </div>`;
      wnd?.document.write(imgStr);
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

  onChange(event: any): void {
    const documentCount = this.documents.length;
    const maxPageAvailable = Math.ceil(documentCount / this.itemsForPagination);
    if (this.p > maxPageAvailable) {
      this.p = maxPageAvailable;
    }
  }
}
