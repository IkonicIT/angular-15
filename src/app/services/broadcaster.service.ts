import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

interface BroadcastEvent {
  key: any;
  data?: any;
}

@Injectable()
export class BroadcasterService {
  private _eventBus: Subject<BroadcastEvent>;
  private _locationBus: Subject<any>;
  public locations: any;
  public location: any;
  public itemTypeHierarchy: any;
  public userTypeHierarchy: any;
  public selectedCompanyId: any;
  public isOwnerAdmin: boolean;
  public currentCompany: any;
  public username: any;
  public itemRank: any;
  public userRoles: any;
  public currentItemTag: any;
  public currentItemType: any;
  public currentNoteAttachmentTitle: any;
  public tracratAnnouncement: any;
  public switchCompanyId: any;
  public itemRepair: any;
  //public currentLocationName:any;
  constructor() {
    this._eventBus = new Subject<BroadcastEvent>();
    this._locationBus = new Subject<any>();
  }
  sendLocations(locations: any) {
    this._locationBus.next({ locationlist: locations });
  }

  getLocations(): Observable<any> {
    return this._locationBus.asObservable();
  }

  public broadcast(key: any, data?: any) {
    this._eventBus.next({ key, data });
  }

  public on<T>(key: any): Observable<T> {
    return this._eventBus.asObservable().pipe(
      filter((event: any) => event.key === key),
      map((event: any) => <T>event.data)
    );
  }
}
