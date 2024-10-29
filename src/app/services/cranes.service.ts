import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfiguration } from '../configuration';

@Injectable()
export class CranesService {
  private apiUrl = AppConfiguration.locationRestURL;

  constructor(private http: HttpClient) {}

  getCranesData(key: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}cliffs/cranes/${key}`);
  }

  getCranesByBMDRNK(key: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}cliffs/cranes/view/${key}`);
  }

  getCranesInfoData(key: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}cliffs/cranes/info/${key}`);
  }

  updateCraneData(key: string, data: any): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}cliffs/cranes/update/${key}`,
      data
    );
  }
}
