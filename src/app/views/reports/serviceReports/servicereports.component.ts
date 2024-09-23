import { Component, OnInit, ViewChild } from '@angular/core';
import { BroadcasterService } from '../../../services/broadcaster.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { ReportsService } from '../../../services/reports.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import * as cloneDeep from 'lodash';
import { ExcelService } from '../../../services/excel-service';
import { DatePipe } from '@angular/common';
import { ItemServiceManagementService } from '../../../services/Items/item-service-management.service';

@Component({
  selector: 'app-servicereports',
  templateUrl: './servicereports.component.html',
  styleUrls: ['./servicereports.component.scss'],
})
export class serviceReportsComponent implements OnInit {
  public params: any = {};
  companyId: any;
  report: any = {};
  public isloaded = false;
  // itemsForPagination: any = 5;
  // currentPage: number = 1;
  itemsForPagination: any = 5;
  completedServicesForPagination: any = 5;
  page1: any = 1;
  page2: any = 1;
  order: string = 'serviceDate';
  reverse: string = '';
  completedOrder: string = 'serviceDate';
  completedReverse: string = '';
  completedServices: any = [];
  incompletedServices: any = [];
  inCompletedServicesFilter: any;
  completedServicesFilter: any;
  loader = false;
  constructor(
    private broadcasterService: BroadcasterService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private reportsService: ReportsService,
    private companyManagementService: CompanyManagementService,
    private excelService: ExcelService,
    public datepipe: DatePipe,
    private itemServiceManagementService: ItemServiceManagementService
  ) {
    this.companyId = this.companyManagementService.getGlobalCompany().companyid;
    this.params.type = 'monthly';
  }

  ngOnInit() {
    this.initializeData();
  }

  initializeData() {
    this.report = this.reportsService.getserviceReport();
    let searchKeys = Object.keys(this.report);
    if (searchKeys.length > 0) {
      this.page1 = this.report.page1 ? this.report.page1 : 1;
      this.page2 = this.report.page2 ? this.report.page2 : 1;
      this.completedServices = this.report.completedServices;
      this.incompletedServices = this.report.inCompletedServices;
      this.itemsForPagination = this.report.itemsForPagination
        ? this.report.itemsForPagination
        : 5;
      this.completedServicesForPagination = this.report
        .completedServicesForPagination
        ? this.report.completedServicesForPagination
        : 5;
      this.params.type = this.report.paramType
        ? this.report.paramType
        : 'monthly';
      this.params.from = this.report.from;
      this.params.to = this.report.to;
      this.isloaded = true;
    }
  }

  generateReport() {
    let timeFrame;
    if (this.params.type == 'monthly') {
      timeFrame = 'MONTH';
    } else if (this.params.type === 'quarterly') {
      timeFrame = 'QUARTER';
    } else if (this.params.type === 'range') {
      timeFrame = 'RANGE';
    }
    var request = {
      companyId: this.companyId,
      timeSpan: timeFrame,
      startDate: this.params.from ? this.params.from.format('YYYY-MM-DD') : '',
      endDate: this.params.to ? this.params.to.format('YYYY-MM-DD') : '',
    };
    this.spinner.show();

    this.reportsService.generateServiceReport(request).subscribe(
      (response: any) => {
        this.spinner.hide();

        this.completedServices = response.completedServices;
        this.incompletedServices = response.inCompletedServices;
        this.report = response;
        this.reportsService.setserviceReport(this.report);
        this.isloaded = true;
      },
      (error: any) => {
        this.spinner.hide();
      }
    );
  }

  goToView(itemId: string, tag: any, typeName: any) {
    this.setCurrentPageData();
    this.broadcasterService.currentItemTag = tag;
    this.broadcasterService.currentItemType = typeName;
    this.broadcasterService.itemRank = 8;
    this.router.navigate(['/items/viewItem/' + itemId]);
  }

  setCurrentPageData() {
    this.report.page1 = this.page1;
    this.report.page2 = this.page2;
    this.report.completedServicesForPagination =
      this.completedServicesForPagination;
    this.report.itemsForPagination = this.itemsForPagination;
    this.report.paramType = this.params.type;
    this.report.from = this.params.from;
    this.report.to = this.params.to;
  }

  exportAsExcelFileWithMultipleSheets() {
    var report = {
      completedServices: this.report.completedServices,
      incompletedServices: this.report.inCompletedServices,
    };
    const clonedsearchResults: any = cloneDeep(report);
    if (clonedsearchResults.completedServices.length > 0) {
      this.removeDataForCompletedServices(
        clonedsearchResults.completedServices
      );
    }
    if (clonedsearchResults.incompletedServices.length > 0) {
      this.removeDataForInCompletedServices(
        clonedsearchResults.incompletedServices
      );
    }
    this.excelService.exportAsExcelFileWithMultipleSheets(
      clonedsearchResults,
      'ServiceReport'
    );
  }

  removeDataForCompletedServices(services: any[]) {
    services.forEach((obj: any) => {
      delete obj.itemId;
      delete obj.complete;
    });
  }

  removeDataForInCompletedServices(services: any[]) {
    services.forEach((obj: any) => {
      delete obj.itemId;
      delete obj.complete;
      delete obj.completedBy;
      delete obj.actualCompletion;
    });
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
}
