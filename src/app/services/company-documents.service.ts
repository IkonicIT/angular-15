import { Inject, Injectable } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
// import 'rxjs/add/operator/toPromise';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppConfiguration } from '../configuration';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class CompanyDocumentsService {
  databaseIndex: number = 1;
  public serviceURL = AppConfiguration.typeStatusRestURL + 'attachment';
  public isProd = false;
  private authToken = sessionStorage.getItem('auth_token') ? sessionStorage.getItem('auth_token') : '';
  private httpOptions = {
    headers: new HttpHeaders({
      Authorization: 'Bearer  ' + this.authToken,
    }),
  };

  constructor(@Inject(SESSION_STORAGE) private storage: StorageService, private http: HttpClient) {}

  saveCompanyDocument(document: any) {
    // console.log(this.serviceURL, document, this.httpOptions);
    return this.http
      .post(this.serviceURL, document, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  saveCompanyDocumentNew(document: any) {
    return this.http
      .post(this.serviceURL + '/createNewAttachment', document, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  saveCompanyMultipleDocuments(attachList: any) {
    return this.http
      .post(this.serviceURL + '/createMultipleAttachments', attachList, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateCompanyDocument(company: { attachmentid: string }) {
    return this.http
      .put(this.serviceURL + '/' + company.attachmentid, company, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getCompanyDocuments(attachmentId: number) {
    return this.http
      .get(this.serviceURL + '/' + attachmentId, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getAllCompanyDocuments(companyId: string | number) {
    return this.http
      .get(this.serviceURL + '/getAllAttachments/companytype/' + companyId, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getAllRepairDocuments(companyId: string) {
    return this.http
      .get(this.serviceURL + '/getAllAttachments/itemrepairtype/' + companyId, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  removeCompanyDocuments(attachmentId: string, companyid: string, username: string) {
    return this.http
      .delete(this.serviceURL + '/' + attachmentId + '/' + companyid + '/' + username, { responseType: 'text' })
      .pipe(catchError(this.handleError));
  }

  getManual() {
    return this.http
      .get(AppConfiguration.companyRestURL + 'getManual')
      .pipe(catchError(this.handleError));
  }
  updateManual(manual: any) {
    return this.http
      .put(AppConfiguration.companyRestURL + 'updateManual', manual)
      .pipe(catchError(this.handleError));
  }

  removeCompanyNoteDocuments(attachmentId: string, companyid: string, username: string, userLog: any) {
    let params = new HttpParams();
    params = params.append('noteType', userLog.noteType);
    params = params.append('noteName', userLog.noteName);
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
