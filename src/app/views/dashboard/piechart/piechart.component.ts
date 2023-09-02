import { Component, OnInit, TemplateRef } from '@angular/core';
import { BroadcasterService } from '../../../services/broadcaster.service';
import { IDatePickerConfig } from 'ng2-date-picker/lib/date-picker/date-picker-config.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { TreeviewItem } from 'ngx-treeview';
import { LocationManagementService } from '../../../services/location-management.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertModule } from 'ngx-bootstrap/alert';
import {
  CompanyDocumentsService,
  CompanyManagementService,
  ItemManagementService,
  ItemTypesService,
} from '../../../services/index';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DashboardService } from '../../../services/dashboard.service';
import * as cloneDeep from 'lodash';
import { ExcelService } from '../../../services/excel-service';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-piechart',
  templateUrl: './piechart.component.html',
  styleUrls: ['./piechart.component.scss'],
})
export class PiechartComponent implements OnInit {
  modalRef: BsModalRef;
  period: any;
  recentRepairs: any = [];
  repairJobs: any = [];
  recentItems: any = [];
  recentNotes: any = [];
  loader = false;
  locations: TreeviewItem[];
  allLocations: any;
  locationId: any = 0;
  isOwnerAdmin: any;
  typeId: any = 0;
  index: number = 0;
  userId: any;
  year: any;
  flag: any;
  documentFilter: any = '';
  itemsForPagination: any = 5;
  dismissible = true;
  documents: any = [];
  failureTypesandPercentage: any = {};
  failureTypesandPercentageCause: any = {};
  public recentlyAddedItems: any[] = [];
  public recentlyAddedItemsKeys: any[] = [];
  public attributeNames = [];
  companyAnnouncement: any;
  tracratAnnouncement: any;
  expandPanel: boolean;
  public pieChartLabels: string[] = [];
  public pieChartData: any = [];
  public pieChartCauseLabels: string[] = [];
  public pieChartCauseData: any = [];
  public pieChartPlugins: any = [
    {
      afterLayout: function (chart: any) {
        chart.legend.legendItems.forEach((label: any) => {
          let value = chart.data.datasets[0].data[label.index];

          label.text += ' ' + value;
          return label;
        });
      },
    },
  ];
  public barChartOptions: any = {
    legend: {
      position: 'left',
      labels: {
        fontSize: 10,
        boxWidth: 10,
        boxHeight: 2,
      },
    },
  };
  public pieChartType: ChartType = 'pie';

  public years = [
    { label: 'last one year', value: 1 },
    { label: 'last two years', value: 2 },
  ];
  public params: any = {};
  public companyid = 0;
  public datePickerConfig: IDatePickerConfig = {
    showMultipleYearsNavigation: true,
  };
  failureTypeData: any;
  topActiveItems: any;
  attributes: any;
  authToken: any;
  currentRole: any;
  highestRank: any;
  selectedFailureType: any;
  selectedFailureCause: any;
  itemTag: any;
  itemType: any;
  timeFrame: any;
  public chartColors: Array<any> = [];
  companyName: any;
  selectedVal: string;
  isRepairFlag: boolean;
  repairFlag: string;
  itemTypes: any;
  itemTypeItems: TreeviewItem[];
  showLocationAndRange: boolean = true;
  showLocation = false;
  showRange = false;
  p = 1;

