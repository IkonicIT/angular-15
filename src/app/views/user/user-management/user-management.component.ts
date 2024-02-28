import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UserManagementService } from '../../../services/user-management.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BroadcasterService } from '../../../services/broadcaster.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {
  users: any = [];
  index: any;
  model: any;
  router: Router;
  message: string;
  modalRef: BsModalRef;
  order: string = 'firstname';
  reverse: string = '';
  userFilter: any = '';
  itemsForPagination: any = 5;
  companyId: any = 0;
  globalCompany: any;
  profileId: any;
  currentRole: any;
  highestRank: any;
  isOwnerAdmin: any;
  helpFlag: any = false;
  p: any;
  userName: any;
  globalUser: any;
  loader = false;
  constructor(
    private modalService: BsModalService,
    router: Router,
    route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private userManagementService: UserManagementService,
    private broadcasterService: BroadcasterService,
    private companyManagementService: CompanyManagementService
  ) {
    this.router = router;
  }

  ngOnInit() {
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany) {
      this.companyId = this.globalCompany.companyid;
      this.getUsers();
    }
    this.globalUser = sessionStorage.getItem('userName');
    this.currentRole = sessionStorage.getItem('currentRole');
    this.highestRank = sessionStorage.getItem('highestRank');
  }

  getUsers() {
    this.isOwnerAdmin = sessionStorage.getItem('IsOwnerAdmin');
    if (this.isOwnerAdmin == 'true') {
      this.spinner.show();
      this.loader = true;
      this.userManagementService
        .getAllUsersAsOwnerAdmin(this.companyId)
        .subscribe((response) => {
          console.log(response);
          this.users = response;
          this.spinner.hide();
          this.loader = false;
        });
    } else {
      this.spinner.show();
      this.loader = true;
      this.userManagementService
        .getAllUsers(this.companyId)
        .subscribe((response) => {
          console.log(response);
          this.users = response;
          this.spinner.hide();
          this.loader = false;
        });
    }
  }

  addUser() {
    this.router.navigate(['/user/addUser/']);
  }

  getSecurityRoles(user: {
    firstname: string;
    lastname: string;
    userid: string;
    profileid: string;
  }) {
    this.broadcasterService.username = user.firstname + ' ' + user.lastname;
    this.router.navigate([
      '/user/securityRoles/' + user.userid + '/' + user.profileid,
    ]);
  }

  editUser(user: {
    firstname: string;
    lastname: string;
    userid: string;
    profileid: string;
  }) {
    this.broadcasterService.username = user.firstname + ' ' + user.lastname;
    this.router.navigate([
      '/user/editUser/' + user.userid + '/' + user.profileid,
    ]);
  }

  viewUser(user: any) {
    this.broadcasterService.username = user.firstname + ' ' + user.lastname;
    this.router.navigate([
      '/user/viewUser/' + user.userid + '/' + user.profileid,
    ]);
  }

  openModal(
    template: TemplateRef<any>,
    user: { userid: any; profileid: any; username: any }
  ) {
    this.index = user.userid;
    this.profileId = user.profileid;
    this.userName = user.username;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();
    this.loader = true;
    this.userManagementService
      .removeUser(
        this.index,
        this.profileId,
        this.companyId,
        this.userName,
        this.globalUser
      )
      .subscribe((response) => {
        this.modalRef.hide();
        this.getUsers();
        const currentPage = this.p;
    const userCount = this.users.length-1;
    const maxPageAvailable = Math.ceil(userCount / this.itemsForPagination);
    if (currentPage > maxPageAvailable){
      this.p = maxPageAvailable;
    }
      });
  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef.hide();
  }

  setOrder(value: string) {
    if (this.order === value) {
      if (this.reverse == '') {
        this.reverse = '-';
      } else {
        this.reverse = '';
      }
    }
    this.order = value;
  }

  print() {
    this.helpFlag = false;
    window.print();
  }

  help() {
    this.helpFlag = !this.helpFlag;
  }

  onChange(e:any){
    const currentPage = this.p;
    const userCount = this.users.length;
    const maxPageAvailable = Math.ceil(userCount / this.itemsForPagination);
    if (currentPage > maxPageAvailable){
      this.p = maxPageAvailable;
    }
  }
}
