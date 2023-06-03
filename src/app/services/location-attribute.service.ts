import { Inject, Injectable } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Subject } from 'rxjs';
// import 'rxjs/add/operator/toPromise';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppConfiguration } from '../configuration';

@Injectable()
export class LocationAttributeService {
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
  ) {}

  saveLocationAttributes(attributes: any) {
    return this.http
      .post(
        AppConfiguration.companyRestURL + 'add',
        attributes,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  updateTypeAttributes(attribute: {
    attributelistitemResource?: null;
    attributenameid: any;
    attributetype?: { attributetypeid: any };
    displayorder?: any;
    ismanufacturer?: any;
    isrequired?: any;
    isrequiredformatch?: boolean;
    name?: any;
    searchmodifier?: string;
    companyId?: string;
    lastmodifiedby?: any;
    searchtype?: { attributesearchtypeid: any };
    tooltip?: any;
    type?: { typeid: number; name: any };
    moduleType?: string;
  }) {
    return this.http
      .put(
        AppConfiguration.attributeRestURL + '/' + attribute.attributenameid,
        attribute,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getTypeAttributes(typeId: string) {
    return this.http
      .get(
        AppConfiguration.attributeRestURL + '/getAllAttributes/' + typeId,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getAllAttributeTypes() {
    return this.http
      .get(
        AppConfiguration.attributeRestURL + '/getAllAttributetypes',
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getAllSearchTypes(attributeType: string) {
    return this.http
      .get(
        AppConfiguration.attributeRestURL +
          '/getAllAttributeSearchType/' +
          attributeType,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  createNewTypeAttribute(attribute: {
    attributelistitemResource: null;
    attributenameid: number;
    attributetype: { attributetypeid: any };
    displayorder: any;
    ismanufacturer: boolean;
    isrequired: any;
    isrequiredformatch: boolean;
    name: any;
    searchmodifier: string;
    companyId: string;
    lastmodifiedby: any;
    searchtype: { attributesearchtypeid: any };
    tooltip: any;
    type: { typeid: number; name: any };
    moduleType: string;
  }) {
    return this.http
      .post(AppConfiguration.attributeRestURL, attribute, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getAllLocationAttributes() {
    return this.http
      .get(
        AppConfiguration.companyRestURL + 'getAllCompanies',
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  removeLocationAttributess(
    attributeId: string,
    companyid: string,
    username: string,
    attributeName: string,
    typeName: string,
    moduleType: string
  ) {
    return this.http
      .delete(
        AppConfiguration.attributeRestURL +
          '/' +
          attributeId +
          '/' +
          companyid +
          '/' +
          username +
          '/' +
          attributeName +
          '/' +
          typeName +
          '/' +
          moduleType,
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
}