  constructor(
    private dashboardService: DashboardService,
    private excelService: ExcelService,
    private itemTypesService: ItemTypesService,
    private companyDocumentsService: CompanyDocumentsService,
    private router: Router,
    private route: ActivatedRoute,
    private locationManagementService: LocationManagementService,
    private broadcasterService: BroadcasterService,
    private spinner: NgxSpinnerService,
    private alertmodule: AlertModule,
    private modalService: BsModalService,
    private companyManagementService: CompanyManagementService,
    private itemManagementService: ItemManagementService
  ) {
    this.index = 0;
    this.params.year = new Date().getFullYear();
    this.params.charttype = 'company';
    this.params.type = 'yearly';
    this.loader = true;
    this.authToken = sessionStorage.getItem('auth_token');
    this.chartColors = [
      {
        backgroundColor: [
          '#C71585', //1MediumVioletRed
          '#9370DB', //2MediumPurple
          '#A52A2A', //Brown
          '#90EE90', //4Light green
          '#CD5C5C', //5IndianRed
          '#20B2AA', //6light sea green
          '#B8860B', //7darkgoldenrod
          '#FF9B80', //8coral
          '#7FFF00', //Chartreuse
          '#808000', //8Olive
          '#D2B48C', //Tan
          '#87CEEB', //sky blue
          '#FA8072', //salmon
          '#FFD700', //Gold
          '#98FB98', //pale green
          '#4B0082', //Indigo
          '#00FFFF', //Aqua
          '#FFFACD', //LemonChiffon
          '#FFB6C1', //Light pink
          '#0000CD', //MediumBlue
          '#BC8F8F', //RosyBrown
          '#800080', //Purple
          '#FFDEAD', //NavajoWhite
          '#F0F8FF', //AliceBlue
          '#FF69B4', //HotPink
          '#ff9380', //9Tomato
        ],
      },
    ];
  }

  ngOnInit() {
    this.itemTag = this.broadcasterService.currentItemTag;
    this.itemType = this.broadcasterService.currentItemType;
    this.isOwnerAdmin = sessionStorage.getItem('IsOwnerAdmin');
    this.userId = sessionStorage.getItem('userId');
    this.companyid = this.broadcasterService.selectedCompanyId;
    this.getData();
    this.repairFlag = 'false';
    this.selectedVal = 'count';
    this.getFailureTypes();
    this.getLocationsWithHierarchy();
    this.getAllTypesWithHierarchy();
    this.broadcasterService.on('piechart').subscribe((data: any) => {
      if (data != 0) {
        this.clearOldData();
        this.isOwnerAdmin = sessionStorage.getItem('IsOwnerAdmin');
        this.userId = sessionStorage.getItem('userId');
        this.flag = 0;
        this.highestRank = sessionStorage.getItem('highestRank');
        this.companyid = parseInt(data);
        this.locationId = 0;
        this.typeId = 0;
        this.getData();
        this.params.type = 'yearly';
        this.repairFlag = 'false';
        this.selectedVal = 'count';
        this.getFailureTypes();
        this.locations = [];
        this.getLocations();
        this.documents = [];
        this.getAllItemTypes();
        this.companyName =
          this.companyManagementService.getGlobalCompany().name;
      } else {
        this.highestRank = 0;
      }
    });

    this.currentRole = sessionStorage.getItem('currentRole');
    this.highestRank = sessionStorage.getItem('highestRank');
  }

  pageChanged(event: any): void {
    this.getData();
  }

  getAllTypesWithHierarchy() {
    this.itemTypes = this.broadcasterService.itemTypeHierarchy;
    if (this.itemTypes && this.itemTypes.length > 0) {
      this.itemTypeItems = this.generateHierarchyForItemTypes(this.itemTypes);
    }
  }

  clearOldData() {
    this.recentRepairs = [];
    this.recentlyAddedItems = [];
    this.recentlyAddedItemsKeys = [];
    this.recentNotes = [];
    this.documents = [];
    this.expandPanel = false;
  }

