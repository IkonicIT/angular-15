import { Component, OnInit, TemplateRef } from '@angular/core';
import { ItemRepairItemsService } from '../../../services/Items/item-repair-items.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BroadcasterService } from '../../../services/broadcaster.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ItemManagementService } from '../../../services/Items/item-management.service';
import { Location } from '@angular/common';
import { CompanyManagementService } from '../../../services/company-management.service';
import { CompanyDocumentsService } from '../../../services/index';

@Component({
  selector: 'app-view-item-repair',
  templateUrl: './view-item-repair.component.html',
  styleUrls: ['./view-item-repair.component.scss'],
})
export class ViewItemRepairComponent implements OnInit {
  model: any = {};
  companyId: string;
  itemRepairId: any;
  itemId: any;
  userName: any;
  itemRank: any;
  modalRef: BsModalRef;
  message: string;
  index: any;
  flag: any;
  itemRepairsFilter: any = '';
  repairsForPagination: any = 5;
  repairs: any = [];
  completedRepairsForPagination: any = 5;
  completedRepairsFilter: any = '';
  completedRepairs: any = [];
  authToken: any;
  globalCompany: any;
  companyName: any;
  dismissible = true;
  helpFlag: any = false;
  highestRank: any;
  page1: any = 1;
  page2: any = 1;
  completedReverse: string = '';
  completedOrder: string;
  reverse: string = '';
  order: string;
  loader = false;
  constructor(
    private itemRepairItemsService: ItemRepairItemsService,
    private companyDocumentsService: CompanyDocumentsService,
    private _location: Location,
    private itemManagementService: ItemManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private broadcasterService: BroadcasterService,
    private modalService: BsModalService,
    private companyManagementService: CompanyManagementService
  ) {
    this.itemId = route.snapshot.params['itemId'];
    this.itemRepairItemsService.itemId = this.itemId;
    this.itemRepairId = route.snapshot.params['repairId'];
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
    this.highestRank = sessionStorage.getItem('highestRank');
    this.itemRank = this.broadcasterService.itemRank;
    this.getItemRepairDetails();
  }

  getItemRepairDetails() {
    this.spinner.show();

    this.itemRepairItemsService
      .getRepairDetailsForView(this.itemRepairId)
      .subscribe((response) => {
        this.model = response;
        this.broadcasterService.itemRepair = this.model;
        this.spinner.hide();
      });
  }

  updateItemRepair() {
    this.router.navigate([
      '/items/editItemRepair/' + this.itemId + '/' + this.itemRepairId,
    ]);
  }

  cancelViewRepair() {
    this.router.navigate(['/items/itemRepairs/' + this.itemId]);
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

  openModal(template: TemplateRef<any>, id: any) {
    this.index = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();

    this.itemRepairItemsService
      .removeItemRepair(
        this.index,
        this.companyId,
        this.userName,
        this.model.itemType,
        this.model.tag,
        this.model.poNumber,
        this.model.jobNumber
      )
      .subscribe(
        (response) => {
          this.modalRef.hide();
          this.model = {};
          this.getAllRepairs();
          this.flag = 1;
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

  ViewItemRepair(repairId: any) {
    this.itemRepairId = repairId;
    this.getItemRepairDetails();
    window.scroll(0, 0);
  }

  back() {
    this._location.back();
  }

  backToViewItem() {
    this.router.navigate(['/items/viewItem/' + this.itemId]);
  }

  download(companyDocument: { new: boolean }) {
    if (companyDocument.new == false) {
      this.downloadFile(companyDocument);
    } else {
      this.downloadDocumentFromDB(companyDocument);
    }
  }

  downloadDocumentFromDB(document: { new?: boolean; attachmentId?: any }) {
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

  downloadFile(attachment: {
    new?: boolean;
    fileName?: any;
    attachmentId?: any;
  }) {
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

  setCompletedOrder(value: string) {
    if (this.order === value) {
      if (this.reverse == '') {
        this.reverse = '-';
      } else {
        this.reverse = '';
      }
    }
    this.order = value;
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

  print() {
    this.helpFlag = false;
    window.print();
  }

  help() {
    this.helpFlag = !this.helpFlag;
  }
}
