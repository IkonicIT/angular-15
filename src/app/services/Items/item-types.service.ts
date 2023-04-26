import { Injectable, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { AppConfiguration } from '../../configuration';
import { HttpHeaders } from '@angular/common/http';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class ItemTypesService {
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

  saveItemType(type: any) {
    return this.http
      .post(this.serviceURL, type, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateItemType(itemType: any) {
    return this.http
      .put(this.serviceURL + '/' + itemType.typeid, itemType, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getItemTypeDetails(typeId: string) {
    return this.http
      .get(this.serviceURL + '/' + typeId, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getAllItemTypes(companyId: string) {
    return this.http
      .get(
        this.serviceURL + '/getAllType/itemtype/' + companyId,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getAllItemTypesWithHierarchy(companyId: string | number) {
    return this.http
      .get(
        this.serviceURL + '/getAllTypeWithHierarchy/itemtype/' + companyId,
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

  removeItemType(id: string, userName: string) {
    return this.http
      .delete(this.serviceURL + '/' + id + '/' + userName, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
}