  public chartClicked(e: any): void {
    this.isOwnerAdmin = sessionStorage.getItem('IsOwnerAdmin');
    this.userId = sessionStorage.getItem('userId');
    const type = e.active[0]._chart.data.labels[e.active[0]._index];
    this.selectedFailureType = type;
    if (this.params.type == 'range') {
      var request = {
        companyId: this.companyid,
        locationId: this.locationId != null ? this.locationId : 0,
        failureType: type,
        isOwnerAdmin: this.isOwnerAdmin,
        userId: this.userId,
        startDate: this.params.from.format('YYYY-MM-DD'),
        endDate: this.params.to.format('YYYY-MM-DD'),
        isByRepairCost: this.repairFlag,
        typeId: this.typeId ? this.typeId : 0,
      };
      if (type != '') {
        this.spinner.show();
        this.dashboardService
          .getFailureCausePercentageInRange(request)
          .subscribe((data) => {
            this.spinner.hide();
            this.failureTypesandPercentageCause = data;
            this.pieChartCauseLabels.length = 0;
            this.pieChartCauseData.length = 0;
            this.pieChartCauseLabels = Object.keys(
              this.failureTypesandPercentageCause
            );
            this.pieChartCauseLabels.forEach((failureType) => {
              const percentage =
                this.failureTypesandPercentageCause[failureType];
              this.pieChartCauseData.push(percentage);
            });
          });
      }
    } else {
      var req = {
        companyId: this.companyid,
        timeFrame: this.timeFrame,
        locationId: this.locationId != null ? this.locationId : 0,
        failureType: type,
        isOwnerAdmin: this.isOwnerAdmin,
        userId: this.userId,
        isByRepairCost: this.repairFlag,
        typeId: this.typeId ? this.typeId : 0,
      };
      if (type != '') {
        this.spinner.show();
        this.dashboardService.getFailureCauses(req).subscribe((data) => {
          this.spinner.hide();
          this.failureTypesandPercentageCause = data;
          this.pieChartCauseLabels.length = 0;
          this.pieChartCauseData.length = 0;
          this.pieChartCauseLabels = Object.keys(
            this.failureTypesandPercentageCause
          );
          this.pieChartCauseLabels.forEach((failureType) => {
            const percentage = this.failureTypesandPercentageCause[failureType];
            this.pieChartCauseData.push(percentage);
          });
        });
      }
    }
  }

  public chartHovered(e: any): void {}

  getCompanyDocuments() {
    if (this.documents.length < 1) {
      this.spinner.show();
      this.companyDocumentsService
        .getAllCompanyDocuments(this.companyid)
        .subscribe(
          (response) => {
            this.spinner.hide();
            this.documents = response;
          },
          (error) => {
            this.spinner.hide();
          }
        );
    }
  }

  getLocations() {
    if (this.isOwnerAdmin == 'true') {
      this.spinner.show();
      this.locationManagementService
        .getAllLocationsWithHierarchy(this.companyid)
        .subscribe((response) => {
          this.spinner.hide();
          this.allLocations = response;
          this.broadcasterService.locations = response;
          if (this.allLocations && this.allLocations.length > 0) {
            this.locations = [];
            this.locations = this.generateHierarchy(this.allLocations);
          }
        });
    } else {
      this.spinner.show();
      this.locationManagementService
        .getAllLocationsWithHierarchyforUser(this.companyid, this.userId)
        .subscribe((response) => {
          this.spinner.hide();
          this.broadcasterService.locations = response;
          this.allLocations = response;
          if (this.allLocations && this.allLocations.length > 0) {
            this.locations = [];
            this.locations = this.generateHierarchy(this.allLocations);
          }
        });
    }
  }

  getLocationsWithHierarchy() {
    this.allLocations = this.broadcasterService.locations;
    if (this.allLocations && this.allLocations.length > 0) {
      this.locations = [];
      this.locations = this.generateHierarchy(this.allLocations);
    }
  }

  getData() {
    if (this.companyid == 0 || this.companyid == undefined) {
      return false;
    } else {
      this.spinner.show();
      this.dashboardService
        .getRecentData(this.companyid, this.isOwnerAdmin, this.userId)
        .subscribe((response: any) => {
          this.spinner.hide();
          this.recentRepairs = response.repairResource;
          this.recentlyAddedItems = response.recentItemResource;
          this.recentlyAddedItemsKeys = Object.keys(this.recentlyAddedItems);
          this.recentNotes = response.notesResource;
          this.setAnnouncements(response.announcementList);
        });
    }
    return;
  }

