import { Injectable, Inject } from '@angular/core';
import { AppConfiguration } from '../configuration';
import { Subject } from 'rxjs';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class WarrantyManagementService {
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

  constructor(
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private http: HttpClient
  ) {
    this.globalCompanyChange.subscribe((value) => {
      this.currentGlobalCompany = value;
    });
  }

  saveWarrantyType(type: any) {
    return this.http
      .post(
        AppConfiguration.locationRestURL + 'warrantytype',
        type,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  updateWarrantyType(type: any, warrantytypeid: string) {
    return this.http
      .put(
        AppConfiguration.locationRestURL + 'warrantytype/' + warrantytypeid,
        type,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  removeWarrantyType(
    typeId: string,
    companyId: string,
    userName: string,
    warrantyType: string
  ) {
    return this.http
      .delete(
        AppConfiguration.locationRestURL +
          'warrantytype/' +
          typeId +
          '/' +
          companyId +
          '/' +
          userName +
          '/' +
          warrantyType,
        { responseType: 'text' }
      )
      .pipe(catchError(this.handleError));
  }

  getWarrantyType(warrantytypeid: string) {
    return this.http
      .get(
        AppConfiguration.locationRestURL + 'warrantytype/' + warrantytypeid,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getAllWarrantyTypes(companyId: string) {
    return this.http
      .get(
        AppConfiguration.locationRestURL +
          'warrantytype/getAlltWarrantytypeByCompanyId/' +
          companyId,
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
}
