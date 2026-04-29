import {
  Component,
  OnInit,
  ViewEncapsulation,
  TemplateRef,
} from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
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
import cloneDeep from 'lodash/cloneDeep';
import { IDatePickerConfig } from 'ng2-date-picker';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-advanced-item-search',
  templateUrl: './advanced-item-search.component.html',
  styleUrls: ['./advanced-item-search.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdvancedItemSearchComponent implements OnInit {
  public selectedDeptNumber: number | null = null;
  public showSearchResults = false;
  public isExpandAdvancedSearch = true;
  public itemModel: any = {};
  public repairModel: any = {};
  public locationModel: any = {};
  public itemTypes: any[] = [];
  public deptData: any[] = [];
  public attributesList: any[] = [];
  public attributesValuesList: any[] = [];
  public statuses: any[] = [];
  public locations: any[] = [];
  public globalCompany: any;
  public companyName = '';
  public companyId: number = 0;
  public typeAttributes: any[] = [];
  public itemTypeName: string = '';
  public itemId: any;
  public isloaded = false;
  public itemrepairNotesrfqModel: any = {};
  public itemNotesList: any = {};
  public repairlogList: any[] = [];
  public RFQsList: any[] = [];
   lastExportRequest: any = null;
   private exportSubscription: Subscription;
   exportSearchResults: any = null;
isExportDataLoading: boolean = false;
  public exportProgress: string = '';
  public currentAttributeValues: any[] = [];
  public value: any;
  public items: TreeviewItem[] = [];
  public itemTypeItems: TreeviewItem[] = [];
  public config: TreeviewConfig = TreeviewConfig.create({
    hasFilter: false,
    hasCollapseExpand: false,
  });
  public advancedsearchflag: number = 0;
  public searchresults: any = {};
  public isOwnerAdmin: any;
  public loggedInuser: string | null = null;
  public excelObj: any;
  public searchResults: Record<string, any[]> = {};
public totalItemsByType: Record<string, number> = {};
  public attributesSearchDisplay: any[] = [];
  public searchResultKeys: any[] = [];
  public itemsForPagination: number = 10;
  public itemsLength: number = 0;
  public dynLst: Array<any> = [];
  public flag: any;
  public page: number = 1;
public itemsPerPage: number = 10;
public totalRows: number = 0;

    private lastSearchRequest: any = null;
  public pieChartFlag: number = 0;
  public advanceSearchResults: any[] = [];
  public searchKeys: any[] = [];
  public advancedItemSearchRepaiNotesSearchresults: any = {};
  public activeTab: number = 0;
  public keys: any[] = [];
  public pieChartPlugins: any = [
    {
      afterLayout: (chart: any) => {
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
  public chartColors: Array<any> = [
    {
      backgroundColor: [
        '#C71585', '#9370DB', '#A52A2A', '#90EE90', '#CD5C5C', '#20B2AA', '#B8860B', '#FF9B80',
        '#7FFF00', '#808000', '#D2B48C', '#87CEEB', '#FA8072', '#FFD700', '#98FB98', '#4B0082',
        '#00FFFF', '#FFFACD', '#FFB6C1', '#0000CD', '#BC8F8F', '#800080', '#FFDEAD', '#F0F8FF',
        '#FF69B4', '#ff9380',
      ],
    },
  ];
  public pieChartLabels: string[] = [];
  public pieChartData: ChartDataset[] = [];
  public pieChartCauseLabels: string[] = [];
  public pieChartCauseData: ChartDataset[] = [];
  public repairJobs: any[] = [];
  public modalRef!: BsModalRef;
  public pieChartModal!: BsModalRef;
  public datePickerConfig: IDatePickerConfig = {
    showMultipleYearsNavigation: true,
  };
  public params: any = {};
  public selectedVal: string = 'count';
  public repairFlag: string = 'false';
  public failureTypesandPercentage: any = {};
  public itemIds: any[] = [];
  public selectedFailureType: any;
  public failureTypesandPercentageCause: any;
  public userId: any;
  public selectedFailureCause: any;
  public startDate: any;
  public endDate: any;
  public index: number = 0;
  public highestRank: any;
  public dismissible: boolean = true;
  public isTimeSpanSelected: number = 0;
  public showFailedItemsSearchResults: boolean = false;
  public vendors: any;
  public order: string = '';
  public reverse: string = '';
  public attr: any;
  public isMMS: boolean = false;
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
      this.companyId = this.globalCompany.companyId;
    }
    this.itemId = route.snapshot.params['itemId'];
    this.itemTypes = this.itemManagementService.getItemTypes();
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value.companyId;
      this.companyName = this.globalCompany.name;
    });
    this.InitData();
  }

  ngOnInit(): void {
    this.initializeData();
    this.selectedVal = 'count';
    this.isMMS = sessionStorage.getItem('itemMMS') === 'true';
    console.log(sessionStorage.getItem('itemMMS'));
  }

  initializeData(): void {
    this.highestRank = sessionStorage.getItem('highestRank');
    this.advanceSearchResults = this.itemManagementService.getAdvancedItemSearchResults();
    this.searchKeys = Object.keys(this.advanceSearchResults);
    if (this.searchKeys.length > 0) {
      this.activeTab = 0;
      this.itemrepairNotesrfqModel.isitemnote = true;
      this.itemrepairNotesrfqModel.isitemrepair = true;
      this.itemModel = this.itemManagementService.itemModel;
      this.currentAttributeValues = this.itemModel.attributeValues;
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

  this.searchResults = this.itemManagementService.getAdvancedItemSearchResults();
  this.searchResultKeys = Object.keys(this.searchResults);

  this.showSearchResults = true;
}
    } else {
      this.advancedItemSearchRepaiNotesSearchresults = this.itemManagementService.getAdvancedItemSearchRepaiNotesSearchresults();
      this.keys = Object.keys(this.advancedItemSearchRepaiNotesSearchresults);
      if (this.keys.length > 0) {
        this.activeTab = 1;
        this.itemrepairNotesrfqModel = this.itemManagementService.itemrepairNotesrfqModel;
        this.itemrepairNotesrfqModel.isitemnote = this.itemrepairNotesrfqModel.isitemnote;
        this.itemrepairNotesrfqModel.isitemrepair = this.itemrepairNotesrfqModel.isitemrepair;
        this.searchresults = this.itemManagementService.getAdvancedItemSearchRepaiNotesSearchresults();
        this.itemNotesList = this.searchresults.itemNotes;
        this.repairlogList = this.searchresults.repairlogList;
      } else {
        this.itemrepairNotesrfqModel.isitemnote = true;
        this.itemrepairNotesrfqModel.isitemrepair = true;
      }
    }
  }

  InitData(): void {
    this.isOwnerAdmin = sessionStorage.getItem('IsOwnerAdmin');
    this.loggedInuser = sessionStorage.getItem('userId');
    this.locations = Array.isArray(this.broadcasterService.locations) ? this.broadcasterService.locations : [];
    if (this.locations && this.locations.length > 0) {
      this.items = this.generateHierarchy(this.locations);
    }
    this.getAllItemTypes();
    this.getDeptData();
  }

  back(): void {
    this._location.back();
  }

  generateHierarchy(locList: any[]): TreeviewItem[] {
    return locList.map(loc => {
      const children = loc.parentResourceList && loc.parentResourceList.length > 0
        ? this.generateHierarchy(loc.parentResourceList)
        : [];
      return new TreeviewItem({
        text: loc.name,
        value: loc.locationId,
        collapsed: true,
        children,
      });
    });
  }

  onValueChange(val: any): void {
    this.itemModel.locationId = val;
  }

  generateHierarchyForItemTypes(typeList: any[]): TreeviewItem[] {
    return typeList.map(type => {
      const children = type.typeList && type.typeList.length > 0
        ? this.generateHierarchyForItemTypes(type.typeList)
        : [];
      return new TreeviewItem({
        text: type.name,
        value: type.typeId,
        collapsed: true,
        children,
      });
    });
  }

  getAllItemTypes(): void {
    this.spinner.show();
    this.itemTypes = Array.isArray(this.broadcasterService.itemTypeHierarchy) ? this.broadcasterService.itemTypeHierarchy : [];
    if (this.itemTypes && this.itemTypes.length > 0) {
      this.itemTypeItems = this.generateHierarchyForItemTypes(this.itemTypes);
      if (this.itemTypeItems.length == 1) {
        this.itemTypeName = this.itemTypeItems[0].text;
        this.value = this.itemTypeItems[0].value;
        this.getTypeAttributes(this.itemTypeItems[0].value);
      } else {
        this.value = 0;
      }
    }
    this.getItemStatus();
    
  }

  getItemStatus(): void {
    this.spinner.show();
    this.itemStatusService.getAllItemStatuses(String(this.companyId)).subscribe(
      (response: any) => {
        this.statuses = Array.isArray(response) ? response : [];
        this.spinner.hide();
        this.isloaded = true;
      },
      () => {
        this.spinner.hide();
        this.isloaded = true;
      }
    );
  }
 getDeptData(): void {
  this.spinner.show();
  this.itemManagementService.getDepartmentData(this.companyId).subscribe(
    (response: any) => {
      this.deptData = Array.isArray(response) ? response.map(d =>
        new TreeviewItem({ text: d.deptName.trim(), value: d.deptNumber, children: [] })
      ) : [];
      this.spinner.hide();
      this.isloaded = true;
    },
    () => {
      this.spinner.hide();
      this.isloaded = true;
    }
  );
}

