import { Inject, Injectable } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Subject } from 'rxjs';
import { AppConfiguration } from '../configuration';
//import 'rxjs/add/operator/toPromise';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable()
export class LocationTypesService {
  databaseIndex: number = 0;
  currentGlobalCompany: any;
  public globalCompanyChange: Subject<any> = new Subject<any>();
  public serviceURL = AppConfiguration.typeRestURL;
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

  saveLocationType(type: {
    attributesearchdisplay: number;
    company: { companyid: number };
    description: any;
    entitytypeid: number;
    hostingfee: any;
    ishidden: boolean;
    lastmodifiedby: any;
    moduleType: string;
    name: any;
    parentid: { typeid: any };
    typeid: number;
    typemtbs: number;
    typespareratio: number;
  }) {
    return this.http
      .post(this.serviceURL, type, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateLocationType(locationType: {
    attributesearchdisplay?: number;
    description?: any;
    entitytypeid?: any;
    hostingfee?: any;
    ishidden?: boolean;
    lastmodifiedby?: any;
    moduleType?: string;
    name?: any;
    parentid?: { typeid: any };
    company?: { companyid: any };
    typeList?: any;
    typeid: any;
    typemtbs?: number;
    typespareratio?: number;
  }) {
    return this.http
      .put(
        this.serviceURL + '/' + locationType.typeid,
        locationType,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getLocationTypeDetails(typeId: string) {
    return this.http
      .get(this.serviceURL + '/' + typeId, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getAllLocationTypes(companyId: string | number) {
    return this.http
      .get(
        this.serviceURL + '/getAllType/locationtype/' + companyId,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getAllLocationTypesWithHierarchy(companyId: string | number) {
    return this.http
      .get(
        this.serviceURL + '/getAllTypeWithHierarchy/locationtype/' + companyId,
        this.httpOptions
      )
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

  removeLocationType(id: string | number, userName: string) {
    return this.http
      .delete(this.serviceURL + '/' + id + '/' + userName, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
}
