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
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const body = {
      username : obj.userName,
      password : obj.password
    };
    return this.http
      .post(`${this.serviceURL}`, body, { headers })
      .pipe(catchError(this.handleError));
  }

  getUserIdByName(userName: string): Observable<any> {
    this.authToken = sessionStorage.getItem('auth_token') ? sessionStorage.getItem('auth_token') : '';
    console.log(this.authToken);
    return this.http
      .get(this.locationRestURL + 'users/' + userName)
      .pipe(catchError(this.handleError));
  }

  getProfileByUserId(userId: string): Observable<any> {
    this.authToken = sessionStorage.getItem('auth_token') ? sessionStorage.getItem('auth_token') : '';
    return this.http
      .get(this.locationRestURL + 'profile/user/' + userId)
      .pipe(catchError(this.handleError));
  }

  getRolesForALoggedInUser(userName: string, companyId: string): Observable<any> {
    this.authToken = sessionStorage.getItem('auth_token') ? sessionStorage.getItem('auth_token') : '';
    return this.http
      .get(this.locationRestURL + 'userSecurity/getAllRolesForLoggedInUser/' + userName + '/' + companyId)
      .pipe(catchError(this.handleError));
  }
}
