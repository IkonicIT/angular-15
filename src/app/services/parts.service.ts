import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfiguration } from '../configuration';

@Injectable()
export class PartsService {
  private baseUrl = AppConfiguration.locationRestURL;

  constructor(private http: HttpClient) {}

  getParts(frame: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}cliffs/motorparts/${frame}`);
  }

  getPartDetails(mpvp: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}cliffs/parts/${mpvp}`);
  }

  getPartData(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}cliffs/view/part/${id}`);
  }

  updatePart(id: number, partData: any): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}cliffs/update/part/${id}`,
      partData
    );
  }
}
