import { Inject, Injectable } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
// import 'rxjs/add/operator/toPromise';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppConfiguration } from '../configuration';

@Injectable()
export class ReportsService {
  public InserviceVsSpareReport: any = {};
  public serviceReport: any = [];
  public serviceURL = AppConfiguration.locationRestURL + 'reports';
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

  public setInserviceVsSpareReport(inserviceVsSpareReport: any) {
    this.InserviceVsSpareReport = inserviceVsSpareReport;
  }

  public getInserviceVsSpareReport() {
    return this.InserviceVsSpareReport;
  }

  public setserviceReport(serviceReport: any) {
    this.serviceReport = serviceReport;
  }

  public getserviceReport() {
    return this.serviceReport;
  }

  generateInserviceVsSpareReport(companyId: string) {
    return this.http
      .get(this.serviceURL + '/inServiceVsSpare/' + companyId, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getSpareMotor(itemId: string) {
    return this.http
      .get(this.serviceURL + '/spare/' + itemId, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  generateServiceReport(request: {
    companyId: any;
    timeSpan: string | undefined;
    startDate: any;
    endDate: any;
  }) {
    return this.http
      .post(this.serviceURL + '/serviceReport', request)
      .pipe(catchError(this.handleError));
  }

  generateISandSpareReport(request: {
    companyId: any;
    hp: any;
    rpm: any;
    frame: any;
  }) {
    return this.http
      .post(this.serviceURL + '/inServiceVsSpare', request)
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
