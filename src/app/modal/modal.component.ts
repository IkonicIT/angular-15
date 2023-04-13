import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router, NavigationEnd } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  message: string;
  modalRef: BsModalRef;
  constructor(private modalService: BsModalService,private router: Router,private spinner: NgxSpinnerService) { }

  ngOnInit() {
  }
  decline(): void {
    this.message = 'Declined!';
//this.modalRef.hide();
this.modalService.hide(1);

  }
  confirm(): void {
   

// localStorage.clear();
// sessionStorage.clear();
// this.router.navigate(['/login']);
this.modalService.hide(1);


  }
}
