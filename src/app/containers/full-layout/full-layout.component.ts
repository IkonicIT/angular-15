import { Component, OnInit } from '@angular/core';
import { CompanyManagementService } from '../../services/company-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { OrderByPipe } from 'ngx-pipes';
import { LocationManagementService } from '../../services/location-management.service';
import { ItemManagementService } from '../../services/Items/item-management.service';
import { Router } from '@angular/router';
import { ItemTypesService } from '../../services/Items/item-types.service';
import { LoginService } from '../../services/login.service';
import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';
import { BroadcasterService } from '../../services/broadcaster.service';
import { ReportsService } from '../../services/reports.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  templateUrl: './full-layout.component.html',
  styleUrls: ['./full-layout.component.css'],
})
export class FullLayoutComponent implements OnInit {
  noLogo: boolean;
  imageSource: any;
  selectedCompany: any = {};
  userSelectedCompany: any = {};
  globalCompanies: any = [];
  userCompanies: any = [];
  itemTag: any = null;
  tag: any = '';
  itemTypes: any = [];
  selectedType: any = null;
  suggessions: any[] = [];
  value: any;
  items: TreeviewItem[];
  config = TreeviewConfig.create({
    hasFilter: false,
    hasCollapseExpand: false,
  });
  authToken: any;
  userSecurityRoles: any = [];
  rolesListForLoggedInUser: any = [];
  isOwnerAdmin: any;
  masterSearch: any;
  userName: any;
  currentRole: any;
  highestRank: any;
  loggedInuser: any;
  userId: any;
  ngxconfig = {
    displayKey: 'name',
    searchOnKey: 'name',
    search: true,
    height: '500px',
    placeholder: 'Select Company',
    customComparator: this.orderData,
    limitTo: 0,
    moreText: 'more',
    noResultsFound: 'No results found!',
    searchPlaceholder: 'Search',
    clearOnSelection: true,
    inputDirection: 'ltr',
    selectAllLabel: 'Select all',
    enableSelectAll: false,
  };
  userSelectedCompany1: any;
  helpFlag: any = false;
  companyList: any;
  companyId: any;
  masterSearchFlag: any = 'false';
  isOwnerAminReadOnly: any;

  public constructor(
    private companyManagementService: CompanyManagementService,
    private spinner: NgxSpinnerService,
    private itemTypesService: ItemTypesService,
    private broadcasterService: BroadcasterService,
    private orderPipe: OrderByPipe,
    private locationManagementService: LocationManagementService,
    private itemManagementService: ItemManagementService,
    private router: Router,
    private loginService: LoginService,
    private reportsService: ReportsService,
    private sanitizer: DomSanitizer
  ) {
    this.spinner.show();
    this.companyManagementService.companyListChange.subscribe((value) => {
      this.broadcasterService.selectedCompanyId = 0;
      this.router.navigate(['']);
    });
    this.companyManagementService.switchCompanyChange.subscribe((value) => {
      this.companyList = this.companyManagementService.getGlobalCompanyList();
      this.companyId = this.broadcasterService.switchCompanyId;
      this.companyList.forEach((company: { companyid: any }) => {
        if (company.companyid == this.companyId) {
          this.userSelectedCompany = company;
        }
      });
    });
    this.isOwnerAminReadOnly = sessionStorage.getItem('IsOwnerAdminReadOnly');
    this.getUserAccessCompanies();
  }

  orderData(a: any, b: any): number {
    if (a.name >= b.name) {
      return 1;
    } else if (a.name < b.name) {
      return -1;
    } else {
      return 0;
    }
  }

  ngOnInit() {
    this.items = [new TreeviewItem({ text: 'All', value: 'All' })];
    this.isOwnerAdmin = sessionStorage.getItem('IsOwnerAdmin');
    this.isOwnerAminReadOnly = sessionStorage.getItem('IsOwnerAdminReadOnly');
    this.spinner.show();
    this.authToken = sessionStorage.getItem('auth_token');
  }

  getSuggessions(tag: string) {
    this.itemManagementService
      .getItemSuggessions(tag, this.broadcasterService.selectedCompanyId)
      .subscribe((response: any) => {
        this.suggessions = response;
      });
  }

