import { Injectable, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { HttpClient } from '@angular/common/http';
import { AppConfiguration } from '../../configuration';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { of } from 'rxjs';

@Injectable()
export class ItemManagementService {
  databaseIndex: number = 0;
  currentGlobalCompany: any;
  public globalCompanyChange: Subject<any> = new Subject<any>();
  private authToken = sessionStorage.getItem('auth_token') ? sessionStorage.getItem('auth_token') : '';
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
  public itemrepairNotesrfqModel: any = {};
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

  public setCompletedRepairs(result: any[]) {
    this.completedRepairs = result;
  }

  public getCompletedRepairs() {
    return this.completedRepairs;
  }

  public setViewAllRepairs(result: any) {
    this.viewAllRepairs = result;
  }

  public getViewAllRepairs() {
    return this.viewAllRepairs;
  }

  public setInCompletedRepairs(result: any[]) {
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

  public setAdvancedItemSearchResults(result: any) {
    this.advancedItemSearchResults = result;
  }

  public getAdvancedItemSearchResults() {
    return this.advancedItemSearchResults;
  }

  public setItemSearchResults(results: any) {
    this.itemSearchResults = results;
    console.log(this.itemSearchResults);
  }

  public getItemSearchResults() {
    return this.itemSearchResults;
  }

  public setSearchedItemTag(tag: any) {
    this.searchedItemTag = tag;
  }

  public getSearchedItemTag() {
    return this.searchedItemTag;
  }

  public setSearchedItemTypeId(typeId: any) {
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

  public setSearchedItemLocationId(locationId: any) {
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

  saveItem(item: any) {
    return this.http
      .post(AppConfiguration.locationRestURL + 'item', item, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  saveFailureType(failureType: any) {
    return this.http
      .post(AppConfiguration.locationRestURL + 'itemrepair/failureTypeAndCause/', failureType, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  checkTag(tagName: string, typeId: string) {
    return this.http
      .get(AppConfiguration.locationRestURL + 'item/checkTagAvailability/' + tagName + '/' + typeId, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateItem(item: any) {
    return this.http
      .put(AppConfiguration.locationRestURL + 'item/' + item.itemId, item, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  removeItem(itemId: any, companyId: any, userName: any, tag: any, type: any) {
    return this.http
      .delete(AppConfiguration.locationRestURL + 'item/' + itemId + '/' + companyId + '/' + 
                userName + '/' + tag + '/' + type, { responseType: 'text' }
      )
      .pipe(catchError(this.handleError));
  }

  getItemDetails(itemId: any) {
    return this.http
      .get(AppConfiguration.locationRestURL + 'item/' + itemId, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getItemById(itemId: string | number) {
    return this.http
      .get(AppConfiguration.locationRestURL + 'item/getItem/' + itemId, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getJournalLog(itemId: string) {
    return this.http
      .get(AppConfiguration.locationRestURL + 'item/journal/' + itemId, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getItemTransferDetails(transferLogId: string) {
    return this.http
      .get(AppConfiguration.locationRestURL + 'transferLog/getTransfer/' + transferLogId, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getAllItems(item: any, companyId: any, isOwnerAdmin: any, userId: any) {
    console.log(AppConfiguration.locationRestURL + "item/search/"+companyId+"/"+isOwnerAdmin+"/"+userId ,item ,this.httpOptions);
    return this.http
      .post(AppConfiguration.locationRestURL + 'item/search/' + companyId + '/' + isOwnerAdmin + '/' + userId,
              item, this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getItemSuggessions(tagName: string, companyId: string) {
    return this.http
      .get(AppConfiguration.locationRestURL + 'item/suggestions/' + tagName + '/' + companyId, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getAdvancedSearchItems(request: any) {
    return this.http
      .post(AppConfiguration.locationRestURL + 'advanceSearch', request, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getAttributesForSearchDisplay(companyId: string) {
    return this.http
      .get(AppConfiguration.typeRestURL + '/getattributesforsearchdisplay/' + companyId, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getLastRepairAndRepairBy(itemId: string) {
    return this.http
      .get(AppConfiguration.locationRestURL + 'item/warehouseTag/' + itemId, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getAdvancedSearchItemRepairNotesRfq(request: any) {
    return this.http
      .post(AppConfiguration.locationRestURL + 'advanceSearch/repairLogNote', request, this.httpOptions)
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
      .post(AppConfiguration.locationRestURL + 'transferLog', transfer, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getAllTransfers(itemId: string) {
    return this.http
      .get(AppConfiguration.locationRestURL + 'transferLog/getAllTransfers' + '/' + itemId, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  saveTransfer(req: any) {
    return this.http
      .post(AppConfiguration.locationRestURL + 'transferLog', req, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getAttributesForReplacements(itemId: string | null) {
    return this.http
      .get(AppConfiguration.locationRestURL + 'item/findReplacement/' + itemId, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  masterSearch(item: any) {
    return this.http
      .post(AppConfiguration.locationRestURL + 'item/masterSearch', item, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getMasterSearchResults(request: any) {
    return this.http
      .post(AppConfiguration.locationRestURL + 'item/masterSearchAttributes', request, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getAdvanceSearchPiechart(request: any) {
    return this.http
      .post(AppConfiguration.locationRestURL + 'advanceSearch/failureTypesChart', request, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getFailureCausesPieChart(request: any) {
    return this.http
      .post(AppConfiguration.locationRestURL + 'advanceSearch/failureCausesChart', request, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getRepairJobsByFailureCause(request: any) {
    return this.http
      .post(AppConfiguration.locationRestURL + 'advanceSearch/repairJobsByFailureCause', request, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  deleteItemTransferLog(transferLogId: string) {
    return this.http
      .delete(AppConfiguration.locationRestURL + 'transferLog/' + transferLogId, { responseType: 'text' })
      .pipe(catchError(this.handleError));
  }

  getDataForFailedItems(companyId: any) {
    return this.http
      .get(AppConfiguration.locationRestURL + 'item/getFailedItemsTwiceInYear/' + companyId, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
}
