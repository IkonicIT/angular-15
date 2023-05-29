import { Inject, Injectable } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
// import 'rxjs/add/operator/toPromise';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppConfiguration } from '../configuration';

@Injectable()
export class CompanynotesService {
  databaseIndex: number = 1;
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

  saveCompanynotes(notes: any) {
    return this.http
      .post(this.serviceURL, notes, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateCompanynotes(companyNote: { journalid: string }) {
    return this.http
      .put(
        this.serviceURL + '/' + companyNote.journalid,
        companyNote,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getCompanynotess(journalid: string | number, companyId: number) {
    return this.http
      .get(this.serviceURL + '/' + journalid, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getAllCompanyNotess(companyId: string) {
    return this.http
      .get(
        this.serviceURL +
          '/getAllNotes/companytype/' +
          companyId +
          '/' +
          companyId,
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

  removeCompanynotess(id: string, userName: string) {
    return this.http
      .delete(this.serviceURL + '/' + id + '/' + userName, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
}
