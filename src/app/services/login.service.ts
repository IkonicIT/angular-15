import { Inject, Injectable } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { AppConfiguration } from '../configuration';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class LoginService {
  public serviceURL = AppConfiguration.oauthURL;
  public locationRestURL = AppConfiguration.locationRestURL;
  public headers: any;
  public authToken: any;
  private httpOptions: any;
  constructor(
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private http: HttpClient
  ) {
    this.headers = new HttpHeaders();
    this.headers = this.headers.append(
      'Authorization',
      'Basic ' + window.btoa('ypatel' + ':' + 'tracrat')
    );
    this.headers = this.headers.append(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );
    this.httpOptions = {
      headers: this.headers,
    };
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

  loginAuth(obj: any): Observable<any> {
    let params = new HttpParams()
      .set('grant_type', 'password')
      .set('username', obj.userName)
      .set('password', obj.password)
      .set('client_id', 'clientid123');
    return this.http
      .post(this.serviceURL, params.toString(), this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getUserIdByName(userName: string): Observable<any> {
    this.authToken = sessionStorage.getItem('auth_token')
      ? sessionStorage.getItem('auth_token')
      : '';
    return this.http
      .get(
        this.locationRestURL +
          'users/' +
          userName +
          '?access_token=' +
          this.authToken
      )
      .pipe(catchError(this.handleError));
  }

  getProfileByUserId(userId: string): Observable<any> {
    this.authToken = sessionStorage.getItem('auth_token')
      ? sessionStorage.getItem('auth_token')
      : '';
    return this.http
      .get(
        this.locationRestURL +
          'profile/user/' +
          userId +
          '?access_token=' +
          this.authToken
      )
      .pipe(catchError(this.handleError));
  }

  getRolesForALoggedInUser(
    userName: string,
    companyid: string
  ): Observable<any> {
    this.authToken = sessionStorage.getItem('auth_token')
      ? sessionStorage.getItem('auth_token')
      : '';
    return this.http
      .get(
        this.locationRestURL +
          'userSecurity/getAllRolesForLoggedInUser/' +
          userName +
          '/' +
          companyid +
          '?access_token=' +
          this.authToken
      )
      .pipe(catchError(this.handleError));
  }
}
