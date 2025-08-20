import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfiguration } from '../configuration';

@Injectable()
export class CranesService {
  private apiUrl = AppConfiguration.locationRestURL;

  private cranesURL = AppConfiguration.cliffsURL;

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

  getCraneNoteAttachment(attachmentId: any): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.cranesURL}/api/v1/crane/attachment/${attachmentId}`
    );
  }

  geAllCraneNoteAttachments(partId: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.cranesURL}/api/v1/crane/attachment/getAllCraneNoteAttachments/${partId}`
    );
  }

  addCraneNoteAttachment(data: any): Observable<any> {
    return this.http.post<any>(
      `${this.cranesURL}/api/v1/crane/attachment/createMultipleAttachments`,
      data
    );
  }

  updateCraneNoteAttachment(id: number, data: any): Observable<any> {
    return this.http.put<any>(
      `${this.cranesURL}/api/v1/crane/attachment/${id}`,
      data
    );
  }

  deleteCraneNoteAttachment(id: number): Observable<any> {
    return this.http.delete<any>(
      `${this.cranesURL}/api/v1/crane/attachment/${id}`
    );
  }

  getAllCraneNotes(partId: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.cranesURL}/api/v1/crane/notes/getAllCraneNotes/${partId}`
    );
  }

  getCraneNote(partId: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.cranesURL}/api/v1/crane/notes/${partId}`
    );
  }

  addCraneNote(data: any): Observable<any> {
    return this.http.post<any>(`${this.cranesURL}/api/v1/crane/notes/`, data);
  }

  updateCraneNote(id: number, data: any): Observable<any> {
    return this.http.put<any>(
      `${this.cranesURL}/api/v1/crane/notes/${id}`,
      data
    );
  }

  deleteCraneNote(id: number): Observable<any> {
    return this.http.delete<any>(`${this.cranesURL}/api/v1/crane/notes/${id}`);
  }
}
