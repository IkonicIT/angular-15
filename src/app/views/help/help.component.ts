import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CompanyDocumentsService } from '../../services/company-documents.service';
import { CompanyManagementService } from '../../services';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
})
export class HelpComponent implements OnInit {
  companyId: string = '';
  loader = false;
  model: any;
  index: string = 'companydocument';
  documents: any[] = [];
  message: string = '';
  modalRef: BsModalRef | null = null;
  companyName: string = '';
  order: string = 'description';
  reverse: string = '';
  documentFilter: string = '';
  itemsForPagination: number = 5;
  globalCompany: any;
  authToken: string | null;
  currentRole: string | null = null;
  highestRank: string | null = null;
  p: number = 1;
  private fileContent: string = '';
  private fileName: string = '';
  public fileType: string = '';
  file!: File;
  index1: number = 0;
  isOwnerAdmin: string | null = null;
  dismissible = true;

  constructor(
    private modalService: BsModalService,
    private companyDocumentsService: CompanyDocumentsService,
    private companyManagementService: CompanyManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.companyId = this.route.snapshot.params['id'] || '';
    this.authToken = sessionStorage.getItem('auth_token');

    if (this.companyId) {
      this.getAllDocuments(this.companyId);
    } else {
      this.globalCompany = this.companyManagementService.getGlobalCompany();
      if (this.globalCompany) {
        this.companyName = this.globalCompany.name;
        this.companyId = this.globalCompany.companyId;
        this.getAllDocuments(this.companyId);
      }
    }

    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyName = value.name;
      this.companyId = value.companyId;
    });
  }

  ngOnInit() {
    this.isOwnerAdmin = sessionStorage.getItem('IsOwnerAdmin');
    this.currentRole = sessionStorage.getItem('currentRole');
    this.highestRank = sessionStorage.getItem('highestRank');
  }

  getAllDocuments(companyId: string) {
    this.spinner.show();
    this.companyDocumentsService.getAllCompanyDocuments(companyId).subscribe(
      (response: any) => {
        this.spinner.hide();
        this.documents = response;
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  saveManual() {
    if (!this.file) {
      this.index1 = -1;
    } else {
      const req = {
        manualId: 1,
        manualFile: this.fileContent,
        contentType: this.fileType,
        description: 'TracRat Manual',
        fileName: this.fileName,
      };
      this.spinner.show();
      this.companyDocumentsService.updateManual(req).subscribe(
        () => {
          this.spinner.hide();
          this.index1 = 1;
        },
        () => {
          this.spinner.hide();
        }
      );
    }
  }

  getManual() {
    this.spinner.show();
    this.companyDocumentsService.getManual().subscribe(
      (response) => {
        this.spinner.hide();
        this.downloadManual(response);
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  fileChangeListener($event: Event): void {
    const input = $event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.readThis(input);
    }
  }

  readThis(inputValue: HTMLInputElement): void {
    if (!inputValue.files?.length) return;
    this.file = inputValue.files[0];
    this.fileName = this.file.name;
    const myReader = new FileReader();
    myReader.readAsDataURL(this.file);
    myReader.onloadend = () => {
      const result = myReader.result as string;
      this.fileContent = result.split(',')[1];
      this.fileType = result.split(',')[0].split(':')[1].split(';')[0];
    };
  }

  download(companyDocument: any) {
    if (!companyDocument.isNew) {
      this.downloadCompanyFile(companyDocument);
    } else {
      this.downloadDocumentFromDB(companyDocument);
    }
  }

  downloadDocumentFromDB(document: { attachmentId?: any }) {
    this.spinner.show();
    this.companyDocumentsService.getCompanyDocuments(document.attachmentId).subscribe(
      (response) => {
        this.spinner.hide();
        this.downloadDocument(response);
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  downloadManual(manual: any) {
    const blob = this.companyDocumentsService.b64toBlob(
      manual.manualFile,
      manual.contentType
    );
    const fileURL = URL.createObjectURL(blob);
    window.open(fileURL);
  }

  downloadDocument(companyDocument: any) {
    const blob = this.companyDocumentsService.b64toBlob(
      companyDocument.attachmentFile,
      companyDocument.contentType
    );
    const fileURL = URL.createObjectURL(blob);
    window.open(fileURL);
  }

  downloadCompanyFile(document: { fileName?: string; attachmentId?: any }) {
    if (!document.fileName) return;

    const extension = document.fileName.split('.').pop()?.toLowerCase();
    if (extension === 'pdf' || extension === 'txt') {
      const wnd = window.open('about:blank');
      const pdfStr = `<div style="text-align:center">
        <h4>Document viewer</h4>
        <iframe id="iFrame" src="https://docs.google.com/viewer?url=https://gotracrat.com:8088/api/attachment/downloadaudiofile/${
          document.attachmentId + '?access_token=' + this.authToken
        }&embedded=true" frameborder="0" height="500px" width="100%"></iframe>
        </div>`;
      if (wnd) wnd.document.write(pdfStr);
    } else if (['jpg', 'png', 'jpeg', 'gif'].includes(extension || '')) {
      const wnd = window.open('about:blank');
      const imgStr = `<div style="text-align:center">
        <h4>Image Viewer</h4>
        <img src="https://gotracrat.com:8088/api/attachment/downloadaudiofile/${
          document.attachmentId + '?access_token=' + this.authToken
        }&embedded=true" >
        </div>`;
      if (wnd) wnd.document.write(imgStr);
    } else {
      window.open(
        'https://gotracrat.com:8088/api/attachment/downloadaudiofile/' +
          document.attachmentId +
          '?access_token=' +
          this.authToken
      );
    }
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = this.reverse === '' ? '-' : '';
    }
    this.order = value;
  }
}
