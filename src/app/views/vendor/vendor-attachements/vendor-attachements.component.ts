import { Component, OnInit, TemplateRef } from '@angular/core';
import { CompanyDocumentsService } from '../../../services/company-documents.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-vendor-attachements',
  templateUrl: './vendor-attachements.component.html',
  styleUrls: ['./vendor-attachements.component.scss'],
})
export class VendorAttachementsComponent implements OnInit {
  companyId: string;
  model: any;
  p: any;
  userName: any;
  highestRank: number;
  index: string = 'companydocument';
  documents: any[] = [];
  route: ActivatedRoute;
  router: Router;
  message: string;
  modalRef: BsModalRef;
  vendorName: string = '';
  order: string = 'description';
  reverse: string = '';
  vendorDocumentFilter: any = '';
  itemsForPagination: any = 5;
  globalCompany: any;
  helpFlag: any = false;
  vendorId: any;
  authToken: any;
  vendorAttachment: any;
  constructor(
    private modalService: BsModalService,
    private companyDocumentsService: CompanyDocumentsService,
    private companyManagementService: CompanyManagementService,
    router: Router,
    route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.vendorId = route.snapshot.params['id'];
    this.authToken = sessionStorage.getItem('auth_token');
    this.router = router;
    this.route = route;

    console.log('VendorId = ' + this.vendorId);
    if (this.vendorId) {
      this.getAllDocuments(this.vendorId);
    }
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName');
  }

  getAllDocuments(vendorId: any) {
    this.spinner.show();
    this.companyDocumentsService.getAllVendorDocuments(vendorId).subscribe(
      (response: any) => {
        this.spinner.hide();
        console.log(response);
        this.documents = response;
      },
      (error: any) => {
        this.spinner.hide();
      }
    );
  }

  refresh() {
    this.documents = [];
    this.getAllDocuments(this.vendorId);
  }
  openModal(template: TemplateRef<any>, id: any) {
    this.index = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }
  addDocument() {
    console.log(this.companyId);
    this.router.navigate(['/vendor/addDocument/'], {
      queryParams: { q: this.vendorId },
    });
  }
  editDocument(document: any) {
    this.router.navigate(['/vendor/editDocument/'], {
      queryParams: { q: this.vendorId, a: document.vendorAttachmentId },
    });
  }

  backToVendor() {
    this.router.navigate(['vendor/list/'], {
      queryParams: { q: this.vendorId },
    });
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();
    this.companyDocumentsService.removeVendorDocument(this.index).subscribe(
      (response) => {
        this.spinner.hide();
        this.modalRef.hide();
        this.refresh();
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

  // downloadDocument(companyDocument) {
  //   var blob = this.companyDocumentsService.b64toBlob(companyDocument.attachmentFile, companyDocument.contentType); //new Blob([companyDocument.attachmentFile], { type: 'text/plain' });
  //   saveAs(blob, companyDocument.fileName);
  // }

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
