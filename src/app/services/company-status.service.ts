import { Inject, Injectable } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import 'rxjs/add/operator/toPromise';
import { _throw } from 'rxjs/observable/throw';
import { catchError, retry } from 'rxjs/operators';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable()
export class CompanyStatusService {
  databaseIndex: number = 1;


  constructor( @Inject(SESSION_STORAGE) private storage: StorageService) {
  }

  saveCompanyStatus(companyStatus) {
    this.databaseIndex++;
    companyStatus._id = this.databaseIndex;
    this.storage.set('status' + this.databaseIndex, document);
    return 1;
  }


  updateCompanyStatus(companyStatus) {
    this.storage.set('status' + companyStatus._id, companyStatus);
    return 1;
  }


  getCompanyStatus(index) {
    return this.storage.get('status' + index);
  }

  removeCompanyStatus(id) {
    this.storage.remove('status' + id);
    return 1;
  }

}
