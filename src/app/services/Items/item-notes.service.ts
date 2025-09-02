import { Injectable, Inject } from '@angular/core';
import { AppConfiguration } from '../../configuration';
import { HttpHeaders } from '@angular/common/http';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class ItemNotesService {
  public serviceURL = AppConfiguration.typeStatusRestURL + 'notes';
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

  saveItemNote(notes: any) {
    return this.http
      .post(this.serviceURL, notes, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateItemNotes(itemNote: { journalId: string }) {
    return this.http
      .put(
        this.serviceURL + '/' + itemNote.journalId,
        itemNote,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getItemNotes(journalId: number) {
    return this.http
      .get(this.serviceURL + '/' + journalId, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getAllItemNotes(companyId: string, itemId: any) {
    return this.http
      .get(
        this.serviceURL + '/getAllNotes/itemtype/' + companyId + '/' + itemId,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getAllItemChangeLogs(companyId: string, itemId: string) {
    return this.http
      .get(
        this.serviceURL +
          '/getAllChangesLog/itemtype/' +
          companyId +
          '/' +
          itemId,
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

  removeItemNotes(
    id: string,
    userName: string,
    tag: string | number | boolean,
    typeName: string | number | boolean
  ) {
    let params = new HttpParams();
    params = params.append('tag', tag);
    params = params.append('type', typeName);
    var httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer  ' + this.authToken,
      }),
      params: params,
    };
    const url = `${this.serviceURL}/${id}/${userName}`;
    return this.http
      .delete(url, { ...this.httpOptions, responseType: 'text' })
      .pipe(catchError(this.handleError));
  }
}
