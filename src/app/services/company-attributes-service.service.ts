import { Inject, Injectable } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppConfiguration } from '../configuration';

@Injectable()
export class CompanyAttributesServiceService {
  databaseIndex: number = 1;
  public isProd = false;
  private authToken = sessionStorage.getItem('auth_token') ? sessionStorage.getItem('auth_token') : '';
  private httpOptions = {
    headers: new HttpHeaders({
      Authorization: 'Bearer  ' + this.authToken,
    }),
  };

  constructor(
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private http: HttpClient
  ) {}

  saveCompanyAttributes(attributes: any) {
    return this.http
      .post(AppConfiguration.companyRestURL + 'add', attributes, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateTypeAttributes(attribute: any) {
    return this.http
      .put(AppConfiguration.attributeRestURL + '/' + attribute.attributenameid, attribute, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getCompanyAttributess(
    index: string | number,
    companyId: string | number,
    typeId: string | number
  ) {
    return this.storage.get(companyId + 'Type' + typeId + 'Attributes' + index);
  }

  getTypeAttributes(typeId: string) {
    return this.http
      .get(AppConfiguration.attributeRestURL + '/getAllAttributes/' + typeId, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getAllAttributeTypes() {
    return this.http
      .get(AppConfiguration.attributeRestURL + '/getAllAttributetypes', this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getAllSearchTypes(attributeType: string) {
    return this.http
      .get(AppConfiguration.attributeRestURL + '/getAllAttributeSearchType/' + attributeType, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  createNewTypeAttribute(attribute: any) {
    return this.http
      .post(AppConfiguration.attributeRestURL, attribute, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getAllCompanyAttributes() {
    return this.http
      .get(AppConfiguration.companyRestURL + 'getAllCompanies', this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  removeCompanyAttributess(
    attributeId: string,
    companyid: string,
    username: string,
    attributeName: string,
    typeName: string,
    moduleType: string
  ) {
    return this.http
      .delete(AppConfiguration.attributeRestURL + '/' + attributeId + '/' + companyid + '/' + username +
          '/' + attributeName + '/' + typeName + '/' + moduleType, { responseType: 'text' })
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
