import { Injectable, Inject } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
// import 'rxjs/add/operator/toPromise';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppConfiguration } from '../configuration';

@Injectable()
export class LocationStatusService {
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

  saveLocationStatus(locationStatus: any) {
    return this.http
      .post(this.serviceURL, locationStatus, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateLocationStatus(locationStatus: { statusid: string }) {
    return this.http
      .put(
        this.serviceURL + '/' + locationStatus.statusid,
        locationStatus,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getLocationStatus(index: string | number) {
    return this.http
      .get(this.serviceURL + '/' + index, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getAllLocationStatuses(locationId: string) {
    return this.http
      .get(
        this.serviceURL + '/getAllStatusByCompanyId/locationtype/' + locationId,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  removeLocationStatus(id: string | number, username: string) {
    return this.http
      .delete(this.serviceURL + '/' + id + '/' + username, this.httpOptions)
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
