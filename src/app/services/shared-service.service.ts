import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'

@Injectable()
export class SharedServiceService {
  data: any;
  dataChange: Observable<any>;

  constructor() {}

  setData(data: any) {
    this.data = data;
  }
}
