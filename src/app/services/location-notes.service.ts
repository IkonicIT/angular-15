import { Injectable, Inject } from '@angular/core';
import { AppConfiguration } from '../configuration';
import { HttpHeaders } from '@angular/common/http';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class LocationNotesService {
  public serviceURL = AppConfiguration.typeStatusRestURL + 'notes';
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

  saveLocationNotes(notes: any) {
    return this.http
      .post(this.serviceURL, notes, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateLocationNotes(locationNote: { journalid: string }) {
    return this.http
      .put(this.serviceURL + '/' + locationNote.journalid, locationNote, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getLocationNotes(journalid: string | number, companyId: string | number) {
    return this.http
      .get(this.serviceURL + '/' + journalid, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getAllLocationNotes(companyId: string, locationId: string) {
    return this.http
      .get(this.serviceURL + '/getAllNotes/locationtype/' + companyId + '/' + locationId, this.httpOptions)
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

  removeLocationNotes(id: string, userName: string, locationName: string | number | boolean) {
    let params = new HttpParams();
    params = params.append('location', locationName);
    var httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer  ' + this.authToken,
      }),
      params: params,
    };

    return this.http
      .delete(this.serviceURL + '/' + id + '/' + userName, httpOptions)
      .pipe(catchError(this.handleError));
  }
}
