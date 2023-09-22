import { Attribute, Component, OnInit } from '@angular/core';
import { ItemManagementService } from '../../../services/Items/item-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as cloneDeep from 'lodash';
import { ExcelService } from '../../../services/excel-service';
import { BroadcasterService } from '../../../services/broadcaster.service';
import { Router } from '@angular/router';
import { CompanyManagementService } from '../../../services/index';

@Component({
  selector: 'app-item-master-search',
  templateUrl: './item-master-search.component.html',
  styleUrls: ['./item-master-search.component.scss'],
})
export class ItemMasterSearchComponent implements OnInit {
  public isExpandAdvancedSearch = true;
  public showTable = false;
  public showAllTable = false;
  itemsForPagination: any = 10;
  itemsPerPaginationForShowAll: any = 10;
  public page = 1;
  public pagesForShowAll = 1;
  public totalRows: number;
  public masterSearchResults: any = [];
  public exportSearchResults: any = [];
  model: any = {};
  filter: any = '';
  helpFlag: any = false;
  dismissible = true;
  index: any;
  loader = false;
  constructor(
    private itemManagementService: ItemManagementService,
    private spinner: NgxSpinnerService,
    private excelService: ExcelService,
    private broadcasterService: BroadcasterService,
    private router: Router,
    private companyManagementService: CompanyManagementService
  ) {}

  ngOnInit() {
    let oldResults = this.itemManagementService.getItemMasterSearchResults();
    let keys = Object.keys(oldResults);
    if (keys.length > 0) {
      if (oldResults.showAllTable == false) {
        this.getOldResults(oldResults);
        this.page = oldResults.currentPage;
        this.itemsForPagination = oldResults.itemsPerPage;
        this.showTable = true;
      } else {
        this.getOldResults(oldResults);
        this.pagesForShowAll = oldResults.currentPage;
        this.itemsPerPaginationForShowAll = oldResults.itemsPerPage;
        this.showAllTable = true;
      }
    }
  }

  getOldResults(oldResults: {
    results: any;
    masterSearchModel: any;
    totalRows: number;
  }) {
    this.masterSearchResults = oldResults.results;
    this.model = oldResults.masterSearchModel;
    this.totalRows = oldResults.totalRows;
  }

  Hide() {
    this.isExpandAdvancedSearch = false;
  }

  clear() {
    this.model = {};
  }

  getResults() {
    this.page = 1;
    this.showAllTable = false;
    this.getMasterSearchResults(this.page, this.itemsForPagination);
  }

  getMasterSearchResults(currentPage: number, itemsPerPage: any) {
    var attributes = [];
    if (this.model.hp != undefined && this.model.hp != '') {
      let attribute = {
        attributeName: 'HP/KW/KVA',
        value: this.model.hp,
      };
      attributes.push(attribute);
    }
    if (this.model.rpm != undefined && this.model.rpm != '') {
      let attribute = {
        attributeName: 'RPM',
        value: this.model.rpm,
      };
      attributes.push(attribute);
    }
    if (this.model.frame != undefined && this.model.frame != '') {
      let attribute = {
        attributeName: 'frame',
        value: this.model.frame,
      };
      attributes.push(attribute);
    }
    var request = {
      tag: this.model.tag,
      attributes: attributes,
      locationName: this.model.locationName,
      page: currentPage,
      size: itemsPerPage,
    };
    this.spinner.show();
    this.loader = true;
    this.itemManagementService
      .getMasterSearchResults(request)
      .subscribe((response: any) => {
        this.spinner.hide();
        this.loader = false;
        this.masterSearchResults = response;

        if (response.length > 0) {
          this.totalRows = response[0].totalRows;
        }
        this.showTable = true;
        this.showAllTable = false;
        this.pagesForShowAll = 1;
        this.itemsPerPaginationForShowAll = 10;
      });
  }

  getPage(page: number) {
    this.page = page;
    this.getMasterSearchResults(this.page, this.itemsForPagination);
  }

  getItems() {
    this.page = 1;
    this.getMasterSearchResults(this.page, this.itemsForPagination);
  }

  async exportAsExcelFileWithMultipleSheets() {
    var attributes = [];
    if (this.model.hp != undefined && this.model.hp != '') {
      let attribute = {
        attributeName: 'HP/KW/KVA',
        value: this.model.hp,
      };
      attributes.push(attribute);
    }
    if (this.model.rpm != undefined && this.model.rpm != '') {
      let attribute = {
        attributeName: 'RPM',
        value: this.model.rpm,
      };
      attributes.push(attribute);
    }
    if (this.model.frame != undefined && this.model.frame != '') {
      let attribute = {
        attributeName: 'frame',
        value: this.model.frame,
      };
      attributes.push(attribute);
    }
    var request = {
      tag: this.model.tag,
      attributes: attributes,
      locationName: this.model.locationName,
      page: 1,
      size: this.totalRows,
    };
    this.spinner.show();
    this.loader = true;
    const data = await this.itemManagementService
      .getMasterSearchResults(request)
      .toPromise();
    this.spinner.hide();
    this.loader = false;
    this.exportSearchResults = data;
    this.exportAsExcelFile();
  }