  setAnnouncements(announcementList: any) {
    let count = 0;
    announcementList.forEach((element: any) => {
      if (count == 0) {
        this.tracratAnnouncement = element;
        this.broadcasterService.tracratAnnouncement = element;
        count++;
      } else {
        this.companyAnnouncement = element;
      }
    });
  }

  getFailureTypes() {
    if (this.companyid == 0 || this.companyid == undefined) {
      this.loader = false;
      return false;
    }

    if (this.params.type === 'yearly') {
      this.period = 'Last 12 months';
      this.timeFrame = 'LASTYEAR';
    } else if (this.params.type == 'lasttwoyears') {
      this.period = 'Last 2 years';
      this.timeFrame = 'LASTTWOYEAR';
    } else if (this.params.type == 'monthly') {
      this.period = 'Last month';
      this.timeFrame = 'LASTMONTH';
    } else if (this.params.type === 'quarterly') {
      this.period = 'Last quarter';
      this.timeFrame = 'LASTQUARTER';
    } else {
      if (!this.params.from && !this.params.to && !this.locationId) {
        this.index = -1;
        window.scroll(0, 0);
        return false;
      } else {
        if (this.locationId == undefined) {
          this.locationId = 0;
        }
        this.spinner.show();
        var request = {
          companyId: this.companyid,
          locationId: this.locationId,
          timeFrame: this.timeFrame,
          isOwnerAdmin: this.isOwnerAdmin,
          userId: this.userId,
          isByRepairCost: this.repairFlag,
          startDate: this.params.from.format('YYYY-MM-DD'),
          endDate: this.params.to.format('YYYY-MM-DD'),
          typeId: this.typeId ? this.typeId : 0,
        };
        this.dashboardService
          .getFailureTypePercentageInRange(request)
          .subscribe((response) => {
            this.spinner.hide();
            this.index = 0;
            this.failureTypesandPercentage = response;
            this.period =
              'range from ' +
              this.params.from.format('YYYY-MM-DD') +
              ' to ' +
              this.params.to.format('YYYY-MM-DD');
            this.pieChartCauseLabels.length = 0;
            this.pieChartCauseLabels = [];
            this.pieChartCauseData.length = 0;
            this.pieChartCauseData = [];
            this.pieChartLabels.length = 0;
            this.pieChartLabels = Object.keys(this.failureTypesandPercentage);
            this.pieChartData.length = 0;
            this.pieChartLabels.forEach((failureType) => {
              const percentage = this.failureTypesandPercentage[failureType];
              this.pieChartData.push(percentage);
            });
          });
        return true;
      }
    }
    this.spinner.show();
    var req = {
      companyId: this.companyid,
      locationId: this.locationId != undefined ? this.locationId : 0,
      timeFrame: this.timeFrame,
      isOwnerAdmin: this.isOwnerAdmin,
      userId: this.userId,
      isByRepairCost: this.repairFlag,
      typeId: this.typeId ? this.typeId : 0,
    };
    this.dashboardService
      .getFailureTypePercentage(req)
      .subscribe((response) => {
        this.spinner.hide();
        this.failureTypesandPercentage = response;
        this.pieChartCauseLabels.length = 0;
        this.pieChartCauseLabels = [];
        this.pieChartCauseData.length = 0;
        this.pieChartCauseData = [];
        this.pieChartLabels.length = 0;
        this.pieChartLabels = Object.keys(this.failureTypesandPercentage);
        this.pieChartData.length = 0;
        this.pieChartLabels.forEach((failureType) => {
          const percentage = this.failureTypesandPercentage[failureType];
          this.pieChartData.push(percentage);
        });
      });
    this.loader = false;
    return;
  }

  setLocation(locid: any) {
    this.locationId = locid;
    console.log(locid);
  }