  getUserAccessCompanies() {
    this.isOwnerAdmin = sessionStorage.getItem('IsOwnerAdmin');
    if (this.isOwnerAdmin == 'true' || this.isOwnerAminReadOnly == 'true') {
      this.companyManagementService.getAllCompanyDetails().subscribe(
        (response) => {
          this.userCompanies = this.orderPipe.transform(response, 'name');

          if (
            !this.userSelectedCompany.name ||
            this.userSelectedCompany.name == undefined
          ) {
            this.userSelectedCompany = { name: 'Select Company', companyid: 0 };
          }
          this.companyManagementService.setGlobalCompanyList(
            this.userCompanies
          );
          this.selectRootCompanyForAdmin(this.userSelectedCompany);
          this.companyManagementService.setGlobalCompany(
            this.userSelectedCompany
          );
          this.spinner.hide();
        },
        (error) => {
          this.spinner.hide();
        }
      );
    } else {
      this.spinner.show();
      this.loggedInuser = sessionStorage.getItem('userId');
      if (this.loggedInuser == null) {
        this.router.navigate(['/login']);
        return;
      }
      console.log('logged in user is' + this.loggedInuser);
      // this.loggedInuser= '99B27614-A682-4BA3-B9CE-7E52CFA659D7';  if user id null uncomment
      this.companyManagementService
        .getCompanyNames(this.loggedInuser)
        .subscribe(
          (response) => {
            this.userCompanies = this.orderPipe.transform(response, 'name');
            if (this.userCompanies.length == 1) {
              this.userSelectedCompany1 = this.userCompanies[0].name;
              this.selectRootCompany(this.userCompanies[0]);
              this.companyManagementService.setGlobalCompany(
                this.userCompanies[0]
              );
            } else {
              if (!this.userSelectedCompany.name) {
                this.userSelectedCompany = {
                  name: 'Select Company',
                  companyid: 0,
                };
              }
              this.selectRootCompany(this.userSelectedCompany);
              this.companyManagementService.setGlobalCompany(
                this.userSelectedCompany
              );
            }
            // this.userCompanies.unshift({"companyid":0,"name":"SELECT COMPANY","filePath":null})

            this.companyManagementService.setGlobalCompanyList(
              this.userCompanies
            );

            this.spinner.hide();
          },
          (error) => {
            this.spinner.hide();
          }
        );
      this.companyManagementService.setGlobalCompany(this.userCompanies[0]);
    }
  }

  selectRootCompanyForAdmin(userSelectedCompany: any) {
    this.itemManagementService.setSearchedItemTag('');
    this.itemManagementService.setSearchedItemTypeId(0);
    this.itemManagementService.setItemSearchResults([]);
    this.itemManagementService.setAdvancedItemSearchResults([]);
    this.itemManagementService.setAdvancedItemSearchRepaiNotesSearchresults({});
    this.reportsService.setInserviceVsSpareReport({});
    this.reportsService.setserviceReport([]);
    this.itemManagementService.setCompletedRepairs([]);
    this.itemManagementService.setInCompletedRepairs([]);
    this.itemManagementService.itemModel = {};
    this.itemManagementService.itemrepairnotesrfqModel = {};
    this.broadcasterService.locations = [];
    if (userSelectedCompany.companyid == 0) {
      this.masterSearchFlag = 'true';
      sessionStorage.removeItem('currentRole');
      sessionStorage.removeItem('highestRank');
      this.broadcasterService.currentCompany = 'selectcompany';
      this.userSelectedCompany = { name: 'Select Company', companyid: 0 };
      this.broadcasterService.selectedCompanyId = userSelectedCompany.companyid;
      this.broadcasterService.broadcast('refreshNavBar', true);
      this.broadcasterService.broadcast(
        'piechart',
        userSelectedCompany.companyid
      );
      this.router.navigate(['/dashboard']);
    } else if (this.isOwnerAminReadOnly == 'true') {
      this.getCompanyLogo(userSelectedCompany.companyid);
      this.masterSearchFlag = 'false';
      this.broadcasterService.currentCompany = 'nonselectcompany';
      this.broadcasterService.locations = [];
      this.itemTag = null;
      this.userSelectedCompany = userSelectedCompany;
      this.authToken = sessionStorage.getItem('auth_token');
      this.userName = sessionStorage.getItem('userName');
      this.locationManagementService.setLocations([]);
      this.spinner.show();
      this.companyManagementService.setGlobalCompany(userSelectedCompany);
      this.broadcasterService.selectedCompanyId = userSelectedCompany.companyid;
      this.itemTypesService
        .getAllItemTypesWithHierarchy(userSelectedCompany.companyid)
        .subscribe((response) => {
          this.broadcasterService.itemTypeHierarchy = response;
          this.currentRole = 'OwnerAdminReadOnly';
          this.highestRank = 9;
          this.broadcasterService.userRoles = [
            { roleName: 'OwnerAdminReadOnly' },
          ];
          sessionStorage.setItem('currentRole', this.currentRole);
          sessionStorage.setItem('highestRank', this.highestRank);

          console.log('currentRole is' + this.currentRole);
          console.log('highestRank is' + this.highestRank);
          this.broadcasterService.broadcast(
            'piechart',
            userSelectedCompany.companyid
          );
          this.broadcasterService.broadcast('refreshNavBar', true);

          this.itemTypes = response;
          if (this.itemTypes && this.itemTypes.length > 0) {
            this.items = this.generateHierarchy(this.itemTypes);
          }
          this.itemManagementService.setItemTypes(response);
          this.spinner.hide();
          this.router.navigate(['/dashboard']);
        });
    } else {
      this.getCompanyLogo(userSelectedCompany.companyid);
      this.masterSearchFlag = 'false';
      this.broadcasterService.currentCompany = 'nonselectcompany';
      this.broadcasterService.locations = [];
      this.itemTag = null;
      this.userSelectedCompany = userSelectedCompany;
      this.authToken = sessionStorage.getItem('auth_token');
      this.userName = sessionStorage.getItem('userName');
      this.locationManagementService.setLocations([]);
      this.spinner.show();
      this.companyManagementService.setGlobalCompany(userSelectedCompany);
      this.broadcasterService.selectedCompanyId = userSelectedCompany.companyid;
      this.itemTypesService
        .getAllItemTypesWithHierarchy(userSelectedCompany.companyid)
        .subscribe((response) => {
          this.broadcasterService.itemTypeHierarchy = response;
          this.highestRank = 0;
          this.currentRole = '';
          this.currentRole = 'ownerAdmin';
          this.highestRank = 8;
          this.broadcasterService.userRoles = [{ roleName: 'ownerAdmin' }];
          sessionStorage.setItem('currentRole', this.currentRole);
          sessionStorage.setItem('highestRank', this.highestRank);

          console.log('currentRole is' + this.currentRole);
          console.log('highestRank is' + this.highestRank);
          this.broadcasterService.broadcast(
            'piechart',
            userSelectedCompany.companyid
          );
          this.broadcasterService.broadcast('refreshNavBar', true);

          this.itemTypes = response;
          if (this.itemTypes && this.itemTypes.length > 0) {
            this.items = this.generateHierarchy(this.itemTypes);
          }
          this.itemManagementService.setItemTypes(response);
          this.spinner.hide();
          this.router.navigate(['/dashboard']);
        });
    }
  }

