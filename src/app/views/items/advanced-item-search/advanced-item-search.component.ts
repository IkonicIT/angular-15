import {
  Component,
  OnInit,
  ViewEncapsulation,
  TemplateRef,
} from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { LocationManagementService } from '../../../services/location-management.service';
import { ItemManagementService } from '../../../services/Items/item-management.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ItemTypesService } from '../../../services/Items/item-types.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CompanyManagementService } from '../../../services/company-management.service';
import { ItemStatusService } from '../../../services/Items/item-status.service';
import { ItemAttributeService } from '../../../services/Items/item-attribute.service';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { BroadcasterService } from '../../../services/broadcaster.service';
import { DatePipe, Location } from '@angular/common';
import { ExcelService } from '../../../services/excel-service';
import * as cloneDeep from 'lodash';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { IDatePickerConfig } from 'ng2-date-picker';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { LoginComponent } from '../../pages/login.component';

@Component({
  selector: 'app-advanced-item-search',
  templateUrl: './advanced-item-search.component.html',
  styleUrls: ['./advanced-item-search.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdvancedItemSearchComponent implements OnInit {
  public showSearchResults = false;
  public isExpandAdvancedSearch = true;
  public itemModel: any = {};
  public repairModel: any = {};
  public locationModel = {};
  public itemTypes: any[] = [];
  public attributesList = [];
  public attributesValuesList = [];
  public statuses: any = [];
  public locations = [];
  public globalCompany;
  public companyName = '';
  public companyId;
  public typeAttributes: any;
  public itemTypeName: any;
  public itemId: any;
  public isloaded = false;
  public itemrepairnotesrfqModel: any = {};
  public itemNotesList: any = {};
  public repairlogList: any = [];
  public RFQsList: any = [];
  public currentAttributeValues = [];
  value: any;
  items: TreeviewItem[];
  itemTypeItems: TreeviewItem[];
  config = TreeviewConfig.create({
    hasFilter: false,
    hasCollapseExpand: false,
  });
  // loader = false;
  advancedsearchflag: number = 0;
  searchresults: any = {};
  isOwnerAdmin: any;
  loggedInuser: string | null;
  public excelObj: any;
  searchResults: any[] = [];
  attributesSearchDisplay: any[] = [];
  public searchResultKeys: any = [];
  itemsForPagination: any = 10;
  itemsLength: number;
  public dynLst: Array<any> = [];
  flag: any;
  pieChartFlag: any = 0;
  public advanceSearchResults: any = [];
  public searchKeys: any = [];
  public advancedItemSearchRepaiNotesSearchresults: any = {};
  activeTab: number = 0;
  public keys: any = [];

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

  public barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'left',
        align: 'start',
        labels: {
          font: {
            size: 10,
          },
          boxWidth: 12,
          boxHeight: 12,
        },
      },
    },
  };

  public pieChartType: ChartType = 'pie';

  public chartColors: Array<any> = [];

  public pieChartLabels: string[] = [];
  public pieChartData: ChartDataset[] = [];
  public pieChartCauseLabels: string[] = [];
  public pieChartCauseData: ChartDataset[] = [];

  repairJobs: any = [];
  modalRef: BsModalRef;
  pieChartModal: BsModalRef;
  public datePickerConfig: IDatePickerConfig = {
    showMultipleYearsNavigation: true,
  };
  public params: any = {};
  selectedVal: string;
  public repairFlag: string;
  failureTypesandPercentage: any = {};
  public itemIds: any = [];
  selectedFailureType: any;
  failureTypesandPercentageCause: any;
  userId: any;
  selectedFailureCause: any;
  startDate: any;
  endDate: any;
  index = 0;
  highestRank: any;
  dismissible = true;
  isTimeSpanSelected = 0;
  public showFailedItemsSearchResults = false;
  vendors: any;
  order: string;
  reverse: string = '';
  public attr: any;

  constructor(
    private modalService: BsModalService,
    private locationManagementService: LocationManagementService,
    private itemStatusService: ItemStatusService,
    private itemManagementService: ItemManagementService,
    private router: Router,
    private companyManagementService: CompanyManagementService,
    private itemTypesService: ItemTypesService,
    private route: ActivatedRoute,
    private excelService: ExcelService,
    private _location: Location,
    public datepipe: DatePipe,
    private spinner: NgxSpinnerService,
    private itemAttributeService: ItemAttributeService,
    private broadcasterService: BroadcasterService
  ) {
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany) {
      this.companyName = this.globalCompany.name;
      this.companyId = this.globalCompany.companyid;
    }
    this.itemId = route.snapshot.params['itemId'];
    this.itemTypes = this.itemManagementService.getItemTypes();
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value.companyid;
      this.companyName = this.globalCompany.name;

      console.log('inide item search');
    });
    this.InitData();
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
    this.initializeData();
    // this.showFailedItemsSearchResults = false;
    // this.showSearchResults = false;
    this.selectedVal = 'count';
  }

  initializeData() {
    this.highestRank = sessionStorage.getItem('highestRank');
    this.advanceSearchResults =
      this.itemManagementService.getAdvancedItemSearchResults();
    this.searchKeys = Object.keys(this.advanceSearchResults);
    if (this.searchKeys.length > 0) {
      this.activeTab = 0;
      this.itemrepairnotesrfqModel.isitemnote = true;
      this.itemrepairnotesrfqModel.isitemrepair = true;
      this.itemModel = this.itemManagementService.itemModel;
      this.currentAttributeValues = this.itemModel.attributevalues;
      if (this.itemModel.count == 1) {
        this.value = this.itemModel.value;
        this.isExpandAdvancedSearch = true;
      } else if (this.itemManagementService.getCount() == 2) {
        this.value = this.itemModel.value;
        this.isExpandAdvancedSearch = false;
        this.reloadForFailedItems();
      } else {
        this.isExpandAdvancedSearch = false;
        this.value = this.itemModel.value;
        this.reloadInit();
      }
    } else {
      this.advancedItemSearchRepaiNotesSearchresults =
        this.itemManagementService.getAdvancedItemSearchRepaiNotesSearchresults();
      this.keys = Object.keys(this.advancedItemSearchRepaiNotesSearchresults);
      if (this.keys.length > 0) {
        this.activeTab = 1;
        this.itemrepairnotesrfqModel =
          this.itemManagementService.itemrepairnotesrfqModel;
        this.itemrepairnotesrfqModel.isitemnote =
          this.itemrepairnotesrfqModel.isitemnote;
        this.itemrepairnotesrfqModel.isitemrepair =
          this.itemrepairnotesrfqModel.isitemrepair;
        this.searchresults =
          this.itemManagementService.getAdvancedItemSearchRepaiNotesSearchresults();
        this.itemNotesList = this.searchresults.itemNotes;
        this.repairlogList = this.searchresults.repairlogList;
      } else {
        this.itemrepairnotesrfqModel.isitemnote = true;
        this.itemrepairnotesrfqModel.isitemrepair = true;
      }
    }
  }

  InitData() {
    this.isOwnerAdmin = sessionStorage.getItem('IsOwnerAdmin');
    this.loggedInuser = sessionStorage.getItem('userId');
    this.locations = this.broadcasterService.locations;
    if (this.locations && this.locations.length > 0) {
      this.items = [];
      this.items = this.generateHierarchy(this.locations);
    }
    this.getAllItemTypes();
  }

  back() {
    this._location.back();
  }

  generateHierarchy(locList: any[]) {
    var items: TreeviewItem[] = [];
    locList.forEach((loc) => {
      var children: TreeviewItem[] = [];
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

  onValueChange(val: any) {
    this.itemModel.locationId = val;
  }

  generateHierarchyForItemTypes(typeList: any[]) {
    var items: TreeviewItem[] = [];
    typeList.forEach((type) => {
      var children: TreeviewItem[] = [];
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

  getAllItemTypes() {
    this.spinner.show();
    // this.loader = true;
    var self = this;

    this.itemTypes = this.broadcasterService.itemTypeHierarchy;
    if (this.itemTypes && this.itemTypes.length > 0) {
      self.itemTypeItems = this.generateHierarchyForItemTypes(this.itemTypes);

      if (self.itemTypeItems.length == 1) {
        this.itemTypeName = self.itemTypeItems[0].text;
        this.value = self.itemTypeItems[0].value;

        this.getTypeAttributes(self.itemTypeItems[0].value);
      } else {
        this.value = 0;
      }
    }
    this.getItemStatus();
  }

  getItemStatus() {
    this.spinner.show();
    // this.loader = true;
    this.itemStatusService.getAllItemStatuses(this.companyId).subscribe(
      (response: any) => {
        this.statuses = response;
        this.spinner.hide();
        // this.loader = false;
        this.isloaded = true;
      },
      (error) => {
        this.spinner.hide();
        this.isloaded = true;
        // this.loader = false;
      }
    );
  }

  getTypeAttributes(typeId: string | undefined) {
    this.currentAttributeValues = [];
    if (typeId != '0' && typeId != undefined) {
      this.spinner.show();
      // this.loader = true;
      this.itemAttributeService
        .getTypeAttributes(typeId)
        .subscribe((response: any) => {
          this.value = typeId;
          if (this.currentAttributeValues.length == 0)
            this.itemModel.attributevalues = response;
          this.spinner.hide();
          // this.loader = false;
        });
    } else {
      this.itemModel.attributevalues = [];
    }
  }

  searchItems() {
    this.isExpandAdvancedSearch = false;
    var attributeLis: { attributeNameID: any; name: any; value: any }[] = [];
    if (
      this.itemModel.attributevalues &&
      this.itemModel.attributevalues.length > 0
    ) {
      this.itemModel.attributevalues.forEach(
        (attr: { value: string; attributenameid: any; name: any }) => {
          if (attr.value && attr.value != '') {
            var attributeValue = attr.value.trim();
            var lastchar = attributeValue.substr(attributeValue.length - 1);
            if (lastchar == '.' || lastchar == ',') {
              attributeValue = attributeValue.substr(
                0,
                attributeValue.length - 1
              );
            }
            let listItem = {
              attributeNameID: attr.attributenameid,
              name: attr.name,
              value: attributeValue.replace('&amp;', '&').replace('&', '&amp;'),
            };
            attributeLis.push(listItem);
          }
        }
      );
    }
    var request = {
      companyId: this.companyId,
      name: this.itemModel.name ? this.itemModel.name : null,
      tag: this.itemModel.tag ? this.itemModel.tag : null,
      locationName: this.itemModel.location ? this.itemModel.location : null,
      statusId: this.itemModel.status ? this.itemModel.status : null,
      locationId: this.itemModel.locationId ? this.itemModel.locationId : null,
      typeId: this.value ? this.value : null,
      maxHitCount: attributeLis.length,
      ownerAdmin: this.isOwnerAdmin,
      userId: this.loggedInuser,
      attributeNameList: attributeLis,
    };

    this.spinner.show();
    // this.loader = true;
    this.searchResults = [];
    this.searchResultKeys = [];
    this.itemManagementService
      .getAdvancedSearchItems(request)
      .subscribe((response) => {
        this.itemManagementService.setAdvancedItemSearchResults(response);
        this.itemManagementService.setAdvancedItemSearchRepaiNotesSearchresults(
          []
        );
        this.searchresults = {};
        this.itemModel.value = this.value;
        this.spinner.hide();
        this.reloadInit();
      });
  }

  searchItemRepairNotesRfqModel() {
    this.advancedsearchflag = 1;
    var request = {
      companyID: this.companyId,
      extraTag: this.itemrepairnotesrfqModel.exactTag
        ? this.itemrepairnotesrfqModel.exactTag
        : null,
      RFQ: this.itemrepairnotesrfqModel.rfq
        ? this.itemrepairnotesrfqModel.rfq
        : null,
      po: this.itemrepairnotesrfqModel.po
        ? this.itemrepairnotesrfqModel.po
        : null,
      job: this.itemrepairnotesrfqModel.job
        ? this.itemrepairnotesrfqModel.job
        : null,
      noteFlag: this.itemrepairnotesrfqModel.isitemnote,
      repairFlag: this.itemrepairnotesrfqModel.isitemrepair,
      rfqFlag: this.itemrepairnotesrfqModel.isitemrfq,
      itemNotes: null,
      repairlogList: null,
      RFQsList: null,
      isOwnerAdmin: this.isOwnerAdmin,
      userId: this.loggedInuser,
    };
    this.spinner.show();
    // this.loader = true;
    this.itemManagementService
      .getAdvancedSearchItemRepairNotesRfq(request)
      .subscribe((response: any) => {
        this.searchresults = response;
        this.itemManagementService.setAdvancedItemSearchResults([]);
        this.searchResults = [];
        this.searchResultKeys = [];
        this.showSearchResults = false;
        this.showFailedItemsSearchResults = false;
        this.itemManagementService.itemrepairnotesrfqModel =
          this.itemrepairnotesrfqModel;
        this.itemManagementService.setAdvancedItemSearchRepaiNotesSearchresults(
          this.searchresults
        );
        this.itemNotesList = response.itemNotes;
        this.repairlogList = response.repairlogList;
        this.RFQsList = response.rfqsList;

        this.spinner.hide();
        // this.loader = false;
      });
  }

  clearItem() {
    this.itemModel = {};
    this.value = 0;
  }

  clearRepairNoteQuote() {
    this.itemrepairnotesrfqModel = {};
  }

  goToNote(
    itemId: string,
    journalid: string,
    rank: any,
    tag: any,
    typeName: any
  ) {
    this.broadcasterService.itemRank = rank;
    this.broadcasterService.currentItemTag = tag;
    this.broadcasterService.currentItemType = typeName;
    this.router.navigate(['/items/itemNotes/' + itemId + '/' + journalid]);
  }

  goToItemRepair(
    itemId: string,
    repairLogId: string,
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
    if (this.modalRef && this.pieChartModal != undefined) {
      this.modalRef.hide();
      this.pieChartModal.hide();
    }
  }

  reloadInit() {
    this.showSearchResults = true;
    this.getAttributesForSearchDisplay();
    this.flag = 0;
    this.searchResults =
      this.itemManagementService.getAdvancedItemSearchResults();
    console.log(this.itemManagementService.getAdvancedItemSearchResults());
    this.searchResultKeys = Object.keys(this.searchResults);
    console.log(this.searchResultKeys);
    if (this.searchResultKeys.length == 0) {
      this.flag = 1;
    } else {
      this.dynLst = [];
      for (let item of this.searchResultKeys) {
        const dnobj = { itemsForPagination: 10, p: 1 };
        this.dynLst.push(dnobj);
      }
      console.log('searchkeylength' + this.searchResultKeys.length);
      if (this.searchResultKeys.length == 1) {
        let key: any;
        let itemId: any;
        let rank: any;
        let count: number = 0;

        key = this.searchResultKeys[0];
        console.log('key' + key);
        this.searchResults[key].forEach((obj: any) => {
          count++;
        });
        this.itemsLength = count;
        console.log('length:' + count);
        if (count == 1) {
          this.searchResults[key].forEach((obj: any) => {
            itemId = obj.itemId;
            rank = obj.rank;
            this.itemModel.count = 1;
            this.itemManagementService.itemModel = this.itemModel;
            this.goToView(itemId, rank, obj.tag, obj.typeName);
          });
        } else {
          this.itemModel.count = this.itemsLength;
          this.itemManagementService.itemModel = this.itemModel;
        }
      } else if (this.searchResultKeys.length > 1) {
        let key: any;
        let count: number = 0;
        let i: number;

        for (i = 0; i < this.searchResultKeys.length; i++) {
          let itemcount: number = 0;
          key = this.searchResultKeys[i];

          this.searchResults[key].forEach((obj: any) => {
            itemcount++;
          });
          count = count + itemcount;
        }
        this.itemsLength = count;
        this.itemModel.count = this.itemsLength;
        this.itemManagementService.itemModel = this.itemModel;
      }
    }
    (error: any) => {
      this.spinner.hide();
    };
  }

  getAttributesForSearchDisplay() {
    this.itemManagementService
      .getAttributesForSearchDisplay(this.companyId)
      .subscribe(
        (response: any) => {
          this.attributesSearchDisplay = response;
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }

  exportAsExcelFileWithMultipleSheets() {
    const clonedsearchResults: any = cloneDeep(this.searchResults);
    Object.keys(clonedsearchResults).forEach((itemType) => {
      const result = clonedsearchResults[itemType];
      result.forEach((obj: any) => {
        const robj: any = {};
        obj.attributeNameList.forEach((atr: any) => {
          robj[atr.name] = atr.value;
        });

        delete obj.typeName;
        delete obj.locationName;
        delete obj.itemId;
        delete obj.rank;

        obj = Object.assign(obj, robj);
      });
    });
    this.excelService.exportAsExcelFileWithMultipleSheets(
      clonedsearchResults,
      'itemAdvancedSearchResults'
    );
  }

  onTabChanged(event: { index: number }) {
    this.activeTab = event.index;
  }

  goToView(itemId: string, rank: any, tag: any, typeName: any) {
    this.broadcasterService.currentItemTag = tag;
    this.broadcasterService.currentItemType = typeName;
    this.broadcasterService.itemRank = rank;
    this.router.navigate(['/items/viewItem/' + itemId]);
    if (this.modalRef && this.pieChartModal != undefined) {
      this.modalRef.hide();
      this.pieChartModal.hide();
    }
  }

  getPieChartData(event: any, template: TemplateRef<any>): void {
    this.pieChartFlag = 1;
    this.selectedVal = 'count';
    this.repairFlag = 'false';
    this.params.type = 'yearly';
    this.index = 0;
    this.highestRank = sessionStorage.getItem('highestRank');
    this.getFailureTypesPieChart();
    this.openModalForPieCharts(template);
  }

  getFailureTypesPieChart() {
    this.index = 0;
    if (this.params.type === 'yearly') {
      const startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);
      this.startDate = startDate;
      this.endDate = new Date();
    } else if (this.params.type == 'lasttwoyears') {
      const startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 2);
      this.startDate = startDate;
      this.endDate = new Date();
    } else if (this.params.type == 'monthly') {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      this.startDate = startDate;
      this.endDate = new Date();
    } else if (this.params.type === 'quarterly') {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 3);
      this.startDate = startDate;
      this.endDate = new Date();
    } else {
      if (!this.params.from && !this.params.to) {
        this.index = -1;
        window.scroll(0, 0);
        return false;
      }
      this.startDate = this.params.from;
      this.endDate = this.params.to;
    }
    this.itemIds = [];
    Object.keys(this.searchResults).forEach((itemType: any) => {
      const items = this.searchResults[itemType];
      items.forEach((item: any) => {
        this.itemIds.push(item.itemId);
      });
    });
    var request = {
      companyId: this.companyId,
      isByRepairCost: this.repairFlag,
      startDate: this.datepipe.transform(this.startDate, 'yyyy-MM-dd'),
      endDate: this.datepipe.transform(this.endDate, 'yyyy-MM-dd'),
      itemIds: this.itemIds,
    };
    this.itemManagementService
      .getAdvanceSearchPiechart(request)
      .subscribe((response) => {
        this.spinner.hide();
        this.failureTypesandPercentage = response;
        this.pieChartCauseLabels.length = 0;
        this.pieChartCauseLabels = [];
        this.pieChartCauseData.length = 0;
        this.pieChartCauseData = [];

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
      });
    return;
  }

  openModalForPieCharts(
    myTemplate: string | TemplateRef<any> | (new (...args: any[]) => any)
  ) {
    this.pieChartModal = this.modalService.show(myTemplate, {
      class: 'modal-lg',
    });
  }

  closeModelForPieCharts() {
    this.pieChartModal.hide();
  }

  openModal(
    myTemplate: string | TemplateRef<any> | (new (...args: any[]) => any)
  ) {
    this.modalRef = this.modalService.show(myTemplate, { class: 'modal-lg' });
  }

  CloseModel() {
    this.modalRef.hide();
  }

  public chartHovered(e: any): void {}

  public chartClicked(e: any): void {
    const clickedLabel =
    e.event.chart.config._config.data.labels[e.active[0].index];
    const matches = clickedLabel.replace(/\b\d+(\.\d+)?\b\s*/g, '').trim();
    const type = matches;

    this.selectedFailureType = type;
    console.log('selectedFailureCause33', this.selectedFailureCause);

    var request = {
      companyId: this.companyId,
      failureType: this.selectedFailureType,
      isByRepairCost: Boolean(this.repairFlag),
      startDate: this.datepipe.transform(this.startDate, 'yyyy-MM-dd'),
      endDate: this.datepipe.transform(this.endDate, 'yyyy-MM-dd'),
      itemIds: this.itemIds,
    };
    this.spinner.show();
    // this.loader = true;
    this.itemManagementService
      .getFailureCausesPieChart(request)
      .subscribe((data) => {
        this.spinner.hide();
        this.failureTypesandPercentageCause = data;

        this.pieChartCauseLabels = [];
        this.pieChartCauseData = [];

        const labels = Object.keys(this.failureTypesandPercentageCause);
        const percentages = Object.values(this.failureTypesandPercentageCause);

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

  public getRepairJobs(e: any, template: TemplateRef<any>): void {
    let causeText;
    this.isOwnerAdmin = sessionStorage.getItem('IsOwnerAdmin');
    this.userId = sessionStorage.getItem('userId');
    const clickedLabel =
      e.event.chart.config._config.data.labels[e.active[0].index];
      const matches = clickedLabel.replace(/\b\d+(\.\d+)?\b\s*/g, '').trim();
      const cause = matches;
  
      this.selectedFailureCause = cause;
      console.log('selectedFailureCause33', this.selectedFailureCause);

    var request = {
      companyId: this.companyId,
      failureType: this.selectedFailureType,
      failureCause: this.selectedFailureCause,
      isOwnerAdmin: this.isOwnerAdmin,
      userId: this.userId,
      startDate: this.datepipe.transform(this.startDate, 'yyyy-MM-dd'),
      endDate: this.datepipe.transform(this.endDate, 'yyyy-MM-dd'),
      itemIds: this.itemIds,
    };
    if (cause != '') {
      this.spinner.show();
      // this.loader = true;
      this.itemManagementService
        .getRepairJobsByFailureCause(request)
        .subscribe((data) => {
          this.spinner.hide();
          // this.loader = false;
          this.repairJobs = data;
          this.openModal(template);
        });
    }
  }

  public onValChange(val: string) {
    console.log(val);
    this.selectedVal = val;
    if (this.selectedVal == 'repaircost') {
      this.repairFlag = 'true';
      this.params.type = 'yearly';
      this.getFailureTypesPieChart();
    } else if (this.selectedVal == 'count') {
      this.repairFlag = 'false';
      this.params.type = 'yearly';
      this.getFailureTypesPieChart();
    }
  }

  exportToExel() {
    const clonedsearchResults: any = cloneDeep(this.repairJobs);

    clonedsearchResults.forEach((obj: any) => {
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
    });
    this.excelService.exportAsExcelFile(clonedsearchResults, 'RepairJobs');
  }

  getDataForFailedItems() {
    this.showSearchResults = false;
    console.log(this.params.type);
    if (this.params.type == 'yearly') {
      this.isExpandAdvancedSearch = false;
      this.isTimeSpanSelected = 0;
      this.spinner.show;
      // this.loader = true;
      this.itemManagementService
        .getDataForFailedItems(this.companyId)
        .subscribe((response: any) => {
          this.searchResults = response;
          this.itemManagementService.setAdvancedItemSearchResults(response);
          this.showFailedItemsSearchResults = true;
          this.spinner.hide;
          this.reloadForFailedItems();
        });
    } else {
      this.isTimeSpanSelected = -1;
    }
  }

  reloadForFailedItems() {
    this.showFailedItemsSearchResults = true;
    this.getAttributesForSearchDisplay();
    this.flag = 0;
    this.searchResults =
      this.itemManagementService.getAdvancedItemSearchResults();
    console.log(this.itemManagementService.getAdvancedItemSearchResults());
    this.searchResultKeys = Object.keys(this.searchResults);
    console.log(this.searchResultKeys);
    if (this.searchResultKeys.length == 0) {
      this.flag = 1;
    } else {
      this.dynLst = [];
      for (let item of this.searchResultKeys) {
        const dnobj = { itemsForPagination: 10, p: 1 };
        this.dynLst.push(dnobj);
      }
      console.log('searchkeylength' + this.searchResultKeys.length);
      if (this.searchResultKeys.length == 1) {
        let key: any;
        let itemId: any;
        let rank: any;
        let count: number = 0;

        key = this.searchResultKeys[0];
        console.log('key' + key);
        this.searchResults[key].forEach((obj: any) => {
          count++;
        });
        this.itemsLength = count;
        console.log('length:' + count);
        if (count == 1) {
          this.searchResults[key].forEach((obj: any) => {
            itemId = obj.itemId;
            rank = obj.rank;
            this.itemModel.count = 1;
            this.itemManagementService.itemModel = this.itemModel;
            this.goToView(itemId, rank, obj.tag, obj.typeName);
          });
        } else {
          this.itemModel.count = this.itemsLength;
          this.itemManagementService.itemModel = this.itemModel;
          this.itemManagementService.setCount(2);
        }
      } else if (this.searchResultKeys.length > 1) {
        let key: any;
        let count: number = 0;
        let i: number;

        for (i = 0; i < this.searchResultKeys.length; i++) {
          let itemcount: number = 0;
          key = this.searchResultKeys[i];

          this.searchResults[key].forEach((obj: any) => {
            itemcount++;
          });
          count = count + itemcount;
        }
        this.itemsLength = count;
        this.itemModel.count = this.itemsLength;
        this.itemManagementService.itemModel = this.itemModel;
        this.itemManagementService.setCount(2);
      }
    }
    (error: any) => {
      this.spinner.hide();
      // this.loader = false;
    };
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
}
