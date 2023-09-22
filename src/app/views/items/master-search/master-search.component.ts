import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ItemManagementService } from '../../../services/Items/item-management.service';
import { BroadcasterService } from '../../../services/broadcaster.service';
import { Router, ActivatedRoute } from '@angular/router';
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
  public searchResultKeys: any = [];
  public flag: any;
  public sampleData = [];
  public searchTypeNameResultKeys: any = [];
  public items: any = [];
  public results = [];
  index: number;
  public dynLst: any[][] = [];
  public masterSearchResults = [];
  helpFlag: any = false;
  dismissible = true;
  order: string;
  reverse: string;
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
    let keys = Object.keys(this.masterSearchResults);
    if (keys.length > 0) {
      this.model = this.itemManagementService.masterSearchModel;
      this.searchResults = this.masterSearchResults;
      this.searchResultKeys = Object.keys(this.searchResults);
      this.flag = 0;
      this.setPaginationArray();
    }
  }

  getSearchedItems() {
    if (this.model.tag && this.model.tag != '') {
      this.index = 0;
      this.isExpandAdvancedSearch = false;
      this.spinner.show();
      this.loader = true;
      var req = {
        tag: this.model.tag ? this.model.tag : null,
        name: this.model.name ? this.model.name : null,
        statusname: this.model.statusName ? this.model.statusName : null,
        locationName: this.model.locationName ? this.model.locationName : null,
        typeName: this.model.typeName ? this.model.typeName : null,
      };
      this.searchResults = [];
      this.searchResultKeys = [];
      this.itemManagementService
        .masterSearch(req)
        .subscribe((response: any) => {
          this.spinner.hide();
          this.loader = false;
          this.searchResults = response;

          this.itemManagementService.setItemMasterSearchResults(
            this.searchResults
          );
          this.itemManagementService.masterSearchModel = req;
          this.searchResultKeys = Object.keys(this.searchResults);
          if (this.searchResultKeys.length == 0) {
            this.flag = 1;
          } else if (this.searchResultKeys.length == 1) {
            let companyName: any;
            companyName = this.searchResultKeys[0];
            this.searchTypeNameResultKeys = Object.keys(
              this.searchResults[companyName]
            );
            if (this.searchTypeNameResultKeys.length == 1) {
              this.items = this.searchResults[companyName];
              let key: any;
              let itemId: any;
              let rank: any;
              let tag: any;
              let typeName: any;
              let companyId: any;
              let count: number = 0;

              key = this.searchTypeNameResultKeys[0];
              this.items[key].forEach((obj: any) => {
                count++;
              });
              if (count == 1) {
                this.items[key].forEach((obj: any) => {
                  itemId = obj.itemid;
                  rank = obj.itemRank;
                  tag = obj.tag;
                  typeName = obj.typeName;
                  companyId = obj.companyid;
                  this.goToView(itemId, rank, tag, typeName, companyId);
                });
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
    if (obj != null && obj != undefined) {
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
    let m: number = 0;
    let n: number = 0;

    this.searchResultKeys.forEach((companyName: any) => {
      let results = this.searchResults[companyName];
      let itemTypes = Object.keys(results);
      n = itemTypes.length;
      this.insertIntoPaginationArray(m, n);
      m++;
    });
    console.log(this.dynLst);
  }

  insertIntoPaginationArray(m: any, n: any) {
    let i, j: number;
    for (i = m; i <= m; i++) {
      this.dynLst[i] = [];

      for (j = 0; j < n; ++j) {
        const dnobj = { itemsForPagination: 15, p: 1 };
        this.dynLst[i][j] = dnobj;
        console.log(this.dynLst[i][j]);
      }
    }
  }

  exportAsExcelFileWithMultipleSheets() {
    this.searchResultKeys.forEach((companyName: any) => {
      let results = this.searchResults[companyName];
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

        delete obj.itemid;
        delete obj.locationid;
        delete obj.companyid;
        delete obj.companyName;
        delete obj.typeName;
        delete obj.name;
        delete obj.description;
        delete obj.statusid;
        delete obj.warrantytypeid;
        delete obj.warrantyexpiration;
        delete obj.warrantyExpiration;
        delete obj.serialnumber;
        delete obj.modelnumber;
        delete obj.meantimebetweenservice;
        delete obj.inserviceon;
        delete obj.lastmodifiedby;
        delete obj.isinrepair;
        delete obj.desiredspareratio;
        delete obj.manufacturerid;
        delete obj.repairqual;
        delete obj.purchaseprice;
        delete obj.daysinservice;
        delete obj.purchasedate;
        delete obj.defaultimageattachmentid;
        delete obj.typeId;
        delete obj.isstale;
        delete obj.locationPath;
        delete obj.entityTypeId;
        delete obj.roleid;
        delete obj.userid;
        delete obj.roleName;
        delete obj.updatedDate;
        delete obj.createdDate;
        delete obj.itemRank;
        delete obj.attributevalues;

        obj = Object.assign(obj, robj);
      });
    });
    this.excelService.exportAsExcelFileWithMultipleSheets(
      clonedsearchResults,
      companyName + ' ' + 'MasterSearchResults'
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

  print() {
    this.helpFlag = false;
    window.print();
  }

  help() {
    this.helpFlag = !this.helpFlag;
  }
}
