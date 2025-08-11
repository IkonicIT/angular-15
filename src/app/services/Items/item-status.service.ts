import { Injectable, Inject } from '@angular/core';
import { AppConfiguration } from '../../configuration';
import { HttpHeaders } from '@angular/common/http';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class ItemStatusService {
  public serviceURL = AppConfiguration.typeStatusRestURL + 'status';
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

  saveItemStatus(itemStatus: any) {
    return this.http
      .post(this.serviceURL, itemStatus, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateItemStatus(itemStatus: { statusId: string }) {
    return this.http
      .put(
        this.serviceURL + '/' + itemStatus.statusId,
        itemStatus,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getItemStatus(index: number) {
    return this.http
      .get(this.serviceURL + '/' + index, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getAllItemStatuses(companyId: string) {
    return this.http
      .get(
        this.serviceURL + '/getAllStatusByCompanyId/itemtype/' + companyId,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  removeItemStatus(id: number, userName: string) {
    return this.http
      .delete(this.serviceURL + '/' + id + '/' + userName, this.httpOptions)
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
