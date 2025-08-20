import { Inject, Injectable } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Subject } from 'rxjs';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppConfiguration } from '../configuration';

@Injectable()
export class LocationManagementService {
  saveItem(req: {
    newLocationId: any;
    OldLocationId: any;
    newLocationName: any;
  }) {
    throw new Error('Method not implemented.');
  }

  databaseIndex: number = 0;
  currentGlobalCompany: any;
  public globalCompanyChange: Subject<any> = new Subject<any>();
  private authToken = sessionStorage.getItem('auth_token') ? sessionStorage.getItem('auth_token') : '';
  private httpOptions = {
    headers: new HttpHeaders({
      Authorization: 'Bearer  ' + this.authToken,
    }),
  };
  public searchedLocationTypeId: any = 0;
  public searchedLocationTypeName: any = '';
  public locations: any = [];
  public currentLocationName: any;
  public currentLocationId: any;

  getLocations() {
    return this.locations;
  }

  setLocations(locations: any) {
    this.locations = locations;
  }

  public setSearchedLocationTypeId(typeId: any) {
    this.searchedLocationTypeId = typeId;
  }

  public getSearchedLocationTypeId() {
    return this.searchedLocationTypeId;
  }

  public setSearchedLocationTypeName(name: any) {
    this.searchedLocationTypeName = name;
  }
  
  public getSearchedLocationTypeName() {
    return this.searchedLocationTypeName;
  }

  constructor(
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private http: HttpClient
  ) {
    this.globalCompanyChange.subscribe((value) => {
      this.currentGlobalCompany = value;
    });
  }

  saveLocation(location: any) {
    return this.http
      .post(AppConfiguration.locationRestURL + 'location', location, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateLocation(location: { locationId: string }) {
    return this.http
      .put(AppConfiguration.locationRestURL + 'location/' + location.locationId, location, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  removeLocation(locationId: number, companyId: number, username: string) {
    return this.http
      .delete(AppConfiguration.locationRestURL + 'location/' + locationId + '/' + companyId + '/' + username,
        { responseType: 'text' }
      )
      .pipe(catchError(this.handleError));
  }

  getLocationDetails(locationId: string) {
    return this.http
      .get(AppConfiguration.locationRestURL + 'location/' + locationId, this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getAllLocations(companyId: number) {
    return this.http
      .get(AppConfiguration.locationRestURL + 'location/getAllLocations/' + companyId, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getAllLocationsWithHierarchy(companyId: string | number) {
    return this.http
      .get(AppConfiguration.locationRestURL + 'location/getAllLocationsWithHierarchy/' + companyId, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getAllLocationsWithHierarchyforUser(companyId: string | number, userId: string) {
    return this.http
      .get(AppConfiguration.locationRestURL + 'location/getAllLocationsByUser/' + companyId + '/' + userId, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  mergeLocations(location: any, companyId: string) {
    return this.http
      .post(AppConfiguration.locationRestURL + 'location/mergeLocations/' + companyId, location, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  cloneaddressfromParentLoc(locationId: string, companyId: string) {
    return this.http
      .get(AppConfiguration.locationRestURL + 'location/getCloneAddressFromParentLocation/' + locationId + '/' +
          companyId, this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(error.error);
    }
    return throwError(() => 'Something bad happened; please try again later.');
  }
}
