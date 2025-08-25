import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  CompanyDocumentsService,
  ItemManagementService,
} from '../../../services/index';
import { BroadcasterService } from '../../../services/broadcaster.service';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
  selector: 'app-view-all-repairs',
  templateUrl: './view-all-repairs.component.html',
  styleUrls: ['./view-all-repairs.component.scss'],
})
export class ViewAllRepairsComponent implements OnInit {
  companyId: any;
  completedRepairs: any = [];
  flag: number;
  inCompletedRepairs: any = [];
  isOwnerAdmin: any;
  userId: any;
  repairsFlag: boolean;
  selectedVal: string;
  document: any;
  authToken: any;
  completedRepairsForPagination: any = 5;
  completedRepairsFilter: any = '';
  page1: any = 1;
  page2: any = 1;
  inCompletedRepairsForPagination: any = 5;
  inCompletedRepairsFilter: any = '';
  timeFrame: any;
  public params: any = {};
  period: string;
  index: number;
  viewAllRepairs: any = {};
  loader = false;
  constructor(
    private dashboardService: DashboardService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private companyDocumentsService: CompanyDocumentsService,
    private broadcasterService: BroadcasterService,
    private itemManagementService: ItemManagementService
  ) {
    this.companyId = route.snapshot.params['companyId'];
  }

  ngOnInit() {
    this.completedRepairs = this.itemManagementService.getCompletedRepairs();
    this.inCompletedRepairs =
      this.itemManagementService.getInCompletedRepairs();
    this.viewAllRepairs = this.itemManagementService.getViewAllRepairs();
    if (
      this.completedRepairs.length > 1 ||
      this.inCompletedRepairs.length > 1
    ) {
      this.selectedVal = this.viewAllRepairs.selectedVal;
      this.repairsFlag = this.viewAllRepairs.repairFlag;
      this.params.type = this.viewAllRepairs.paramsType;
      if (this.params.type === 'range') {
        this.params.to = this.viewAllRepairs.endDate;
        this.params.from = this.viewAllRepairs.startDate;
      }
      this.isOwnerAdmin = sessionStorage.getItem('IsOwnerAdmin');
      this.userId = sessionStorage.getItem('userId');
      this.authToken = sessionStorage.getItem('auth_token');
    } else {
      this.selectedVal = 'complete';
      this.isOwnerAdmin = sessionStorage.getItem('IsOwnerAdmin');
      this.userId = sessionStorage.getItem('userId');
      this.authToken = sessionStorage.getItem('auth_token');
      this.params.type = 'monthly';
      this.getAllCompletedRepairs();
    }
  }

