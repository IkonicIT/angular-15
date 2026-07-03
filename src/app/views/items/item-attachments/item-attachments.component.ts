import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LocationAttachmentsService } from '../../../services/location-attachments.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ItemAttachmentsService } from '../../../services/Items/item-attachments.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Location } from '@angular/common';
import { BroadcasterService } from '../../../services/broadcaster.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-item-attachments',
  templateUrl: './item-attachments.component.html',
  styleUrls: ['./item-attachments.component.scss'],
})
export class ItemAttachmentsComponent implements OnInit {
  @ViewChild('myModal') public myModal!: ModalDirective;
  public activeCompanyDocument: any;
  itemId: string;
  companyId: string;
  companyName: any;
  model: any;
  index: string = '';
  documents: any[] = [];
  message: string;
  modalRef!: BsModalRef;
  order: string = 'description';
  reverse: string = '';
  p: any;
  documentFilter: any = '';
  itemsForPagination: any = 5;
  globalCompany: any;
  companyDocument: any;
  authToken: any;
  currentRole: any;
  userName: any;
  highestRank: any;
  msg: number = 0;
  itemRank: any;
  itemTag: any;
  itemType: any;
  currentAttachmentId: any;
  helpFlag: any = false;
  imageSource: any;
  dismissible = true;
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
    private sanitizer: DomSanitizer
  ) {
    this.itemId = this.route.snapshot.params['id'];
    this.currentAttachmentId = this.route.snapshot.params['attachmentId'];
    this.authToken = sessionStorage.getItem('auth_token');
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany) {
      this.companyId = this.globalCompany.companyId;
      this.companyName = this.globalCompany.name;
    }
    if (this.companyId) {
      this.getAllDocuments(this.itemId);
    }
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyName = value.name;
      this.companyId = value.companyId;
    });
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName');
    this.itemTag = this.broadcasterService.currentItemTag;
    this.itemType = this.broadcasterService.currentItemType;
    this.itemRank = this.broadcasterService.itemRank;
    this.currentRole = sessionStorage.getItem('currentRole');
    this.highestRank = sessionStorage.getItem('highestRank');
  }

  getAllDocuments(itemId: string) {
    this.spinner.show();
    this.itemAttachmentsService.getAllItemDocuments(itemId).subscribe(
      (response: any) => {
        this.spinner.hide();
        this.documents = Array.isArray(response) ? response : [];
        this.setShowFlagBasedOncontentType(this.documents);
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  setShowFlagBasedOncontentType(documents: any[]) {
    documents.forEach((element) => {
      element.show = element.contentType.includes('image');
    });
  }

  refresh() {
    this.getAllDocuments(this.itemId);
  }

  openModal(template: TemplateRef<any>, id: string) {
    this.index = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  addItemDocument() {
    this.router.navigate([
      '/items/addAttachment/' + this.itemId + '/' + this.currentAttachmentId,
    ]);
  }

  editItemDocument(document: { attachmentId: string }) {
    this.router.navigate([
      '/items/editAttachment/' +
        document.attachmentId +
        '/' +
        this.itemId +
        '/' +
        this.currentAttachmentId,
    ]);
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();
    let userLog = {
      itemTag: this.itemTag,
      itemTypeName: this.itemType,
    };
    this.itemAttachmentsService
      .removeItemDocuments(this.index, this.companyId, this.userName, userLog)
      .subscribe(
        () => {
          this.spinner.hide();
          this.modalRef.hide();
          this.getAllDocuments(this.itemId);
          if (this.currentAttachmentId == this.index) {
            this.spinner.show();
            this.itemAttachmentsService
              .updateItemDefaultImage(this.itemId, 0)
              .subscribe(
                () => {
                  this.spinner.hide();
                },
                () => {
                  this.spinner.hide();
                }
              );
          }
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

  downloadDocuments(companyDocument: { isNew: boolean }) {
    if (companyDocument.isNew == false) {
      this.downloadFile(companyDocument);
    } else {
      this.downloadDocumentFromDB(companyDocument);
    }
  }

  downloadDocumentFromDB(document: { isNew?: boolean; attachmentId?: any }) {
    this.spinner.show();
    this.itemAttachmentsService
      .getItemDocuments(document.attachmentId)
      .subscribe(
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
    const blob = this.itemAttachmentsService.b64toBlob(
      companyDocument.attachmentFile,
      companyDocument.contentType
    );
    const fileURL = URL.createObjectURL(blob);
    window.open(fileURL);
  }

  downloadFile(companyDocument: {
    isNew?: boolean;
    fileName?: any;
    attachmentId?: any;
  }) {
    const index = companyDocument.fileName.lastIndexOf('.');
    const extension = companyDocument.fileName.slice(index + 1);
    if (extension.toLowerCase() == 'pdf' || extension.toLowerCase() == 'txt') {
      const wnd = window.open('about:blank');
      const pdfStr = `<div style="text-align:center">
      <h4>Pdf viewer</h4>
      <iframe id="iFrame" src="https://docs.google.com/viewer?url=https://gotracrat.com:8088/api/attachment/downloadaudiofile/${
        companyDocument.attachmentId + '?access_token=' + this.authToken
      }&embedded=true" frameborder="0" height="650px" width="100%"></iframe>
        </div>
        <script>
          function reloadIFrame() {
            var iframe = document.getElementById("iFrame");
              if(iframe.contentDocument.URL == "about:blank"){
                iframe.src =  iframe.src;
              }
            }
            var timerId = setInterval("reloadIFrame();", 1300);
            setTimeout(() => {
              clearInterval(timerId);
              }, 25000);

            $( document ).ready(function() {
                $('#menuiFrame').on('load', function() {
                    clearInterval(timerId);
                });
            });
          </script>
        `;
      if (wnd) wnd.document.write(pdfStr);
    } else if (
      extension.toLowerCase() == 'jpg' ||
      extension.toLowerCase() == 'png' ||
      extension.toLowerCase() == 'jpeg' ||
      extension.toLowerCase() == 'gif'
    ) {
      const pdfStr = `<div style="text-align:center">
      <h4>Image Viewer</h4>
      <img src="https://gotracrat.com:8088/api/attachment/downloadaudiofile/${
        companyDocument.attachmentId + '?access_token=' + this.authToken
      }&embedded=true" >
        </div>`;
      const wnd = window.open('about:blank');
      if (wnd) wnd.document.write(pdfStr);
    } else {
      window.open(
        'https://gotracrat.com:8088/api/attachment/downloadaudiofile/' +
          companyDocument.attachmentId +
          '?access_token=' +
          this.authToken
      );
    }
  }

  setActiveCompany(companyDocument: { isNew: any; attachmentId: any }) {
    this.activeCompanyDocument = companyDocument;
    if (companyDocument.isNew) {
      this.spinner.show();
      this.itemAttachmentsService
        .getItemDocuments(companyDocument.attachmentId)
        .subscribe(
          (response: any) => {
            this.spinner.hide();
            this.imageSource = this.sanitizer.bypassSecurityTrustResourceUrl(
              `data:image/png;base64, ${response.attachmentFile}`
            );
            this.myModal.show();
          },
          () => {
            this.spinner.hide();
          }
        );
    } else {
      this.imageSource =
        'https://gotracrat.com:8088/api/attachment/downloadaudiofile/' +
        companyDocument.attachmentId +
        '?access_token=' +
        this.authToken;
      this.myModal.show();
    }
  }

  setAsDefault(companyDocument: { attachmentId: any }) {
    this.spinner.show();
    this.itemAttachmentsService
      .updateItemDefaultImage(this.itemId, companyDocument.attachmentId)
      .subscribe(
        () => {
          this.spinner.hide();
          this.msg = 2;
          this.currentAttachmentId = companyDocument.attachmentId;
          setTimeout(() => {
            this.msg = 0;
          }, 7000);
        },
        () => {
          this.spinner.hide();
        }
      );
    this.myModal.hide();
  }

  back() {
    this._location.back();
  }

  backToViewItem() {
    this.router.navigate(['/items/viewItem/' + this.itemId]);
  }

  print() {
    this.helpFlag = false;
    window.print();
  }

  help() {
    this.helpFlag = !this.helpFlag;
  }
}