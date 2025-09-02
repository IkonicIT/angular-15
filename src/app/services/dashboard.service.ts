import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AppConfiguration } from '../configuration';
import { Observable } from 'rxjs';

@Injectable()
export class DashboardService {
  public serviceURL = AppConfiguration.locationRestURL + 'dashboard/';
  constructor(private http: HttpClient) {}

  getRecentData(
    companyId: string | number,
    isOwnerAdmin: string,
    userId: string
  ) {
    return this.http
      .get(
        this.serviceURL +
          'getRecentData/' +
          companyId +
          '/' +
          isOwnerAdmin +
          '/' +
          userId
      )
      .pipe(catchError(this.handleError));
  }

  getFailureTypePercentage(req: any) {
    return this.http
      .post(this.serviceURL + 'primaryFindingsChart', req)
      .pipe(catchError(this.handleError));
  }

  getFailureTypePercentageMasterPieCharts(req: any): Observable<any> {
    return this.http.post(AppConfiguration.locationRestURL + "masterpiecharts/failureTypeChart",req);
  }

  getFailureTypePercentageInRange(request: any) {
    return this.http
      .post(this.serviceURL + 'primaryFindingsChartInRange', request)
      .pipe(catchError(this.handleError));
  }

  getFailureCauses(body: any) {
    return this.http
      .post(this.serviceURL + 'causesChart', body)
      .pipe(catchError(this.handleError));
  }

  getFailureCausesMasterPieCharts(body: any) {
    return this.http.post(AppConfiguration.locationRestURL + "masterpiecharts/failureCausesChart", body)
      .pipe(
        catchError(this.handleError)
      );
  }

  getFailureCausePercentageInRange(failureCause: any) {
    return this.http
      .post(this.serviceURL + 'causesChartInRange', failureCause)
      .pipe(catchError(this.handleError));
  }

  getRecentJobsByCause(failureType: any) {
    return this.http
      .post(this.serviceURL + 'repairJobsByFailureCause', failureType)
      .pipe(catchError(this.handleError));
  }

  getRecentJobsByCauseMasterPieCharts(failureType: any) {
    return this.http.post(AppConfiguration.locationRestURL + "masterpiecharts/repairJobsByFailureCause", failureType)
      .pipe(
        catchError(this.handleError)
      );
  }

  getRecentJobsByCauseinRange(failureType: any) {
    return this.http
      .post(this.serviceURL + 'repairJobsByFailureCauseInRange', failureType)
      .pipe(catchError(this.handleError));
  }

  getAllRepairs(request: any) {
    return this.http
      .post(this.serviceURL + 'getAllRepairs', request)
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
