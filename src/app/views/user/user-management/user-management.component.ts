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
  users: any[] = [];
  index: any;
  model: any;
  message: string = '';
  modalRef: BsModalRef | null = null;
  order: string = 'firstname';
  reverse: string = '';
  userFilter: string = '';
  itemsForPagination: number = 5;
  companyId: number = 0;
  globalCompany: any;
  profileId: any;
  currentRole: any;
  highestRank: any;
  isOwnerAdmin: any;
  helpFlag: boolean = false;
  p: number = 1;
  userName: any;
  globalUser: any;
  loader = false;

  constructor(
    private readonly modalService: BsModalService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly spinner: NgxSpinnerService,
    private readonly userManagementService: UserManagementService,
    private readonly broadcasterService: BroadcasterService,
    private readonly companyManagementService: CompanyManagementService
  ) {}

  ngOnInit(): void {
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany) {
      this.companyId = this.globalCompany.companyId;
      this.getUsers();
    }
    this.globalUser = sessionStorage.getItem('userName');
    this.currentRole = sessionStorage.getItem('currentRole');
    this.highestRank = sessionStorage.getItem('highestRank');
  }

  getUsers(): void {
    this.isOwnerAdmin = sessionStorage.getItem('IsOwnerAdmin');
    this.spinner.show();

    const users$ = this.isOwnerAdmin === 'true'
      ? this.userManagementService.getAllUsersAsOwnerAdmin(this.companyId)
      : this.userManagementService.getAllUsers(this.companyId);

    users$.subscribe({
      next: (response) => {
        this.users = response;
        this.spinner.hide();
      },
      error: () => {
        this.spinner.hide();
      }
    });
  }

  addUser(): void {
    this.router.navigate(['/user/addUser/']);
  }

  getSecurityRoles(user: { firstname: string; lastname: string; userId: string; profileId: string }): void {
    this.broadcasterService.userName = `${user.firstname} ${user.lastname}`;
    this.router.navigate([`/user/securityRoles/${user.userId}/${user.profileId}`]);
  }

  editUser(user: { firstName: string; lastName: string; userId: string; profileId: string }): void {
    this.broadcasterService.userName = `${user.firstName} ${user.lastName}`;
    this.router.navigate([`/user/editUser/${user.userId}/${user.profileId}`]);
  }

  viewUser(user: any): void {
    this.broadcasterService.userName = `${user.firstName} ${user.lastName}`;
    this.router.navigate([`/user/viewUser/${user.userId}/${user.profileId}`]);
  }

  openModal(template: TemplateRef<any>, user: { userId: any; profileId: any; userName: any }): void {
    this.index = user.userId;
    this.profileId = user.profileId;
    this.userName = user.userName;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();

    this.userManagementService
      .removeUser(this.index, this.profileId, this.companyId, this.userName, this.globalUser)
      .subscribe(() => {
        this.modalRef?.hide();
        this.getUsers();
      });
  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef?.hide();
  }

  setOrder(value: string): void {
    this.reverse = this.order === value && this.reverse === '' ? '-' : '';
    this.order = value;
  }

  print(): void {
    this.helpFlag = false;
    window.print();
  }

  help(): void {
    this.helpFlag = !this.helpFlag;
  }

  onChange(e: any): void {
    const totalCount = this.users.length;
    const maxPageAvailable = Math.ceil(totalCount / this.itemsForPagination);
    if (this.p > maxPageAvailable) {
      this.p = maxPageAvailable;
    }
  }
}
