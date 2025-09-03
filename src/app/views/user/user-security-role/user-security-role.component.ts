import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UserManagementService } from '../../../services/user-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { OrderByPipe } from 'ngx-pipes';
import {
  CompanyManagementService,
  LocationManagementService,
} from '../../../services';
import { TreeviewItem } from 'ngx-treeview';
import { BroadcasterService } from '../../../services/broadcaster.service';

@Component({
  selector: 'app-user-security-role',
  templateUrl: './user-security-role.component.html',
  styleUrls: ['./user-security-role.component.scss'],
})
export class UserSecurityRoleComponent implements OnInit {
  userSecurityRole: any = {};
  model: any = {};
  index = 0;
  userId!: string;
  loggedInuser: any;
  profileId!: string;
  userName: any;
  companyId: any;
  company: any[] = [];
  locationId: any;
  roles: any[] = [];
  accessroles: any = {};
  statusroles: any = {};
  companies: any[] = [];
  levels: any[] = [];
  globalCompany: any = {};
  locationItems: TreeviewItem[] = [];
  locations: any[] = [];
  location: any;
  roleId: any;
  currentRole: any;
  highestRank: any;
  isOwnerAdmin: any;
  locationsWithHierarchy: any[] = [];
  helpFlag = false;
  modalRef!: BsModalRef;
  message!: string;
  isOwnerAdminReadOnly: any;
  itemsForPagination = 5;
  order!: string;
  reverse = '';
  isSelected: any;
  p: any;
  dismissible = true;
  roleFilter: any;
  loader = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private userManagementService: UserManagementService,
    private modalService: BsModalService,
    private companyManagementService: CompanyManagementService,
    private orderPipe: OrderByPipe,
    private locationManagementService: LocationManagementService,
    private broadcasterService: BroadcasterService
  ) {
    this.spinner.show();
    this.profileId = this.route.snapshot.params['profileId'];
    this.loggedInuser = sessionStorage.getItem('userId');
    this.userId = this.route.snapshot.params['userId'];
    this.getAllCompanies();
    this.isOwnerAdminReadOnly = sessionStorage.getItem('IsOwnerAdminReadOnly');
    this.getAllRoles();
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    console.log('user profile', this.profileId);
    this.getReportSecurity();
    this.getProfile();
    this.userName = this.broadcasterService.userName;
    this.isOwnerAdmin = sessionStorage.getItem('IsOwnerAdmin');
    this.spinner.hide();
  }

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('userName');
    this.currentRole = sessionStorage.getItem('currentRole');
    this.highestRank = sessionStorage.getItem('highestRank');
    console.log('currentRole is', this.currentRole);
    console.log('highestRank is', this.highestRank);
  }

  getAllCompanies(): void {
    this.isOwnerAdmin = sessionStorage.getItem('IsOwnerAdmin');
    if (this.isOwnerAdmin === 'true') {
      this.companyManagementService.getAllCompaniesForOwnerAdmin().subscribe({
        next: (response) => {
          this.spinner.hide();
          this.companies = response;
        },
        error: () => this.spinner.hide(),
      });
    } else {
      this.companyManagementService
        .getCompanyNames(this.loggedInuser)
        .subscribe({
          next: (response) => {
            this.companies = response;
          },
          error: () => this.spinner.hide(),
        });
    }
  }

  getAllRoles(): void {
    this.companyManagementService.getRolesForUser(this.userId).subscribe({
      next: (response) => {
        this.roles = response;
      },
      error: () => this.spinner.hide(),
    });
  }

  getReportSecurity(): void {
    this.userManagementService
      .getReportSecurityForUser(this.profileId)
      .subscribe({
        next: (response) => {
          this.accessroles = response;
        },
        error: () => this.spinner.hide(),
      });
  }

  onValueChange(): void {
    this.companyId = this.userSecurityRole.companyId;
    this.getLocationNames(this.loggedInuser, this.companyId);
    this.getAllLevels(this.companyId);
  }

  getLocationNames(userId: string, companyId: string | number): void {
    this.isOwnerAdmin = sessionStorage.getItem('IsOwnerAdmin');
    if (this.isOwnerAdmin === 'true') {
      this.spinner.show();
      this.locationManagementService
        .getAllLocationsWithHierarchy(companyId)
        .subscribe({
          next: (response) => {
            this.locationsWithHierarchy = response;
            if (this.locationsWithHierarchy?.length > 0) {
              this.locationItems = this.generateHierarchy(
                this.locationsWithHierarchy
              );
            }
            this.spinner.hide();
          },
        });
    } else {
      this.spinner.show();
      this.locationManagementService
        .getAllLocationsWithHierarchyforUser(companyId, userId)
        .subscribe({
          next: (response) => {
            this.locationsWithHierarchy = response;
            if (this.locationsWithHierarchy?.length > 0) {
              this.locationItems = this.generateHierarchy(
                this.locationsWithHierarchy
              );
            }
            this.spinner.hide();
          },
        });
    }
  }

  generateHierarchy(locList: any[]): TreeviewItem[] {
    const items: TreeviewItem[] = [];
    locList.forEach((loc) => {
      let children: TreeviewItem[] = [];
      if (loc.parentLocationResourceList?.length > 0) {
        children = this.generateHierarchy(loc.parentLocationResourceList);
      }
      items.push(
        new TreeviewItem({
          text: loc.name,
          value: loc.locationId,
          collapsed: true,
          children,
        })
      );
    });
    return items;
  }

  getProfile(): void {
    this.userManagementService.getUserProfile(this.profileId).subscribe({
      next: (response: any) => {
        if (response.isOwnerAdminReadOnly === true) {
          response.isOwnerAdmin = false;
        }
        this.statusroles = response;
      },
      error: () => this.spinner.hide(),
    });
  }

  getAllLevels(companyId: string): void {
    this.spinner.show();
    if (this.isOwnerAdmin === 'true') {
      this.levels = [
        { roleId: 'DBA0906C-D9DE-4C81-9515-967D67D15C8B', roleName: 'Partner Admin' },
        { roleId: '0204551E-1DE2-4991-893C-39EFECB8F0FC', roleName: 'Super Admin' },
        { roleId: '6589ADD2-1179-449E-BA27-3831C07038AE', roleName: 'Admin' },
        { roleId: '8C1149E0-CC63-4DA8-8C89-34C254D04CD9', roleName: 'Super User' },
        { roleId: 'C8427B9D-047C-421A-AC95-F47A35D9EFDA', roleName: 'User' },
        { roleId: '87D5F0C3-FFEF-43B3-9E6F-8A7411305C47', roleName: 'Journalist' },
        { roleId: 'A6A1D829-0AF1-4DBE-9CB4-623685165710', roleName: 'Repair Vendor' },
        { roleId: '48146915-0F7E-429D-ACE2-C7993D6438D3', roleName: 'Read Only' },
        { roleId: '559484BC-CA2A-457F-88A6-64BAA83956E8', roleName: 'Disabled' },
      ];
      this.spinner.hide();
    } else {
      this.userName = sessionStorage.getItem('userName');
      this.companyManagementService
        .getLevelsByUserName(this.userName, companyId)
        .subscribe({
          next: (response) => {
            this.levels = response;
            this.spinner.hide();
          },
          error: () => this.spinner.hide(),
        });
    }
  }

  cancelUser(): void {
    this.router.navigate(['/user/list']);
  }

  updateStatus(profileId: string, companyId: string, statusroles: any): void {
    this.spinner.show();
    if (
      this.statusroles.isOwnerAdmin === true &&
      this.statusroles.isOwnerAdminReadOnly === true
    ) {
      this.isSelected = 0;
      this.spinner.hide();
      return;
    }

    this.isSelected = 1;
    if (this.statusroles.isOwnerAdminReadOnly === true) {
      this.statusroles.isOwnerAdmin = 'true';
    }

    this.userManagementService
      .updateStatus(profileId, companyId, statusroles)
      .subscribe({
        next: () => {
          this.index = 2;
          setTimeout(() => (this.index = 0), 7000);
          this.getProfile();
          this.spinner.hide();
        },
        error: () => this.spinner.hide(),
      });
  }

  updateAccess(profileId: string, accessroles: any): void {
    this.spinner.show();
    this.userManagementService.updateAccess(profileId, accessroles).subscribe({
      next: () => {
        window.scroll(0, 0);
        this.index = 3;
        setTimeout(() => (this.index = 0), 7000);
        this.spinner.hide();
      },
      error: () => this.spinner.hide(),
    });
  }

  addSecurityRole(): void {
    if (
      this.userSecurityRole.roleId &&
      this.userSecurityRole.companyId
    ) {
      const req = {
        userId: this.userId,
        roleId: this.userSecurityRole.roleId,
        lastModifiedBy: this.userName,
<<<<<<< HEAD
        locationId: this.userSecurityRole.locationId ?? 0,
=======
        locationId:
          this.userSecurityRole.locationId != undefined
            ? this.userSecurityRole.locationId
            : 0,
>>>>>>> 73e99df05c6bfebbd0fbd624d8715b0e0601450c
        companyId: this.userSecurityRole.companyId,
      };
      this.spinner.show();
      this.userManagementService.addSecurityRole(req).subscribe(() => {
        window.scroll(0, 0);
        this.index = 1;
        setTimeout(() => (this.index = 0), 7000);
        this.spinner.hide();
        this.getAllRoles();
        this.model = {};
      });
    } else {
      window.scroll(0, 0);
      this.index = -1;
    }
  }

  setOrder(value: string): void {
    if (this.order === value) {
      this.reverse = this.reverse === '' ? '-' : '';
    }
    this.order = value;
  }

  openModal(template: TemplateRef<any>, id: any, id1: any, id2: any): void {
    this.companyId = id;
    this.locationId = id1;
    this.userId = id2;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();
    this.userManagementService
      .removeRole(this.companyId, this.locationId, this.userId, this.userName)
      .subscribe({
        next: () => {
          window.scroll(0, 0);
          this.index = 4;
          setTimeout(() => (this.index = 0), 7000);
          this.spinner.hide();
          this.modalRef.hide();
          this.getAllRoles();
        },
        error: () => this.spinner.hide(),
      });
  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef.hide();
  }

  help(): void {
    this.helpFlag = !this.helpFlag;
  }
}
