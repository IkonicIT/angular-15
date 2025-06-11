import { Injectable } from '@angular/core';
import { AppConfiguration } from '../../configuration';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class ItemServiceManagementService {
  public serviceURL = AppConfiguration.locationRestURL + 'itemService';
  private authToken = sessionStorage.getItem('auth_token')
    ? sessionStorage.getItem('auth_token')
    : '';
  private httpOptions = {
    headers: new HttpHeaders({
      Authorization: 'Bearer  ' + this.authToken,
    }),
  };
  constructor(private http: HttpClient) {}

  saveItemService(service: any) {
    return this.http
      .post(this.serviceURL, service, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getAllItemServices(itemId: string) {
    return this.http
      .get(this.serviceURL + '/services/' + itemId, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getServiceById(serviceId: string) {
    return this.http
      .get(this.serviceURL + '/' + serviceId, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateItemService(service: any, serviceId: string) {
    return this.http
      .put(this.serviceURL + '/' + serviceId, service, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  deleteItemServiceById(serviceId: string) {
    const url = `${this.serviceURL}/${serviceId}`;
    return this.http
      .delete(url, { ...this.httpOptions, responseType: 'text' })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return throwError(() => 'Something bad happened; please try again later.');
  }
}
