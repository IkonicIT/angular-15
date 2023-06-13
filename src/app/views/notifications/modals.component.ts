import { Component, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  templateUrl: 'modals.component.html',
})
export class ModalsComponent {
  public myModal: any;
  public largeModal: any;
  public smallModal: any;
  public primaryModal: any;
  public successModal: any;
  public warningModal: any;
  public dangerModal: any;
  public infoModal: any;
}
