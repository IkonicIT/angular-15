import { Component, OnInit, TemplateRef } from '@angular/core';
import { CompanyDocumentsService } from '../../../services/company-documents.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-manage-vendor-note-attachment',
  templateUrl: './manage-vendor-note-attachment.component.html',
  styleUrls: ['./manage-vendor-note-attachment.component.scss'],
})
export class ManageVendorNoteAttachmentComponent implements OnInit {
  entityId: string;
  vendorNoteId: string;
  p: any;
  companyId: string;
  companyName: any;
  model: any;
  index: string = '';
  documents: any[] = [];
  highestRank: number;
  route: ActivatedRoute;
  router: Router;
  message: string;
  modalRef: BsModalRef;
  order: string = 'description';
  reverse: string = '';
  documentFilter: any = '';
  itemsForPagination: any = 5;
  userName: any;
  globalCompany: any;
  authToken: any;
  entityName: any;
  helpFlag: any = false;
  vendorAttachment: any;
  vendorId: any;
  private sub: any;
  constructor(
    private modalService: BsModalService,
    private companyManagementService: CompanyManagementService,
    private companyDocumentsService: CompanyDocumentsService,
    router: Router,
    route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.vendorNoteId = route.snapshot.params['id'];
    console.log('VendorNoteId in manage vendor note att:' + this.vendorNoteId);
    this.router = router;
    this.route = route;
    if (this.companyId) {
      this.getAllDocuments(this.vendorNoteId);
    } else {
      this.globalCompany = this.companyManagementService.getGlobalCompany();
      this.companyId = this.globalCompany.companyId;
      this.getAllDocuments(this.vendorNoteId);
    }
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyName = value.name;
      this.companyId = value.companyId;
    });
  }

  ngOnInit() {
    this.sub = this.route.queryParams.subscribe((params) => {
      this.vendorId = +params['q'] || 0;
      console.log('Query params of VendorNoteId ', this.vendorNoteId);
    });
    this.userName = sessionStorage.getItem('userName');
  }

  getAllDocuments(vendorNoteId: string) {
    this.spinner.show();
    this.companyDocumentsService
      .getAllVendorNoteDocuments(vendorNoteId)
      .subscribe(
        (response) => {
          this.spinner.hide();
          console.log(response);
          this.documents = response as any[];
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }
  refresh() {}
  openModal(template: TemplateRef<any>, id: string) {
    this.index = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }
  addVendorNoteAttachments() {
    console.log(this.companyId);
    this.router.navigate([
      '/vendor/addVendorNoteDocument/' + this.vendorNoteId,
    ]);
  }
  editVendorNoteDocument(document: any) {
    this.router.navigate(
      ['/vendor/editVendorNoteDocument/' + document.vendorAttachmentId],
      { queryParams: { q: this.vendorNoteId } }
    );
  }

  back() {
    this.router.navigate(['/vendor/notes/' + this.vendorId]);
  }
  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();
    this.companyDocumentsService.removeVendorDocument(this.index).subscribe(
      (response) => {
        this.spinner.hide();
        this.modalRef.hide();
        this.getAllDocuments(this.vendorNoteId);
      },
      (error) => {
        this.spinner.hide();
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
  getVendorAttachment(document: any): void {
    this.companyDocumentsService
      .getVendorDocument(document.vendorAttachmentId)
      .subscribe((data: any) => {
        this.vendorAttachment = data;
        this.openAttachment();
      });
  }

  openAttachment(): void {
    if (this.isImage()) {
      // Open image in a new tab
      const imageWindow = window.open();
      if (imageWindow) {
        imageWindow.document.write(
          `<img src="data:${this.vendorAttachment.contentType};base64,${this.vendorAttachment.attachmentFile}" />`
        );
      }
    } else {
      // Download the attachment
      const blob = this.base64ToBlob(
        this.vendorAttachment.attachmentFile,
        this.vendorAttachment.contentType
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.vendorAttachment.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  isImage(): boolean {
    return (
      this.vendorAttachment &&
      this.vendorAttachment.contentType.startsWith('image')
    );
  }

  private base64ToBlob(base64: string, contentType: string): Blob {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  }

  downloadDocument(companyDocument: any) {
    var blob = this.companyDocumentsService.b64toBlob(
      companyDocument.attachmentFile,
      companyDocument.contentType
    );
    var fileURL = URL.createObjectURL(blob);

    window.open(fileURL);
  }

  print() {
    this.helpFlag = false;
    window.print();
  }
  help() {
    this.helpFlag = !this.helpFlag;
  }
}
