import { Component, OnInit, HostListener} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { isUndefined } from 'is-what';
import { BroadcasterService } from '../../services/broadcaster.service';
import { UserManagementService } from '../../services/user-management.service'; 


@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['app-header.component.css'],
})
export class AppHeaderComponent implements OnInit {
  public currentRole: any;
  public highestRank: any;
  public userName: any = [];
  public roles: string = '';
  isDropdownOpen: boolean = false;
  userRoles: any = [];
  userId: any;
  data: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private broadcasterService: BroadcasterService,
    private userManagementService: UserManagementService,
  ) {
    this.getUserData();
  }

  ngOnInit() {
    this.broadcasterService.on('refreshNavBar').subscribe((data) => {
      this.getUserData();
    });
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

  toggleDropdown(event: Event) {
    event.preventDefault();
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    if (!(event.target as HTMLElement).closest('#simple-dropdown')) {
      this.isDropdownOpen = false;
    }
  }
}
