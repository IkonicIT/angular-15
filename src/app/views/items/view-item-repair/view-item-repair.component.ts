import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { ItemRepairItemsService } from '../../../services/Items/item-repair-items.service';
import { ItemManagementService } from '../../../services/Items/item-management.service';
import { BroadcasterService } from '../../../services/broadcaster.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { CompanyDocumentsService } from '../../../services/index';

type Nullable<T> = T | null | undefined;

interface Attachment {
  new?: boolean;
  fileName?: string;
  attachmentId?: string | number;
}

interface CompanyDocumentFromDB {
  attachmentFile: string;  
  contentType: string;
}

@Component({
  selector: 'app-view-item-repair',
  templateUrl: './view-item-repair.component.html',
  styleUrls: ['./view-item-repair.component.scss'],
})
export class ViewItemRepairComponent implements OnInit, OnDestroy {
  model: any = {};
  companyId: string = ''; 
  itemRepairId!: string;
  itemId!: string;
  mmsDetails: any;
  userName: string = '';
  itemRank: any;
  modalRef!: BsModalRef;
  message: string | undefined;
  index: any;
  flag: any;

  itemRepairsFilter: any = '';
  repairsForPagination = 5;
  repairs: any[] = [];
  isMMS: boolean = false;
  completedRepairsForPagination = 5;
  completedRepairsFilter: any = '';
  completedRepairs: any[] = [];

  authToken: string | null = null;
  globalCompany: any;
  companyName: any;
  dismissible = true;
  helpFlag = false;

  highestRank: any;
  page1 = 1;
  page2 = 1;

  completedReverse: '' | '-' = '';
  completedOrder: string | undefined;

  reverse: '' | '-' = '';
  order: string | undefined;

