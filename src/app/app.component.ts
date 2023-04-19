import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
// import it to your component
import { UserIdleService } from 'angular-user-idle';
import { Subscription } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

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
    private modalService: BsModalService
  ) {}
  private subscription: Subscription;
  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
    //Start watching for user inactivity.
    this.userIdle.startWatching();

    // Start watching when user idle is starting and reset if user action is there.
    this.userIdle.onTimerStart().subscribe((count) => {
      //console.log(count);
      if (count == 1) {
        //this.modalService.show(ModalComponent, { backdrop: 'static' });
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
    // Start watch when time is up.
    this.userIdle.onTimeout().subscribe(() => {
      this.userId = sessionStorage.getItem('userId');

      // this.userManagementService
      //   .updateLogoutDate(this.userId)
      //   .subscribe((response) => {});

      localStorage.clear();
      sessionStorage.clear();
      this.router.navigate(['/login']);
      console.log('logged out...!');
      this.modalService.hide(1);
    });
  }
}
