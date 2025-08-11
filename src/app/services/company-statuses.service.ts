import { Inject, Injectable } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
// import 'rxjs/add/operator/toPromise';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppConfiguration } from '../configuration';

@Injectable()
export class CompanyStatusesService {
  databaseIndex: number = 1;
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

  saveCompanyStatus(companyStatus: any) {
    return this.http
      .post(this.serviceURL, companyStatus, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateCompanyStatus(companyStatus: { statusId: string }) {
    console.log(companyStatus);
    return this.http
      .put(
        this.serviceURL + '/' + companyStatus.statusId,
        companyStatus,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getCompanyStatus(index: string | number) {
    return this.http
      .get(this.serviceURL + '/' + index, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getAllCompanyStatuses(companyId: string | number) {
    return this.http
      .get(
        this.serviceURL + '/getAllStatusByCompanyId/companytype/' + companyId,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  removeCompanyStatus(id: string, userName: string) {
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
