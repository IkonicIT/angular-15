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
  companyId: string = '';
  itemId: string = '';
  model: any = {};
  index: string = '';
  notes: any[] = [];
  message: string = '';
  modalRef?: BsModalRef;
  companyName: string = '';
  typeId: number = 0;
  typeName: string = '';
  tag: string = '';
  page1: number = 1;
  page2: number = 1;
  order: string = 'date';
  reverse: string = '';
  itemRepairsFilter: string = '';
  repairsForPagination: number = 5;
  repairs: any[] = [];
  userName: string = '';
  globalCompany: any = {};
  currentRole: string = '';
  
  completedOrder: string = 'date';
  completedReverse: string = '';
  completedRepairsForPagination: number = 5;
  completedRepairsFilter: string = '';
  completedRepairs: any[] = [];
  authToken: string = '';
 itemRank: number = 0;
highestRank: number = 0;

  itemTag: string = '';
  itemType: string = '';
  helpFlag: boolean = false;
  loader: boolean = false;

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
    this.itemId = this.route.snapshot.params['id'] ?? '';
    this.itemRepairItemsService.itemId = this.itemId;
    this.authToken = sessionStorage.getItem('auth_token') ?? '';
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany) {
      this.companyId = this.globalCompany.companyId;
    }
    if (this.companyId) {
      this.getAllRepairs();
    }
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyName = value.name;
      this.companyId = value.companyId;
    });
  }

  ngOnInit() {
  this.userName = sessionStorage.getItem('userName') ?? '';
  this.itemTag = this.broadcasterService.currentItemTag ?? '';
  this.itemType = this.broadcasterService.currentItemType ?? '';
  this.itemRank = Number(this.broadcasterService.itemRank ?? 0);  
  this.currentRole = sessionStorage.getItem('currentRole') ?? '';
  this.highestRank = Number(sessionStorage.getItem('highestRank') ?? 0);  
}

 getAllRepairs() {
  this.spinner.show();
  this.itemRepairItemsService
    .getAllCompletedRepairs(this.companyId, this.itemId)
    .subscribe((completed) => {
      this.completedRepairs = (completed as any[]) ?? [];
      this.itemRepairItemsService
        .getAllPreviousRepairs(this.companyId, this.itemId)
        .subscribe((previous) => {
          this.repairs = (previous as any[]) ?? [];
          this.spinner.hide();
        });
    });
}


  itemRepairAttachments(itemRepairAttachments: { journalId: string }) {
    this.router.navigate([
      '../../items/itemRepairAttachments/' +
        this.itemId +
        '/' +
        itemRepairAttachments.journalId,
    ]);
  }

  setOrder(value: string) {
    this.reverse = this.order === value && this.reverse === '' ? '-' : '';
    this.order = value;
  }

  setCompletedOrder(value: string) {
    this.completedReverse =
      this.completedOrder === value && this.completedReverse === '' ? '-' : '';
    this.completedOrder = value;
  }

  back() {
    this._location.back();
  }

  backToViewItem() {
    this.router.navigate(['/items/viewItem/' + this.itemId]);
  }

  download(companyDocument: any) {
    if (!companyDocument.new) {
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
        () => this.spinner.hide()
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

  downloadFile(attachment: any) {
    const index = attachment.fileName.lastIndexOf('.');
    const extension = attachment.fileName.slice(index + 1).toLowerCase();

    if (['pdf', 'txt'].includes(extension)) {
      const wnd = window.open('about:blank');
      const pdfStr = `<div style="text-align:center">
        <h4>Pdf viewer</h4>
        <iframe id="iFrame" src="https://docs.google.com/viewer?url=https://gotracrat.com:8088/api/attachment/downloadaudiofile/${
          attachment.attachmentId + '?access_token=' + this.authToken
        }&embedded=true" frameborder="0" height="650px" width="100%"></iframe>
      </div>`;
      if (wnd) wnd.document.write(pdfStr);
    } else if (['jpg', 'png', 'jpeg', 'gif'].includes(extension)) {
      const wnd = window.open('about:blank');
      const imgStr = `<div style="text-align:center">
        <h4>Image Viewer</h4>
        <img src="https://gotracrat.com:8088/api/attachment/downloadaudiofile/${
          attachment.attachmentId + '?access_token=' + this.authToken
        }&embedded=true" >
      </div>`;
      if (wnd) wnd.document.write(imgStr);
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
