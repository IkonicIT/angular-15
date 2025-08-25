import {
  Component,
  OnInit,
  ViewEncapsulation,
  TemplateRef,
} from '@angular/core';
import { BroadcasterService } from '../../../services/broadcaster.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { ReportsService } from '../../../services/reports.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ExcelService } from '../../../services/excel-service';
import * as cloneDeep from 'lodash';

@Component({
  selector: 'app-inservice-vs-spare',
  templateUrl: './inservice-vs-spare.component.html',
  styleUrls: ['./inservice-vs-spare.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class InserviceVsSpareComponent implements OnInit {
  order: string = 'tag';
  reverse: string = '';
  orderIS: string = 'tag';
  reverseIS: string = '';
  orderS: string = 'tag';
  reverseS: string = '';
  pageIsas: number = 1;
  pageIs: number = 1;
  pageS: number = 1;
  itemsForPaginationISAS: any = 5;
  itemsForPaginationIS: any = 5;
  itemsForPaginationS: any = 5;
  inServiceAndSpareMotors: any;
  inServiceMotors: any;
  spareMotors: any;
  router: Router;
  companyId: any;
  modalRef: BsModalRef;
  sparesModelRef: BsModalRef;
  spareItem: any = {};
  report: any = {};
  activeTab: number = 0;
  public isloaded = false;
  model: any = {};
  isandSpareItems: any = [];
  spares: any = [];
  typeFilter: any = '';
  loader = false;
  constructor(
    private broadcasterService: BroadcasterService,
    private spinner: NgxSpinnerService,
    router: Router,
    private reportsService: ReportsService,
    private companyManagementService: CompanyManagementService,
    private modalService: BsModalService,
    private excelService: ExcelService
  ) {
    this.router = router;
    this.companyId = this.companyManagementService.getGlobalCompany().companyId;
  }

  ngOnInit() {
    this.initializeData();
  }
  initializeData() {
    this.report = this.reportsService.getInserviceVsSpareReport();
    let searchKeys = Object.keys(this.report);
    if (searchKeys.length > 0) {
      this.inServiceAndSpareMotors = this.report.inServiceAndSpareMotors;
      this.inServiceMotors = this.report.unmatchedServiceMotors;
      this.spareMotors = this.report.unmatchedSpareMotors;
      this.isloaded = true;
      this.activeTab = this.report.activeTab ? this.report.activeTab : 0;
      this.pageIsas = this.report.pageIsas ? this.report.pageIsas : 1;
      this.pageIs = this.report.pageIs ? this.report.pageIs : 1;
      this.pageS = this.report.pageS ? this.report.pageS : 1;
      this.itemsForPaginationISAS = this.report.itemsForPaginationISAS
        ? this.report.itemsForPaginationISAS
        : 5;
      this.itemsForPaginationIS = this.report.itemsForPaginationIS
        ? this.report.itemsForPaginationIS
        : 5;
      this.itemsForPaginationS = this.report.itemsForPaginationS
        ? this.report.itemsForPaginationS
        : 5;
      this.model = this.report.searchData;
    }
  }

  getReport() {
    this.spinner.show();

    let request = {
      companyId: this.companyId,
      hp: this.model.hp ? this.model.hp : null,
      rpm: this.model.rpm ? this.model.rpm : null,
      frame: this.model.frame ? this.model.frame : null,
    };
    this.reportsService.generateISandSpareReport(request).subscribe(
      (response: any) => {
        this.spinner.hide();

        this.report.inServiceAndSpareMotors = response.inServiceAndSpareMotors;
        this.report.unmatchedServiceMotors = response.unmatchedServiceMotors;
        this.report.unmatchedSpareMotors = response.unmatchedSpareMotors;
        this.report.searchData = this.model;
        this.reportsService.setInserviceVsSpareReport(this.report);
        this.inServiceAndSpareMotors = response.inServiceAndSpareMotors;
        this.inServiceMotors = response.unmatchedServiceMotors;
        this.spareMotors = response.unmatchedSpareMotors;
        this.isloaded = true;
      },
      (error) => {
        this.spinner.hide();
      }
    );
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

  setOrderforInservice(value: string) {
    if (this.orderIS === value) {
      if (this.reverseIS == '') {
        this.reverseIS = '-';
      } else {
        this.reverseIS = '';
      }
    }
    this.orderIS = value;
  }

  setOrderForSpare(value: string) {
    if (this.orderS === value) {
      if (this.reverseS == '') {
        this.reverseS = '-';
      } else {
        this.reverseS = '';
      }
    }
    this.orderS = value;
  }

  goToView(itemId: string, tag: any, typeName: any) {
    this.setCurrentPageData();
    this.broadcasterService.currentItemTag = tag;
    this.broadcasterService.currentItemType = typeName;
    this.broadcasterService.itemRank = 8;
    this.router.navigate(['/items/viewItem/' + itemId]);
  }

  setCurrentPageData() {
    this.report.activeTab = this.activeTab;
    this.report.pageIsas = this.pageIsas;
    this.report.pageIs = this.pageIs;
    this.report.pageS = this.pageS;
    this.report.itemsForPaginationISAS = this.itemsForPaginationISAS;
    this.report.itemsForPaginationIS = this.itemsForPaginationIS;
    this.report.itemsForPaginationS = this.itemsForPaginationS;
  }

  goToViewForSpare(itemId: string, tag: any, typeName: any) {
    this.setCurrentPageData();
    this.modalRef.hide();
    this.sparesModelRef.hide();
    this.broadcasterService.currentItemTag = tag;
    this.broadcasterService.currentItemType = typeName;
    this.broadcasterService.itemRank = 8;
    this.router.navigate(['/items/viewItem/' + itemId]);
  }

  openModal(template: TemplateRef<any>, itemId: any) {
    this.spinner.show();

    this.reportsService.getSpareMotor(itemId).subscribe(
      (response) => {
        this.spinner.hide();

        this.spareItem = response;
      },
      (error) => {
        this.spinner.hide();
      }
    );
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  showSpares(template: TemplateRef<any>, itemId: any) {
    var item = this.inServiceAndSpareMotors.find(
      (item: { itemId: any }) => item.itemId === itemId
    );
    this.spares = item.spares;
    this.sparesModelRef = this.modalService.show(template, {
      class: 'modal-lg',
    });
  }

  closeModel() {
    this.modalRef.hide();
  }

  closeSparesModel() {
    this.sparesModelRef.hide();
  }

  onTabChanged(event: { index: number }) {
    this.activeTab = event.index;
  }

  exportAsExcelFileWithMultipleSheets() {
    var report = {
      inServiceAndSpareMotors: this.report.inServiceAndSpareMotors,
      unmatchedServiceMotors: this.report.unmatchedServiceMotors,
      unmatchedSpareMotors: this.report.unmatchedSpareMotors,
    };
    const clonedsearchResults: any = cloneDeep(report);
    if (clonedsearchResults.inServiceAndSpareMotors.length > 0) {
      this.removeDataForIsAndSpareMotors(
        clonedsearchResults.inServiceAndSpareMotors
      );
    }
    if (clonedsearchResults.unmatchedServiceMotors.length > 0) {
      this.removeData(clonedsearchResults.unmatchedServiceMotors);
    }
    if (clonedsearchResults.unmatchedSpareMotors.length > 0) {
      this.removeData(clonedsearchResults.unmatchedSpareMotors);
    }
    this.excelService.exportAsExcelFileWithMultipleSheets(
      clonedsearchResults,
      'InserviceVsSpareReport'
    );
  }

  removeDataForIsAndSpareMotors(inServiceAndSpareMotors: any) {
    inServiceAndSpareMotors.forEach((obj: any) => {
      delete obj.itemId;
      var spareTag = '';
      obj.spares.forEach((spare: { tag: string }) => {
        spareTag = spareTag + spare.tag + ',';
      });

      delete obj.spares;
      obj.spareItems = spareTag;
    });
  }

  removeData(motors: any[]) {
    motors.forEach((obj: any) => {
      delete obj.itemId;
      delete obj.companyId;
    });
  }
}
