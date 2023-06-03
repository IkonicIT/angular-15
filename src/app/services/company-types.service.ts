import { Inject, Injectable } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
// import 'rxjs/add/operator/toPromise';
import { catchError, retry } from 'rxjs/operators';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppConfiguration } from '../configuration';
import { TreeviewItem } from 'ngx-treeview';
import { throwError } from 'rxjs';

@Injectable()
export class CompanyTypesService {
  databaseIndex: number = 1;
  public serviceURL = AppConfiguration.typeRestURL;
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

  saveCompanyType(type: {
    attributesearchdisplay: number;
    company: { companyid: any };
    description: any;
    entitytypeid: number;
    hostingfee: any;
    ishidden: boolean;
    lastmodifiedby: any;
    moduleType: string;
    name: any;
    parentid: { typeid: any };
    typeid: number;
    typemtbs: number;
    typespareratio: number;
  }) {
    return this.http
      .post(this.serviceURL, type, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateCompanyType(
    typeId: string | number,
    companyType: {
      attributesearchdisplay: number;
      company: { companyid: number };
      description: any;
      entitytypeid: any;
      hostingfee: any;
      ishidden: boolean;
      lastmodifiedby: any;
      moduleType: string;
      name: any;
      parentid: { typeid: any };
      typeList: any;
      typeid: number;
      typemtbs: number;
      typespareratio: number;
      moduletype: string;
    }
  ) {
    return this.http
      .put(this.serviceURL + '/' + typeId, companyType, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getCompanyType(typeId: string | number) {
    return this.http
      .get(this.serviceURL + '/' + typeId, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getAllCompanyTypes(companyId: string) {
    return this.http
      .get(
        this.serviceURL + '/getAllType/companytype/' + companyId,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getAllCompanyTypesWithHierarchy(companyId: string | number) {
    return this.http
      .get(
        this.serviceURL + '/getAllTypeWithHierarchy/companytype/' + companyId,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getBooks(): TreeviewItem[] {
    const childrenCategory = new TreeviewItem({
      text: 'Children',
      value: 1,
      collapsed: true,
      children: [
        { text: 'Baby 3-5', value: 11 },
        { text: 'Baby 6-8', value: 12 },
        { text: 'Baby 9-12', value: 13 },
      ],
    });
    const itCategory = new TreeviewItem({
      text: 'IT',
      value: 9,
      children: [
        {
          text: 'Programming',
          value: 91,
          children: [
            {
              text: 'Frontend',
              value: 911,
              children: [
                { text: 'Angular 1', value: 9111 },
                { text: 'Angular 2', value: 9112 },
                { text: 'ReactJS', value: 9113, disabled: true },
              ],
            },
            {
              text: 'Backend',
              value: 912,
              children: [
                { text: 'C#', value: 9121 },
                { text: 'Java', value: 9122 },
                { text: 'Python', value: 9123, checked: false, disabled: true },
              ],
            },
          ],
        },
        {
          text: 'Networking',
          value: 92,
          children: [
            { text: 'Internet', value: 921 },
            { text: 'Security', value: 922 },
          ],
        },
      ],
    });
    const teenCategory = new TreeviewItem({
      text: 'Teen',
      value: 2,
      collapsed: true,
      disabled: true,
      children: [
        { text: 'Adventure', value: 21 },
        { text: 'Science', value: 22 },
      ],
    });
    const othersCategory = new TreeviewItem({
      text: 'Others',
      value: 3,
      checked: false,
      disabled: true,
    });
    return [childrenCategory, itCategory, teenCategory, othersCategory];
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

  removeCompanyType(id: string, userName: string) {
    return this.http
      .delete(this.serviceURL + '/' + id + '/' + userName, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
}
