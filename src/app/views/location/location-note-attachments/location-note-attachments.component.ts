import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ItemAttachmentsService } from '../../../services/Items/item-attachments.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CompanyDocumentsService } from '../../../services/index';
import { LocationManagementService } from '../../../services/location-management.service';
import { BroadcasterService } from '../../../services/broadcaster.service';
import { LocationAttachmentsService } from '../../../services/location-attachments.service';

@Component({
  selector: 'app-location-note-attachments',
  templateUrl: './location-note-attachments.component.html',
  styleUrls: ['./location-note-attachments.component.scss'],
})
export class LocationNoteAttachmentsComponent implements OnInit {
  entityId: string;
  noteId: string;
  p: any;
  companyId: string;
  companyName: string = '';
  model: any;
  index: string = '';
  documents: any[] = [];
  message: string;
  modalRef!: BsModalRef;
  order: string = 'description';
  reverse: string = '';
  documentFilter: any = '';
  itemsForPagination: number = 5;
  userName: string = '';
  globalCompany: any;
  authToken: string | null;
  locationName: string = '';
  entityName: string = '';
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
    private locationManagementService: LocationManagementService,
    private broadcasterService: BroadcasterService,
    private locationAttachmentsService: LocationAttachmentsService
  ) {
    this.entityId = this.route.snapshot.params['entityId'];
    this.noteId = this.route.snapshot.params['noteId'];
    this.authToken = sessionStorage.getItem('auth_token');
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyId = this.globalCompany?.companyId ?? '';
    this.companyName = this.globalCompany?.name ?? '';
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyName = value.name;
      this.companyId = value.companyId;
    });
    this.getAllDocuments(this.entityId, this.noteId);
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName') ?? '';
    this.locationName = this.locationManagementService.currentLocationName;
    this.entityName = this.broadcasterService.currentNoteAttachmentTitle;
  }

  getAllDocuments(entityId: string, noteId: string) {
    this.spinner.show();
    this.itemAttachmentsService.getAllItemNoteDocuments(noteId).subscribe(
      (response: any) => {
        this.spinner.hide();
        this.documents = Array.isArray(response) ? response : [];
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  refresh() {
    this.getAllDocuments(this.entityId, this.noteId);
  }

  openModal(template: TemplateRef<any>, id: string) {
    this.index = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  addNoteAttachments() {
    this.router.navigate(['/location/addNoteAttchments/' + this.noteId]);
  }

  editNoteDocument(document: { attachmentId: string }) {
    this.router.navigate([
      '/location/editNoteAttchments/' + document.attachmentId + '/' + this.noteId,
    ]);
  }

  back() {
    this.router.navigate([
      '/location/locationNote/' + this.locationManagementService.currentLocationId,
    ]);
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();
    const userLog = {
      noteType: 'locationnoteattachment',
      noteName: this.entityName,
      locationName: this.locationName,
    };
    this.locationAttachmentsService
      .removeLocationNoteDocuments(
        this.index,
        this.companyId,
        this.userName,
        userLog
      )
      .subscribe(
        () => {
          this.spinner.hide();
          this.modalRef.hide();
          this.getAllDocuments(this.entityId, this.noteId);
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

  download(companyDocument: { isNew: boolean }) {
    if (companyDocument.isNew === false) {
      this.downloadFile(companyDocument);
    } else {
      this.downloadDocumentFromDB(companyDocument);
    }
  }

  downloadDocumentFromDB(document: { isNew?: boolean; attachmentId?: any }) {
    this.spinner.show();
    this.companyDocumentsService
      .getCompanyDocuments(document.attachmentId)
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
    const blob = this.companyDocumentsService.b64toBlob(
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
    if (['pdf', 'txt'].includes(extension.toLowerCase())) {
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
          </script>`;
      if (wnd) wnd.document.write(pdfStr);
    } else if (
      ['jpg', 'png', 'jpeg', 'gif'].includes(extension.toLowerCase())
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
}