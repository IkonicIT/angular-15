import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ItemManagementService } from '../../../services/Items/item-management.service';
import { BroadcasterService } from '../../../services/broadcaster.service';
import { Router } from '@angular/router';
import { CompanyManagementService } from '../../../services/index';
import * as cloneDeep from 'lodash';
import { ExcelService } from '../../../services/excel-service';

@Component({
  selector: 'app-master-search',
  templateUrl: './master-search.component.html',
  styleUrls: ['./master-search.component.scss'],
})
export class MasterSearchComponent implements OnInit {
  public isExpandAdvancedSearch = true;
  model: any = {};
  public searchResults: any = [];
  public searchResultKeys: string[] = [];
  public flag: number | undefined;
  public sampleData: any[] = [];
  public searchTypeNameResultKeys: string[] = [];
  public items: { [key: string]: any[] } = {};
  public results: any[] = [];
  index: number | undefined;
  public dynLst: any[][] = [];
  public masterSearchResults: any = [];
  helpFlag = false;
  dismissible = true;
  order: string | undefined;
  reverse = '';
  loader = false;

  constructor(
    private itemManagementService: ItemManagementService,
    private spinner: NgxSpinnerService,
    private broadcasterService: BroadcasterService,
    private router: Router,
    private companyManagementService: CompanyManagementService,
    private excelService: ExcelService
  ) {}

  ngOnInit() {
    this.initializeData();
  }

  setData() {}

  initializeData() {
    this.masterSearchResults =
      this.itemManagementService.getItemMasterSearchResults();
    const keys = Object.keys(this.masterSearchResults);
    if (keys.length > 0) {
      this.model = this.itemManagementService.masterSearchModel;
      this.searchResults = this.masterSearchResults;
      this.searchResultKeys = Object.keys(this.searchResults);
      this.flag = 0;
      this.setPaginationArray();
    }
  }

  getSearchedItems() {
    if (this.model.tag && this.model.tag !== '') {
      this.index = 0;
      this.isExpandAdvancedSearch = false;
      this.spinner.show();

      const req = {
        tag: this.model.tag ? this.model.tag : null,
        name: this.model.name ? this.model.name : null,
        statusname: this.model.statusName ? this.model.statusName : null,
        locationName: this.model.locationName ? this.model.locationName : null,
        typeName: this.model.typeName ? this.model.typeName : null,
      };
      this.searchResults = [];
      this.searchResultKeys = [];
      this.itemManagementService.masterSearch(req).subscribe((response: any) => {
        this.spinner.hide();

        this.searchResults = Array.isArray(response) ? response : response || [];

        this.itemManagementService.setItemMasterSearchResults(this.searchResults);
        this.itemManagementService.masterSearchModel = req;
        this.searchResultKeys = Object.keys(this.searchResults);

        if (this.searchResultKeys.length === 0) {
          this.flag = 1;
        } else if (this.searchResultKeys.length === 1) {
          const companyName = this.searchResultKeys[0];
          this.searchTypeNameResultKeys = Object.keys(this.searchResults[companyName]);
          if (this.searchTypeNameResultKeys.length === 1) {
            this.items = this.searchResults[companyName] as { [key: string]: any[] };
            const key = this.searchTypeNameResultKeys[0];

            if (Array.isArray(this.items[key]) && this.items[key].length === 1) {
              const obj = this.items[key][0];
              const itemId = obj.itemId;
              const rank = obj.itemRank;
              const tag = obj.tag;
              const typeName = obj.typeName;
              const companyId = obj.companyId;
              this.goToView(itemId, rank, tag, typeName, companyId);
            }
          }
        } else {
          this.flag = 0;
          this.setPaginationArray();
        }
      });
    } else {
      this.index = -1;
    }
  }

  goToView(itemId: string, rank: any, tag: any, typeName: any, companyId: any) {
    this.broadcasterService.currentItemTag = tag;
    this.broadcasterService.currentItemType = typeName;
    this.broadcasterService.itemRank = rank;
    this.broadcasterService.switchCompanyId = companyId;
    this.companyManagementService.setSwithCompany(true);
    this.router.navigate(['/items/viewItem/' + itemId]);
  }

  getKeys(obj: {} | null | undefined) {
    if (obj != null && obj !== undefined) {
      return Object.keys(obj);
    }
    return;
  }

  Hide() {
    this.isExpandAdvancedSearch = false;
  }

  clear() {
    this.model = {};
  }

  setPaginationArray() {
    let m = 0;
    let n = 0;

    this.searchResultKeys.forEach((companyName: any) => {
      const results = this.searchResults[companyName];
      const itemTypes = Object.keys(results);
      n = itemTypes.length;
      this.insertIntoPaginationArray(m, n);
      m++;
    });
  }

  insertIntoPaginationArray(m: number, n: number) {
    for (let i = m; i <= m; i++) {
      this.dynLst[i] = [];

      for (let j = 0; j < n; ++j) {
        const dnobj = { itemsForPagination: 15, p: 1 };
        this.dynLst[i][j] = dnobj;
      }
    }
  }

  exportAsExcelFileWithMultipleSheets() {
    this.searchResultKeys.forEach((companyName: any) => {
      const results = this.searchResults[companyName];
      this.exportAsExcelFileForAcompany(results, companyName);
    });
  }

  exportAsExcelFileForAcompany(results: any, companyName: string) {
    const clonedsearchResults: any = cloneDeep(results);
    Object.keys(clonedsearchResults).forEach((itemType: any) => {
      const result = clonedsearchResults[itemType];
      result.forEach((obj: any) => {
        const robj: any = {};
        obj.attributeNameList.forEach((atr: any) => {
          robj[atr.name] = atr.value;
        });

        delete obj.itemId;
        delete obj.locationId;
        delete obj.companyId;
        delete obj.companyName;
        delete obj.typeName;
        delete obj.name;
        delete obj.description;
        delete obj.statusId;
        delete obj.warrantyTypeId;
        delete obj.warrantyExpiration;
        delete obj.serialNumber;
        delete obj.modelNumber;
        delete obj.meanTimeBetweenService;
        delete obj.inServiceOn;
        delete obj.lastModifiedBy;
        delete obj.isInRepair;
        delete obj.desiredSpareRatio;
        delete obj.manufacturerId;
        delete obj.repairQual;
        delete obj.purchasePrice;
        delete obj.daysInService;
        delete obj.purchaseDate;
        delete obj.defaultImageAttachmentId;
        delete obj.typeId;
        delete obj.isstale;
        delete obj.locationPath;
        delete obj.entityTypeId;
        delete obj.roleId;
        delete obj.userId;
        delete obj.roleName;
        delete obj.updatedDate;
        delete obj.createdDate;
        delete obj.itemRank;
        delete obj.attributeValues;

        obj = Object.assign(obj, robj);
      });
    });
    this.excelService.exportAsExcelFileWithMultipleSheets(
      clonedsearchResults,
      companyName + ' MasterSearchResults'
    );
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = this.reverse === '' ? '-' : '';
    }
    this.order = value;
  }

  print() {
    this.helpFlag = false;
    window.print();
  }

  help() {
    this.helpFlag = !this.helpFlag;
  }
}
