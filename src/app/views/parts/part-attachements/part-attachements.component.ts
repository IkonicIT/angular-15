import { Component, OnInit, TemplateRef } from '@angular/core';
import { CompanyDocumentsService } from '../../../services/company-documents.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router, ActivatedRoute } from '@angular/router';
// import { saveAs } from 'file-saver/FileSaver';
import { NgxSpinnerService } from 'ngx-spinner';
import { PartsService } from 'src/app/services/parts.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-part-attachements',
  templateUrl: './part-attachements.component.html',
  styleUrls: ['./part-attachements.component.scss'],
})
export class PartAttachementsComponent implements OnInit {
  companyId: string;
  model: any;
  p: any;
  userName: any;
  index: any;
  documents: any[] = [];
  route: ActivatedRoute;
  router: Router;
  message: string;
  highestRank: number;
  modalRef: BsModalRef;
  vendorName: string = '';
  order: string = 'description';
  reverse: string = '';
  vendorDocumentFilter: any = '';
  itemsForPagination: any = 5;
  globalCompany: any;
  helpFlag: any = false;
  partNoteId: any;
  authToken: any;
  vendorAttachment: any;
  frame: any;
  constructor(
    private modalService: BsModalService,
    private companyDocumentsService: CompanyDocumentsService,
    private partsService: PartsService,
    private location: Location,
    router: Router,
    route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.partNoteId = route.snapshot.params['id'];
    this.authToken = sessionStorage.getItem('auth_token');
    this.router = router;
    this.route = route;
    this.route.params.subscribe((params) => {
      this.frame = params['frame'] || '';
    });
    console.log('VendorId = ' + this.partNoteId);
    if (this.partNoteId) {
      this.getAllDocuments(this.partNoteId);
    }
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName');
  }

  getAllDocuments(vendorId: any) {
    this.spinner.show();
    this.partsService.geAllPartAttachments(this.partNoteId).subscribe(
      (response) => {
        this.spinner.hide();
        console.log(response);
        this.documents = response;
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  refresh() {
    this.documents = [];
    this.getAllDocuments(this.partNoteId);
  }
  openModal(template: TemplateRef<any>, id: any) {
    this.index = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }
  addDocument() {
    console.log('Part', this.companyId);
    this.router.navigate(['/parts/addDocument/', this.partNoteId]);
  }
  editDocument(document: any) {
    this.router.navigate(['/parts/editDocument/', document.partAttachmentID]);
  }

  backToParts() {
    this.location.back();
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();
    this.partsService.deletePartAttachment(this.index).subscribe(
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
  //   var blob = this.companyDocumentsService.b64toBlob(companyDocument.attachmentFile, companyDocument.contenttype); //new Blob([companyDocument.attachmentFile], { type: 'text/plain' });
  //   saveAs(blob, companyDocument.filename);
  // }

  getPartAttachment(document: any): void {
    this.partsService
      .getPartAttachment(document.partAttachmentID)
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
          `<img src="data:${this.vendorAttachment.contenttype};base64,${this.vendorAttachment.attachmentFile}" />`
        );
      }
    } else {
      // Download the attachment
      const blob = this.base64ToBlob(
        this.vendorAttachment.attachmentFile,
        this.vendorAttachment.contenttype
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.vendorAttachment.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  isImage(): boolean {
    return (
      this.vendorAttachment &&
      this.vendorAttachment.contenttype.startsWith('image')
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
      companyDocument.contenttype
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
