import { Injectable, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { HttpClient } from '@angular/common/http';
import { AppConfiguration } from '../../configuration';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class ItemAttributeService {
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

  saveItemAttributes(attributes: any) {
    return this.http
      .post(
        AppConfiguration.companyRestURL + 'add',
        attributes,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  updateTypeAttributes(attribute: { attributeNameId: string }) {
    return this.http
      .put(
        AppConfiguration.attributeRestURL + '/' + attribute.attributeNameId,
        attribute,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  updateTypeAttributesOrder(typeAttributes: any) {
    return this.http
      .put(AppConfiguration.attributeRestURL, typeAttributes, this.httpOptions)
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

  getAttributesForFindReplacement(itemId: string) {
    return this.http
      .get(
        AppConfiguration.locationRestURL + '/item/findReplacement/' + itemId,
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

  createNewTypeAttribute(attribute: any) {
    return this.http
      .post(AppConfiguration.attributeRestURL, attribute, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getAllItemAttributes() {
    return this.http
      .get(
        AppConfiguration.companyRestURL + 'getAllCompanies',
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  removeItemAttributess(
    attributeId: string,
    companyId: string,
    userName: string,
    attributeName: string,
    typeName: string,
    moduleType: string
  ) {
    const url = `${AppConfiguration.attributeRestURL}/${attributeId}/${companyId}/${userName}/${attributeName}/${typeName}/${moduleType}`;
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
