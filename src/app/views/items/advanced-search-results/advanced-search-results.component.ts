import { Component, OnInit } from '@angular/core';
import { ItemManagementService } from '../../../services/Items/item-management.service';
import { Router } from '@angular/router';
import { CompanyManagementService } from '../../../services/company-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from '../../../services/excel-service';
import * as cloneDeep from 'lodash';
import { Location } from '@angular/common';
import { BroadcasterService } from '../../../services/broadcaster.service';

@Component({
  selector: 'app-advanced-search-results',
  templateUrl: './advanced-search-results.component.html',
  styleUrls: ['./advanced-search-results.component.scss'],
})
export class AdvancedSearchResultsComponent implements OnInit {
  public globalCompany;
  public companyName = '';
  public companyId;
  public excelObj: any;
  searchResults: any[] = [];
  public attributesSearchDisplay: any = [];
  public searchResultKeys: any = [];
  itemsForPagination: any = 10;
  itemsLength: number;
  public dynLst: Array<any> = [];
  flag: any;
  order: string;
  reverse: string = '';
  dismissible = true;

  constructor(
    private itemManagementService: ItemManagementService,
    private router: Router,
    private companyManagementService: CompanyManagementService,
    private spinner: NgxSpinnerService,
    private _location: Location,
    private broadcasterService: BroadcasterService,
    private excelService: ExcelService
  ) {
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany) {
      this.companyName = this.globalCompany.name;
      this.companyId = this.globalCompany.companyid;
    }
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value.companyid;
      this.companyName = this.globalCompany.name;
    });
  }

  ngOnInit() {
    this.broadcasterService.on('advancedsearchresults').subscribe((data) => {
      this.reloadInit();
    });
  }
  reloadInit() {
    this.getAttributesForSearchDisplay();
    this.flag = 0;
    this.searchResults =
      this.itemManagementService.getAdvancedItemSearchResults();

    this.searchResultKeys = Object.keys(this.searchResults);

    if (this.searchResultKeys.length == 0) {
      this.flag = 1;
    }
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
          this.goToView(itemId, rank, obj.tag, obj.typeName);
        });
      }
    }
    if (this.searchResultKeys.length > 1) {
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
      console.log('length:' + count);
    }

    (error: any) => {
      this.spinner.hide();
    };
  }
  getAttributesForSearchDisplay() {
    this.itemManagementService
      .getAttributesForSearchDisplay(this.companyId)
      .subscribe(
        (response) => {
          this.attributesSearchDisplay = response;
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }

  exportAsExcelFileWithMultipleSheets() {
    const clonedsearchResults: any = cloneDeep(this.searchResults);
    Object.keys(clonedsearchResults).forEach((itemType: any) => {
      const result = clonedsearchResults[itemType];
      result.forEach((obj: any) => {
        const robj: any = {};
        obj.attributeNameList.forEach((atr: any) => {
          robj[atr.name] = atr.value;
        });
        delete obj.typeName;
        delete obj.locationPath;
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

  back() {
    this._location.back();
  }

  goToView(itemId: string, rank: any, tag: any, typeName: any) {
    this.broadcasterService.currentItemTag = tag;
    this.broadcasterService.currentItemType = typeName;
    this.broadcasterService.itemRank = rank;
    this.router.navigate(['/items/viewItem/' + itemId]);
  }
}
