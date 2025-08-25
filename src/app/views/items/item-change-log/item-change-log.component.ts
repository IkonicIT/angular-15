import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CompanyManagementService } from '../../../services/company-management.service';
import { ItemNotesService } from '../../../services/Items/item-notes.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CompanyDocumentsService } from '../../../services/index';
import { BroadcasterService } from '../../../services/broadcaster.service';

@Component({
  selector: 'app-item-change-log',
  templateUrl: './item-change-log.component.html',
  styleUrls: ['./item-change-log.component.scss'],
})
export class ItemChangeLogComponent implements OnInit {
  companyId: string;
  itemId: string;
  model: any = [];
  index: string = '';
  notes: any[] = [];
  message: string;
  modalRef: BsModalRef;
  companyName: string = '';
  order: string = 'date';
  reverse: string = '';
  itemNotesFilter: any = '';
  itemsForPagination: any = 5;
  globalCompany: any;
  currentRole: any;
  highestRank: any;
  journalId: any;
  authToken: string | null;
  itemRank: any;
  itemTag: any;
  itemType: any;
  helpFlag: any = false;
  p: any;
  loader = false;
  constructor(
    private modalService: BsModalService,
    private companyManagementService: CompanyManagementService,
    private itemNotesService: ItemNotesService,
    private companyDocumentsService: CompanyDocumentsService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private broadcasterService: BroadcasterService
  ) {
    this.itemId = route.snapshot.params['itemId'];
    this.journalId = route.snapshot.params['journalId'];
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany) {
      this.companyId = this.globalCompany.companyId;
    }
    console.log('itemId=' + this.itemId);
    if (this.companyId) {
      this.getAllNotes(this.companyId);
    }
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyName = value.name;
      this.companyId = value.companyId;
    });
  }

  ngOnInit() {
    this.itemTag = this.broadcasterService.currentItemTag;
    this.itemType = this.broadcasterService.currentItemType;
    this.itemRank = this.broadcasterService.itemRank;
    this.authToken = sessionStorage.getItem('auth_token');
    if (this.journalId != 0) {
      this.goToView(this.journalId);
    }
    this.currentRole = sessionStorage.getItem('currentRole');
    this.highestRank = sessionStorage.getItem('highestRank');
  }

  getAllNotes(companyId: string) {
    this.spinner.show();

    this.itemNotesService
      .getAllItemChangeLogs(companyId, this.itemId)
      .subscribe(
        (response: any) => {
          this.spinner.hide();

          console.log(response);
          this.notes = response;
          if (this.notes.length == 1) {
            this.goToView(this.notes[0].journalid);
          }
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }

  addNotes() {
    console.log(this.itemId);
    this.router.navigate(['/items/addItemNotes/' + this.itemId]);
  }

  openModal(template: TemplateRef<any>, id: string) {
    this.index = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  refresh() {
    this.notes = [];
    this.ngOnInit();
  }

  editItemNotes(notes: { journalid: string }) {
    this.router.navigate([
      '/items/editItemNotes/' + notes.journalid + '/' + this.itemId,
    ]);
  }

  confirm(): void {}

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

  goToView(journalid: number) {
    this.journalId = journalid;
    this.spinner.show();

    this.itemNotesService.getItemNotes(journalid).subscribe((response) => {
      this.spinner.hide();

      window.scroll(0, 0);
      this.model = response;

      if (this.model.enteredon) {
        this.model.enteredon = new Date(this.model.enteredon);
      }
    });
  }

  addAttachments() {
    this.broadcasterService.currentNoteAttachmentTitle = this.model.entityname;
    this.router.navigate([
      '/items/itemChangeLogAttachments/' + this.itemId + '/' + this.journalId,
    ]);
  }

  backToItem() {
    this.router.navigate(['/items/viewItem/' + this.itemId]);
  }

  download(companyDocument: { new: boolean }) {
    if (companyDocument.new == false) {
      this.downloadFile(companyDocument);
    } else {
      this.downloadDocumentFromDB(companyDocument);
    }
  }

  downloadDocumentFromDB(document: { new?: boolean; attachmentID?: any }) {
    this.spinner.show();

    this.companyDocumentsService
      .getCompanyDocuments(document.attachmentID)
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
      companyDocument.contentType
    );
    var fileURL = URL.createObjectURL(blob);
    window.open(fileURL);
  }

  downloadFile(attachment: {
    new?: boolean;
    fileName?: any;
    attachmentID?: any;
  }) {
    var index = attachment.fileName.lastIndexOf('.');
    var extension = attachment.fileName.slice(index + 1);
    if (extension.toLowerCase() == 'pdf' || extension.toLowerCase() == 'txt') {
      var wnd = window.open('about:blank');
      var pdfStr = `<div style="text-align:center">
      <h4>Pdf viewer</h4>
      <iframe id="iFrame" src="https://docs.google.com/viewer?url=https://gotracrat.com:8088/api/attachment/downloadaudiofile/${
        attachment.attachmentID + '?access_token=' + this.authToken
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
          </script>
        `;

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
        attachment.attachmentID + '?access_token=' + this.authToken
      }&embedded=true" >
        </div>`;

      var wnd = window.open('about:blank');
      if (wnd) wnd.document.write(pdfStr);
    } else {
      window.open(
        'https://gotracrat.com:8088/api/attachment/downloadaudiofile/' +
          attachment.attachmentID +
          '?access_token=' +
          this.authToken
      );
    }
  }
  print() {
    this.helpFlag = false;
    window.print();
  }

  help() {
    this.helpFlag = !this.helpFlag;
  }
}
