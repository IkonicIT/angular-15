import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CompanyManagementService } from '../../../services/company-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocationAttachmentsService } from '../../../services/location-attachments.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-location-attachment',
  templateUrl: './location-attachment.component.html',
  styleUrls: ['./location-attachment.component.scss'],
})
export class LocationAttachmentComponent implements OnInit {
  locationId: string = '';
  companyId: number = 0;
  p: number = 1;

  companyName: string = '';
  model: any;
  authToken: string | null = null;
  index: string = 'locationdocument';
  documents: any[] = [];
  userName: string | null = null;
  message: string = '';
  modalRef: BsModalRef | null = null;
  order: string = 'description';
  reverse: string = '';
  documentFilter: string = '';
  itemsForPagination: number = 5;
  globalCompany: any;
  loader = false;

  constructor(
    private modalService: BsModalService,
    private locationAttachmentsService: LocationAttachmentsService,
    private companyManagementService: CompanyManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.locationId = this.route.snapshot.params['id'] ?? '';
    this.authToken = sessionStorage.getItem('auth_token');

    if (this.companyId) {
      this.getAllDocuments(this.companyId, this.locationId);
    } else {
      this.globalCompany = this.companyManagementService.getGlobalCompany();
      if (this.globalCompany) {
        this.companyId = this.globalCompany.companyId;
        this.companyName = this.globalCompany.name;
        this.getAllDocuments(this.companyId, this.locationId);
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
  }

  getAllDocuments(companyId: number, locationId: string): void {
    this.spinner.show();

    this.locationAttachmentsService
      .getAllLocationDocuments(String(companyId), locationId)
      .subscribe(
        (response: any) => {
          this.spinner.hide();
          this.documents = response ?? [];
        },
        () => {
          this.spinner.hide();
        }
      );
  }

  refresh(): void {
    if (this.companyId && this.locationId) {
      this.getAllDocuments(this.companyId, this.locationId);
    }
  }

  openModal(template: TemplateRef<any>, id: string): void {
    this.index = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  addLocationDocument(): void {
    this.router.navigate([`/location/addAttachment/${this.locationId}`]);
  }

  editLocationDocument(document: { attachmentId: string }): void {
    this.router.navigate([
      `/location/editAttachment/${document.attachmentId}/${this.locationId}`,
    ]);
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();

    this.locationAttachmentsService
      .removeLocationDocuments(this.index, String(this.companyId), this.userName ?? '')
      .subscribe(
        () => {
          this.spinner.hide();
          this.modalRef?.hide();
          this.getAllDocuments(this.companyId, this.locationId);
        },
        () => {
          this.spinner.hide();
        }
      );
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

  downloadDocument(companyDocument: {
    attachmentFile: string;
    contentType: string;
    fileName: string;
  }): void {
    const blob = this.locationAttachmentsService.b64toBlob(
      companyDocument.attachmentFile,
      companyDocument.contentType
    );
    saveAs(blob, companyDocument.fileName);
  }

  downloadFile(companyDocument: { fileName: string; attachmentId: string }): void {
    const extension = companyDocument.fileName.split('.').pop()?.toLowerCase() ?? '';

    if (['pdf', 'txt'].includes(extension)) {
      const pdfStr = `<div style="text-align:center">
        <h4>Pdf viewer</h4>
        <iframe src="https://docs.google.com/viewer?url=http://18.216.158.31:8088/api/attachment/downloadaudiofile/${
          companyDocument.attachmentId + '?access_token=' + this.authToken
        }&embedded=true" frameborder="0" height="500px" width="100%"></iframe>
      </div>`;

      const wnd = window.open('about:blank');
      if (wnd) wnd.document.write(pdfStr);
    } else if (['jpg', 'png', 'jpeg', 'gif'].includes(extension)) {
      const imgStr = `<div style="text-align:center">
        <h4>Image Viewer</h4>
        <img src="http://18.216.158.31:8088/api/attachment/downloadaudiofile/${
          companyDocument.attachmentId + '?access_token=' + this.authToken
        }&embedded=true" >
      </div>`;

      const wnd = window.open('about:blank');
      if (wnd) wnd.document.write(imgStr);
    } else {
      window.open(
        `http://18.216.158.31:8088/api/attachment/downloadaudiofile/${companyDocument.attachmentId}?access_token=${this.authToken}`
      );
    }
  }
}
