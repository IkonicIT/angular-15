import { Injectable, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { HttpClient } from '@angular/common/http';
import { AppConfiguration } from '../../configuration';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ItemManagementService {
  databaseIndex: number = 0;
  currentGlobalCompany: any;
  public globalCompanyChange: Subject<any> = new Subject<any>();
  private authToken = sessionStorage.getItem('auth_token')
    ? sessionStorage.getItem('auth_token')
    : '';
  private httpOptions = {
    headers: new HttpHeaders({
      Authorization: 'Bearer  ' + this.authToken,
    }),
  };

  private httpOptions1 = {
    headers: new HttpHeaders({
      Authorization: 'Bearer  ' + this.authToken,
    }),
    responseType: 'text',
  };
  public item: any;
  public searchedItemTag: any = '';
  public searchedItemTypeId: any = 0;
  public searchedItemTypeName: any = '';
  public searchedItemStatusId: any = 0;
  public searchedItemLocationId: any = 0;
  public itemSearchResults: any = [];
  public advancedItemSearchResults: any = [];
  public advancedItemSearchRepaiNotesSearchresults: any = {};
  public itemMasterSearchResults: any = [];
  public itemTypes = [];
  public itemTypeId: any = 0;
  public deleteFlag: any = 0;
  public itemrepairnotesrfqModel: any = {};
  public itemModel: any = {};
  public masterSearchModel: any = {};
  public viewAllRepairs: any = {};
  public completedRepairs: any = [];
  public inCompletedRepairs: any = [];
  public count: any = 0;

  public setCount(result: number) {
    this.count = result;
  }

  public getCount() {
    return this.count;
  }

  public setCompletedRepairs(result: never[]) {
    this.completedRepairs = result;
  }

  public getCompletedRepairs() {
    return this.completedRepairs;
  }

  public setViewAllRepairs(result: {
    selectedVal?: string;
    repairFlag?: boolean;
    paramsType?: any;
    startDate?: any;
    endDate?: any;
  }) {
    this.viewAllRepairs = result;
  }

  public getViewAllRepairs() {
    return this.viewAllRepairs;
  }

  public setInCompletedRepairs(result: never[]) {
    this.inCompletedRepairs = result;
  }

  public getInCompletedRepairs() {
    return this.inCompletedRepairs;
  }

  public setItemTypes(result: any) {
    this.itemTypes = result;
  }

  public getItemTypes() {
    return this.itemTypes;
  }

  public setItemMasterSearchResults(result: any) {
    this.itemMasterSearchResults = result;
  }

  public getItemMasterSearchResults() {
    return this.itemMasterSearchResults;
  }

  public setAdvancedItemSearchRepaiNotesSearchresults(result: any) {
    this.advancedItemSearchRepaiNotesSearchresults = result;
  }

  public getAdvancedItemSearchRepaiNotesSearchresults() {
    return this.advancedItemSearchRepaiNotesSearchresults;
  }

  public setAdvancedItemSearchResults(result: unknown) {
    this.advancedItemSearchResults = result;
  }

  public getAdvancedItemSearchResults() {
    return this.advancedItemSearchResults;
  }
  public setItemSearchResults(results: unknown) {
    this.itemSearchResults = results;
  }
  public getItemSearchResults() {
    return this.itemSearchResults;
  }

  public setSearchedItemTag(tag: string) {
    this.searchedItemTag = tag;
  }
  public getSearchedItemTag() {
    return this.searchedItemTag;
  }

  public setSearchedItemTypeId(typeId: number) {
    this.searchedItemTypeId = typeId;
  }
  public getSearchedItemTypeId() {
    return this.searchedItemTypeId;
  }

  public setItemTypeId(typeId: any) {
    this.itemTypeId = typeId;
  }
  public getItemTypeId() {
    return this.itemTypeId;
  }

  public setSearchedItemTypeName(name: any) {
    this.searchedItemTypeName = name;
  }
  public getSearchedItemTypeName() {
    return this.searchedItemTypeName;
  }

  public setSearchedItemStatusId(statusId: number) {
    this.searchedItemStatusId = statusId;
  }
  public getSearchedItemStatusId() {
    return this.searchedItemStatusId;
  }

  public setSearchedItemLocationId(locationId: number) {
    this.searchedItemLocationId = locationId;
  }
  public getSearchedItemLocationId() {
    return this.searchedItemLocationId;
  }

  constructor(
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private http: HttpClient
  ) {
    this.globalCompanyChange.subscribe((value) => {
      this.currentGlobalCompany = value;
    });
  }

  saveItem(item: {
    attributevalues: any;
    defaultimageattachmentid: number;
    description: any;
    desiredspareratio: any;
    inserviceon: Date;
    isinrepair: boolean;
    isstale: boolean;
    itemid: number;
    lastmodifiedby: any;
    locationid: any;
    manufacturerid: null;
    meantimebetweenservice: any;
    modelnumber: string;
    name: any;
    purchasedate: any;
    purchaseprice: any;
    repairqual: number;
    serialnumber: string;
    companyid: any;
    statusid: any;
    tag: any;
    typeId: any;
    warrantyexpiration: any;
    warrantytypeid: any;
    userid?: string | null;
    typeName: any;
    locationName: any;
    statusname: any;
    createdDate: string;
  }) {
    return this.http
      .post(AppConfiguration.locationRestURL + 'item', item, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  saveFailureType(failureType: any) {
    return this.http
      .post(
        AppConfiguration.locationRestURL + 'itemrepair/failureTypeAndCause/',
        failureType,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  checkTag(tagName: string, typeId: string) {
    return this.http
      .get(
        AppConfiguration.locationRestURL +
          'item/checkTagAvailability/' +
          tagName +
          '/' +
          typeId,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  updateItem(item: {
    attributevalues?: any;
    defaultimageattachmentid?: any;
    description?: any;
    desiredspareratio?: any;
    inserviceon?: any;
    isinrepair?: boolean;
    isstale?: boolean;
    itemid: any;
    lastmodifiedby?: any;
    locationid?: any;
    manufacturerid?: null;
    meantimebetweenservice?: any;
    modelnumber?: string;
    name?: any;
    purchasedate?: any;
    purchaseprice?: any;
    repairqual?: number;
    serialnumber?: string;
    statusid?: any;
    statusname?: any;
    companyid?: any;
    tag?: any;
    typeId?: any;
    warrantyexpiration?: any;
    warrantytypeid?: any;
    userid?: string | null;
    typeName?: any;
    locationName?: any;
    updatedDate?: string;
  }) {
    return this.http
      .put(
        AppConfiguration.locationRestURL + 'item/' + item.itemid,
        item,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  removeItem(
    itemId: string,
    companyId: string,
    username: string,
    tag: string,
    type: string
  ) {
    return this.http
      .delete(
        AppConfiguration.locationRestURL +
          'item/' +
          itemId +
          '/' +
          companyId +
          '/' +
          username +
          '/' +
          tag +
          '/' +
          type,
        { responseType: 'text' }
      )
      .pipe(catchError(this.handleError));
  }

  getItemDetails(itemId: any) {
    return this.http
      .get(
        AppConfiguration.locationRestURL + 'item/' + itemId,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getItemById(itemId: string | number) {
    return this.http
      .get(
        AppConfiguration.locationRestURL + 'item/getItem/' + itemId,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getJournalLog(itemId: string) {
    return this.http
      .get(
        AppConfiguration.locationRestURL + 'item/journal/' + itemId,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getItemTransferDetails(transferLogId: string) {
    return this.http
      .get(
        AppConfiguration.locationRestURL +
          'transferLog/getTransfer/' +
          transferLogId,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getAllItems(
    item: { locationid: any; statusid: any; tag: any; typeId: any },
    companyId: string,
    isOwnerAdmin: string | null,
    userId: string | null
  ) {
    return this.http
      .post(
        AppConfiguration.locationRestURL +
          'item/search/' +
          companyId +
          '/' +
          isOwnerAdmin +
          '/' +
          userId,
        item,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getItemSuggessions(tagName: string, companyId: string) {
    return this.http
      .get(
        AppConfiguration.locationRestURL +
          'item/suggestions/' +
          tagName +
          '/' +
          companyId,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getAdvancedSearchItems(request: any) {
    return this.http
      .post(
        AppConfiguration.locationRestURL + 'advanceSearch',
        request,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getAttributesForSearchDisplay(companyId: string) {
    return this.http
      .get(
        AppConfiguration.typeRestURL +
          '/getattributesforsearchdisplay/' +
          companyId,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getLastRepairAndRepairBy(itemId: string) {
    return this.http
      .get(
        AppConfiguration.locationRestURL + 'item/warehouseTag/' + itemId,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getAdvancedSearchItemRepairNotesRfq(request: any) {
    return this.http
      .post(
        AppConfiguration.locationRestURL + 'advanceSearch/repairLogNote',
        request,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(error.error);
    }
    return throwError(() => 'Something bad happened; please try again later.');
  }

  search(term: string) {
    if (term === '') {
      return of([]);
    }

    return this.http
      .get(AppConfiguration.locationRestURL, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  itemTransfer(transfer: any) {
    return this.http
      .post(
        AppConfiguration.locationRestURL + 'transferLog',
        transfer,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getAllTransfers(itemId: string) {
    return this.http
      .get(
        AppConfiguration.locationRestURL +
          'transferLog/getAllTransfers' +
          '/' +
          itemId,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  saveTransfer(req: {
    daysinOldStatus: any;
    details: any;
    fromLocation: any;
    fromLocationID: any;
    itemID: any;
    jobNumber: any;
    newStatus: any;
    oldStatus: any;
    shippingNumber: any;
    toLocationID: any;
    companyID: any;
    statusID: any;
    trackingNumber: any;
    transferDate: any;
    transferredBy: any;
    ponumber: any;
  }) {
    return this.http
      .post(
        AppConfiguration.locationRestURL + 'transferLog',
        req,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getAttributesForReplacements(itemId: string | null) {
    return this.http
      .get(
        AppConfiguration.locationRestURL + 'item/findReplacement/' + itemId,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  masterSearch(item: {
    tag: any;
    name: any;
    statusname: any;
    locationName: any;
    typeName: any;
  }) {
    return this.http
      .post(
        AppConfiguration.locationRestURL + 'item/masterSearch',
        item,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getMasterSearchResults(request: {
    tag: any;
    attributes:
      | { attributeName: string; value: any }[]
      | { attributeName: string; value: any }[]
      | { attributeName: string; value: any }[];
    locationName: any;
    page: any;
    size: any;
  }) {
    return this.http
      .post(
        AppConfiguration.locationRestURL + 'item/masterSearchAttributes',
        request,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getAdvanceSearchPiechart(request: {
    companyId: any;
    isByRepairCost: any;
    startDate: string | null;
    endDate: string | null;
    itemIds: any;
  }) {
    return this.http
      .post(
        AppConfiguration.locationRestURL + 'advanceSearch/failureTypesChart',
        request,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getFailureCausesPieChart(request: {
    companyId: any;
    failureType: any;
    isByRepairCost: any;
    startDate: string | null;
    endDate: string | null;
    itemIds: any;
  }) {
    return this.http
      .post(
        AppConfiguration.locationRestURL + 'advanceSearch/failureCausesChart',
        request,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getRepairJobsByFailureCause(request: {
    companyId: any;
    failureType: any;
    failureCause: any;
    isOwnerAdmin: any;
    userId: any;
    startDate: string | null;
    endDate: string | null;
    itemIds: any;
  }) {
    return this.http
      .post(
        AppConfiguration.locationRestURL +
          'advanceSearch/repairJobsByFailureCause',
        request,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  deleteItemTransferLog(transferLogId: string) {
    return this.http
      .delete(
        AppConfiguration.locationRestURL + 'transferLog/' + transferLogId,
        { responseType: 'text' }
      )
      .pipe(catchError(this.handleError));
  }

  getDataForFailedItems(companyId: any) {
    return this.http
      .get(
        AppConfiguration.locationRestURL +
          'item/getFailedItemsTwiceInYear/' +
          companyId,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
}
