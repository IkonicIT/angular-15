import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ItemAttachmentsService } from '../../../services/Items/item-attachments.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { saveAs } from 'file-saver';
import { Location } from '@angular/common';
import { BroadcasterService } from '../../../services/broadcaster.service';
import { CompanyDocumentsService } from '../../../services/index';

@Component({
  selector: 'app-item-note-attachements',
  templateUrl: './item-note-attachements.component.html',
  styleUrls: ['./item-note-attachements.component.scss'],
})
export class ItemNoteAttachementsComponent implements OnInit {
  itemRank: any;
  itemId: string;
  companyId: string;
  companyName: any;
  model: any;
  userName: any;
  index: string = '';
  documents: any[] = [];
  message: string;
  modalRef: BsModalRef;
  order: string = 'description';
  reverse: string = '';
  documentFilter: any = '';
  itemsForPagination: any = 5;
  globalCompany: any;
  authToken: any;
  currentRole: any;
  highestRank: any;
  currentItemId: any;
  entityName: any;
  helpFlag: any = false;
  p: any;
  itemTag: any;
  itemType: any;
  loader = false;

  constructor(
    private modalService: BsModalService,
    private itemAttachmentsService: ItemAttachmentsService,
    private companyManagementService: CompanyManagementService,
    private _location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private broadcasterService: BroadcasterService,
    private companyDocumentsService: CompanyDocumentsService
  ) {
    this.itemId = this.route.snapshot.params['id'];
    this.currentItemId = this.route.snapshot.params['itemId'];
    this.authToken = sessionStorage.getItem('auth_token');

    if (this.companyId) {
      this.getAllDocuments(this.itemId);
    } else {
      this.globalCompany = this.companyManagementService.getGlobalCompany();
      this.companyId = this.globalCompany.companyId;
      this.getAllDocuments(this.itemId);
    }

    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyName = value.name;
      this.companyId = value.companyId;
    });
  }

  ngOnInit() {
    this.entityName = this.broadcasterService.currentNoteAttachmentTitle;
    this.itemRank = this.broadcasterService.itemRank;
    this.itemTag = this.broadcasterService.currentItemTag;
    this.itemType = this.broadcasterService.currentItemType;
    this.userName = sessionStorage.getItem('userName');
    this.currentRole = sessionStorage.getItem('currentRole');
    this.highestRank = sessionStorage.getItem('highestRank');
  }

  getAllDocuments(itemId: string) {
    this.spinner.show();
    this.itemAttachmentsService.getAllItemNoteDocuments(itemId).subscribe(
      (response: any) => {
        this.spinner.hide();
        this.documents = response;
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

  addItemDocument() {
    this.router.navigate([
      '/items/addNoteAttachment/' + this.itemId + '/' + this.currentItemId,
    ]);
  }

  editItemDocument(document: { attachmentId: string }) {
    this.router.navigate([
      '/items/editNoteAttachment/' +
        document.attachmentId +
        '/' +
        this.itemId +
        '/' +
        this.currentItemId,
    ]);
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();

    const userLog = {
      noteType: 'itemnoteattachment',
      noteName: this.entityName,
      itemTag: this.itemTag,
      itemTypeName: this.itemType,
    };

    this.itemAttachmentsService
      .removeItemNoteDocuments(
        this.index,
        this.companyId,
        this.userName,
        userLog
      )
      .subscribe(
        () => {
          this.spinner.hide();
          this.modalRef.hide();
          this.getAllDocuments(this.itemId);
        },
        () => {
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
      this.reverse = this.reverse === '' ? '-' : '';
    }
    this.order = value;
  }

  download(companyDocument: any) {
    if (companyDocument.isNew === false) {
      this.downloadFile(companyDocument);
    } else {
      this.downloadDocumentFromDB(companyDocument);
    }
  }

  downloadDocumentFromDB(document: { attachmentId: number }) {
    this.spinner.show();
    this.itemAttachmentsService.getItemDocuments(document.attachmentId).subscribe(
      (response) => {
        this.spinner.hide();
        this.downloadDocument(response);
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  downloadDocument(companyDocument: any) {
    const blob = this.companyDocumentsService.b64toBlob(
      companyDocument.attachmentFile,
      companyDocument.contentType
    );
    const fileURL = URL.createObjectURL(blob);
    window.open(fileURL);
  }

  downloadFile(companyDocument: any) {
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
    } else if (
      ['jpg', 'png', 'jpeg', 'gif'].includes(extension)
    ) {
      const wnd = window.open('about:blank');
      const imgStr = `<div style="text-align:center">
        <h4>Image Viewer</h4>
        <img src="https://gotracrat.com:8088/api/attachment/downloadaudiofile/${
          companyDocument.attachmentId + '?access_token=' + this.authToken
        }&embedded=true" >
      </div>`;
      if (wnd) wnd.document.write(imgStr);
    } else {
      window.open(
        'https://gotracrat.com:8088/api/attachment/downloadaudiofile/' +
          companyDocument.attachmentId +
          '?access_token=' +
          this.authToken
      );
    }
  }

  back() {
    this.router.navigate(['/items/itemNotes/' + this.currentItemId + '/' + 0]);
  }

  backToViewItem() {
    this.router.navigate(['/items/viewItem/' + this.currentItemId]);
  }

  print() {
    this.helpFlag = false;
    window.print();
  }

  help() {
    this.helpFlag = !this.helpFlag;
  }
}
