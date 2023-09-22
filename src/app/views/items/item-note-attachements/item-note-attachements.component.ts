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
  route: ActivatedRoute;
  router: Router;
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
  entityname: any;
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
    router: Router,
    route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private broadcasterService: BroadcasterService,
    private companyDocumentsService: CompanyDocumentsService
  ) {
    this.itemId = route.snapshot.params['id'];
    this.currentItemId = route.snapshot.params['itemId'];
    this.authToken = sessionStorage.getItem('auth_token');
    this.router = router;
    this.route = route;
    console.log('itemId=' + this.itemId);
    if (this.companyId) {
      this.getAllDocuments(this.itemId);
    } else {
      this.globalCompany = this.companyManagementService.getGlobalCompany();
      this.companyId = this.globalCompany.companyid;
      this.getAllDocuments(this.itemId);
    }
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyName = value.name;
      this.companyId = value.companyid;
    });
  }

  ngOnInit() {
    this.entityname = this.broadcasterService.currentNoteAttachmentTitle;
    this.itemRank = this.broadcasterService.itemRank;
    this.itemTag = this.broadcasterService.currentItemTag;
    this.itemType = this.broadcasterService.currentItemType;
    this.userName = sessionStorage.getItem('userName');
    this.currentRole = sessionStorage.getItem('currentRole');
    this.highestRank = sessionStorage.getItem('highestRank');
    console.log('currentRole is' + this.currentRole);
    console.log('highestRank is' + this.highestRank);
  }

  getAllDocuments(itemId: string) {
    this.spinner.show();
    this.loader = true;
    this.itemAttachmentsService.getAllItemNoteDocuments(itemId).subscribe(
      (response: any) => {
        this.spinner.hide();
        this.loader = false;
        console.log(response);
        this.documents = response;
      },
      (error) => {
        this.spinner.hide();
        this.loader = false;
      }
    );
  }

  refresh() {}

  openModal(template: TemplateRef<any>, id: string) {
    this.index = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  addItemDocument() {
    console.log(this.companyId);
    this.router.navigate([
      '/items/addNoteAttachment/' + this.itemId + '/' + this.currentItemId,
    ]);
  }

  editItemDocument(document: { attachmentid: string }) {
    this.router.navigate([
      '/items/editNoteAttachment/' +
        document.attachmentid +
        '/' +
        this.itemId +
        '/' +
        this.currentItemId,
    ]);
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();
    this.loader = true;
    let userLog = {
      noteType: 'itemnoteattachment',
      noteName: this.entityname,
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
        (response) => {
          this.spinner.hide();
          this.loader = false;
          this.modalRef.hide();
          this.getAllDocuments(this.itemId);
        },
        (error) => {
          this.spinner.hide();
          this.loader = false;
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

  download(companyDocument: any) {
    if (companyDocument.isNew == false) {
      this.downloadFile(companyDocument);
    } else {
      this.downloadDocumentFromDB(companyDocument);
    }
  }

  downloadDocumentFromDB(document: { attachmentid: number }) {
    this.spinner.show();
    this.loader = true;
    this.itemAttachmentsService
      .getItemDocuments(document.attachmentid)
      .subscribe(
        (response) => {
          this.spinner.hide();
          this.loader = false;
          this.downloadDocument(response);
        },
        (error) => {
          this.spinner.hide();
          this.loader = false;
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

  downloadFile(companyDocument: any) {
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
