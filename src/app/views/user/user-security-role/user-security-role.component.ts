import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UserManagementService } from '../../../services/user-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { OrderByPipe } from 'ngx-pipes';
import {
  CompanyManagementService,
  LocationManagementService,
} from '../../../services/index';
import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';
import { BroadcasterService } from '../../../services/broadcaster.service';

@Component({
  selector: 'app-user-security-role',
  templateUrl: './user-security-role.component.html',
  styleUrls: ['./user-security-role.component.scss'],
})
export class UserSecurityRoleComponent implements OnInit {
  userSecurityRole: any = {};
  model: any = {};
  index: number = 0;
  router: Router;
  userId: any;
  loggedInuser: any;
  profileId: any;
  userName: any;
  companyId: any;
  company: any = [];
  locationId: any;
  roles: any = [];
  accessroles: any = {};
  statusroles: any = {};
  companies: any = [];
  levels: any = [];
  globalCompany: any = {};
  locationItems: TreeviewItem[];
  locations: any = [];
  location: any;
  roleId: any;
  currentRole: any;
  highestRank: any;
  isOwnerAdmin: any;
  locationsWithHierarchy: any;
  username: any;
  helpFlag: any = false;
  modalRef: BsModalRef;
  message: string;
  isOwnerAdminReadOnly: string;
  itemsForPagination: any = 5;
  order: string;
  reverse: string = '';
  isSelected: any;
  p: any;
  dismissible = true;
  roleFilter: any;
  loader = false;
  constructor(
    router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private userManagementService: UserManagementService,
    private modalService: BsModalService,
    private companyManagementService: CompanyManagementService,
    private orderPipe: OrderByPipe,
    private locationManagementService: LocationManagementService,
    private broadcasterService: BroadcasterService
  ) {
    this.router = router;
    this.spinner.show();

    this.profileId = route.snapshot.params['profileId'];
    this.loggedInuser = sessionStorage.getItem('userId');
    this.userId = route.snapshot.params['userId'];
    this.getAllCompanies();
    this.isOwnerAdminReadOnly ?? sessionStorage.getItem('IsOwnerAdminReadOnly');
    this.getAllRoles();
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    console.log('user profile' + this.profileId);
    this.getReportSecurity();
    this.getProfile();
    this.username = this.broadcasterService.username;
    this.isOwnerAdmin = sessionStorage.getItem('IsOwnerAdmin');
    this.spinner.hide();
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName');
    this.currentRole = sessionStorage.getItem('currentRole');
    this.highestRank = sessionStorage.getItem('highestRank');
    console.log('currentRole is' + this.currentRole);
    console.log('highestRank is' + this.highestRank);
  }

