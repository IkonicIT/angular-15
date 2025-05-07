import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CompanyManagementService } from '../../../services/company-management.service';
import { ItemNotesService } from '../../../services/Items/item-notes.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ItemRepairItemsService } from '../../../services/Items/item-repair-items.service';
import { ItemManagementService } from '../../../services/Items/item-management.service';
import { Location } from '@angular/common';
import { BroadcasterService } from '../../../services/broadcaster.service';
import { CompanyDocumentsService } from '../../../services/index';

@Component({
  selector: 'app-item-repairs',
  templateUrl: './item-repairs.component.html',
  styleUrls: ['./item-repairs.component.scss'],
})
export class ItemRepairsComponent implements OnInit {
  companyId: string;
  itemId: string;
  model: any;
  index: string = '';
  notes: any[] = [];
  message: string;
  modalRef: BsModalRef;
  companyName: string = '';
  typeId: any = 0;
  typeName: any = '';
  tag: any = '';
  page1: any = 1;
  page2: any = 1;
  order: string = 'date';
  reverse: string = '';
  itemRepairsFilter: any = '';
  repairsForPagination: any = 5;
  repairs: any = [];
  userName: any;
  globalCompany: any;
  currentRole: any;
  highestRank: any;
  completedOrder: string = 'date';
  completedReverse: string = '';
  completedRepairsForPagination: any = 5;
  completedRepairsFilter: any = '';
  completedRepairs: any = [];
  authToken: any;
  itemRank: any;
  itemTag: any;
  itemType: any;
  helpFlag: any = false;
  loader = false;

  constructor(
    private modalService: BsModalService,
    private itemManagementService: ItemManagementService,
    private companyManagementService: CompanyManagementService,
    private companyDocumentsService: CompanyDocumentsService,
    private itemRepairItemsService: ItemRepairItemsService,
    private _location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private broadcasterService: BroadcasterService
  ) {
    this.itemId = route.snapshot.params['id'];
    this.itemRepairItemsService.itemId = this.itemId;
    this.authToken = sessionStorage.getItem('auth_token');
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany) {
      this.companyId = this.globalCompany.companyid;
    }
    if (this.companyId) {
      this.getAllRepairs();
    }
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyName = value.name;
      this.companyId = value.companyid;
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

  getAllRepairs() {
    this.spinner.show();

    this.itemRepairItemsService
      .getAllCompletedRepairs(this.companyId, this.itemId)
      .subscribe((response) => {
        this.completedRepairs = response;
        this.itemRepairItemsService
          .getAllPreviousRepairs(this.companyId, this.itemId)
          .subscribe((response) => {
            this.repairs = response;
            this.spinner.hide();
          });
      });
  }

  itemRepairAttachments(itemRepairAttachments: { journalid: string }) {
    this.router.navigate([
      '../../items/itemRepairAttachments/' +
        this.itemId +
        '/' +
        itemRepairAttachments.journalid,
    ]);
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

  setCompletedOrder(value: string) {
    if (this.completedOrder === value) {
      if (this.completedReverse == '') {
        this.completedReverse = '-';
      } else {
        this.completedReverse = '';
      }
    }
    this.completedOrder = value;
  }

  back() {
    this._location.back();
  }

  backToViewItem() {
    this.router.navigate(['/items/viewItem/' + this.itemId]);
  }

  download(companyDocument: any) {
    if (companyDocument.new == false) {
      this.downloadFile(companyDocument);
    } else {
      this.downloadDocumentFromDB(companyDocument);
    }
  }

  downloadDocumentFromDB(document: { attachmentId: number }) {
    this.spinner.show();

    this.companyDocumentsService
      .getCompanyDocuments(document.attachmentId)
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

  downloadFile(attachment: any) {
    var index = attachment.fileName.lastIndexOf('.');
    var extension = attachment.fileName.slice(index + 1);
    if (extension.toLowerCase() == 'pdf' || extension.toLowerCase() == 'txt') {
      var wnd = window.open('about:blank');
      var pdfStr = `<div style="text-align:center">
    <h4>Pdf viewer</h4>
    <iframe id="iFrame" src="https://docs.google.com/viewer?url=https://gotracrat.com:8088/api/attachment/downloadaudiofile/${
      attachment.attachmentId + '?access_token=' + this.authToken
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
        attachment.attachmentId + '?access_token=' + this.authToken
      }&embedded=true" >
        </div>`;

      var wnd = window.open('about:blank');
      if (wnd) wnd.document.write(pdfStr);
    } else {
      window.open(
        'https://gotracrat.com:8088/api/attachment/downloadaudiofile/' +
          attachment.attachmentId +
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
