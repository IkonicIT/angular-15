import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { ItemRepairItemsService } from '../../../services/Items/item-repair-items.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BroadcasterService } from '../../../services/broadcaster.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ItemManagementService } from '../../../services/Items/item-management.service';
import { Location } from '@angular/common';
import { CompanyManagementService } from '../../../services/company-management.service';
import { CompanyDocumentsService } from '../../../services/index';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-view-item-repair',
  templateUrl: './view-item-repair.component.html',
  styleUrls: ['./view-item-repair.component.scss'],
})
export class ViewItemRepairComponent implements OnInit, OnDestroy {
  model: any = {};
  companyId: string = ''; // ✅ ensure always a string
  itemRepairId: any;
  itemId: any;
  userName: string ='';
  itemRank: any;
  modalRef!: BsModalRef;
  message: string | undefined;
  index: any;
  flag: any;
  itemRepairsFilter: any = '';
  repairsForPagination = 5;
  repairs: any[] = [];
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
  completedReverse = '';
  completedOrder: string | undefined;
  reverse = '';
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
    this.itemId = route.snapshot.params['itemId'];
    this.itemRepairItemsService.itemId = this.itemId;
    this.itemRepairId = route.snapshot.params['repairId'];
    this.authToken = sessionStorage.getItem('auth_token');

    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany?.companyId) {
      this.companyId = this.globalCompany.companyId;
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
          this.companyId = value?.companyId ?? '';
        });
    }
  }

  ngOnInit(): void {
  this.userName = sessionStorage.getItem('userName') || ''; // ✅ fallback to empty string
  this.highestRank = sessionStorage.getItem('highestRank');
  this.itemRank = this.broadcasterService.itemRank;
  this.getItemRepairDetails();
}


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
      '/items/editItemRepair/' + this.itemId + '/' + this.itemRepairId,
    ]);
  }

  cancelViewRepair(): void {
    this.router.navigate(['/items/itemRepairs/' + this.itemId]);
  }

  getAllRepairs(): void {
    if (!this.companyId) return; // ✅ safety check

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
  this.model.itemType,
  this.model.tag,
  this.model.poNumber,
  this.model.jobNumber
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
    this.itemRepairId = repairId;
    this.getItemRepairDetails();
    window.scroll(0, 0);
  }

  back(): void {
    this._location.back();
  }

  backToViewItem(): void {
    this.router.navigate(['/items/viewItem/' + this.itemId]);
  }

  download(companyDocument: { new: boolean }): void {
    if (companyDocument.new === false) {
      this.downloadFile(companyDocument as any);
    } else {
      this.downloadDocumentFromDB(companyDocument as any);
    }
  }

  downloadDocumentFromDB(document: { new?: boolean; attachmentId?: any }): void {
    this.spinner.show();

    this.companyDocumentsService
      .getCompanyDocuments(document.attachmentId)
      .pipe(takeUntil(this.destroy$))
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

  downloadDocument(companyDocument: any): void {
    const blob = this.companyDocumentsService.b64toBlob(
      companyDocument.attachmentFile,
      companyDocument.contentType
    );
    const fileURL = URL.createObjectURL(blob);
    window.open(fileURL);
  }

  downloadFile(attachment: {
    new?: boolean;
    fileName?: any;
    attachmentId?: any;
  }): void {
    const index = (attachment.fileName || '').lastIndexOf('.');
    const extension = index >= 0 ? (attachment.fileName || '').slice(index + 1) : '';

    if (extension.toLowerCase() === 'pdf' || extension.toLowerCase() === 'txt') {
      const pdfStr = `<div style="text-align:center">
      <h4>Pdf viewer</h4>
      <iframe id="iFrame" src="https://gotracrat.com:8088/api/attachment/downloadaudiofile/${
        attachment.attachmentId + '?access_token=' + this.authToken
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
        </script>`;

      const wnd = window.open('about:blank');
      if (wnd) wnd.document.write(pdfStr);
    } else if (
      ['jpg', 'png', 'jpeg', 'gif'].includes(extension.toLowerCase())
    ) {
      const imgStr = `<div style="text-align:center">
      <h4>Image Viewer</h4>
      <img src="https://gotracrat.com:8088/api/attachment/downloadaudiofile/${
        attachment.attachmentId + '?access_token=' + this.authToken
      }&embedded=true" >
        </div>`;

      const wnd = window.open('about:blank');
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

  setCompletedOrder(value: string): void {
    if (this.order === value) {
      this.reverse = this.reverse === '' ? '-' : '';
    }
    this.order = value;
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
