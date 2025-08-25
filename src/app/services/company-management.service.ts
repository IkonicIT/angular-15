import { Inject, Injectable } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Subject } from 'rxjs';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AppConfiguration } from '../configuration';
import { Router } from '@angular/router';

@Injectable()
export class CompanyManagementService {
  databaseIndex: number = 4;
  currentGlobalCompany: any;
  public globalCompanyChange: Subject<any> = new Subject<any>();
  switchCompany: any;
  public switchCompanyChange: Subject<any> = new Subject<any>();
  public isProd = false;
  public isCompaniesListModified = false;
  public companyListChange: Subject<any> = new Subject<any>();
  public headers: any;
  private authToken = sessionStorage.getItem('auth_token')
    ? sessionStorage.getItem('auth_token')
    : '';
  public router;
  public globalCompanyList: any = [];
  public globalAttachments: any = [];
  public userId: any;
  public GlobalCompany: any;
  public searchedCompanyTypeId: any = 0;
  public searchedCompanyTypeName: any = '';
  public currentCompanyName: any;
  public currentCompanyId: any;

  constructor(
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private http: HttpClient,
    router: Router
  ) {
    this.router = router;
    this.globalCompanyChange.subscribe((value) => {
      this.currentGlobalCompany = value;
    });
    this.companyListChange.subscribe((value) => {
      this.isCompaniesListModified = value;
    });
    console.log('auth token' + this.authToken);
  }

  setGlobalCompanyList(list: any) {
    this.globalCompanyList = list;
  }

  getGlobalCompanyList() {
    return this.globalCompanyList;
  }

  setGlobalAttachments(list: any) {
    this.globalAttachments = list;
  }

  getGlobalAttachments() {
    return this.globalAttachments;
  }

  public setSearchedCompanyTypeId(typeId: any) {
    this.searchedCompanyTypeId = typeId;
  }

  public getSearchedCompanyTypeId() {
    return this.searchedCompanyTypeId;
  }

  public setSearchedCompanyTypeName(name: any) {
    this.searchedCompanyTypeName = name;
  }

  public getSearchedCompanyTypeName() {
    return this.searchedCompanyTypeName;
  }

  setGlobalCompany(value: any) {
    this.globalCompanyChange.next(value);
  }

  getGlobalCompany() {
    return this.currentGlobalCompany;
  }

  setCompaniesListModified(value: any) {
    this.companyListChange.next(value);
  }

  getCompaniesListModified() {
    return this.isCompaniesListModified;
  }

  setSwithCompany(value: any) {
    this.switchCompanyChange.next(value);
  }

  getSwithCompany() {
    return this.switchCompany;
  }

  saveCompany(company: any) {
    return this.http
      .post(AppConfiguration.companyRestURL + 'add', company)
      .pipe(catchError(this.handleError));
  }

  updateCompany(company: { companyId: string }) {
    return this.http
      .put(AppConfiguration.companyRestURL + '' + company.companyId, company)
      .pipe(catchError(this.handleError));
  }

  removeCompany(companyId: string) {
    return this.http
      .delete(AppConfiguration.companyRestURL + '' + companyId, {
        responseType: 'text',
      })
      .pipe(catchError(this.handleError));
  }

  getAllCompanyDetails() {
    return this.http
      .get(AppConfiguration.companyRestURL + 'getAllCompanies')
      .pipe(catchError(this.handleError));
  }

  getCompanyNames(userId: string) {
    return this.http
      .get(AppConfiguration.companyRestURL + 'getCompaniesByUser/' + userId)
      .pipe(catchError(this.handleError));
  }

  getLogo(companyId: string) {
    return this.http
      .get(AppConfiguration.companyRestURL + 'logo/' + companyId)
      .pipe(catchError(this.handleError));
  }

  getRolesForUser(userId: string) {
    return this.http
      .get(
        AppConfiguration.locationRestURL +
          'userSecurity/getAllRolesForUser/' +
          userId
      )
      .pipe(catchError(this.handleError));
  }

