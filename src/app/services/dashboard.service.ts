import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AppConfiguration } from '../configuration';

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

  getFailureTypePercentage(req: {
    companyId: number;
    locationId: any;
    timeFrame: any;
    isOwnerAdmin: any;
    userId: any;
    isByRepairCost: string;
    typeId: any;
  }) {
    return this.http
      .post(this.serviceURL + 'primaryFindingsChart', req)
      .pipe(catchError(this.handleError));
  }

  getFailureTypePercentageInRange(request: {
    companyId: number;
    locationId: any;
    timeFrame: any;
    isOwnerAdmin: any;
    userId: any;
    isByRepairCost: string;
    startDate: any;
    endDate: any;
    typeId: any;
  }) {
    return this.http
      .post(this.serviceURL + 'primaryFindingsChartInRange', request)
      .pipe(catchError(this.handleError));
  }

  getFailureCauses(body: {
    companyId: number;
    timeFrame: any;
    locationId: any;
    failureType: any;
    isOwnerAdmin: any;
    userId: any;
    isByRepairCost: string;
    typeId: any;
  }) {
    return this.http
      .post(this.serviceURL + 'causesChart', body)
      .pipe(catchError(this.handleError));
  }
  
  getFailureCausePercentageInRange(failureCause: {
    companyId: number;
    locationId: any;
    failureType: any;
    isOwnerAdmin: any;
    userId: any;
    startDate: any;
    endDate: any;
    isByRepairCost: string;
    typeId: any;
  }) {
    return this.http
      .post(this.serviceURL + 'causesChartInRange', failureCause)
      .pipe(catchError(this.handleError));
  }

  getRecentJobsByCause(failuretype: {
    companyId: number;
    timeFrame: any;
    locationId: any;
    failureType: any;
    failureCause: any;
    isOwnerAdmin: any;
    userId: any;
    typeId: any;
  }) {
    return this.http
      .post(this.serviceURL + 'repairJobsByFailureCause', failuretype)
      .pipe(catchError(this.handleError));
  }

  getRecentJobsByCauseinRange(failuretype: {
    companyId: number;
    locationId: any;
    failureType: any;
    failureCause: any;
    isOwnerAdmin: any;
    userId: any;
    startDate: any;
    endDate: any;
    typeId: any;
  }) {
    return this.http
      .post(this.serviceURL + 'repairJobsByFailureCauseInRange', failuretype)
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
