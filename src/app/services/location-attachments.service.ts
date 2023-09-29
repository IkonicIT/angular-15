import { Injectable, Inject } from '@angular/core';
import { AppConfiguration } from '../configuration';
import { HttpHeaders } from '@angular/common/http';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class LocationAttachmentsService {
  public serviceURL = AppConfiguration.typeStatusRestURL + 'attachment';
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

  saveLocationDocument(document: FormData) {
    return this.http
      .post(this.serviceURL, document, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateLocationDocument(company: { attachmentid: string }) {
    return this.http
      .put(this.serviceURL + '/' + company.attachmentid, company, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getLocationDocuments(attachmentId: string) {
    return this.http
      .get(this.serviceURL + '/' + attachmentId, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getAllLocationDocuments(companyId: any, locationId: string) {
    return this.http
      .get(this.serviceURL + '/getAllAttachments/locationtype/' + locationId + '/' + locationId, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  removeLocationDocuments(
    attachmentId: string,
    companyid: string,
    username: string
  ) {
    return this.http
      .delete(this.serviceURL + '/' + attachmentId + '/' + companyid + '/' + username, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  removeLocationNoteDocuments(
    attachmentId: string,
    companyid: string,
    username: string,
    userLog: { noteType: any; noteName: any; locationName: any }
  ) {
    let params = new HttpParams();
    params = params.append('noteType', userLog.noteType);
    params = params.append('noteName', userLog.noteName);
    params = params.append('locationName', userLog.locationName);
    var httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer  ' + this.authToken,
      }),
      params: params,
    };

    return this.http
      .delete(this.serviceURL + '/' + attachmentId + '/' + companyid + '/' + username, httpOptions)
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

  b64toBlob(b64Data: string, contentType: string) {
    contentType = contentType || '';
    var sliceSize = 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
}
