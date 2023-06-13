import {Injectable, Inject} from '@angular/core';
import {Subject} from "rxjs";
import {HttpHeaders} from "@angular/common/http";
import {SESSION_STORAGE, StorageService} from "angular-webstorage-service";
import {HttpClient} from "@angular/common/http";
import {AppConfiguration} from "../configuration";
import {catchError} from "rxjs/operators/catchError";
import {_throw} from "rxjs/observable/throw";

@Injectable()
export class ForgotPasswordService {

  private authToken = sessionStorage.getItem('auth_token') ? sessionStorage.getItem('auth_token') : '';
  private httpOptions = {
    headers: new HttpHeaders({
      'Authorization': 'Bearer  ' + this.authToken
    })
  };

  constructor( @Inject(SESSION_STORAGE) private storage: StorageService, private http: HttpClient) {
  }

  forgotPasswordAPI(userName) {
    return this.http.post(AppConfiguration.forgotPasswordURL+'forgot/'+userName,this.httpOptions)
        .pipe(
            catchError(this.handleError)
        );
  }



  private handleError(error: any) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
          `Backend returned code ${error.status}, ` +
          `body was: ${error.error}`);
    }
    return _throw('Something bad happened; please try again later.');
  }


}
