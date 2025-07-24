import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { LocationManagementService } from '../../../services/location-management.service';
import { ItemManagementService } from '../../../services/Items/item-management.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ItemTypesService } from '../../../services/Items/item-types.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CompanyManagementService } from '../../../services/company-management.service';
import { ItemStatusService } from '../../../services/Items/item-status.service';
import { ItemAttributeService } from '../../../services/Items/item-attribute.service';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { isNullOrUndefined } from 'is-what';
import { BroadcasterService } from '../../../services/broadcaster.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-advanced-item-search',
  templateUrl: './advanced-item-search-replacement.component.html',
  styleUrls: ['./advanced-item-search-replacement.component.scss'],
})
export class AdvancedItemSearchReplacementComponent implements OnInit {
  public showSearchResults = false;
  public isExpandAdvancedSearch = true;
  public itemModel: any = {};
  public repairModel: any = {};
  public locationModel: any = {};
  public itemTypes = [];
  public attributesList = [];
  public attributesValuesList = [];
  public statuses: any = [];
  public locations = [];
  public globalCompany;
  public companyName = '';
  public companyId;
  public typeAttributes: any;
  public itemTypeName: any;
  public reqItemTypeId: String;
  public reqItemTypeName: any;
  public itemId: any;
  public typeId: any;
  public itrTypeId: any;
  value: any;
  itemValue: any;
  public itemrepairnotesrfqModel: any = {};
  public itemNotesList: any = {};
  public repairlogList: any = [];
  public RFQsList: any = [];
  advancedsearchflag: number = 0;
  searchresults: any = {};
  vendors: any = [];
  items: TreeviewItem[];
  public itemTypeItems: TreeviewItem[];
  config = TreeviewConfig.create({
    hasFilter: false,
    hasCollapseExpand: false,
  });
  isOwnerAdmin: string | null;
  loggedInuser: string | null;
  order: string;
  reverse: string;
  loader = false;
  constructor(
    private modalService: BsModalService,
    private locationManagementService: LocationManagementService,
    private itemStatusService: ItemStatusService,
    private itemManagementService: ItemManagementService,
    private router: Router,
    private companyManagementService: CompanyManagementService,
    private itemTypesService: ItemTypesService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private itemAttributeService: ItemAttributeService,
    private broadcasterService: BroadcasterService,
    private _location: Location
  ) {
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany) {
      this.companyName = this.globalCompany.name;
      this.companyId = this.globalCompany.companyid;
      this.getAllLocationsWithHierarchy();
    }

    this.itemId = route.snapshot.params['itemId'];
    this.typeId = route.snapshot.params['typeID'];
    console.log('typeId from view item' + this.typeId);
    this.itemTypes = this.itemManagementService.getItemTypes();
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value.companyid;
      this.companyName = this.globalCompany.name;
      console.log('inide item search');
    });
  }

  ngOnInit() {
    this.isOwnerAdmin = sessionStorage.getItem('IsOwnerAdmin');
    this.loggedInuser = sessionStorage.getItem('userId');
    this.getAllItemTypes();
  }

  back() {
    this._location.back();
  }

  getAllLocationsWithHierarchy() {
    this.locations = this.broadcasterService.locations;
    if (this.locations && this.locations.length > 0) {
      this.items = [];
      this.items = this.generateHierarchy(this.locations);
    }
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
          value: type.typeid + '',
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
        (response: any) => {
          this.itemTypes = response;
          this.spinner.hide();

          if (this.itemTypes && this.itemTypes.length > 0) {
            this.itemTypeItems = this.generateHierarchyForItemTypes(
              this.itemTypes
            );

            this.itemValue = this.typeId;
            this.getTypeAttributes(this.typeId);
          }
          this.getItemStatus();
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }

  getItemStatus() {
    this.spinner.show();

    this.itemStatusService.getAllItemStatuses(this.companyId).subscribe(
      (response: any) => {
        this.statuses = response;
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  onItemValueChange(typeId: any) {
    if (typeId != 0 && typeId != undefined) {
      this.itemValue = typeId;
      console.log('on value change type id is' + typeId);
      this.getTypeAttributes(typeId);
    }
  }

  getTypeAttributes(typeId: string) {
    console.log('hit type id is' + typeId);

    if (typeId != '0') {
      this.spinner.show();

      this.itemAttributeService
        .getTypeAttributes(typeId)
        .subscribe((response) => {
          this.spinner.hide();

          this.itemModel.attributevalues = response;
          this.attributesValuesList = this.itemModel.attributevalues;
          this.itemAttributeService
            .getAttributesForFindReplacement(this.itemId)
            .subscribe((res) => {
              this.itemModel.attributesList = res;
              this.itemModel.attributename = null;
              this.attributesValuesList.forEach((attrList: any) => {
                this.itemModel.attributename = attrList.name;
                this.itemModel.attributesList.forEach((attribtesList: any) => {
                  this.itemModel.attributeeName = attribtesList.attributeName;
                  if (
                    this.itemModel.attributeeName ===
                    this.itemModel.attributename
                  ) {
                    attrList.value = attribtesList.attributeValue;
                  }
                });
              });
            });
        });
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
            let listItem = {
              attributeNameID: attr.attributenameid,
              name: attr.name,
              value: attr.value,
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
      typeId: this.itemValue ? this.itemValue : null,
      maxHitCount: attributeLis.length,
      ownerAdmin: this.isOwnerAdmin,
      userId: this.loggedInuser,
      attributeNameList: attributeLis,
    };

    console.log(JSON.stringify(request));
    this.spinner.show();

    this.itemManagementService
      .getAdvancedSearchItems(request)
      .subscribe((response) => {
        this.itemManagementService.setAdvancedItemSearchResults(response);
        this.spinner.hide();

        this.showSearchResults = true;
        this.broadcasterService.broadcast('advancedsearchresults', 'reload');
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

    this.itemManagementService
      .getAdvancedSearchItemRepairNotesRfq(request)
      .subscribe((response: any) => {
        this.searchresults = response;
        this.itemNotesList = response.itemNotes;
        this.repairlogList = response.repairlogList;
        this.RFQsList = response.rfqsList;
        console.log('this.itemNotesList is' + this.itemNotesList);
        console.log('this.repairlogList is' + this.repairlogList);
        console.log('this.RFQsList is' + this.RFQsList);
        console.log('this.itemNotesList is' + response.itemNotes);
        console.log('this.repairlogList is' + response.repairlogList);
        console.log('this.RFQsList is' + response.rfqsList);
        this.spinner.hide();
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

  clearItem() {
    this.itemModel = {};
    this.itemValue = 0;
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
  }
}
