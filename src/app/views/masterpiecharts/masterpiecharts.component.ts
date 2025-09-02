import { Component, OnInit, TemplateRef } from '@angular/core';
import { IDatePickerConfig } from 'ng2-date-picker'; // Updated import path
import { NgxSpinnerService } from 'ngx-spinner';
// import { BaseChartDirective, Color } from 'ng2-charts';
// import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertModule } from 'ngx-bootstrap/alert';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { cloneDeep } from 'lodash';
import { ExcelService } from 'src//app/services/excel-service';
import * as moment from 'moment'; // Corrected import for moment
import { BroadcasterService } from 'src/app/services/broadcaster.service';
import { LocationManagementService } from 'src/app/services';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-template',
  templateUrl: './masterpiecharts.component.html',
  styleUrls: ['./masterpiecharts.component.scss'],
})
export class TemplateComponent implements OnInit {
  modalRef: BsModalRef;
  period: any;
  repairJobs: any = [];
  loader = false;
  dismissible: boolean = true;
  locationId: any = 0;
  isOwnerAdmin: string | any;
  index: number = 0;
  userId: any;
  year: any;
  flag: any;
  documents: any = [];
  failureTypesandPercentage: any = {};
  failureTypesandPercentageCause: any = {};
  public recentlyAddedItems = [];
  public recentlyAddedItemsKeys = [];
  public attributeNames = [];
  expandPanel: boolean;
  public pieChartLabels: string[] = [];
  public pieChartData: ChartDataset[] = [];
  public pieChartCauseLabels: string[] = [];
  public pieChartCauseData: ChartDataset[] = [];
  public pieChartPlugins: any = [
    {
      afterLayout: function (chart: any) {
        chart.legend.legendItems.forEach(
          (label: { index: string | number; text: string }) => {
            let value = chart.data.datasets[0].data[label.index];
            label.text += ' ' + value;
            return label;
          }
        );
      },
    },
  ];
  public barChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true, // Ensures the legend is visible
        position: 'left', // Moves legend to the left
        labels: {
          font: {
            size: 10, // Adjust font size
          },
          boxWidth: 10, // Adjust legend color box width
        },
      },
    },
  };

  public pieChartType: ChartType = 'pie';
  public years = [
    { label: 'last one year', value: 1 },
    { label: 'last two years', value: 2 },
  ];
  public params: any = {};
  public companyId = 0;
  public datePickerConfig: IDatePickerConfig = {
    showMultipleYearsNavigation: true,
  };
  failureTypeData: any;
  topActiveItems: any;
  authToken: any;
  currentRole: any;
  highestRank: any;
  selectedFailureType: any;
  selectedFailureCause: any;
  timeFrame: any;
  public chartColors: Array<any> = [];
  companyName: any;
  selectedVal: string;
  isRepairFlag: boolean;
  repairFlag: string;
  typeId: any;
  failureType: any;
  chartFlag: boolean;
  constructor(
    private dashboardService: DashboardService,
    private excelService: ExcelService,
    private router: Router,
    private route: ActivatedRoute,
    private locationManagementService: LocationManagementService,
    private broadcasterService: BroadcasterService,
    private spinner: NgxSpinnerService,
    private alertmodule: AlertModule,
    private modalService: BsModalService
  ) {
    this.index = 0;
    this.params.year = new Date().getFullYear();
    this.params.charttype = 'company';
    this.params.type = 'yearly';
    this.loader = false;
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
    this.params = {
      type: 'yearly',
      from: moment(), // Initialize with the current date or any default value
      to: moment(), // Initialize with the current date or any default value
    };
    this.isOwnerAdmin = sessionStorage.getItem('IsOwnerAdmin') ?? '';
    this.userId = sessionStorage.getItem('userId') ?? '';
    this.repairFlag = 'false';
    this.selectedVal = 'count';
    this.highestRank = sessionStorage.getItem('highestRank');
    this.getFailureTypes();
    this.currentRole = sessionStorage.getItem('currentRole');
    this.highestRank = sessionStorage.getItem('highestRank');
  }

  public chartClicked(e: any): void {
    this.isOwnerAdmin = sessionStorage.getItem('IsOwnerAdmin') ?? '';
    this.userId = sessionStorage.getItem('userId') ?? '';
    const clickedLabel =
      e.event.chart.config._config.data.labels[e.active[0].index];
    // const matches = clickedLabel.replace(/\d+\.\d+\s*/g, '');
    const matches = clickedLabel.replace(/\b\d+(\.\d+)?\b\s*/g, '');
    const type = matches;
    this.selectedFailureType = type;
    sessionStorage.setItem('failureType', matches);
    console.log(this.selectedFailureType);
    var req = {
      timeFrame: this.timeFrame,
      failureType: type,
      isOwnerAdmin: this.isOwnerAdmin,
      userId: this.userId,
      isByRepairCost: this.repairFlag,
      startDate: this.params.from.format('YYYY-MM-DD'),
      endDate: this.params.to.format('YYYY-MM-DD'),
    };
    if (type != '') {
      this.spinner.show();
      this.dashboardService
        .getFailureCausesMasterPieCharts(req)
        .subscribe((data: any) => {
          this.spinner.hide();
          this.failureTypesandPercentageCause = data;

          this.pieChartCauseLabels = [];
          this.pieChartCauseData = [];

          const labels = Object.keys(this.failureTypesandPercentageCause);
          const percentages = Object.values(
            this.failureTypesandPercentageCause
          );

          const dataset: any = {
            data: percentages,
            backgroundColor: this.chartColors[0].backgroundColor,
          };

          this.pieChartCauseLabels = labels.map(
            (label, index) => `${label} ${percentages[index]}`
          );
          this.pieChartCauseData = [dataset];
        });
    }
  }

  public chartHovered(e: any): void {}
  getFailureTypes() {
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
      this.timeFrame = 'RANGE';
    }

    if (!this.params.from || !this.params.to) {
      console.error('Date parameters are not defined');
      return;
    }

    this.spinner.show();
    if (this.timeFrame == 'range') {
      const req = {
        timeFrame: this.timeFrame,
        isOwnerAdmin: this.isOwnerAdmin,
        isByRepairCost: this.repairFlag,
        startDate: this.params.from.format('YYYY-MM-DD'),
        endDate: this.params.to.format('YYYY-MM-DD'),
      };
    }
    const req = {
      timeFrame: this.timeFrame,
      isOwnerAdmin: this.isOwnerAdmin,
      isByRepairCost: this.repairFlag,
      startDate: this.params.from.format('YYYY-MM-DD'),
      endDate: this.params.to.format('YYYY-MM-DD'),
    };
    this.dashboardService
      .getFailureTypePercentageMasterPieCharts(req)
      .subscribe((response: any) => {
        this.spinner.hide();
        this.failureTypesandPercentage = response;

        this.pieChartCauseLabels.length = 0;
        this.pieChartCauseLabels = [];
        this.pieChartCauseData.length = 0;
        this.pieChartCauseData = [];

        this.pieChartLabels.length = 0;
        // this.pieChartLabels = Object.keys(this.failureTypesandPercentage);
        // this.pieChartData.length = 0;
        // this.pieChartLabels.forEach(failureType => {
        //   const percentage = this.failureTypesandPercentage[failureType];
        //   this.pieChartData.push(percentage);
        // });
        this.pieChartLabels = [];
        this.pieChartData = [];

        const labels = Object.keys(this.failureTypesandPercentage);
        const percentages = Object.values(this.failureTypesandPercentage);

        const dataset: any = {
          data: percentages,
          backgroundColor: this.chartColors[0].backgroundColor,
        };

        this.pieChartLabels = labels.map(
          (label, index) => `${label} ${percentages[index]}`
        );
        this.pieChartData = [dataset];

        this.chartFlag = this.isDataGreaterThanZero(this.pieChartData[0].data);
        console.log('pieChartData', this.pieChartData);
      });
    this.loader = false;
  }

  public isDataGreaterThanZero(data: number[] | number[][] | any): boolean {
    if (Array.isArray(data)) {
      return data.some((value) => value > 0);
    } else if (typeof data === 'number') {
      return data > 0;
    } else {
      return false;
    }
  }

  public getRepairJobs(e: any, template: TemplateRef<any>): void {
    let causeText;
    this.isOwnerAdmin = sessionStorage.getItem('IsOwnerAdmin');
    this.userId = sessionStorage.getItem('userId');
    this.failureType = sessionStorage.getItem('failureType');
    //const cause = e.active[0]._chart.data.labels[e.active[0]._index];
    const clickedLabel =
      e.event.chart.config._config.data.labels[e.active[0].index];
    const matches = clickedLabel.replace(/\b\d+(\.\d+)?\b\s*/g, '');
    const type = matches;
    this.selectedFailureType = type;
    const cause = causeText;
    console.log(
      'selectedFailureCause1',
      this.selectedFailureType,
      clickedLabel
    );
    var req = {
      timeFrame: this.timeFrame,
      failureType: this.failureType,
      failureCause: this.selectedFailureType,
      isOwnerAdmin: this.isOwnerAdmin,
      startDate: this.params.from.format('YYYY-MM-DD'),
      endDate: this.params.to.format('YYYY-MM-DD'),
    };
    if (cause != '') {
      this.spinner.show();
      this.dashboardService
        .getRecentJobsByCauseMasterPieCharts(req)
        .subscribe((data) => {
          this.spinner.hide();
          this.repairJobs = data;
          this.openModal(template);
        });
    }
  }
  openModal(mytemplate: TemplateRef<any>) {
    this.modalRef = this.modalService.show(mytemplate, { class: 'modal-lg' });
  }
  CloseModel() {
    this.modalRef.hide();
  }

  public onValChange(val: string) {
    console.log(val);
    this.selectedVal = val;
    if (this.selectedVal == 'repairCost') {
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
    const clonedsearchResults = cloneDeep(this.repairJobs);

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

  exportAsExcelFileWithMultipleSheets() {
    this.exportAsExcelFile();
  }

  // exportAsExcelFile() {
  //   const groupedData = this.groupBy(this.repairJobs, item => item.companyName);
  //   const results: { [key: string]: any[] } = {};
  //   groupedData.forEach((value, key) => {
  //     results[key] = value;
  //   });

  //   const clonedsearchResults = cloneDeep(results);
  //   Object.keys(clonedsearchResults).forEach(companyName => {
  //     const result = clonedsearchResults[companyName];
  //     result.forEach((obj: any) => {
  //       // Remove unnecessary fields
  //       delete obj.repairLogId;
  //       delete obj.companyId;
  //       delete obj.itemId;
  //       delete obj.rank;
  //       delete obj.complete;
  //       delete obj.attachmentListFromXml;
  //       delete obj.attachmentList;
  //     });
  //   });

  //   this.excelService.exportAsExcelFileWithMultipleSheets(clonedsearchResults, 'MasterPieCharts');
  // }

  exportAsExcelFile() {
    const clonedsearchResults = cloneDeep(this.repairJobs);

    clonedsearchResults.forEach((obj: any) => {
      delete obj.repairLogId;
      delete obj.companyId;
      delete obj.itemId;
      delete obj.rank;
      delete obj.complete;
      delete obj.actualCompletion;
      delete obj.dateAdded;
      delete obj.attachmentListFromXml;
      delete obj.attachmentList;
    });

    this.excelService.exportAsExcelFile(clonedsearchResults, 'MasterPieCharts');
  }

  groupBy(list: any, keyGetter: any) {
    const map = new Map();
    list.forEach((item: any) => {
      const key = keyGetter(item).replace(/\//g, ''); // Replace slashes
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }
}
