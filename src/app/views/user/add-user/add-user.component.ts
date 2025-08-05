import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CompanyManagementService } from '../../../services/company-management.service';
import { UserManagementService } from '../../../services/user-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgModel } from '@angular/forms';
import { TreeviewItem } from 'ngx-treeview';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent implements OnInit {
  model: any = {};
  showPassword = {
    password: false,
    confirmPassword: false
  };
  index: number = 0;
  router: Router;
  isNameCheckVisible = false;
  isEmailCheckVisible = false;
  isDuplicateTag = false;
  isMinLength = false;
  isDuplicate = false;
  companyId: any = 0;
  globalCompany: any;
  allCompanies: any = [];
  isOwnerAdmin: any;
  helpFlag: any = false;
  userName: any;
  dismissible = true;
  vendors: any = [];
  vendorItems: TreeviewItem[];
  userId:any;

  constructor(
    router: Router,
    private route: ActivatedRoute,
    private companyManagementService: CompanyManagementService,
    private spinner: NgxSpinnerService,
    private userManagementService: UserManagementService
  ) {
    this.router = router;
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName');
    this.spinner.show();
    this.loadVendors();
    this.globalCompany = this.companyManagementService.getGlobalCompany();

    if (this.globalCompany) {
      this.companyId = this.globalCompany.companyid;
    }
   const isOwnerAdmin = sessionStorage.getItem("IsOwnerAdmin") === "true";
   this.userId = sessionStorage.getItem('userId') ;
   const highestRank = parseInt(sessionStorage.getItem("highestRank") || "0", 10);
    if (highestRank === 10) {
        this.companyManagementService.getCompanyNames(this.userId).subscribe(
        (response) => {
          this.spinner.hide();
          console.log(response);
          this.allCompanies = response;
        },
        (error) => {
          this.spinner.hide();
        }
      );
      console.log('all  companies for owner Admin' + this.allCompanies);
    } else {
       this.companyManagementService.getAllCompaniesForOwnerAdmin().subscribe(
        (response) => {
          this.spinner.hide();
          console.log(response);
          this.allCompanies = response;
        },
        (error) => {
          this.spinner.hide();
        }
      )
      console.log('all vendor companies' + this.allCompanies);
    }
  }

  loadVendors() {
    this.spinner.show();
    this.companyManagementService.getAllVendorDetails().subscribe(
      (response) => {
        this.spinner.hide();
        this.vendors = response;
        this.vendorItems = this.convertVendorsToTreeviewItems(this.vendors);
      },
      (error) => {
        this.spinner.hide();
        console.error('Error loading vendors:', error);
      }
    );
  }

  convertVendorsToTreeviewItems(vendors: any[]): TreeviewItem[] {
    return vendors.map(
      (vendor) =>
        new TreeviewItem({
          text: vendor.name,
          value: vendor.vendorId,
        })
    );
  }

  onVendorChange(value: any) {
    this.model.vendorId = value;
  }

  checkUserName(event: any) {
    this.isNameCheckVisible = true;
    this.isDuplicateTag = false;
    console.log('event' + event.target.value);
    if (
      event.target.value.length < 4 ||
      event.target.value == null ||
      event.target.value == ''
    ) {
      this.isMinLength = false;
    } else {
      this.isMinLength = true;
      this.userManagementService.getUserId(event.target.value).subscribe(
        (response: any) => {
          if (response > 0) {
            this.isDuplicateTag = true;
          }
        },
        (error) => {}
      );
    }
  }

  checkEmail(event: any) {
    this.isEmailCheckVisible = true;
    this.isDuplicate = false;
    var email = '^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$';
    console.log('event' + event.target.value);
    if (event.target.value.match(email)) {
    }
    this.userManagementService.getEmail(event.target.value).subscribe(
      (response: any) => {
        if (response > 0) {
          this.isDuplicate = true;
        }
      },
      (error) => {}
    );
  }

  saveUser() {
    console.log(this.model);
    console.log('user name is' + this.model.name);
    console.log('vendorId:', this.model.vendorId);
    if (
      this.model.name &&
      this.model.email &&
      this.model.firstName &&
      this.model.lastName &&
      this.model.password &&
      this.model.confirmPassword &&
      this.model.companyId &&
      this.model.password == this.model.confirmPassword &&
      /\S+@\S+\.\S+/.test(this.model.email) &&
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/.test(
        this.model.password
      )
    ) {
      if (this.model.isVendor == true && !this.model.vendorId) {
        this.index = -5;
        window.scroll(0, 0);
        return;
      }
      var req = {
        applicationId: '2E8DCDA9-84CE-4A7F-B8EB-CBD5E815656B',
        userName: this.model.name,
        loweredUserName: 'y',
        mobileAlias: null,
        isAnonymous: true,
        lastActivityDate: new Date(),
        password: this.model.password,
        passwordFormat: null,
        passwordSalt: null,
        mobilePin: null,
        email: this.model.email,
        loweredEmail: null,
        passwordQuestion: null,
        passwordAnswer: null,
        isApproved: true,
        isLockedOut: false,
        createDate: new Date(),
        lastLoginDate: new Date(),
        lastPasswordChangedDate: new Date(),
        lastLockoutDate: new Date(),
        failedPasswordAttemptCount: 2,
        failedPasswordAttemptWindowStart: new Date(),
        failedPasswordAnswerAttemptCount: 2,
        failedPasswordAnswerAttemptWindowStart: new Date(),
        comment: null,
        profileId: '',
        firstName: this.model.firstName ? this.model.firstName : '',
        lastName: this.model.lastName ? this.model.lastName : '',
        jobTitle: this.model.jobTitle ? this.model.jobTitle : '',
        department: this.model.department ? this.model.department : '',
        phone: this.model.phone ? this.model.phone : '',
        mobilePhone: this.model.mobile ? this.model.mobile : '',
        fax: this.model.fax ? this.model.fax : '',
        acceptedTerms: true,
        isownerAdmin: true,
        sendReceiverFq: true,
        topLocationId: null,
        preferredLocationId: null,
        hidePricing: true,
        companyId: this.model.companyId ? this.model.companyId : this.companyId,
        addedBy: this.userName,
        isVendor: this.model.isVendor,
        vendorResource: {
          vendorId: this.model.vendorId,
        },
      };
      this.spinner.show();
      this.userManagementService
        .saveUser(req, this.companyId)
        .subscribe((response) => {
          window.scroll(0, 0);
          this.index = 1;
          setTimeout(() => {
            this.index = 0;
          }, 7000);
          this.spinner.hide();
          this.router.navigate(['/user/list']);
        });
    } else {
      window.scroll(0, 0);
      this.index = -1;
      if (/\S+@\S+\.\S+/.test(this.model.email)) {
        if (
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/.test(
            this.model.password
          )
        ) {
          if (this.model.password != this.model.confirmPassword) {
            this.index = -2;
          }
        } else {
          this.index = -4;
          if (this.model.password == null || this.model.name == null) {
            this.index = -1;
          }
        }
      } else {
        this.index = -3;
        if (this.model.email == null || this.model.name == null) {
          this.index = -1;
        }
      }
    }
  }

  cancelUser() {
    this.router.navigate(['/user/list']);
  }

  print() {
    this.helpFlag = false;
    window.print();
  }
  help() {
    this.helpFlag = !this.helpFlag;
  }
  togglePasswordVisibility(field: 'password' | 'confirmPassword') {
    this.showPassword[field] = !this.showPassword[field];
  }  
}