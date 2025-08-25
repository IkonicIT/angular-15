import { Injectable, Inject } from '@angular/core';
import { AppConfiguration } from '../../configuration';
import { HttpHeaders } from '@angular/common/http';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { getQuarter } from 'ngx-bootstrap/chronos/units/quarter';

@Injectable()
export class ItemRepairItemsService {
  public itemId: any;
  public serviceURL = AppConfiguration.locationRestURL;
  public isProd = false;
  private authToken = sessionStorage.getItem('auth_token')
    ? sessionStorage.getItem('auth_token')
    : '';
  private httpOptions = {
    headers: new HttpHeaders({
      Authorization: 'Bearer  ' + this.authToken,
    }),
  };

  constructor(
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private http: HttpClient
  ) {}

  saveRepairItemType(itemStatus: any) {
    return this.http
      .post(this.serviceURL + 'itemRepairItem', itemStatus, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateRepairItemType(itemStatus: any, repairId: string) {
    return this.http
      .put(
        this.serviceURL + 'itemRepairItem/' + repairId,
        itemStatus,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getAllCompletedRepairs(companyId: string, typeId: string) {
    return this.http
      .get(
        this.serviceURL +
          'itemrepair/getAllCompletedItemRepairs/' +
          companyId +
          '/' +
          typeId,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getAllPreviousRepairs(companyId: string, typeId: string) {
    return this.http
      .get(
        this.serviceURL +
          'itemrepair/getAllInCompletedItemRepairs/' +
          companyId +
          '/' +
          typeId,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getAllFailureTypes(companyId: string, itemId: string) {
    return this.http
      .get(
        this.serviceURL + 'failureType/' + companyId + '/' + itemId,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getAllFailureTypesForEditItemRepair(companyId: string, itemId: string) {
    return this.http
      .get(
        this.serviceURL +
          'itemrepair/failureTypeAndCauseForItemRepair/' +
          companyId +
          '/' +
          itemId,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getAcMotorFailureTypesAndCauses() {
    return this.http
      .get(
        this.serviceURL + 'failureType/getAllACMotorFailureTypes',
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getDcMotorFailureTypesAndCauses() {
    return this.http
      .get(
        this.serviceURL + 'failureType/getAllDCMotorFailureTypes',
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  saveItemRepair(repair: any) {
    return this.http
      .post(this.serviceURL + 'itemrepair', repair, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  saveFailureTypeAndCauses(getFailureTypeAndCause: any) {
    return this.http
      .post(
        this.serviceURL + 'failureType',
        getFailureTypeAndCause,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  updateFailureTypeAndCauses(failureTypeAndCause: any, failuretypeId: any) {
    console.log(
      'failuretypeId in updateFailureTypeAndCauses service is' + failuretypeId
    );
    return this.http
      .put(
        this.serviceURL + 'failureType/' + parseInt(failuretypeId),
        failureTypeAndCause,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  deleteFailureTypeAndCauses(
    failureTypeId: string,
    companyId: string,
    userName: string
  ) {
    return this.http
      .delete(
        this.serviceURL +
          'failureType/' +
          parseInt(failureTypeId) +
          '/' +
          companyId +
          '/' +
          userName,
        { responseType: 'text' }
      )
      .pipe(catchError(this.handleError));
  }

  itemTransfer(transfer: any) {
    return this.http
      .post(this.serviceURL + 'transferlog', transfer, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getAllTransfers(itemId: string) {
    return this.http
      .get(
        this.serviceURL + 'transferlog/getAllTransfers' + '/' + itemId,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  public warrantyTypes: any = [];

  setWarrantyTypes(warrantyTypes: any) {
    this.warrantyTypes = warrantyTypes;
  }

  getWarrantyTypes() {
    return this.warrantyTypes;
  }

  getFailureTypes(companyId: string, typeId: string) {
    return this.http
      .get(
        this.serviceURL +
          'itemrepair/getAllInCompletedItemRepairs/' +
          companyId +
          '/' +
          typeId,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  updateItemRepair(itemRepair: { repairLogId: string }) {
    return this.http
      .put(
        this.serviceURL + 'itemrepair/' + itemRepair.repairLogId,
        itemRepair,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getAllItemRepairItems(companyId: string, typeId: string) {
    return this.http
      .get(
        this.serviceURL +
          'itemRepairItem/getAllRepairItems/' +
          companyId +
          '/' +
          typeId,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getItemRepairItem(repairId: string) {
    return this.http
      .get(this.serviceURL + 'itemRepairItem/' + repairId, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getRepairDetailsForView(repairid: string) {
    return this.http
      .get(
        this.serviceURL + 'itemrepair/getForView/' + repairid,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getRepairDetails(repairId: string) {
    return this.http
      .get(this.serviceURL + 'itemrepair/' + repairId, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  removeRepairItem(repairId: number) {
    return this.http
      .delete(this.serviceURL + 'itemRepairItem/' + repairId, {
        responseType: 'text',
      })
      .pipe(catchError(this.handleError));
  }

  removeItemRepair(
    id: string,
    companyId: string,
    userName: string,
    itemtype: string,
    tag: string,
    ponumber: string,
    jobnumber: string
  ) {
    return this.http
      .delete(
        this.serviceURL +
          'itemrepair/' +
          id +
          '/' +
          companyId +
          '/' +
          userName +
          '/' +
          itemtype +
          '/' +
          tag +
          '/' +
          ponumber +
          '/' +
          jobnumber,
        { responseType: 'text' }
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
}