  generateHierarchy(locList: any) {
    var items: any[] = [];
    locList.forEach((loc: any) => {
      var children = [];
      if (
        loc.parentLocationResourceList &&
        loc.parentLocationResourceList.length > 0
      ) {
        children = this.generateHierarchy(loc.parentLocationResourceList);
      }
      items.push(
        new TreeviewItem({
          text: loc.name,
          value: loc.locationid,
          collapsed: true,
          children: children,
        })
      );
    });
    return items;
  }

  setLocationId() {
    if (this.params.charttype == 'company') {
      this.locationId = 0;
      this.getFailureTypes();
      this.params.type = 'yearly';
    }
  }

  goToView(itemId: any, rank: any, tag: any, typeName: any) {
    this.broadcasterService.currentItemTag = tag;
    this.broadcasterService.currentItemType = typeName;
    this.broadcasterService.itemRank = rank;
    this.router.navigate(['/items/viewItem/' + itemId]);
    if (this.modalRef != undefined) this.modalRef.hide();
  }

  goToNote(journalid: any, itemId: any, rank: any, tag: any, typeName: any) {
    this.broadcasterService.itemRank = rank;
    this.broadcasterService.currentItemTag = tag;
    this.broadcasterService.currentItemType = typeName;
    this.router.navigate(['/items/itemNotes/' + itemId + '/' + journalid]);
  }

  goToItemRepair(
    itemId: any,
    repairLogId: any,
    rank: any,
    tag: any,
    typeName: any
  ) {
    this.broadcasterService.itemRank = rank;
    this.broadcasterService.currentItemTag = tag;
    this.broadcasterService.currentItemType = typeName;
    this.router.navigate([
      '/items/viewItemRepair/' + itemId + '/' + repairLogId,
    ]);
    if (this.modalRef != undefined) this.modalRef.hide();
  }

  downloadDocuments(companyDocument: any, flag: any) {
    if (companyDocument.isNew == 0 || companyDocument.isNew == false) {
      this.downloadFile(companyDocument, flag);
    } else {
      this.downloadDocumentFromDB(companyDocument, flag);
    }
  }