onDeptChange(deptNumber: number) {
  this.selectedDeptNumber = deptNumber;
  console.log('Selected deptNumber:', deptNumber);
}
  getTypeAttributes(typeId: string | undefined): void {
    this.currentAttributeValues = [];
    if (typeId != '0' && typeId != undefined) {
      this.spinner.show();
      this.itemAttributeService.getTypeAttributes(typeId).subscribe((response: any) => {
        this.value = typeId;
        if (this.currentAttributeValues.length == 0)
          this.itemModel.attributeValues = Array.isArray(response) ? response : [];
        this.currentAttributeValues = this.itemModel.attributeValues;
        this.spinner.hide();
      });
    } else {
      this.itemModel.attributeValues = [];
    }
  }

   searchItems() {
  this.isExpandAdvancedSearch = false;

  const attributeLis = this.buildAttributeList();

  const request = {
    companyId: this.companyId,
    name: this.itemModel.name ? this.itemModel.name : null,
    tag: this.itemModel.tag ? this.itemModel.tag : null,
    locationName: this.itemModel.location ? this.itemModel.location : null,
    statusId: this.itemModel.status ? this.itemModel.status : null,
    locationId: this.itemModel.locationId ? this.itemModel.locationId : null,
    deptNumber: this.selectedDeptNumber,
    typeId: this.value ? this.value : null,
    maxHitCount: attributeLis.length,
    ownerAdmin: this.isOwnerAdmin,
    userId: this.loggedInuser,
    attributeNameList: attributeLis,
    isExport: 0,
    isMMS: this.isMMS
  };

  this.lastSearchRequest = { ...request };
  this.page = 1;

  
  this.getAdvancedSearchResults(this.page, this.itemsForPagination, request);

  const exportRequest = { ...request, isExport: 1 };

  const isRequestChanged =
    JSON.stringify(exportRequest) !== JSON.stringify(this.lastExportRequest);

  if (isRequestChanged) {

    this.lastExportRequest = { ...exportRequest };

  
    if (this.exportSubscription) {
      this.exportSubscription.unsubscribe();
    }

    this.exportSearchResults = null;
    this.isExportDataLoading = true;

    this.exportSubscription = this.itemManagementService.getAdvancedSearchItems(exportRequest)
      .subscribe(res => {
        this.exportSearchResults = res;
        this.isExportDataLoading = false;
      }, err => {
        this.isExportDataLoading = false;
      });
  }
}
getAdvancedSearchResults(currentPage: number, itemsPerPage: number, baseRequest: any) {

  const request = {
    ...baseRequest,
    page: currentPage,
    size: itemsPerPage,
    
  };

  this.spinner.show();

  this.itemManagementService.getAdvancedSearchItems(request)
    .subscribe((response: Record<string, any[]>) => {

      this.spinner.hide();

      this.searchResults = response;
      this.searchResultKeys = Object.keys(this.searchResults);

      this.totalItemsByType = {};

      this.searchResultKeys.forEach(key => {
        if (response[key] && response[key].length > 0) {
          const firstRow = response[key][0];
          this.totalItemsByType[key] = firstRow.totalRows || firstRow.totalrows || firstRow.TotalRows || response[key].length;
        } else {
          this.totalItemsByType[key] = 0;
        }
      });

      // Set itemsLength from the first type's total count
      if (this.searchResultKeys.length > 0) {
        const firstKey = this.searchResultKeys[0];
        this.itemsLength = this.totalItemsByType[firstKey] || 0;
      } else {
        this.itemsLength = 0;
      }

  
      if (this.dynLst.length === 0) {
        this.searchResultKeys.forEach((key, index) => {
          this.dynLst[index] = { itemsForPagination: this.itemsForPagination, p: currentPage };
        });
      }

      this.showSearchResults = true;
      this.flag = this.searchResultKeys.length === 0 ? 1 : 0;

    });
}
onTypePageChange(page: number, index: number, itemType: string) {

  if (!this.lastSearchRequest) {
    console.warn('No search request stored. Perform a search first.');
    return;
  }

  if (!this.dynLst[index]) {
    this.dynLst[index] = { itemsForPagination: this.itemsForPagination, p: 1 };
  }

  
  this.dynLst[index].p = page;

  const request = {
    ...this.lastSearchRequest,
    page: page,
    size: this.dynLst[index].itemsForPagination || this.itemsForPagination
  };

  this.spinner.show();

  this.itemManagementService.getAdvancedSearchItems(request).subscribe((response: Record<string, any[]>) => {

    this.spinner.hide();

    if (!response) return;

    
    const key = Object.keys(response).find(k => k.toLowerCase() === itemType.toLowerCase());

    if (key) {
      this.searchResults[itemType] = response[key];

      if (response[key].length > 0) {
        const firstRow = response[key][0];
        this.totalItemsByType[itemType] = firstRow.totalRows || firstRow.totalrows || firstRow.TotalRows || response[key].length;
      }
    }

  }, err => {
    this.spinner.hide();
    console.error(err);
  });
}
onPageSizeChange(index: number, itemType: string) {
 
  if (!this.dynLst[index]) {
    this.dynLst[index] = { itemsForPagination: this.itemsForPagination, p: 1 };
  }

  
  this.dynLst[index].itemsForPagination = Number(this.dynLst[index].itemsForPagination) || this.itemsForPagination;

  this.onTypePageChange(1, index, itemType);
}
onPageChange(page: number) {
  this.page = page;

  const attributeLis = this.buildAttributeList();

  const request = {
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
    attributeNameList: attributeLis
  };

  this.getAdvancedSearchResults(this.page, this.itemsForPagination, request);
}
buildAttributeList() {
  const attributeLis: any[] = [];

  if (this.itemModel.attributeValues) {
    this.itemModel.attributeValues.forEach((attr: any) => {
      if (attr.value && attr.value !== "") {

        let attributeValue = attr.value.trim();
        const lastchar = attributeValue.substr(attributeValue.length - 1);

        if (lastchar === '.' || lastchar === ',') {
          attributeValue = attributeValue.substr(0, attributeValue.length - 1);
        }

        let formattedValue = attributeValue;
        const finalValue = formattedValue
          .replace("&amp;", "&")
          .replace(/&/g, "&amp;");
        const attributeObj = {
          attributeNameId: attr.attributeNameId,
          name: attr.name, 
          value: finalValue
        };
        attributeLis.push(attributeObj);
      }
    });
  }

  return attributeLis;
}
  searchItemRepairNotesRfqModel(): void {
    this.advancedsearchflag = 1;
    const request = {
      companyID: this.companyId,
      extraTag: this.itemrepairNotesrfqModel.exactTag ?? null,
      RFQ: this.itemrepairNotesrfqModel.rfq ?? null,
      PO: this.itemrepairNotesrfqModel.PO ?? null,
      job: this.itemrepairNotesrfqModel.job ?? null,
      noteFlag: this.itemrepairNotesrfqModel.isitemnote,
      repairFlag: this.itemrepairNotesrfqModel.isitemrepair,
      rfqFlag: this.itemrepairNotesrfqModel.isitemrfq,
      itemNotes: null,
      repairlogList: null,
      RFQsList: null,
      isOwnerAdmin: this.isOwnerAdmin,
      userId: this.loggedInuser,
    };
    this.spinner.show();
    this.itemManagementService.getAdvancedSearchItemRepairNotesRfq(request).subscribe((response: any) => {
     
      this.showSearchResults = false;
      this.showFailedItemsSearchResults = false;
      this.itemManagementService.itemrepairNotesrfqModel = this.itemrepairNotesrfqModel;
      this.itemManagementService.setAdvancedItemSearchRepaiNotesSearchresults(this.searchresults);
      this.itemNotesList = response.itemNotes;
      this.repairlogList = response.repairlogList;
      this.RFQsList = response.rfqsList;
      this.spinner.hide();
    });
  }

  clearItem(): void {
    this.itemModel = {};
    this.value = 0;
  }

  clearRepairNoteQuote(): void {
    this.itemrepairNotesrfqModel = {};
  }

  goToNote(itemId: string, journalId: string, rank: any, tag: any, typeName: any): void {
    this.broadcasterService.itemRank = rank;
    this.broadcasterService.currentItemTag = tag;
    this.broadcasterService.currentItemType = typeName;
    this.router.navigate(['/items/itemNotes/' + itemId + '/' + journalId]);
  }

  goToItemRepair(itemId: string, repairLogId: string, rank: any, tag: any, typeName: any): void {
    this.broadcasterService.itemRank = rank;
    this.broadcasterService.currentItemTag = tag;
    this.broadcasterService.currentItemType = typeName;
    this.router.navigate(['/items/viewItemRepair/' + itemId + '/' + repairLogId]);
    if (this.modalRef && this.pieChartModal != undefined) {
      this.modalRef.hide();
      this.pieChartModal.hide();
    }
  }

  reloadInit(): void {
    this.showSearchResults = true;
    this.getAttributesForSearchDisplay();
    this.flag = 0;
    this.searchResults = this.itemManagementService.getAdvancedItemSearchResults();
    this.searchResultKeys = Object.keys(this.searchResults);
    if (this.searchResultKeys.length == 0) {
      this.flag = 1;
    } else {
      this.dynLst = [];
      for (let item of this.searchResultKeys) {
        this.dynLst.push({ itemsForPagination: 10, p: 1 });
      }
      if (this.searchResultKeys.length == 1) {
        let key: any = this.searchResultKeys[0];
        let count: number = this.searchResults[key].length;
        this.itemsLength = count;
        if (count == 1) {
          this.searchResults[key].forEach((obj: any) => {
            this.itemModel.count = 1;
            this.itemManagementService.itemModel = this.itemModel;
            this.goToView(obj.itemId, obj.rank, obj.tag, obj.typeName);
          });
        } else {
          this.itemModel.count = this.itemsLength;
          this.itemManagementService.itemModel = this.itemModel;
        }
      } else if (this.searchResultKeys.length > 1) {
        let count: number = 0;
        for (let key of this.searchResultKeys) {
          count += this.searchResults[key].length;
        }
        this.itemsLength = count;
        this.itemModel.count = this.itemsLength;
        this.itemManagementService.itemModel = this.itemModel;
      }
    }
  }

  getAttributesForSearchDisplay(): void {
    this.itemManagementService.getAttributesForSearchDisplay(String(this.companyId)).subscribe(
      (response: any) => {
        this.attributesSearchDisplay = Array.isArray(response) ? response : [];
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  private buildExportChunks(
    sourceData: Record<string, any[]>,
    maxRowsPerWorkbook = 8000
  ): Array<{ fileNameSuffix: number; payload: Record<string, any[]> }> {
    const chunks: Array<{ fileNameSuffix: number; payload: Record<string, any[]> }> = [];
    let currentPayload: Record<string, any[]> = {};
    let currentRowCount = 0;
    let fileIndex = 1;

    const flushCurrentPayload = () => {
      if (Object.keys(currentPayload).length > 0) {
        chunks.push({ fileNameSuffix: fileIndex++, payload: { ...currentPayload } });
      }
      currentPayload = {};
      currentRowCount = 0;
    };

    const addSheetGroup = (sheetName: string, rows: any[]) => {
      if (!rows || rows.length === 0) {
        return;
      }

      const rowCount = rows.length;
      if (currentRowCount + rowCount > maxRowsPerWorkbook && currentRowCount > 0) {
        flushCurrentPayload();
      }

      if (rowCount > maxRowsPerWorkbook) {
        const rowGroups = this.chunkArray(rows, maxRowsPerWorkbook);
        rowGroups.forEach((group, index) => {
          const chunkedSheetName = `${sheetName}_${index + 1}`;
          if (currentRowCount + group.length > maxRowsPerWorkbook && currentRowCount > 0) {
            flushCurrentPayload();
          }
          currentPayload[chunkedSheetName] = group;
          currentRowCount += group.length;
          if (currentRowCount >= maxRowsPerWorkbook) {
            flushCurrentPayload();
          }
        });
      } else {
        currentPayload[sheetName] = rows;
        currentRowCount += rowCount;
      }
    };

    Object.keys(sourceData).forEach((sheetName) => {
      addSheetGroup(sheetName, sourceData[sheetName] || []);
    });

    flushCurrentPayload();
    return chunks;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async exportMultipleExcelFiles(exportData: Record<string, any[]>): Promise<void> {
    const maxRowsPerWorkbook = 8000;
    const maxRowsPerSheet = 4000;
    const workbookChunks = this.buildExportChunks(exportData, maxRowsPerWorkbook);

    for (const chunk of workbookChunks) {
      this.exportProgress = `Exporting file ${chunk.fileNameSuffix} of ${workbookChunks.length}...`;
      await this.delay(50);
      const fileName = `itemAdvancedSearchResults_part${chunk.fileNameSuffix}`;
      this.excelService.exportAsExcelFileWithMultipleSheets(
        chunk.payload,
        fileName,
        maxRowsPerSheet
      );
      await this.delay(100);
    }

    this.exportProgress = 'Export complete.';
  }

  private buildExportPayload(): Record<string, any[]> {
    const payload: Record<string, any[]> = {};
    Object.keys(this.exportSearchResults).forEach((itemType) => {
      const rows = this.exportSearchResults[itemType];
      if (!Array.isArray(rows)) {
        payload[itemType] = rows;
        return;
      }

      payload[itemType] = rows.map((obj: any) => {
        const exportObj: Record<string, any> = { ...obj };
        const attrList = obj['attributeNameList'];
        if (Array.isArray(attrList)) {
          attrList.forEach((atr: any) => {
            exportObj[atr.name] = atr.value;
          });
          exportObj['attributeNameList'] = JSON.stringify(attrList);
        }
        return exportObj;
      });
    });
    return payload;
  }

  async exportAsExcelFileWithMultipleSheets() {
    if (!this.exportSearchResults) {
      console.log('No export data available. Please search again.');
      return;
    }

    this.spinner.show();
    this.isExportDataLoading = true;
    this.exportProgress = 'Preparing export...';

    await this.delay(0);
    const exportData = this.buildExportPayload();

    await this.exportMultipleExcelFiles(exportData);

    this.spinner.hide();
    this.isExportDataLoading = false;
    this.exportProgress = '';
  }

  onTabChanged(event: { index: number }): void {
    this.activeTab = event.index;
  }

  goToView(itemId: string, rank: any, tag: any, typeName: any): void {
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

  getFailureTypesPieChart(): void {
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
        return;
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
    const request = {
      companyId: this.companyId,
      isByRepairCost: this.repairFlag,
      startDate: this.datepipe.transform(this.startDate, 'yyyy-MM-dd'),
      endDate: this.datepipe.transform(this.endDate, 'yyyy-MM-dd'),
      itemIds: this.itemIds,
    };
    this.itemManagementService.getAdvanceSearchPiechart(request).subscribe((response) => {
      this.spinner.hide();
      this.failureTypesandPercentage = response;
      this.pieChartCauseLabels = [];
      this.pieChartCauseData = [];
      this.pieChartLabels = [];
      this.pieChartData = [];
      const labels = Object.keys(this.failureTypesandPercentage);
      const percentages = Object.values(this.failureTypesandPercentage);
      const dataset: any = {
        data: percentages,
        backgroundColor: this.chartColors[0].backgroundColor,
      };
      this.pieChartLabels = labels.map((label, index) => `${label} ${percentages[index]}`);
      this.pieChartData = [dataset];
    });
  }

  openModalForPieCharts(myTemplate: string | TemplateRef<any> | (new (...args: any[]) => any)): void {
    this.pieChartModal = this.modalService.show(myTemplate, { class: 'modal-lg' });
  }

  closeModelForPieCharts(): void {
    this.pieChartModal.hide();
  }

  openModal(myTemplate: string | TemplateRef<any> | (new (...args: any[]) => any)): void {
    this.modalRef = this.modalService.show(myTemplate, { class: 'modal-lg' });
  }

  CloseModel(): void {
    this.modalRef.hide();
  }

  public chartHovered(e: any): void {}

  public chartClicked(e: any): void {
    const clickedLabel = e.event.chart.config._config.data.labels[e.active[0].index];
    const matches = clickedLabel.replace(/\b\d+(\.\d+)?\b\s*/g, '').trim();
    const type = matches;
    this.selectedFailureType = type;
    const request = {
      companyId: this.companyId,
      failureType: this.selectedFailureType,
      isByRepairCost: Boolean(this.repairFlag),
      startDate: this.datepipe.transform(this.startDate, 'yyyy-MM-dd'),
      endDate: this.datepipe.transform(this.endDate, 'yyyy-MM-dd'),
      itemIds: this.itemIds,
    };
    this.spinner.show();
    this.itemManagementService.getFailureCausesPieChart(request).subscribe((data) => {
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
      this.pieChartCauseLabels = labels.map((label, index) => `${label} ${percentages[index]}`);
      this.pieChartCauseData = [dataset];
    });
  }

  public getRepairJobs(e: any, template: TemplateRef<any>): void {
  this.isOwnerAdmin = sessionStorage.getItem('IsOwnerAdmin');
  this.userId = sessionStorage.getItem('userId');
  const clickedLabel = e.event.chart.config._config.data.labels[e.active[0].index];
  const matches = clickedLabel.replace(/\b\d+(\.\d+)?\b\s*/g, '').trim();
  const cause = matches;
  this.selectedFailureCause = cause;
  const request = {
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
    this.itemManagementService.getRepairJobsByFailureCause(request).subscribe((data) => {
      this.spinner.hide();
      this.repairJobs = Array.isArray(data) ? data : [];
      this.openModal(template);
    });
  }
}

  public onValChange(val: string): void {
    this.selectedVal = val;
    if (this.selectedVal == 'repairCost') {
      this.repairFlag = 'true';
      this.params.type = 'yearly';
      this.getFailureTypesPieChart();
    } else if (this.selectedVal == 'count') {
      this.repairFlag = 'false';
      this.params.type = 'yearly';
      this.getFailureTypesPieChart();
    }
  }

  exportToExel(): void {
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

  getDataForFailedItems(): void {
    this.showSearchResults = false;
    if (this.params.type == 'yearly') {
      this.isExpandAdvancedSearch = false;
      this.isTimeSpanSelected = 0;
      this.spinner.show();
      this.itemManagementService.getDataForFailedItems(String(this.companyId)).subscribe((response: any) => {
       this.searchResults = response && !Array.isArray(response) ? response : {};
        this.itemManagementService.setAdvancedItemSearchResults(response);
        this.showFailedItemsSearchResults = true;
        this.spinner.hide();
        this.reloadForFailedItems();
      });
    } else {
      this.isTimeSpanSelected = -1;
    }
  }

  reloadForFailedItems(): void {
    this.showFailedItemsSearchResults = true;
    this.getAttributesForSearchDisplay();
    this.flag = 0;
    this.searchResults = this.itemManagementService.getAdvancedItemSearchResults();
    this.searchResultKeys = Object.keys(this.searchResults);
    if (this.searchResultKeys.length == 0) {
      this.flag = 1;
    } else {
      this.dynLst = [];
      for (let item of this.searchResultKeys) {
        this.dynLst.push({ itemsForPagination: 10, p: 1 });
      }
      if (this.searchResultKeys.length == 1) {
        let key: any = this.searchResultKeys[0];
        let count: number = this.searchResults[key].length;
        this.itemsLength = count;
        if (count == 1) {
          this.searchResults[key].forEach((obj: any) => {
            this.itemModel.count = 1;
            this.itemManagementService.itemModel = this.itemModel;
            this.goToView(obj.itemId, obj.rank, obj.tag, obj.typeName);
          });
        } else {
          this.itemModel.count = this.itemsLength;
          this.itemManagementService.itemModel = this.itemModel;
          this.itemManagementService.setCount(2);
        }
      } else if (this.searchResultKeys.length > 1) {
        let count: number = 0;
        for (let key of this.searchResultKeys) {
          count += this.searchResults[key].length;
        }
        this.itemsLength = count;
        this.itemModel.count = this.itemsLength;
        this.itemManagementService.itemModel = this.itemModel;
        this.itemManagementService.setCount(2);
      }
    }
  }

  setOrder(value: string): void {
    if (this.order === value) {
      this.reverse = this.reverse === '' ? '-' : '';
    }
    this.order = value;
  }
}