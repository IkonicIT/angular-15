import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { UserIdleService } from 'angular-user-idle';
import { Subscription } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { UserManagementService } from './services/user-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalsComponent } from './views/notifications/modals.component';

@Component({
  selector: 'body',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  broadcasterService: any;
  data: 'hello';
  model: BsModalRef;
  userId: any;

  constructor(
    private router: Router,
    private userIdle: UserIdleService,
    private modalService: BsModalService,
    private userManagementService: UserManagementService,
    private spinner: NgxSpinnerService
  ) {}
  private subscription: Subscription;
  
  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
    this.userIdle.startWatching();

    this.userIdle.onTimerStart().subscribe((count) => {
    
      if (count == 1) {
        this.modalService.show(ModalsComponent, { backdrop: 'static' });
      }
      var eventList = [
        'click',
        'keydown',
        'DOMMouseScroll',
        'mousewheel',
        'mousedown',
        'touchstart',
        'touchmove',
        'scroll',
        'keyup',
      ];
      for (let event of eventList) {
        document.body.addEventListener(event, () => this.userIdle.resetTimer());
      }
    });
    this.userIdle.onTimeout().subscribe(() => {
      this.userId = sessionStorage.getItem('userId');

      this.userManagementService
        .updateLogoutDate(this.userId)
        .subscribe((response) => {});

  
      this.modalService.hide(1);
    });
  }
}