  loader = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly itemRepairItemsService: ItemRepairItemsService,
    private readonly companyDocumentsService: CompanyDocumentsService,
    private readonly _location: Location,
    private readonly itemManagementService: ItemManagementService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly spinner: NgxSpinnerService,
    private readonly broadcasterService: BroadcasterService,
    private readonly modalService: BsModalService,
    private readonly companyManagementService: CompanyManagementService
  ) {
    const itemIdParam = this.route.snapshot.params['itemId'];
    const repairIdParam = this.route.snapshot.params['repairId'];

    this.itemId = String(itemIdParam ?? '');
    this.itemRepairId = String(repairIdParam ?? '');

    this.itemRepairItemsService.itemId = this.itemId;
    this.authToken = sessionStorage.getItem('auth_token');

    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany?.companyId) {
      this.companyId = String(this.globalCompany.companyId);
    }

    if (this.companyId) {
      this.getAllRepairs();
    }

    if (this.companyManagementService.globalCompanyChange?.pipe) {
      this.companyManagementService.globalCompanyChange
        .pipe(takeUntil(this.destroy$))
        .subscribe((value: any) => {
          this.globalCompany = value;
          this.companyName = value?.name;
          this.companyId = value?.companyId ? String(value.companyId) : '';
          if (this.companyId) {
            this.getAllRepairs();
          }
        });
    }
  }

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('userName') || '';
    this.highestRank = sessionStorage.getItem('highestRank');
    this.itemRank = this.broadcasterService.itemRank;
    this.getItemRepairDetails();
    this.isMMS = sessionStorage.getItem('itemMMS') === 'true';

  if (this.isMMS) {
    this.getMmsRepairDetails();
  }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  getMmsRepairDetails(): void {
  this.spinner.show();

  this.itemRepairItemsService
    .getItemMmsDetails(this.itemRepairId)
    .subscribe(
      (response) => {
        console.log('MMS Repair Details response:', response);
        this.mmsDetails = response;
        this.spinner.hide();
      },
      (error) => {
        console.error('Error fetching MMS Repair Details:', error);
        this.spinner.hide();
      }
    );
}

  getItemRepairDetails(): void {
    this.spinner.show();
    this.itemRepairItemsService
      .getRepairDetailsForView(this.itemRepairId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response) => {
          this.model = response;
          this.broadcasterService.itemRepair = this.model;
          this.spinner.hide();
        },
        () => {
          this.spinner.hide();
        }
      );
  }

  updateItemRepair(): void {
    this.router.navigate([
      '/items/editItemRepair',
      this.itemId,
      this.itemRepairId,
    ]);
  }

  cancelViewRepair(): void {
    this.router.navigate(['/items/itemRepairs', this.itemId]);
  }

  getAllRepairs(): void {
    if (!this.companyId) return;

    this.spinner.show();

    this.itemRepairItemsService
      .getAllCompletedRepairs(this.companyId, this.itemId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (completedResponse: any) => {
          this.completedRepairs = (completedResponse as any[]) || [];

          this.itemRepairItemsService
            .getAllPreviousRepairs(this.companyId, this.itemId)
            .pipe(takeUntil(this.destroy$))
            .subscribe(
              (previousResponse: any) => {
                this.repairs = (previousResponse as any[]) || [];
                this.spinner.hide();
              },
              () => {
                this.spinner.hide();
              }
            );
        },
        () => {
          this.spinner.hide();
        }
      );
  }

  openModal(template: TemplateRef<any>, id: any): void {
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
        this.model?.itemType,
        this.model?.tag,
        this.model?.poNumber,
        this.model?.jobNumber
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          if (this.modalRef) {
            this.modalRef.hide();
          }
          this.model = {};
          this.getAllRepairs();
          this.flag = 1;
          this.spinner.hide();
        },
        () => {
          this.spinner.hide();
        }
      );
  }

  decline(): void {
    this.message = 'Declined!';
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }

  ViewItemRepair(repairId: any): void {
    this.itemRepairId = String(repairId ?? '');
    this.getItemRepairDetails();
    this.getMmsRepairDetails();
    window.scroll(0, 0);
  }

  back(): void {
    this._location.back();
  }

  backToViewItem(): void {
    this.router.navigate(['/items/viewItem', this.itemId]);
  }

  download(companyDocument: { new: boolean } & Partial<Attachment>): void {
    if (companyDocument.new === false) {
      this.downloadFile(companyDocument);
    } else {
      this.downloadDocumentFromDB(companyDocument);
    }
  }

 downloadDocumentFromDB(document: Partial<Attachment>): void {
  if (!document.attachmentId) return;

  const id = Number(document.attachmentId); 

  this.spinner.show();
  this.companyDocumentsService
    .getCompanyDocuments(id) 
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (response: any) => { 
        this.spinner.hide();
        const doc = response as CompanyDocumentFromDB;
        this.downloadDocument(doc);
      },
      () => {
        this.spinner.hide();
      }
    );
}

  downloadDocument(companyDocument: CompanyDocumentFromDB): void {
    const blob = this.companyDocumentsService.b64toBlob(
      companyDocument.attachmentFile,
      companyDocument.contentType
    );
    const fileURL = URL.createObjectURL(blob);
    window.open(fileURL);
  }

  downloadFile(attachment: Attachment): void {
    const fileName = attachment.fileName || '';
    const index = fileName.lastIndexOf('.');
    const extension =
      index >= 0 ? fileName.slice(index + 1).toLowerCase() : '';

    const token = this.authToken || '';
    const id = attachment.attachmentId;

    if (!id) return;

    if (extension === 'pdf' || extension === 'txt') {
      const pdfStr = `<div style="text-align:center">
        <h4>Pdf viewer</h4>
        <iframe id="iFrame" src="https://gotracrat.com:8088/api/attachment/downloadaudiofile/${id}?access_token=${token}&embedded=true" frameborder="0" height="650px" width="100%"></iframe>
      </div>
      <script>
        function reloadIFrame() {
          var iframe = document.getElementById("iFrame");
          if (iframe && iframe.contentDocument && iframe.contentDocument.URL === "about:blank") {
            iframe.src = iframe.src;
          }
        }
        var timerId = setInterval(reloadIFrame, 1300);
        setTimeout(function () { clearInterval(timerId); }, 25000);
      </script>`;

      const wnd = window.open('about:blank');
      if (wnd && wnd.document) {
        wnd.document.write(pdfStr);
      }
    } else if (['jpg', 'png', 'jpeg', 'gif'].includes(extension)) {
      const imgStr = `<div style="text-align:center">
        <h4>Image Viewer</h4>
        <img src="https://gotracrat.com:8088/api/attachment/downloadaudiofile/${id}?access_token=${token}&embedded=true" />
      </div>`;

      const wnd = window.open('about:blank');
      if (wnd && wnd.document) {
        wnd.document.write(imgStr);
      }
    } else {
      window.open(
        `https://gotracrat.com:8088/api/attachment/downloadaudiofile/${id}?access_token=${token}`
      );
    }
  }

  setCompletedOrder(value: string): void {
    if (this.completedOrder === value) {
      this.completedReverse = this.completedReverse === '' ? '-' : '';
    }
    this.completedOrder = value;
  }

  setOrder(value: string): void {
    if (this.order === value) {
      this.reverse = this.reverse === '' ? '-' : '';
    }
    this.order = value;
  }

  print(): void {
    this.helpFlag = false;
    window.print();
  }

  help(): void {
    this.helpFlag = !this.helpFlag;
  }
}
