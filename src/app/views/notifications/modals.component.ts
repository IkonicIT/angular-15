import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router, NavigationEnd } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  templateUrl: 'modals.component.html',
})

export class ModalsComponent implements OnInit {
  message: string;
  modalRef: BsModalRef;
  constructor(private modalService: BsModalService, private router: Router, private spinner: NgxSpinnerService) { }

  ngOnInit() {
  }
  decline(): void {
    this.message = 'Declined!';
    this.modalService.hide(1);

  }
  confirm(): void {
    this.modalService.hide(1);
  }
}

