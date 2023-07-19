import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { isUndefined } from 'is-what';
import { BroadcasterService } from '../../services/broadcaster.service';
import { UserManagementService } from '../../services/user-management.service';
// import { ElementRef, Renderer2 } from '@angular/core';
// import * as $ from 'jquery';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
})
export class AppHeaderComponent implements OnInit {
  public currentRole: any;
  public highestRank: any;
  public userName: any = [];
  public roles: string = '';
  userRoles: any = [];
  userId: any;
  data: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private broadcasterService: BroadcasterService,
    private userManagementService: UserManagementService,
    // private elementRef: ElementRef,
    // private renderer: Renderer2
  ) {
    this.getUserData();
  }

  ngOnInit() {
    this.broadcasterService.on('refreshNavBar').subscribe((data) => {
      this.getUserData();
    });

    // this.elementRef.nativeElement
    //   .querySelector('#simple-dropdown')
    //   .addEventListener('click', this.toggleDropdown.bind(this));
  }

  getUserData() {
    this.userRoles = this.broadcasterService.userRoles;
    this.setUserRoles();
    this.currentRole = sessionStorage.getItem('currentRole');
    this.highestRank = sessionStorage.getItem('highestRank');
    this.highestRank = sessionStorage.getItem('highestRank');
    if (isUndefined(this.currentRole)) {
      this.currentRole = 'Disabled';
    }
    this.userName = sessionStorage.getItem('userName');
  }

  setUserRoles() {
    this.roles = '';
    if (this.userRoles != undefined && this.userRoles.length > 0) {
      if (this.userRoles.length == 1) {
        this.roles = this.userRoles[0].roleName;
      } else {
        let len = this.userRoles.length - 1;
        let count = 0;
        this.userRoles.forEach((element: { roleName: string }) => {
          if (count != len) {
            this.roles = this.roles + element.roleName + ',';
            count++;
          } else {
            this.roles = this.roles + element.roleName;
          }
        });
      }
    }
  }

  logout() {
    this.broadcasterService.selectedCompanyId = 0;
    this.broadcasterService.locations = [];
    this.broadcasterService.userRoles = [];
    this.userId = sessionStorage.getItem('userId');

    this.userManagementService
      .updateLogoutDate(this.userId)
      .subscribe((response: any) => {});

    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  /* toggleDropdown() {
    //alert('1');
    let dropdownMenu =
      this.elementRef.nativeElement.querySelector('.dropdown-menu');
    if (dropdownMenu.classList.contains('show')) {
      this.renderer.removeClass(dropdownMenu, 'show');
      this.renderer.removeClass(dropdownMenu, 'd-block');
    } else {
      this.renderer.addClass(dropdownMenu, 'show');
      this.renderer.addClass(dropdownMenu, 'd-block');
    }
  } */
}