  formAttributesString(searchResults: any[]) {
    searchResults.forEach((item: any) => {
      var attributes = '';
      if (item.attributes != '') {
        item.attributes.forEach(
          (attribute: { attributeName: string; value: string }) => {
            attributes =
              attributes +
              attribute.attributeName +
              ':' +
              attribute.value +
              ' ' +
              ' | ';
          }
        );
      }
      item.Attributes = attributes;
    });

    return searchResults;
  }

  exportAsExcelFile() {
    var map = this.groupBy(
      this.formAttributesString(this.exportSearchResults),
      (item) => item.companyName
    );
    let results: any = {};
    map.forEach((value, key) => {
      results[key] = value;
    });
    const clonedsearchResults: any = cloneDeep(results);
    Object.keys(clonedsearchResults).forEach((companyName) => {
      const result = clonedsearchResults[companyName];
      result.forEach((obj: any) => {
        delete obj.attributes;
        delete obj.companyId;
        delete obj.itemId;
        delete obj.totalRows;
      });
    });
    this.excelService.exportAsExcelFileWithMultipleSheets(
      clonedsearchResults,
      'MasterSearchResults'
    );
  }

  groupBy(list: any[], keyGetter: { (item: any): any; (arg0: any): string }) {
    const map = new Map();
    list.forEach((item: any) => {
      const key = keyGetter(item).replaceAll('/', '');
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }

  goToView(itemId: string, tag: any, typeName: any, companyId: any) {
    var searchResults = {
      results: this.masterSearchResults,
      currentPage: this.page,
      itemsPerPage: this.itemsForPagination,
      masterSearchModel: this.model,
      totalRows: this.totalRows,
      showAllTable: this.showAllTable,
    };
    this.itemManagementService.setItemMasterSearchResults(searchResults);
    this.broadcasterService.currentItemTag = tag;
    this.broadcasterService.currentItemType = typeName;
    this.broadcasterService.itemRank = 8;
    this.broadcasterService.switchCompanyId = companyId;
    this.companyManagementService.setSwithCompany(true);
    this.router.navigate(['/items/viewItem/' + itemId]);
  }

  async showAll() {
    if (this.totalRows > this.itemsForPagination) {
      var attributes = [];
      if (this.model.hp != undefined && this.model.hp != '') {
        let attribute = {
          attributeName: 'HP/KW/KVA',
          value: this.model.hp,
        };
        attributes.push(attribute);
      }
      if (this.model.rpm != undefined && this.model.rpm != '') {
        let attribute = {
          attributeName: 'RPM',
          value: this.model.rpm,
        };
        attributes.push(attribute);
      }
      if (this.model.frame != undefined && this.model.frame != '') {
        let attribute = {
          attributeName: 'frame',
          value: this.model.frame,
        };
        attributes.push(attribute);
      }
      var request = {
        tag: this.model.tag,
        attributes: attributes,
        locationName: this.model.locationName,
        page: 1,
        size: this.totalRows,
      };
      this.spinner.show();
      this.loader = true;
      const data = await this.itemManagementService
        .getMasterSearchResults(request)
        .toPromise();
      this.spinner.hide();
      this.loader = false;
      this.masterSearchResults = data;
      this.showAllTable = true;
      this.showTable = false;
    }
  }

  goToViewFromShowAll(itemId: string, tag: any, typeName: any, companyId: any) {
    var searchResults = {
      results: this.masterSearchResults,
      currentPage: this.pagesForShowAll,
      itemsPerPage: this.itemsPerPaginationForShowAll,
      masterSearchModel: this.model,
      totalRows: this.totalRows,
      showAllTable: this.showAllTable,
    };
    this.itemManagementService.setItemMasterSearchResults(searchResults);
    this.broadcasterService.currentItemTag = tag;
    this.broadcasterService.currentItemType = typeName;
    this.broadcasterService.itemRank = 8;
    this.broadcasterService.switchCompanyId = companyId;
    this.companyManagementService.setSwithCompany(true);
    this.router.navigate(['/items/viewItem/' + itemId]);
  }

  print() {
    this.helpFlag = false;
    window.print();
  }

  help() {
    this.helpFlag = !this.helpFlag;
  }
}
