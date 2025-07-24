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
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { BroadcasterService } from '../../../services/broadcaster.service';
import { ExcelService } from '../../../services/excel-service';
import * as cloneDeep from 'lodash';

export interface Attribute {
  name: string; // Assuming name is a string
  value: string; // Assuming value is a string
}

@Component({
  selector: 'app-item-management',
  templateUrl: './item-management.component.html',
  styleUrls: ['./item-management.component.scss'],
})
export class ItemManagementComponent implements OnInit {
  modalRef: BsModalRef | null;
  modalRef2: BsModalRef;
  message: string;
  items: any = [];
  index: number;
  order: string = 'name';
  reverse: string = '';
  itemFilter: any = '';
  itemsForPagination: any = 5;
  itemTypes: any;
  statuses: any;
  locations: any;
  warrantyTypes: any;
  companyId: any = 0;
  globalCompany: any;
  companyName: any;
  currentRole: any;
  highestRank: any;
  excelObj: any;
  model: any = {
    statusid: 0,
    typeid: null,
  };
  queryString: any = '';
  suggessions: any[] = [];
  dataSource: Observable<any>;
  typeAheadUrl: string = 'http://18.216.158.31:8087/api/item/searchTags/';

  value: any;
  locationItems: TreeviewItem[];
  itemTypeItems: TreeviewItem[];
  config = TreeviewConfig.create({
    hasFilter: false,
    hasCollapseExpand: false,
  });
  deleteFlag: any;
  isOwnerAdmin: string | null;
  loggedInuser: string | null;
  searchResults: any[] = [];
  public attributesSearchDisplay: Attribute[] = [];
  public searchResultKeys: any = [];
  public dynLst: Array<any> = [];
  flag: any;
  itemTag: any;
  itemType: any;
  helpFlag: any = false;
  dismissible = true;
  loader = false;

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
      this.companyId = this.globalCompany.companyid;
    }
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value.companyid;
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
    this.broadcasterService.on('refreshlist').subscribe((data) => {
      this.setInitValues();
    });
    this.currentRole = sessionStorage.getItem('currentRole');
    this.highestRank = sessionStorage.getItem('highestRank');
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
  setInitValues() {
    this.searchResults = this.itemManagementService.getItemSearchResults();
    this.model.typeId = this.itemManagementService.getSearchedItemTypeId();
    this.model.statusid = this.itemManagementService.getSearchedItemStatusId();
    this.model.locationid =
      this.itemManagementService.getSearchedItemLocationId();
    this.value = this.model.locationid;
    this.model.tag = this.itemManagementService.getSearchedItemTag();

    this.searchResultKeys = Object.keys(this.searchResults);
    if (this.searchResultKeys.length == 0) {
      if (this.route.snapshot.params['type'] == 'all') {
        if (
          (this.model.tag && this.model.tag != '') ||
          (this.model.typeId != '' && this.model.typeId)
        ) {
          this.getSearchedItems();
        } else {
          this.getSearchedItemsByCompanyId();
        }
      }
    } else {
      this.searchResultKeys = Object.keys(this.searchResults);
      this.dynLst = [];
      for (let item of this.searchResultKeys) {
        const dnobj = { itemsForPagination: 5, p: 1 };
        this.dynLst.push(dnobj);
      }
    }
  }

  itemRepairs(item: any) {
    this.itemManagementService.setSearchedItemTypeId(item.typeid);
    this.itemManagementService.setSearchedItemTag(item.tag);
    this.router.navigate(['/items/itemRepairs/' + item.itemId]);
  }

  getLocations() {
    this.spinner.show();
    this.locations = this.broadcasterService.locations;
    if (this.locations && this.locations.length > 0) {
      this.locationItems = [];
      this.locationItems = this.generateHierarchy(this.locations);
    }
    this.getItemStatus();
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
          value: loc.locationId,
          collapsed: true,
          children: children,
        })
      );
    });
    return items;
  }

  onValueChange(value: any) {
    this.value = value;
    this.model.locationid = value;
  }

  getSuggessions(tag: string) {
    this.itemManagementService
      .getItemSuggessions(tag, this.companyId)
      .subscribe((response: any) => {
        this.suggessions = response;
      });
  }

  getSearchedItems() {
    this.flag = 0;
    this.isOwnerAdmin = sessionStorage.getItem('IsOwnerAdmin');
    this.loggedInuser = sessionStorage.getItem('userId');
    this.spinner.show();
    var req = {
      locationId: this.model.locationid ? this.model.locationid : null,
      statusId: this.model.statusid ? this.model.statusid : null,
      tag: this.model.tag ? this.model.tag : null,
      typeId: this.model.typeId ? this.model.typeId : null,
    };

    this.searchResults = [];
    this.itemManagementService
      .getAllItems(req, this.companyId, this.isOwnerAdmin, this.loggedInuser)
      .subscribe(
        (response: any) => {
          this.spinner.hide();
          this.itemManagementService.setSearchedItemTag(req.tag);
          this.itemManagementService.setSearchedItemTypeId(req.typeId);
          this.itemManagementService.setSearchedItemLocationId(req.locationId);
          this.itemManagementService.setSearchedItemStatusId(req.statusId);

          this.itemManagementService.setItemSearchResults(response);
          this.searchResults = response;
          console.log(
            'searchResults1:',
            this.searchResults,
            this.searchResults[this.itemType]
          );

          this.searchResultKeys = Object.keys(this.searchResults);
          console.log(
            'searchResultKeys:',
            this.searchResultKeys,
            this.searchResultKeys.length
          );
          this.dynLst = [];
          for (let item of this.searchResultKeys) {
            const dnobj = { itemsForPagination: 5, p: 1 };
            this.dynLst.push(dnobj);
          }
          if (this.searchResultKeys.length == 0) {
            this.flag = 1;
          } else if (this.searchResultKeys.length == 1) {
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
                itemId = obj.itemId;
                rank = obj.itemRank;
                tag = obj.tag;
                typeName = obj.typeName;
                this.goToView(itemId, rank, tag, typeName);
              });
            }

            this.itemManagementService.deleteFlag = 0;
          }
        },
        (error) => {
          this.spinner.hide();
        }
      );
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
      locationId: this.model.locationid ? this.model.locationid : null,
      statusId: this.model.statusid ? this.model.statusid : null,
      tag: this.model.tag ? this.model.tag : null,
      typeId: this.model.typeId ? this.model.typeId : null,
    };
    this.searchResults = [];
    this.itemManagementService
      .getAllItems(req, this.companyId, this.isOwnerAdmin, this.loggedInuser)
      .subscribe(
        (response: any) => {
          this.spinner.hide();
          this.searchResults = response;
          console.log('searchResults:', this.searchResults);
          this.itemManagementService.setSearchedItemTag(req.tag);
          this.itemManagementService.setSearchedItemTypeId(req.typeId);
          this.itemManagementService.setSearchedItemLocationId(req.locationId);
          this.itemManagementService.setSearchedItemStatusId(req.statusId);
          this.itemManagementService.setItemSearchResults(response);
          this.searchResultKeys = Object.keys(this.searchResults);
          console.log(
            'searchResultKeys1:',
            this.searchResultKeys,
            this.searchResultKeys.length
          );
          this.dynLst = [];
          for (let item of this.searchResultKeys) {
            const dnobj = { itemsForPagination: 5, p: 1 };
            this.dynLst.push(dnobj);
          }
          if (this.searchResultKeys.length == 0) {
            this.flag = 1;
            console.log
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
    this.itemTypesService
      .getAllItemTypesWithHierarchy(this.companyId)
      .subscribe(
        (response) => {
          this.spinner.hide();
          this.itemTypes = response;
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
    this.itemStatusService.getAllItemStatuses(this.companyId).subscribe(
      (response) => {
        this.statuses = response;
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
          this.warrantyTypes = response;
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

  exportAsExcelFileWithMultipleSheets() {
    const clonedsearchResults: any = cloneDeep(this.searchResults);
    Object.keys(clonedsearchResults).forEach((itemType) => {
      const result = clonedsearchResults[itemType];
      result.forEach((obj: any) => {
        const robj: any = {};
        obj.attributeNameList.forEach((atr: any) => {
          robj[atr.name] = atr.value;
        });
        delete obj.companyid;
        delete obj.serialNumber;
        delete obj.modelnumber;
        delete obj.statusid;
        delete obj.typeName;
        delete obj.locationid;
        delete obj.typeId;
        delete obj.itemid;
        delete obj.itemRank;
        delete obj.description;
        delete obj.warrantytypeid;
        delete obj.warrantyexpiration;
        delete obj.warrantyExpiration;
        delete obj.lastmodifiedby;
        delete obj.serialnumber;
        delete obj.meantimebetweenservice;
        delete obj.inserviceon;
        delete obj.isinrepair;
        delete obj.desiredspareratio;
        delete obj.manufacturerid;
        delete obj.repairqual;
        delete obj.purchaseprice;
        delete obj.daysinservice;
        delete obj.purchasedate;
        delete obj.defaultimageattachmentid;
        delete obj.isstale;
        delete obj.entityTypeId;
        delete obj.roleid;
        delete obj.roleName;
        delete obj.updatedDate;
        delete obj.userid;
        delete obj.attributeName;
        delete obj.attributevalue;

        obj = Object.assign(obj, robj);
      });
    });
    this.excelService.exportAsExcelFileWithMultipleSheets(
      clonedsearchResults,
      'itemAdvancedSearchResults'
    );
  }

  print() {
    this.helpFlag = false;
    window.print();
  }
  help() {
    this.helpFlag = !this.helpFlag;
  }
}