  getCompanyLogo(companyid: any) {
    this.noLogo = false;
    this.spinner.show();
    this.companyManagementService.getLogo(companyid).subscribe(
      (response: any) => {
        if (response.logo != null)
          this.imageSource = this.sanitizer.bypassSecurityTrustResourceUrl(
            `data:image/png;base64, ${response.logo}`
          );
        else this.noLogo = true;
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  selectRootCompany(userSelectedCompany: any) {
    let userSelectedCompany1 = userSelectedCompany.value;
    this.itemManagementService.setSearchedItemTag('');
    this.itemManagementService.setSearchedItemTypeId(0);
    this.itemManagementService.setItemSearchResults([]);
    this.itemManagementService.setAdvancedItemSearchRepaiNotesSearchresults({});
    this.reportsService.setInserviceVsSpareReport({});
    this.reportsService.setserviceReport([]);
    this.itemManagementService.setAdvancedItemSearchResults([]);
    this.itemManagementService.itemModel = {};
    this.itemManagementService.itemrepairnotesrfqModel = {};
    this.itemManagementService.setCompletedRepairs([]);
    this.itemManagementService.setInCompletedRepairs([]);
    this.broadcasterService.locations = [];
    if (typeof userSelectedCompany1 == 'undefined') {
      userSelectedCompany1 = { name: 'Select Company', companyid: 0 };
    }

    if (this.isOwnerAdmin == 'true' || this.isOwnerAminReadOnly == 'true') {
      this.selectRootCompanyForAdmin(userSelectedCompany1);
    } else {
      if (userSelectedCompany1.companyid == 0) {
        sessionStorage.removeItem('currentRole');
        sessionStorage.removeItem('highestRank');
        this.broadcasterService.currentCompany = 'selectcompany';
        this.userSelectedCompany = { name: 'Select Company', companyid: 0 };
        this.broadcasterService.selectedCompanyId =
          userSelectedCompany1.companyid;
        this.broadcasterService.broadcast('refreshNavBar', true);
        this.broadcasterService.broadcast(
          'piechart',
          userSelectedCompany1.companyid
        );
        this.router.navigate(['/dashboard']);
        return true;
      }
      this.getCompanyLogo(userSelectedCompany1.companyid);
      this.broadcasterService.currentCompany = 'nonselectcompany';
      this.broadcasterService.locations = [];
      this.itemTag = null;
      this.userSelectedCompany = userSelectedCompany1;
      this.authToken = sessionStorage.getItem('auth_token');
      this.userName = sessionStorage.getItem('userName');
      this.locationManagementService.setLocations([]);
      this.spinner.show();
      this.companyManagementService.setGlobalCompany(userSelectedCompany1);
      this.broadcasterService.selectedCompanyId =
        userSelectedCompany1.companyid;
      this.itemTypesService
        .getAllItemTypesWithHierarchy(userSelectedCompany1.companyid)
        .subscribe((response) => {
          this.broadcasterService.itemTypeHierarchy = response;
          this.highestRank = 0;
          this.currentRole = '';
          this.userId = sessionStorage.getItem('userId');
          this.loginService
            .getRolesForALoggedInUser(
              this.userName,
              userSelectedCompany1.companyid
            )
            .subscribe((response: any) => {
              this.userSecurityRoles = response;
              this.broadcasterService.userRoles = this.userSecurityRoles;
              if (this.userSecurityRoles && this.userSecurityRoles.length > 0) {
                this.userSecurityRoles.forEach((userRolesObj: any) => {
                  this.rolesListForLoggedInUser = userRolesObj.roleName;
                  if (true) {
                    if (userRolesObj.rank >= this.highestRank) {
                      this.highestRank = userRolesObj.rank;
                      this.currentRole = userRolesObj.roleName;
                    } else {
                    }

                    sessionStorage.setItem('currentRole', this.currentRole);
                    sessionStorage.setItem('highestRank', this.highestRank);

                    console.log('currentRole is' + this.currentRole);
                    console.log('highestRank is' + this.highestRank);
                  }
                });
                this.broadcasterService.broadcast(
                  'piechart',
                  userSelectedCompany.companyid
                );
                setTimeout(() => {
                  this.broadcasterService.broadcast('refreshNavBar', true);
                }, 1000);
              } else {
              }
            });

          this.itemTypes = response;
          if (this.itemTypes && this.itemTypes.length > 0) {
            this.items = this.generateHierarchy(this.itemTypes);
          }
          this.itemManagementService.setItemTypes(response);
          this.spinner.hide();
          this.router.navigate(['/dashboard']);
        });
    }
    return;
  }

  generateHierarchy(typeList: any[]) {
    let items: TreeviewItem[] = [];
    typeList.forEach((type) => {
      var children: TreeviewItem[] = [];
      if (type.typeList && type.typeList.length > 0) {
        children = this.generateHierarchy(type.typeList);
      }
      items.push(
        new TreeviewItem({
          text: type.name,
          value: type.typeid,
          collapsed: true,
          children: children,
        })
      );
    });

    return items;
  }

  getProfile() {
    this.userId = sessionStorage.getItem('userId');
    this.loginService.getProfileByUserId(this.userId).subscribe(
      (response) => {
        this.broadcasterService.isOwnerAdmin = response.isowneradmin;
        console.log(this.broadcasterService.isOwnerAdmin);
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  selectRootItemType(type: any) {
    this.selectedType = type;
  }

  navigateToItems() {
    this.itemManagementService.setSearchedItemTag(this.itemTag);
    this.itemManagementService.setItemSearchResults([]);
    this.itemManagementService.setSearchedItemTypeId(this.selectedType);
    // tslint:disable-next-line: triple-equals
    this.value = null;
    this.itemTag = '';
    if (this.router.url != '/items/lists/all') {
      this.router.navigate(['/items/lists/all']);
      this.spinner.show();
    } else {
      this.broadcasterService.broadcast('refreshlist', true);
    }
  }

  navigateToAdvanceItemSearch() {
    this.itemManagementService.setAdvancedItemSearchRepaiNotesSearchresults({});
    this.itemManagementService.setAdvancedItemSearchResults([]);
    this.itemManagementService.itemModel = {};
    this.itemManagementService.itemrepairnotesrfqModel = {};
    this.router.navigate(['/items/advancedSearch']);
  }

  help() {
    this.helpFlag = !this.helpFlag;
  }

  navigateToMasterSearch() {
    this.itemManagementService.setItemMasterSearchResults([]);
    this.itemManagementService.masterSearchModel = {};
    this.router.navigate(['/items/masterSearch']);
  }

  navigateToMasterPieCharts() {
    this.itemManagementService.setItemMasterSearchResults([]);
    this.itemManagementService.masterSearchModel = {};
    this.router.navigate(['/masterpiecharts']);
  }
}