  getAllCompanies() {
    this.isOwnerAdmin = sessionStorage.getItem('IsOwnerAdmin');
    if (this.isOwnerAdmin == 'true') {
      this.companyManagementService.getAllCompaniesForOwnerAdmin().subscribe(
        (response) => {
          this.spinner.hide();

          console.log(response);
          this.companies = response;
        },
        (error) => {
          this.spinner.hide();
        }
      );
      console.log('all  companies for owner Admin' + this.companies);
    } else {
      this.companyManagementService
        .getCompanyNames(this.loggedInuser)
        .subscribe(
          (response) => {
            this.companies = response;
            console.log('user companies' + this.companies);
          },
          (error) => {
            this.spinner.hide();
          }
        );
    }
  }
  getAllRoles() {
    this.companyManagementService.getRolesForUser(this.userId).subscribe(
      (response) => {
        this.roles = response;
        console.log('user companies roles ' + this.roles);
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
  getReportSecurity() {
    this.userManagementService
      .getReportSecurityForUser(this.profileId)
      .subscribe(
        (response) => {
          this.accessroles = response;
          console.log('user accessroles ' + this.accessroles);
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }

  onValueChange() {
    this.companyId = this.userSecurityRole.companyid;
    this.getLocationNames(this.loggedInuser, this.companyId);
    this.getAllLevels(this.companyId);
  }

  getLocationNames(userId: string, companyId: string | number) {
    this.isOwnerAdmin = sessionStorage.getItem('IsOwnerAdmin');
    if (this.isOwnerAdmin == 'true') {
      this.spinner.show();

      this.locationManagementService
        .getAllLocationsWithHierarchy(companyId)
        .subscribe((response) => {
          this.locationsWithHierarchy = response;
          if (
            this.locationsWithHierarchy &&
            this.locationsWithHierarchy.length > 0
          ) {
            this.locationItems = [];
            this.locationItems = this.generateHierarchy(
              this.locationsWithHierarchy
            );
          }
          this.spinner.hide();
        });
    } else {
      this.spinner.show();

      this.locationManagementService
        .getAllLocationsWithHierarchyforUser(companyId, userId)
        .subscribe((response) => {
          this.locationsWithHierarchy = response;
          if (
            this.locationsWithHierarchy &&
            this.locationsWithHierarchy.length > 0
          ) {
            this.locationItems = [];
            this.locationItems = this.generateHierarchy(
              this.locationsWithHierarchy
            );
          }
          this.spinner.hide();
        });
    }
  }

  generateHierarchy(locList: any[]) {
    var items: TreeviewItem[] = [];
    locList.forEach((loc) => {
      var children: TreeviewItem[] = [];
      if (
        loc.parentLocationResourceList &&
        loc.parentLocationResourceList.length > 0
      ) {
        children = this.generateHierarchy(loc.parentLocationResourceList);
      }
      items.push(
        new TreeviewItem({
          text: loc.name,
          value: loc.locationid,
          collapsed: true,
          children: children,
        })
      );
    });
    return items;
  }

  getProfile() {
    this.userManagementService.getUserProfile(this.profileId).subscribe(
      (response: any) => {
        if (response.isOwnerAdminReadOnly === true) {
          response.isowneradmin = false;
          this.statusroles = response;
        } else {
          this.statusroles = response;
        }

        console.log('user status roles ' + this.statusroles);
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  getAllLevels(companyId: string) {
    this.spinner.show();

    if (this.isOwnerAdmin == 'true') {
      this.levels = [
        {
          roleId: 'DBA0906C-D9DE-4C81-9515-967D67D15C8B',
          roleName: 'Partner Admin',
        },
        {
          roleId: '0204551E-1DE2-4991-893C-39EFECB8F0FC',
          roleName: 'Super Admin',
        },
        { roleId: '6589ADD2-1179-449E-BA27-3831C07038AE', roleName: 'Admin' },
        {
          roleId: '8C1149E0-CC63-4DA8-8C89-34C254D04CD9',
          roleName: 'Super User',
        },
        { roleId: 'C8427B9D-047C-421A-AC95-F47A35D9EFDA', roleName: 'User' },
        {
          roleId: '87D5F0C3-FFEF-43B3-9E6F-8A7411305C47',
          roleName: 'Journalist',
        },
        {
          roleId: 'A6A1D829-0AF1-4DBE-9CB4-623685165710',
          roleName: 'Repair Vendor',
        },
        {
          roleId: '48146915-0F7E-429D-ACE2-C7993D6438D3',
          roleName: 'Read Only',
        },
        {
          roleId: '559484BC-CA2A-457F-88A6-64BAA83956E8',
          roleName: 'Disabled',
        },
      ];
    } else {
      this.userName = sessionStorage.getItem('userName');

      this.companyManagementService
        .getLevelsByUserName(this.userName, companyId)
        .subscribe(
          (response) => {
            this.levels = response;
            this.spinner.hide();

            console.log('user levels are' + this.levels);
          },
          (error) => {
            this.spinner.hide();
          }
        );
    }
  }

  cancelUser() {
    this.router.navigate(['/user/list']);
  }

  updateStatus(profileId: string, companyid: string, statusroles: any) {
    this.spinner.show();

    if (
      this.statusroles.isowneradmin == true &&
      this.statusroles.isOwnerAdminReadOnly == true
    ) {
      this.isSelected = 0;
      this.spinner.hide();
    } else if (this.statusroles.isOwnerAdminReadOnly == true) {
      this.isSelected = 1;
      this.statusroles.isowneradmin = 'true';
      this.spinner.show();

      this.userManagementService
        .updateStatus(profileId, companyid, statusroles)
        .subscribe(
          (response) => {
            this.index = 2;
            setTimeout(() => {
              this.index = 0;
            }, 7000);
            this.getProfile();
            this.spinner.hide();

            console.log('user status roles updated' + response);
          },
          (error) => {
            this.spinner.hide();
          }
        );
    } else {
      this.isSelected = 1;
      this.spinner.show();

      this.userManagementService
        .updateStatus(profileId, companyid, statusroles)
        .subscribe(
          (response) => {
            this.index = 2;
            setTimeout(() => {
              this.index = 0;
            }, 7000);
            this.getProfile();
            this.spinner.hide();

            console.log('user status roles updated' + response);
          },
          (error) => {
            this.spinner.hide();
          }
        );
    }
  }

  updateAccess(profileId: string, accessroles: any) {
    this.spinner.show();

    this.userManagementService.updateAccess(profileId, accessroles).subscribe(
      (response) => {
        window.scroll(0, 0);
        this.index = 3;
        setTimeout(() => {
          this.index = 0;
        }, 7000);
        this.spinner.hide();

        console.log('user accessroles updated' + response);
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  addSecurityRole() {
    if (
      this.userSecurityRole.roleid &&
      this.userSecurityRole.roleid != undefined &&
      this.userSecurityRole.companyid &&
      this.userSecurityRole.companyid != undefined
    ) {
      var req = {
        userid: this.userId,
        roleid: this.userSecurityRole.roleid,
        lastmodifiedby: this.userName,
        locationid:
          this.userSecurityRole.locationid != undefined
            ? this.userSecurityRole.locationid
            : 0,
        companyid: this.userSecurityRole.companyid,
      };
      this.spinner.show();

      this.userManagementService.addSecurityRole(req).subscribe((response) => {
        window.scroll(0, 0);
        this.index = 1;
        setTimeout(() => {
          this.index = 0;
        }, 7000);
        this.spinner.hide();

        this.getAllRoles();
        this.model = {};
      });
    } else {
      window.scroll(0, 0);
      this.index = -1;
    }
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

  openModal(template: TemplateRef<any>, id: any, id1: any, id2: any) {
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
      .subscribe(
        (response) => {
          window.scroll(0, 0);
          this.index = 4;
          setTimeout(() => {
            this.index = 0;
          }, 7000);

          this.spinner.hide();

          this.modalRef.hide();

          console.log('user deleted');
          this.getAllRoles();
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef.hide();
  }

  help() {
    this.helpFlag = !this.helpFlag;
  }
}