  getAllCompletedRepairs() {
    this.spinner.show();

    this.flag = 1;
    this.repairsFlag = true;
    this.setTimeFrame();
    var req = {
      companyId: this.companyId,
      isOwnerAdmin: this.isOwnerAdmin,
      userId: this.userId,
      statusFlag: this.flag,
      timeFrame: this.timeFrame,
      startDate: this.params.from
        ? this.params.from.format('YYYY-MM-DD')
        : null,
      endDate: this.params.to ? this.params.to.format('YYYY-MM-DD') : null,
    };
    this.dashboardService.getAllRepairs(req).subscribe(
      (response: any) => {
        this.spinner.hide();

        this.completedRepairs = response;
        this.itemManagementService.setCompletedRepairs(response);
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  getAllRepairs() {
    if (
      this.params.type === 'range' &&
      this.params.from == undefined &&
      this.params.to == undefined
    ) {
      this.index = 1;
      setTimeout(() => {
        this.index = 0;
      }, 5000);
      return 0;
    } else {
      if (this.selectedVal == 'inComplete') {
        this.repairsFlag = false;
        this.getIncompletedRepairs();
      } else {
        this.repairsFlag = true;
        this.getAllCompletedRepairs();
      }
    }
    return;
  }

  getIncompletedRepairs() {
    this.spinner.show();

    this.flag = 0;
    this.setTimeFrame();
    var req = {
      companyId: this.companyId,
      isOwnerAdmin: this.isOwnerAdmin,
      userId: this.userId,
      statusFlag: this.flag,
      timeFrame: this.timeFrame,
      startDate: this.params.from
        ? this.params.from.format('YYYY-MM-DD')
        : null,
      endDate: this.params.to ? this.params.to.format('YYYY-MM-DD') : null,
    };
    this.dashboardService.getAllRepairs(req).subscribe(
      (response: any) => {
        this.spinner.hide();

        this.inCompletedRepairs = response;
        this.itemManagementService.setInCompletedRepairs(response);
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  setTimeFrame() {
    if (this.params.type === 'yearly') {
      this.period = 'Last 12 months';
      this.timeFrame = 'LASTYEAR';
      this.params.to = null;
      this.params.from = null;
    } else if (this.params.type == 'lasttwoyears') {
      this.period = 'Last 2 years';
      this.timeFrame = 'LASTTWOYEAR';
      this.params.to = null;
      this.params.from = null;
    } else if (this.params.type == 'monthly') {
      this.period = 'Last month';
      this.timeFrame = 'LASTMONTH';
      this.params.to = null;
      this.params.from = null;
    } else if (this.params.type === 'quarterly') {
      this.period = 'Last quarter';
      this.timeFrame = 'LASTQUARTER';
      this.params.to = null;
      this.params.from = null;
    } else if (this.params.type === 'range') {
      this.timeFrame = 'RANGE';
    }
  }

  downloadDocuments(companyDocument: { isNew: number }) {
    if (companyDocument.isNew == 0) {
      this.downloadFile(companyDocument);
    } else {
      this.downloadDocument(companyDocument);
    }
  }

  downloadDocument(companyDocument: { isNew?: number; attachmentId?: any }) {
    this.document = {};
    this.spinner.show();

    this.companyDocumentsService
      .getCompanyDocuments(companyDocument.attachmentId)
      .subscribe(
        (response) => {
          this.spinner.hide();

          this.document = response;
          this.downloadFromDB();
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }

  downloadFromDB() {
    var blob = this.companyDocumentsService.b64toBlob(
      this.document.attachmentFile,
      this.document.contentType
    );
    var fileURL = URL.createObjectURL(blob);
    window.open(fileURL);
  }

  downloadFile(attachment: {
    isNew?: number;
    fileName?: any;
    attachmentId?: any;
  }) {
    var index = attachment.fileName.lastIndexOf('.');
    var extension = attachment.fileName.slice(index + 1);
    if (extension.toLowerCase() == 'pdf' || extension.toLowerCase() == 'txt') {
      var wnd = window.open('about:blank');

      var pdfStr = `<div style="text-align:center">
      <h4>Document viewer</h4>
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

  goToView(itemId: string, rank: any, tag: any, typeName: any) {
    var model = {
      selectedVal: this.selectedVal,
      repairFlag: this.repairsFlag,
      paramsType: this.params.type,
      startDate: this.params.from,
      endDate: this.params.to,
    };
    this.itemManagementService.setViewAllRepairs(model);
    this.broadcasterService.currentItemTag = tag;
    this.broadcasterService.currentItemType = typeName;
    this.broadcasterService.itemRank = rank;
    this.router.navigate(['/items/viewItem/' + itemId]);
  }

  goToItemRepair(
    itemId: string,
    repairLogId: string,
    rank: any,
    tag: any,
    typeName: any
  ) {
    var model = {
      selectedVal: this.selectedVal,
      repairFlag: this.repairsFlag,
      paramsType: this.params.type,
      startDate: this.params.from,
      endDate: this.params.to,
    };
    this.itemManagementService.setViewAllRepairs(model);
    this.broadcasterService.itemRank = rank;
    this.broadcasterService.currentItemTag = tag;
    this.broadcasterService.currentItemType = typeName;
    this.router.navigate([
      '/items/viewItemRepair/' + itemId + '/' + repairLogId,
    ]);
  }

  getFailureTypeAndCause(failureType: string, failureCause: string) {
    let typeAndCause = '';
    if (!failureType) {
      return typeAndCause;
    }

    typeAndCause = failureCause
      ? failureType + ' : ' + failureCause
      : failureType + ' : ' + ' ';

    return typeAndCause;
  }
}
