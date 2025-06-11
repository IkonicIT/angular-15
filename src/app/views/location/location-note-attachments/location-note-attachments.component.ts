import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ItemAttachmentsService } from '../../../services/Items/item-attachments.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { saveAs } from 'file-saver';
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
  companyName: any;
  model: any;
  index: string = '';
  documents: any[] = [];
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
  locationName: any;
  entityname: any;
  loader = false;
  highestRank: any;

  constructor(
    private modalService: BsModalService,
    private itemAttachmentsService: ItemAttachmentsService,
    private companyManagementService: CompanyManagementService,
    private companyDocumentsService: CompanyDocumentsService,
    router: Router,
    route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private locationManagementService: LocationManagementService,
    private broadcasterService: BroadcasterService,
    private locationAttachmentsService: LocationAttachmentsService
  ) {
    this.entityId = route.snapshot.params['entityId'];
    this.authToken = sessionStorage.getItem('auth_token');
    this.noteId = route.snapshot.params['noteId'];
    this.router = router;
    this.route = route;
    if (this.companyId) {
      this.getAllDocuments(this.entityId, this.noteId);
    } else {
      this.globalCompany = this.companyManagementService.getGlobalCompany();
      this.companyId = this.globalCompany.companyid;
      this.getAllDocuments(this.entityId, this.noteId);
    }
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyName = value.name;
      this.companyId = value.companyid;
    });
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName');
    this.locationName = this.locationManagementService.currentLocationName;
    this.entityname = this.broadcasterService.currentNoteAttachmentTitle;
  }

  getAllDocuments(entityId: string, noteId: string) {
    this.spinner.show();

    this.itemAttachmentsService.getAllItemNoteDocuments(noteId).subscribe(
      (response: any) => {
        this.spinner.hide();

        console.log(response);
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

  addNoteAttachments() {
    console.log(this.companyId);
    this.router.navigate(['/location/addNoteAttchments/' + this.noteId]);
  }

  editNoteDocument(document: { attachmentid: string }) {
    this.router.navigate([
      '/location/editNoteAttchments/' +
        document.attachmentid +
        '/' +
        this.noteId,
    ]);
  }

  back() {
    this.router.navigate([
      '/location/locationNote/' +
        this.locationManagementService.currentLocationId,
    ]);
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();

    let userLog = {
      noteType: 'locationnoteattachment',
      noteName: this.entityname,
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
        (response) => {
          this.spinner.hide();

          this.modalRef.hide();
          this.getAllDocuments(this.noteId, this.noteId);
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

  download(companyDocument: { isNew: boolean }) {
    if (companyDocument.isNew == false) {
      this.downloadFile(companyDocument);
    } else {
      this.downloadDocumentFromDB(companyDocument);
    }
  }

  downloadDocumentFromDB(document: { isNew?: boolean; attachmentid?: any }) {
    this.spinner.show();

    this.companyDocumentsService
      .getCompanyDocuments(document.attachmentid)
      .subscribe(
        (response) => {
          this.spinner.hide();

          this.downloadDocument(response);
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }

  downloadDocument(companyDocument: any) {
    var blob = this.companyDocumentsService.b64toBlob(
      companyDocument.attachmentFile,
      companyDocument.contenttype
    );
    var fileURL = URL.createObjectURL(blob);
    window.open(fileURL);
  }

  downloadFile(companyDocument: {
    isNew?: boolean;
    filename?: any;
    attachmentid?: any;
  }) {
    var index = companyDocument.filename.lastIndexOf('.');
    var extension = companyDocument.filename.slice(index + 1);
    if (extension.toLowerCase() == 'pdf' || extension.toLowerCase() == 'txt') {
      var wnd = window.open('about:blank');
      var pdfStr = `<div style="text-align:center">
    <h4>Pdf viewer</h4>
    <iframe id="iFrame" src="https://docs.google.com/viewer?url=https://gotracrat.com:8088/api/attachment/downloadaudiofile/${
      companyDocument.attachmentid + '?access_token=' + this.authToken
    }&embedded=true" frameborder="0" height="650px" width="100%"></iframe>
      </div>
      <script>
          function reloadIFrame() {
            var iframe = document.getElementById("iFrame");
              console.log(iframe); //work control
              console.log(iframe.contentDocument); //work control
              if(iframe.contentDocument.URL == "about:blank"){
                console.log("loaded");
                iframe.src =  iframe.src;
              }
            }
            var timerId = setInterval("reloadIFrame();", 1300);
            setTimeout(() => {
              clearInterval(timerId);
              console.log("Finally Loaded");
              }, 25000);
  
            $( document ).ready(function() {
                $('#menuiFrame').on('load', function() {
                    clearInterval(timerId);
                    console.log("Finally Loaded"); //work control
                });
            });
          </script>`;

      if (wnd) wnd.document.write(pdfStr);
    } else if (
      extension.toLowerCase() == 'jpg' ||
      extension.toLowerCase() == 'png' ||
      extension.toLowerCase() == 'jpeg' ||
      extension.toLowerCase() == 'gif'
    ) {
      var pdfStr = `<div style="text-align:center">
    <h4>Image Viewer</h4>
    <img src="https://gotracrat.com:8088/api/attachment/downloadaudiofile/${
      companyDocument.attachmentid + '?access_token=' + this.authToken
    }&embedded=true" >
      </div>`;

      var wnd = window.open('about:blank');
      if (wnd) wnd.document.write(pdfStr);
    } else {
      window.open(
        'https://gotracrat.com:8088/api/attachment/downloadaudiofile/' +
          companyDocument.attachmentid +
          '?access_token=' +
          this.authToken
      );
    }
  }
}
