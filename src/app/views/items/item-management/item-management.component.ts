import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CompanyManagementService } from '../../../services/company-management.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { ItemStatusService } from '../../../services/Items/item-status.service';
import { ItemTypesService } from '../../../services/Items/item-types.service';
import { WarrantyManagementService } from '../../../services/warranty-management.service';
import { LocationManagementService } from '../../../services/location-management.service';
import { ItemManagementService } from '../../../services/Items/item-management.service';
import { Observable, forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { BroadcasterService } from '../../../services/broadcaster.service';
import { ExcelService } from '../../../services/excel-service';
import * as cloneDeep from 'lodash';

export interface Attribute {
  name: string;
  value: string;
}

@Component({
  selector: 'app-item-management',
  templateUrl: './item-management.component.html',
  styleUrls: ['./item-management.component.scss'],
})
export class ItemManagementComponent implements OnInit {
  modalRef: BsModalRef | null = null;
  modalRef2!: BsModalRef;
  message = '';
  items: any[] = [];
  index!: number;
  order = 'name';
  reverse = '';
  itemFilter = '';
  itemsForPagination = 5;
  itemTypes: any[] = [];
  statuses: any[] = [];
  locations: any[] = [];
  warrantyTypes: any[] = [];
  companyId = 0;
  globalCompany: any;
  companyName = '';
  currentRole: string | null = null;
  highestRank?: string | null;
  get highestRankNum(): number {
    return Number(this.highestRank ?? 0);
  }
  excelObj: any;
  model: any = {
    statusId: 0,
    typeId: null,
  };
  queryString = '';
  suggessions: any[] = [];
  dataSource!: Observable<any>;
  typeAheadUrl = 'http://18.216.158.31:8087/api/item/searchTags/';

  value: any;
  locationItems: TreeviewItem[] = [];
  itemTypeItems: TreeviewItem[] = [];
  config = TreeviewConfig.create({
    hasFilter: false,
    hasCollapseExpand: false,
  });
  deleteFlag: any;
  isOwnerAdmin: string | null = null;
  loggedInuser: string | null = null;
  searchResults: Record<string, any[]> = {};
  public attributesSearchDisplay: Attribute[] = [];
  public searchResultKeys: string[] = [];
  public dynLst: Array<{ itemsForPagination: number; p: number }> = [];
  public totalItemsByType: Record<string, number> = {};
  public itemsLength: number = 0;
  public page: number = 1;
  public exportSearchResults: any = null;
  public lastSearchRequest: any = null;
  public lastExportRequest: any = null;
  public isExportDataLoading: boolean = false;
  flag: any;
  itemTag: any;
  itemType: any;
  helpFlag = false;
  dismissible = true;
  loader = false;
  exportProgress = '';

  constructor(
    private modalService: BsModalService,
    private locationManagementService: LocationManagementService,
    private itemManagementService: ItemManagementService,
    private route: ActivatedRoute,
    private router: Router,
    private broadcasterService: BroadcasterService,
    private companyManagementService: CompanyManagementService,
    private itemStatusService: ItemStatusService,
    private excelService: ExcelService,
    private itemTypesService: ItemTypesService,
    private warrantyManagementService: WarrantyManagementService,
    sanitizer: DomSanitizer,
    private spinner: NgxSpinnerService,
    private httpClient: HttpClient
  ) {
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany) {
      this.companyName = this.globalCompany.name;
      this.companyId = this.globalCompany.companyId;
    }
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value.companyId;
      this.companyName = this.globalCompany.name;
    });
    this.deleteFlag = itemManagementService.deleteFlag;
    setTimeout(() => {
      this.deleteFlag = 0;
    }, 5000);
    this.setInitValues();
  }

  ngOnInit() {
    this.itemTag = this.broadcasterService.currentItemTag;
    this.itemType = this.broadcasterService.currentItemType;
    this.getAttributesForSearchDisplay();
    this.spinner.show();
    this.getLocations();
    this.broadcasterService.on('refreshlist').subscribe(() => {
      this.setInitValues();
    });
    this.currentRole = sessionStorage.getItem('currentRole');
    this.highestRank = sessionStorage.getItem('highestRank');
  }

  getAttributesForSearchDisplay() {
    this.itemManagementService
      .getAttributesForSearchDisplay(String(this.companyId))
      .subscribe({
        next: (response: any) => {
          this.attributesSearchDisplay = response || [];
        },
        error: () => this.spinner.hide(),
      });
  }

  setInitValues() {
    this.searchResults = this.itemManagementService.getItemSearchResults();
    this.model.typeId = this.itemManagementService.getSearchedItemTypeId();
    this.model.statusId = this.itemManagementService.getSearchedItemStatusId();
    this.model.locationId =
      this.itemManagementService.getSearchedItemLocationId();
    this.value = this.model.locationId;
    this.model.tag = this.itemManagementService.getSearchedItemTag();

    this.searchResultKeys = Object.keys(this.searchResults || {});
    if (this.searchResultKeys.length === 0) {
      if (this.route.snapshot.params['type'] === 'all') {
        if (
          (this.model.tag && this.model.tag !== '') ||
          (this.model.typeId !== '' && this.model.typeId)
        ) {
          this.getSearchedItems();
        } else {
          this.getSearchedItemsByCompanyId();
        }
      }
    } else {
      this.dynLst = this.searchResultKeys.map(() => ({
        itemsForPagination: 5,
        p: 1,
      }));
    }
  }

  itemRepairs(item: any) {
    this.itemManagementService.setSearchedItemTypeId(item.typeId);
    this.itemManagementService.setSearchedItemTag(item.tag);
    this.router.navigate(['/items/itemRepairs/' + item.itemId]);
  }

  getLocations() {
    this.locations = this.broadcasterService.locations || [];
    if (this.locations.length > 0) {
      this.locationItems = this.generateHierarchy(this.locations);
    }
    this.getItemStatus();
  }

  generateHierarchy(locList: any[]): TreeviewItem[] {
    return locList.map((loc) => {
      const children = Array.isArray(loc.parentResourceList)
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

  onValueChange(value: any) {
    this.value = value;
    this.model.locationId = value;
  }

  getSuggessions(tag: string) {
    this.itemManagementService
      .getItemSuggessions(tag, String(this.companyId))
      .subscribe((response: any) => {
        this.suggessions = response || [];
      });
  }

  getSearchedItems() {
    this.flag = 0;
    this.isOwnerAdmin = sessionStorage.getItem('IsOwnerAdmin');
    this.loggedInuser = sessionStorage.getItem('userId');

    const request = {
      locationId: this.model.locationId || null,
      statusId: this.model.statusId || null,
      tag: this.model.tag || null,
      typeId: this.model.typeId || null,
      pageNumber: 1,
      pageSize: this.itemsForPagination,
      isExport: 0,
    };

    this.lastSearchRequest = { ...request };
    
    const exportRequest = { ...request, isExport: 1 };
    delete (exportRequest as any).pageNumber;
    delete (exportRequest as any).pageSize;

    this.spinner.show();
    this.searchResults = {};

    // Make paginated call first - show UI immediately
    (this.itemManagementService.getAllItems(
      request,
      this.companyId,
      this.isOwnerAdmin,
      this.loggedInuser
    ) as Observable<any>).subscribe({
      next: (paginatedResponse: any) => {
        this.spinner.hide();
        
        // Handle paginated response - show UI immediately
        this.itemManagementService.setItemSearchResults(paginatedResponse);
        this.searchResults = paginatedResponse || {};
        this.searchResultKeys = Object.keys(this.searchResults);
        this.dynLst = this.searchResultKeys.map(() => ({
          itemsForPagination: 5,
          p: 1,
        }));

        this.totalItemsByType = {};
        this.searchResultKeys.forEach((key) => {
          const rows = this.searchResults[key];
          if (Array.isArray(rows) && rows.length > 0) {
            const firstRow: any = rows[0];
            this.totalItemsByType[key] =
              firstRow.totalRows || firstRow.totalrows || firstRow.TotalRows || rows.length;
          } else {
            this.totalItemsByType[key] = 0;
          }
        });

        if (this.searchResultKeys.length > 0) {
          const firstKey = this.searchResultKeys[0];
          this.itemsLength = this.totalItemsByType[firstKey] || 0;
        } else {
          this.itemsLength = 0;
        }

        if (this.searchResultKeys.length === 0) {
          this.flag = 1;
        } else if (this.searchResultKeys.length === 1) {
          const key = this.searchResultKeys[0];
          if (
            Array.isArray(this.searchResults[key]) &&
            this.searchResults[key].length === 1
          ) {
            const obj = this.searchResults[key][0];
            this.goToView(obj.itemId, obj.itemRank, obj.tag, obj.typeName);
          }
          this.itemManagementService.deleteFlag = 0;
        }
      },
      error: () => {
        this.spinner.hide();
        this.exportSearchResults = null;
      },
    });

    // Make export call in parallel (non-blocking) - load data in background
    this.itemManagementService.getAllItems(
      exportRequest,
      this.companyId,
      this.isOwnerAdmin,
      this.loggedInuser
    ).subscribe({
      next: (exportResponse: any) => {
        // Set export data to full search results (all data)
        this.exportSearchResults = exportResponse;
      },
      error: () => {
        this.exportSearchResults = null;
      },
    });
  }

  exportAsXLSX(itemType: any): void {
    const result: any = this.searchResults[itemType];
    result.forEach((obj: any) => {
      const robj: any = {};
      obj.attributeNameList.forEach((atr: any) => {
        robj[atr.name] = atr.value;
      });
      delete obj.itemRank;
      obj = Object.assign(obj, robj);
    });

    this.excelService.exportAsExcelFile(result, 'itemAdvancedSearchResults');
  }
  getSearchedItemsByCompanyId() {
    this.flag = 0;
    this.isOwnerAdmin = sessionStorage.getItem('IsOwnerAdmin');
    this.loggedInuser = sessionStorage.getItem('userId');
    this.spinner.show();
    var req = {
      locationId: this.model.locationId ? this.model.locationId : null,
      statusId: this.model.statusId ? this.model.statusId : null,
      tag: this.model.tag ? this.model.tag : null,
      typeId: this.model.typeId ? this.model.typeId : null,
    };
    this.searchResults = {};
    this.itemManagementService
      .getAllItems(req, this.companyId, this.isOwnerAdmin, this.loggedInuser)
      .subscribe(
        (response: any) => {
          this.spinner.hide();
          this.searchResults = response;
          this.itemManagementService.setSearchedItemTag(req.tag);
          this.itemManagementService.setSearchedItemTypeId(req.typeId);
          this.itemManagementService.setSearchedItemLocationId(req.locationId);
          this.itemManagementService.setSearchedItemStatusId(req.statusId);
          this.itemManagementService.setItemSearchResults(response);
          this.searchResultKeys = Object.keys(this.searchResults);
          this.dynLst = [];
          for (let item of this.searchResultKeys) {
            const dnobj = { itemsForPagination: 5, p: 1 };
            this.dynLst.push(dnobj);
          }
          if (this.searchResultKeys.length == 0) {
            this.flag = 1;
          }
          if (this.searchResultKeys.length == 1) {
            let key: any;
            let itemId: any;
            let rank: any;
            let tag: any;
            let typeName: any;
            let count: number = 0;

            key = this.searchResultKeys[0];
            this.searchResults[key].forEach((obj: any) => {
              count++;
            });
            if (count == 1) {
              this.searchResults[key].forEach((obj: any) => {
                itemId = obj.itemid;
                rank = obj.itemRank;
                tag = obj.tag;
                typeName = obj.typeName;
                this.goToView(itemId, rank, tag, typeName);
              });
            }
          }
          this.itemManagementService.deleteFlag = 0;
        },
        (error) => {
          this.spinner.hide();
        }
      );
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
          value: type.typeId,
          collapsed: true,
          children: children,
        })
      );
    });
    return items;
  }

  getAllItemTypes() {
    this.spinner.show();
    this.itemTypesService
      .getAllItemTypesWithHierarchy(this.companyId)
      .subscribe(
        (response) => {
          this.spinner.hide();
          this.itemTypes = Array.isArray(response) ? response : [];;
          if (this.itemTypes && this.itemTypes.length > 0) {
            this.itemTypeItems = this.generateHierarchyForItemTypes(
              this.itemTypes
            );
          }
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }

  getItemStatus() {
    this.spinner.show();
    this.itemStatusService.getAllItemStatuses(String(this.companyId)).subscribe(
      (response) => {
        this.statuses = Array.isArray(response) ? response : [];
        this.getAllItemTypes();
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  getWarrantyTypes() {
    this.spinner.show();
    this.warrantyManagementService
      .getAllWarrantyTypes(this.companyId)
      .subscribe(
        (response) => {
          this.spinner.hide();
          this.warrantyTypes = Array.isArray(response) ? response : [];
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }

  refresh() {
    if (
      (this.model.tag && this.model.tag != '') ||
      (this.model.typeId != '' && this.model.typeId)
    )
      this.getSearchedItems();
    else {
      this.getSearchedItemsByCompanyId();
    }
  }

  openModal(template: TemplateRef<any>, id: number) {
    this.index = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }
  openModal2(template: TemplateRef<any>) {
    this.modalRef2 = this.modalService.show(template, { class: 'second' });
  }
  closeFirstModal() {
    this.modalRef?.hide();
    this.modalRef = null;
  }

  editItemRepair() {}
  goToAddItem() {
    this.router.navigate(['/items/addItem']);
  }

  onTypePageChange(page: number, index: number, itemType: string) {
    if (!this.dynLst[index]) {
      return;
    }

    this.dynLst[index].p = page;
    const request = {
      ...this.lastSearchRequest,
      pageNumber: page,
      pageSize: this.dynLst[index].itemsForPagination || this.itemsForPagination,
      isExport: 0,
    };

    this.spinner.show();
    this.searchResults = {};

    (this.itemManagementService.getAllItems(
      request,
      this.companyId,
      this.isOwnerAdmin,
      this.loggedInuser
    ) as Observable<any>).subscribe({
      next: (response: any) => {
        this.spinner.hide();
        this.searchResults = response || {};
        this.searchResultKeys = Object.keys(this.searchResults);

        this.totalItemsByType = {};
        this.searchResultKeys.forEach((key) => {
          const rows = this.searchResults[key];
          if (Array.isArray(rows) && rows.length > 0) {
            const firstRow: any = rows[0];
            this.totalItemsByType[key] =
              firstRow.totalRows || firstRow.totalrows || firstRow.TotalRows || rows.length;
          } else {
            this.totalItemsByType[key] = 0;
          }
        });

        if (this.searchResultKeys.length > 0) {
          const firstKey = this.searchResultKeys[0];
          this.itemsLength = this.totalItemsByType[firstKey] || 0;
        } else {
          this.itemsLength = 0;
        }
      },
      error: () => {
        this.spinner.hide();
      },
    });
  }

  onPageSizeChange(index: number, itemType: string) {
    if (!this.dynLst[index]) {
      return;
    }

    // Reset to page 1 when page size changes
    this.dynLst[index].p = 1;
    const pageSize = Number(this.dynLst[index].itemsForPagination) || this.itemsForPagination;

    const request = {
      ...this.lastSearchRequest,
      pageNumber: 1,
      pageSize: pageSize,
      isExport: 0,
    };

    this.spinner.show();
    this.searchResults = {};

    (this.itemManagementService.getAllItems(
      request,
      this.companyId,
      this.isOwnerAdmin,
      this.loggedInuser
    ) as Observable<any>).subscribe({
      next: (response: any) => {
        this.spinner.hide();
        this.searchResults = response || {};
        this.searchResultKeys = Object.keys(this.searchResults);

        this.totalItemsByType = {};
        this.searchResultKeys.forEach((key) => {
          const rows = this.searchResults[key];
          if (Array.isArray(rows) && rows.length > 0) {
            const firstRow: any = rows[0];
            this.totalItemsByType[key] =
              firstRow.totalRows || firstRow.totalrows || firstRow.TotalRows || rows.length;
          } else {
            this.totalItemsByType[key] = 0;
          }
        });

        if (this.searchResultKeys.length > 0) {
          const firstKey = this.searchResultKeys[0];
          this.itemsLength = this.totalItemsByType[firstKey] || 0;
        } else {
          this.itemsLength = 0;
        }
      },
      error: () => {
        this.spinner.hide();
      },
    });
  }

  goToView(itemId: string, rank: any, tag: any, typeName: any) {
    this.broadcasterService.currentItemTag = tag;
    this.broadcasterService.currentItemType = typeName;
    this.broadcasterService.itemRank = rank;
    this.router.navigate(['/items/viewItem/' + itemId]);
  }

  goToNotes(itemId: string, rank: any) {
    this.broadcasterService.itemRank = rank;
    this.router.navigate(['/items/notes/' + itemId]);
  }

  goToPicturesAndPrints(itemId: string, rank: any) {
    this.broadcasterService.itemRank = rank;
    this.router.navigate(['items/attachments/' + itemId]);
  }

  goToEdit(itemId: string, rank: any) {
    this.broadcasterService.itemRank = rank;
    this.router.navigate(['/items/editItem/' + itemId]);
  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef?.hide();
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

  private buildExportPayload(): Record<string, any[]> {
    const payload: Record<string, any[]> = {};
    Object.keys(this.exportSearchResults).forEach((itemType) => {
      const rows = this.exportSearchResults[itemType] || [];
      payload[itemType] = rows.map((obj: any) => {
        const exportObj: any = { ...obj };
        const attrs = obj['attributeNameList'];
        if (Array.isArray(attrs)) {
          attrs.forEach((atr: any) => {
            exportObj[atr.name] = atr.value;
          });
          exportObj['attributeNameList'] = JSON.stringify(attrs);
        }
        delete exportObj['attributeNameList'];
        return exportObj;
      });
    });
    return payload;
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

  async exportAsExcelFileWithMultipleSheets(): Promise<void> {
    if (!this.exportSearchResults) {
      return;
    }

    this.exportProgress = 'Preparing export...';
    await this.delay(0);
    const exportData = this.buildExportPayload();
    await this.exportMultipleExcelFiles(exportData);
    this.exportProgress = '';
  }

  print() {
    this.helpFlag = false;
    window.print();
  }
  help() {
    this.helpFlag = !this.helpFlag;
  }
}