  getLevelsByUserName(userName: string, companyId: string) {
    return this.http
      .get(
        AppConfiguration.locationRestURL +
          'userSecurity/' +
          userName +
          '/' +
          companyId
      )
      .pipe(catchError(this.handleError));
  }

  getCompanyDetails(comapnyId: string) {
    return this.http
      .get(AppConfiguration.companyRestURL + comapnyId)
      .pipe(catchError(this.handleError));
  }

  saveLogo(formdata: any, companyId: string) {
    return this.http
      .post(
        AppConfiguration.companyRestURL + 'companyImage/' + companyId,
        formdata
      )
      .pipe(catchError(this.handleError));
  }

  saveTracratAnnouncements(announcementResource: any) {
    return this.http
      .put(
        AppConfiguration.companyRestURL + 'tracratAnnouncments',
        announcementResource
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    //handle your auth error
    if (error.status === 401) {
      //navigate /delete cookies or whatever
      console.log('handled error ' + error.status);
      this.router.navigate([`/login`]);
    }
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(error.error);
    }
    return throwError(() => 'Something bad happened; please try again later.');
  }

  randomNumber() {
    return Math.floor(Math.random() * 6 + 1);
  }

  getAllVendorDetails() {
    return this.http
      .get(AppConfiguration.vendorRestURL + 'getAllVendorsList')
      .pipe(catchError(this.handleError));
  }

  getAllVendorRepairs(vendorRequest: any) {
    return this.http
      .post(
        AppConfiguration.locationRestURL +
          'itemrepair/getAllItemRepairsByVendorInLocation/',
        vendorRequest
      )
      .pipe(catchError(this.handleError));
  }

  getAllCompaniesForOwnerAdmin() {
    return this.http
      .get(AppConfiguration.companyRestURL + 'getCompanies')
      .pipe(catchError(this.handleError));
  }

  getAllVendors(companyId: string) {
    return this.http
      .get(AppConfiguration.vendorRestURL + 'getAllVendors/' + companyId)
      .pipe(catchError(this.handleError));
  }

  removeVendor(companyId: number) {
    return this.http
      .delete(AppConfiguration.vendorRestURL + '' + companyId, {
        responseType: 'text',
      })
      .pipe(catchError(this.handleError));
  }

  saveVendor(vendor: any) {
    return this.http
      .post(AppConfiguration.vendorRestURL, vendor)
      .pipe(catchError(this.handleError));
  }

  getVendorDetails(comapnyId: number) {
    return this.http
      .get(AppConfiguration.vendorRestURL + comapnyId)
      .pipe(catchError(this.handleError));
  }

  updateVendor(vendor: any) {
    return this.http
      .put(AppConfiguration.vendorRestURL + vendor.vendorId, vendor)
      .pipe(catchError(this.handleError));
  }

  getAllTemplates(companyId: string) {
    return this.http
      .get(AppConfiguration.templateRestURL + 'getAllTemplates/' + companyId)
      .pipe(catchError(this.handleError));
  }

  removeTemplate(
    templateId: string,
    companyId: string,
    userName: string,
    templateName: string
  ) {
    return this.http
      .delete(
        AppConfiguration.templateRestURL +
          '' +
          templateId +
          '/' +
          companyId +
          '/' +
          userName +
          '/' +
          templateName,
        { responseType: 'text' }
      )
      .pipe(catchError(this.handleError));
  }

  saveTemplate(template: any) {
    return this.http
      .post(AppConfiguration.templateRestURL + 'createTemplate', template)
      .pipe(catchError(this.handleError));
  }

  saveCompanyFromTemplate(template: any) {
    return this.http
      .post(
        AppConfiguration.templateRestURL + 'createCompanyFromTemplate',
        template
      )
      .pipe(catchError(this.handleError));
  }
}
