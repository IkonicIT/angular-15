import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfiguration } from '../configuration';

@Injectable()
export class PartsService {
  private baseUrl = AppConfiguration.locationRestURL;

  private partsURL = AppConfiguration.cliffsURL;

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

  getPartAttachment(attachmentId: any): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.partsURL}/api/v1/parts/attachment/${attachmentId}`
    );
  }

  geAllPartAttachments(partId: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.partsURL}/api/v1/parts/attachment/getAllPartAttachments/${partId}`
    );
  }

  addPartAttachment(data: any): Observable<any> {
    return this.http.post<any>(
      `${this.partsURL}/api/v1/parts/attachment/createMultipleAttachments`,
      data
    );
  }

  updatePartAttachment(id: number, data: any): Observable<any> {
    return this.http.put<any>(
      `${this.partsURL}/api/v1/parts/attachment/${id}`,
      data
    );
  }

  deletePartAttachment(id: number): Observable<any> {
    return this.http.delete<any>(
      `${this.partsURL}/api/v1/parts/attachment/${id}`
    );
  }

  getAllPartNotes(partId: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.partsURL}/api/v1/parts/notes/getAllPartNotes/${partId}`
    );
  }

  getPartNote(partId: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.partsURL}/api/v1/parts/notes/${partId}`
    );
  }

  addPartNote(data: any): Observable<any> {
    return this.http.post<any>(`${this.partsURL}/api/v1/parts/notes/`, data);
  }

  updatePartNote(id: number, data: any): Observable<any> {
    return this.http.put<any>(
      `${this.partsURL}/api/v1/parts/notes/${id}`,
      data
    );
  }

  deletePartNote(id: number): Observable<any> {
    return this.http.delete<any>(`${this.partsURL}/api/v1/parts/notes/${id}`);
  }
}
