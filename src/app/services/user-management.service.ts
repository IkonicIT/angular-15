import { Injectable, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { AppConfiguration } from '../configuration';
import { HttpHeaders } from '@angular/common/http';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class UserManagementService {
  databaseIndex: number = 0;
  currentGlobalCompany: any;
  public globalCompanyChange: Subject<any> = new Subject<any>();
  public serviceURL = AppConfiguration.locationRestURL;
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

  saveUser(user: any, companyId: number) {
    return this.http
      .post(this.serviceURL + 'users/' + companyId, user, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  addSecurityRole(role: any) {
    return this.http
      .post(this.serviceURL + 'userSecurity', role, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  changePassword(user: any) {
    return this.http
      .post(this.serviceURL + 'users/changepassword', user, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getAllUsers(companyId: number) {
    return this.http
      .get<any[]>(this.serviceURL + 'users/getUserProfiles/' + companyId, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getAllUsersAsOwnerAdmin(companyId: number) {
    return this.http
      .get<any[]>(this.serviceURL + 'users/getUserProfilesAsAdmin/' + companyId,this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getReportSecurityForUser(profileId: string) {
    return this.http
      .get(AppConfiguration.locationRestURL + 'reportsecurity/' + profileId, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getUserProfile(profileId: string) {
    return this.http
      .get(AppConfiguration.locationRestURL + 'profile/' + profileId, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getUserId(userName: string) {
    return this.http
      .get(AppConfiguration.locationRestURL + 'users/usercount/' + userName, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getEmail(email: string) {
    return this.http
      .get(AppConfiguration.locationRestURL + 'users/usercountbyemail/' + email, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getProfileWithUser(userId: string) {
    return this.http
      .get(AppConfiguration.locationRestURL + 'profile/user/' + userId, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateStatus(profileId: string, companyId: string, statusroles: any) {
    return this.http
      .put(AppConfiguration.locationRestURL + 'profile/' + profileId + '/' + companyId, statusroles, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateProfile(profileId: string, companyId: string, profile: any) {
    return this.http
      .put(AppConfiguration.locationRestURL + 'profile/saveProfile/' + profileId + '/' + companyId, profile,
        this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateAccess(profileId: string, accessroles: any) {
    return this.http
      .put(AppConfiguration.locationRestURL + 'reportsecurity/' + profileId, accessroles, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateUser(userId: string, user: any) {
    return this.http
      .put(this.serviceURL + 'users/' + userId, user, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateLoginDate(user: any) {
    return this.http
      .put(this.serviceURL + 'users/updatelogindate', user, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateLogoutDate(id: string) {
    return this.http
      .put(this.serviceURL + 'users/updateUserLogOut/' + id, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getUser(userId: string, profileId: string, companyId: string) {
    return this.http
      .get(this.serviceURL + 'users/' + userId + '/' + profileId + '/' + companyId, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getUserview(companyId: number) {
    return this.http
      .get<any[]>(this.serviceURL + 'users/userlog/' + companyId, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getprofileWithType(userId: string, companyId: number) {
    return this.http
      .get(this.serviceURL + 'profile/user/' + userId + '/' + companyId, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getUserlogData(companyId: number, userName: string) {
    return this.http
      .get<any[]>(this.serviceURL + 'users/userlogdetails/' + companyId + '/' + userName, this.httpOptions)
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

  removeUser(
    userId: string,
    profileId: string,
    companyId: number,
    userName: string,
    addedBy: string
  ) {
    return this.http
      .delete(AppConfiguration.locationRestURL+'users/' + userId + '/' + profileId + '/' + companyId + '/' + userName + '/' + addedBy, 
        { responseType: 'text' }
      )
      .pipe(catchError(this.handleError));
  }

  removeRole(
    companyId: string,
    locationid: string,
    userId: string,
    userName: string
  ) {
    return this.http
      .delete(AppConfiguration.locationRestURL + 'userSecurity/' + userId + '/' + companyId + '/' + locationid + '/' +
          userName, { responseType: 'text' }
      )
      .pipe(catchError(this.handleError));
  }
}