  downloadDocumentFromDB(document: any, flag: any) {
    var attachmentId;
    if (flag == true) {
      attachmentId = document.attachmentId;
    } else if (flag == false) {
      attachmentId = document.attachmentid;
    }
    this.spinner.show();
    this.companyDocumentsService.getCompanyDocuments(attachmentId).subscribe(
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

  downloadFile(attachment: any, flag: any) {
    var index;
    var extension;
    var attachmentId;
    if (flag == true) {
      index = attachment.fileName.lastIndexOf('.');
      extension = attachment.fileName.slice(index + 1);
      attachmentId = attachment.attachmentId;
    } else if (flag == false) {
      index = attachment.filename.lastIndexOf('.');
      extension = attachment.filename.slice(index + 1);
      attachmentId = attachment.attachmentid;
    }

    if (extension.toLowerCase() == 'pdf' || extension.toLowerCase() == 'txt') {
      var wnd = window.open('about:blank');

      var pdfStr = `<div style="text-align:center">
      <h4>Document viewer</h4>
      <iframe id="iFrame" src="https://docs.google.com/viewer?url=https://gotracrat.com:8088/api/attachment/downloadaudiofile/${
        attachmentId + '?access_token=' + this.authToken
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
      attachmentId + '?access_token=' + this.authToken
    }&embedded=true" >
      </div>`;

      var wnd = window.open('about:blank');
      if (wnd) wnd.document.write(pdfStr);
    } else {
      window.open(
        'https://gotracrat.com:8088/api/attachment/downloadaudiofile/' +
          attachmentId +
          '?access_token=' +
          this.authToken
      );
    }
  }

  public getRepairJobs(e: any, template: TemplateRef<any>): void {
    this.isOwnerAdmin = sessionStorage.getItem('IsOwnerAdmin');
    this.userId = sessionStorage.getItem('userId');
    const cause = e.active[0]._chart.data.labels[e.active[0]._index];
    this.selectedFailureCause = cause;

    if (this.params.type == 'range') {
      var request = {
        companyId: this.companyid,
        locationId: this.locationId != null ? this.locationId : 0,
        failureType: this.selectedFailureType,
        failureCause: this.selectedFailureCause,
        isOwnerAdmin: this.isOwnerAdmin,
        userId: this.userId,
        startDate: this.params.from.format('YYYY-MM-DD'),
        endDate: this.params.to.format('YYYY-MM-DD'),
        typeId: this.typeId ? this.typeId : 0,
      };
      if (cause != '') {
        this.spinner.show();
        this.dashboardService
          .getRecentJobsByCauseinRange(request)
          .subscribe((data) => {
            this.spinner.hide();
            this.repairJobs = data;
            this.openModal(template);
          });
      }
    } else {
      var req = {
        companyId: this.companyid,
        timeFrame: this.timeFrame,
        locationId: this.locationId != null ? this.locationId : 0,
        failureType: this.selectedFailureType,
        failureCause: this.selectedFailureCause,
        isOwnerAdmin: this.isOwnerAdmin,
        userId: this.userId,
        typeId: this.typeId ? this.typeId : 0,
      };
      if (cause != '') {
        this.spinner.show();
        this.dashboardService.getRecentJobsByCause(req).subscribe((data) => {
          this.spinner.hide();
          this.repairJobs = data;
          this.openModal(template);
        });
      }
    }
  }

  openModal(mytemplate: any) {
    this.modalRef = this.modalService.show(mytemplate, { class: 'modal-lg' });
  }

  CloseModel() {
    this.modalRef.hide();
  }

  viewAllRepairs() {
    this.itemManagementService.setCompletedRepairs([]);
    this.itemManagementService.setInCompletedRepairs([]);
    this.itemManagementService.setViewAllRepairs({});
    this.router.navigate(['/items/viewAllRepairs/' + this.companyid]);
  }

  getAllItemTypes() {
    this.itemTypesService
      .getAllItemTypesWithHierarchy(this.companyid)
      .subscribe((response) => {
        this.itemTypes = response;
        if (this.itemTypes && this.itemTypes.length > 0) {
          this.itemTypeItems = this.generateHierarchyForItemTypes(
            this.itemTypes
          );
        }
      });
  }

  generateHierarchyForItemTypes(typeList: any) {
    var items: any[] = [];
    typeList.forEach((type: any) => {
      var children = [];
      if (type.typeList && type.typeList.length > 0) {
        children = this.generateHierarchyForItemTypes(type.typeList);
      }
      items.push(
        new TreeviewItem({
          text: type.name,
          value: type.typeid,
          collapsed: true,
          children: children,
        })
      );
    });
    return items;
  }

  public onValChange(val: string) {
    console.log(val);
    this.selectedVal = val;
    if (this.selectedVal == 'repaircost') {
      this.isRepairFlag = true;
      this.repairFlag = 'true';
      this.params.type = 'yearly';
      this.getFailureTypes();
    } else if (this.selectedVal == 'count') {
      this.isRepairFlag = false;
      this.repairFlag = 'false';
      this.params.type = 'yearly';
      this.locationId = 0;
      this.getFailureTypes();
    }
  }

  exportToExel() {
    const clonedsearchResults: any = cloneDeep(this.repairJobs);

    clonedsearchResults.forEach((obj: any) => {
      //const robj = {};

      if (this.highestRank <= 5) {
        delete obj.repairCost;
      }
      delete obj.actualCompletion;
      delete obj.attachmentList;
      delete obj.attachmentListFromXml;
      delete obj.rank;
      delete obj.complete;
      delete obj.dateAdded;
      delete obj.itemId;
      delete obj.repairLogId;

      // obj = Object.assign(obj, robj);
    });

    this.excelService.exportAsExcelFile(clonedsearchResults, 'RepairJobs');
  }

  getFailureTypeAndCause(failureType: any, failureCause: any) {
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
