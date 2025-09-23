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
import { BroadcasterService } from '../../../services/broadcaster.service';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';

interface AttributeType {
  attributeTypeId: number;
}

interface AttributeValue {
  attributeNameId: number;
  name: string;
  value?: string;
  attributeType?: AttributeType;
  attributeListItemResource?: any[];
}

@Component({
  selector: 'app-advanced-item-search',
  templateUrl: './advanced-item-search-replacement.component.html',
  styleUrls: ['./advanced-item-search-replacement.component.scss'],
})
export class AdvancedItemSearchReplacementComponent implements OnInit {

  showSearchResults = false;
  isExpandAdvancedSearch = true;
  advancedsearchflag = 0;
  loader = false;

  itemModel: any = {};
  repairModel: any = {};
  itemrepairNotesrfqModel: any = {};
  searchresults: any = {};
  itemNotesList: any = {};
  repairlogList: any[] = [];
  RFQsList: any[] = [];

  itemTypes: any[] = [];
  statuses: any[] = [];
  locations: any[] = [];
  vendors: any[] = [];

  items: TreeviewItem[] = [];
  itemTypeItems: TreeviewItem[] = [];
  config = TreeviewConfig.create({ hasFilter: false, hasCollapseExpand: false });

  globalCompany: any;
  companyId: number;
  companyName = '';
  itemId: string;
  typeId: string;
  itemValue: any;
  isOwnerAdmin: string | null;
  loggedInuser: string | null;
  order = '';
  reverse = '';

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
      this.companyId = this.globalCompany.companyId;
      this.getAllLocationsWithHierarchy();
    }

    this.itemId = this.route.snapshot.params['itemId'];
    this.typeId = this.route.snapshot.params['typeId'];

    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value.companyId;
      this.companyName = value.name;
    });
  }

  ngOnInit(): void {
    this.isOwnerAdmin = sessionStorage.getItem('IsOwnerAdmin');
    this.loggedInuser = sessionStorage.getItem('userId');
    this.getAllItemTypes();
  }

  /** Navigation */
  back(): void {
    this._location.back();
  }

  /** Locations */
  getAllLocationsWithHierarchy(): void {
    this.locations = this.broadcasterService.locations || [];
    if (this.locations.length) {
      this.items = this.generateHierarchy(this.locations);
    }
  }

  private generateHierarchy(locList: any[]): TreeviewItem[] {
    return locList.map((loc) => {
      const children = loc.parentLocationResourceList?.length
        ? this.generateHierarchy(loc.parentLocationResourceList)
        : [];
      return new TreeviewItem({ text: loc.name, value: loc.locationId, collapsed: true, children });
    });
  }

  /** Item Types */
  private generateHierarchyForItemTypes(typeList: any[]): TreeviewItem[] {
    return typeList.map((type) => {
      const children = type.typeList?.length ? this.generateHierarchyForItemTypes(type.typeList) : [];
      return new TreeviewItem({ text: type.name, value: String(type.typeId), collapsed: true, children });
    });
  }

  getAllItemTypes(): void {
    this.spinner.show();
    this.itemTypesService.getAllItemTypesWithHierarchy(this.companyId).subscribe({
      next: (response: any) => {
        this.itemTypes = response || [];
        if (this.itemTypes.length) {
          this.itemTypeItems = this.generateHierarchyForItemTypes(this.itemTypes);
          this.itemValue = this.typeId;
          if (this.itemValue) this.getTypeAttributes(this.itemValue);
        }
        this.getItemStatus();
        this.spinner.hide();
      },
      error: () => this.spinner.hide(),
    });
  }

  getItemStatus(): void {
    this.spinner.show();
    this.itemStatusService.getAllItemStatuses(String(this.companyId)).subscribe({
      next: (response: any) => {
        this.statuses = response || [];
        this.spinner.hide();
      },
      error: () => this.spinner.hide(),
    });
  }

  onItemValueChange(typeId: any): void {
    if (typeId && typeId !== 0) {
      this.itemValue = typeId;
      this.getTypeAttributes(typeId);
    }
  }

  /** Attributes */
  getTypeAttributes(typeId: string): void {
    if (!typeId || typeId === '0') return;
    this.spinner.show();

    this.itemAttributeService.getTypeAttributes(typeId).subscribe({
      next: (response: any) => {
        this.spinner.hide();
        this.itemModel.attributeValues = response || [];
        this.itemAttributeService.getAttributesForFindReplacement(this.itemId).subscribe({
          next: (res: any) => {
            this.itemModel.attributesList = res || [];
            this.mergeAttributes();
          },
        });
      },
    });
  }

  private mergeAttributes(): void {
    if (!this.itemModel.attributeValues || !this.itemModel.attributesList) return;
    this.itemModel.attributeValues.forEach((attr: AttributeValue) => {
      const match = this.itemModel.attributesList.find((a: any) => a.attributeName === attr.name);
      if (match) attr.value = match.attributeValue;
    });
  }

  /** Search */
  searchItems(): void {
    this.isExpandAdvancedSearch = false;

    const attributeList = (this.itemModel.attributeValues || [])
      .filter((attr: AttributeValue) => !!attr.value)
      .map((attr: AttributeValue) => ({
        attributeNameID: attr.attributeNameId,
        name: attr.name,
        value: attr.value,
      }));

    const request = {
      companyId: this.companyId,
      name: this.itemModel.name || null,
      tag: this.itemModel.tag || null,
      locationName: this.itemModel.location || null,
      statusId: this.itemModel.status || null,
      locationId: this.itemModel.locationId || null,
      typeId: this.itemValue || null,
      maxHitCount: attributeList.length,
      ownerAdmin: this.isOwnerAdmin,
      userId: this.loggedInuser,
      attributeNameList: attributeList,
    };

    this.spinner.show();
    this.itemManagementService.getAdvancedSearchItems(request).subscribe({
      next: (response) => {
        this.spinner.hide();
        this.itemManagementService.setAdvancedItemSearchResults(response);
        this.showSearchResults = true;
        this.broadcasterService.broadcast('advancedsearchresults', 'reload');
      },
      error: () => this.spinner.hide(),
    });
  }

  searchItemRepairNotesRfqModel(): void {
    this.advancedsearchflag = 1;
    const request = {
      companyID: this.companyId,
      extraTag: this.itemrepairNotesrfqModel.exactTag || null,
      RFQ: this.itemrepairNotesrfqModel.rfq || null,
      po: this.itemrepairNotesrfqModel.po || null,
      job: this.itemrepairNotesrfqModel.job || null,
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
    this.itemManagementService.getAdvancedSearchItemRepairNotesRfq(request).subscribe({
      next: (response: any) => {
        this.spinner.hide();
        this.searchresults = response;
        this.itemNotesList = response.itemNotes;
        this.repairlogList = response.repairlogList;
        this.RFQsList = response.rfqsList;
      },
      error: () => this.spinner.hide(),
    });
  }

  /** Sorting */
  setOrder(value: string): void {
    if (this.order === value) this.reverse = this.reverse === '' ? '-' : '';
    this.order = value;
  }

  /** Clear */
  clearItem(): void {
    this.itemModel = {};
    this.itemValue = 0;
  }

  clearRepairNoteQuote(): void {
    this.itemrepairNotesrfqModel = {};
  }

  /** Navigation */
  goToNote(itemId: string, journalId: string, rank: any, tag: any, typeName: any): void {
    this.broadcasterService.itemRank = rank;
    this.broadcasterService.currentItemTag = tag;
    this.broadcasterService.currentItemType = typeName;
    this.router.navigate(['/items/itemNotes', itemId, journalId]);
  }

  goToItemRepair(itemId: string, repairLogId: string, rank: any, tag: any, typeName: any): void {
    this.broadcasterService.itemRank = rank;
    this.broadcasterService.currentItemTag = tag;
    this.broadcasterService.currentItemType = typeName;
    this.router.navigate(['/items/viewItemRepair', itemId, repairLogId]);
  }
}
