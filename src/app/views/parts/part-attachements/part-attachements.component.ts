import { Component, OnInit, TemplateRef } from '@angular/core';
import { CompanyDocumentsService } from '../../../services/company-documents.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { PartsService } from 'src/app/services/parts.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-part-attachements',
  templateUrl: './part-attachements.component.html',
  styleUrls: ['./part-attachements.component.scss'],
})
export class PartAttachementsComponent implements OnInit {
  companyId: string = '';
  model: any;
  p: any;
  userName: string | null = null;
  index: any;
  documents: any[] = [];
  message: string = '';
  highestRank: number = 0;
  modalRef: BsModalRef | null = null;
  vendorName: string = '';
  order: string = 'description';
  reverse: string = '';
  vendorDocumentFilter: any = '';
  itemsForPagination: number = 5;
  globalCompany: any;
  helpFlag: boolean = false;
  partNoteId: string | null = null;
  authToken: string | null = null;
  vendorAttachment: any;
  frame: string = '';

  constructor(
    private modalService: BsModalService,
    private companyDocumentsService: CompanyDocumentsService,
    private partsService: PartsService,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.partNoteId = this.route.snapshot.paramMap.get('id');
    this.authToken = sessionStorage.getItem('auth_token');

    this.route.paramMap.subscribe((params) => {
      this.frame = params.get('frame') || '';
    });

    if (this.partNoteId) {
      this.getAllDocuments(this.partNoteId);
    }
  }

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('userName');
  }

  getAllDocuments(vendorId: string): void {
    this.spinner.show();
    this.partsService.geAllPartAttachments(vendorId).subscribe(
      (response) => {
        this.spinner.hide();
        this.documents = response;
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  refresh(): void {
    this.documents = [];
    if (this.partNoteId) {
      this.getAllDocuments(this.partNoteId);
    }
  }

  openModal(template: TemplateRef<any>, id: any): void {
    this.index = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  addDocument(): void {
    this.router.navigate(['/parts/addDocument/', this.partNoteId]);
  }

  editDocument(document: any): void {
    this.router.navigate(['/parts/editDocument/', document.partAttachmentId]);
  }

  backToParts(): void {
    this.location.back();
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();
    this.partsService.deletePartAttachment(this.index).subscribe(
      () => {
        this.spinner.hide();
        this.modalRef?.hide();
        this.refresh();
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


  getPartAttachment(document: any): void {
    this.partsService
      .getPartAttachment(document.partAttachmentId)
      .subscribe((data: any) => {
        this.vendorAttachment = data;
        this.openAttachment();
      });
  }

  openAttachment(): void {
    if (this.isImage()) {
      const imageWindow = window.open();
      if (imageWindow) {
        imageWindow.document.write(
          `<img src="data:${this.vendorAttachment.contentType};base64,${this.vendorAttachment.attachmentFile}" />`
        );
      }
    } else {
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
  const byteArrays: BlobPart[] = [];

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

  downloadDocument(companyDocument: any): void {
    const blob = this.companyDocumentsService.b64toBlob(
      companyDocument.attachmentFile,
      companyDocument.contentType
    );
    const fileURL = URL.createObjectURL(blob);
    window.open(fileURL);
  }

  print(): void {
    this.helpFlag = false;
    window.print();
  }

  help(): void {
    this.helpFlag = !this.helpFlag;
  }
}
