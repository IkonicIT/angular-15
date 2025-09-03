import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CompanyDocumentsService,
  ItemAttachmentsService,
  ItemRepairItemsService,
} from '../../../services/index';
import { TemplateRef, SecurityContext } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { CompanyManagementService } from '../../../services/index';
import { saveAs } from 'file-saver';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import { BroadcasterService } from '../../../services/broadcaster.service';

@Component({
  selector: 'app-item-repair-attachments',
  templateUrl: './item-repair-attachments.component.html',
  styleUrls: ['./item-repair-attachments.component.scss'],
})
export class ItemRepairAttachmentsComponent implements OnInit {
  repairLogId: string;
  model: any;
  itemRank: any;
  p: any;
  index: string = 'companydocument';
  documents: any[] = [];
  route: ActivatedRoute;
  router: Router;
  message: string;
  companyId: number = 0;
  modalRef: BsModalRef;
  companyName: string = '';
  order: string = 'description';
  reverse: string = '';
  documentFilter: any = '';
  itemsForPagination: any = 5;
  globalCompany: any;
  authToken: any;
  itemId: string;
  currentRole: any;
  userName: any;
  highestRank: any;
  helpFlag: any = false;
  itemRepair: any;
  loader = false;
  constructor(
    private modalService: BsModalService,
    private companyManagementService: CompanyManagementService,
    private companyDocumentsService: CompanyDocumentsService,
    router: Router,
    route: ActivatedRoute,
    private _location: Location,
    private _itemRepairItemsService: ItemRepairItemsService,
    private spinner: NgxSpinnerService,
    private broadcasterService: BroadcasterService,
    private itemAttachmentsService: ItemAttachmentsService
  ) {
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value.companyId;
    });

    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany) {
      this.companyName = this.globalCompany.name;
      this.companyId = this.globalCompany.companyId;
    }

    this.repairLogId = route.snapshot.params['repairLogId'];
    this.itemId = this._itemRepairItemsService.itemId;
    this.authToken = sessionStorage.getItem('auth_token');
    this.router = router;
    this.route = route;
    console.log('repairLogId=' + this.repairLogId);
    if (this.repairLogId) {
      this.getAllDocuments();
    }
  }

  ngOnInit() {
    this.itemRepair = this.broadcasterService.itemRepair;
    this.itemRank = this.broadcasterService.itemRank;
    this.userName = sessionStorage.getItem('userName');
    this.currentRole = sessionStorage.getItem('currentRole');
    this.highestRank = sessionStorage.getItem('highestRank');
  }

  getAllDocuments() {
    this.spinner.show();

    this.companyDocumentsService
      .getAllRepairDocuments(this.repairLogId)
      .subscribe(
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

  refresh() {
    this.documents = [];
    this.getAllDocuments();
  }

  openModal(template: TemplateRef<any>, id: string) {
    this.index = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();

    let userLog = {
      itemTag: this.itemRepair.tag,
      itemTypeName: this.itemRepair.itemType,
      poNumber: this.itemRepair.poNumber,
      jobNumber: this.itemRepair.jobNumber,
    };
    this.itemAttachmentsService
      .removeItemRepairDocuments(
        this.index,
        this.companyId,
        this.userName,
        userLog
      )
      .subscribe(
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

  download(repairDocument: { isNew: boolean }) {
    if (repairDocument.isNew == false) {
      this.downloadFile(repairDocument);
    } else {
      this.downloadDocumentFromDB(repairDocument);
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

  downloadFile(companyDocument: {
    isNew?: boolean;
    fileName?: any;
    attachmentId?: any;
  }) {
    var index = companyDocument.fileName.lastIndexOf('.');
    var extension = companyDocument.fileName.slice(index + 1);
    if (extension.toLowerCase() == 'pdf' || extension.toLowerCase() == 'txt') {
      var wnd = window.open('about:blank');
      var pdfStr = `<div style="text-align:center">
    <h4>Pdf viewer</h4>
    <iframe id="iFrame" src="https://docs.google.com/viewer?url=https://gotracrat.com:8088/api/attachment/downloadaudiofile/${
      companyDocument.attachmentId + '?access_token=' + this.authToken
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
      companyDocument.attachmentId + '?access_token=' + this.authToken
    }&embedded=true" >
      </div>`;

      var wnd = window.open('about:blank');
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

  back() {
    this.router.navigate([
      '/items/viewItemRepair/' + this.itemId + '/' + this.repairLogId,
    ]);
  }

  print() {
    this.helpFlag = false;
    window.print();
  }
  help() {
    this.helpFlag = !this.helpFlag;
  }
}
