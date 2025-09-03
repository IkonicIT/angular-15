import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CompanyManagementService } from '../../../services/company-management.service';
import { UserManagementService } from '../../../services/user-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
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
    confirmPassword: false,
  };
  index = 0;
  isNameCheckVisible = false;
  isEmailCheckVisible = false;
  isDuplicateTag = false;
  isMinLength = false;
  isDuplicate = false;
  companyId: number = 0;
  globalCompany: any;
  allCompanies: any[] = [];
  isOwnerAdmin: any;
  helpFlag = false;
  userName: string | null = null;
  dismissible = true;
  vendors: any[] = [];
  vendorItems: TreeviewItem[] = [];
  userId: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private companyManagementService: CompanyManagementService,
    private spinner: NgxSpinnerService,
    private userManagementService: UserManagementService
  ) {}

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('userName');
    this.spinner.show();
    this.loadVendors();
    this.globalCompany = this.companyManagementService.getGlobalCompany();

    if (this.globalCompany) {
      this.companyId = this.globalCompany.companyId;
    }

    const isOwnerAdmin = sessionStorage.getItem('IsOwnerAdmin') === 'true';
    this.userId = sessionStorage.getItem('userId');
    const highestRank = parseInt(sessionStorage.getItem('highestRank') || '0', 10);

    if (highestRank === 10 && this.userId) {
      this.companyManagementService.getCompanyNames(this.userId).subscribe({
        next: (response) => {
          this.spinner.hide();
          this.allCompanies = response;
        },
        error: () => this.spinner.hide(),
      });
    } else {
      this.companyManagementService.getAllCompaniesForOwnerAdmin().subscribe({
        next: (response) => {
          this.spinner.hide();
          this.allCompanies = response;
        },
        error: () => this.spinner.hide(),
      });
    }
  }

  loadVendors(): void {
    this.spinner.show();
    this.companyManagementService.getAllVendorDetails().subscribe({
      next: (response) => {
        this.spinner.hide();
        this.vendors = response;
        this.vendorItems = this.convertVendorsToTreeviewItems(this.vendors);
      },
      error: (error) => {
        this.spinner.hide();
        console.error('Error loading vendors:', error);
      },
    });
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

  onVendorChange(value: any): void {
    this.model.vendorId = value;
  }

  checkUserName(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.isNameCheckVisible = true;
    this.isDuplicateTag = false;

    if (!input.value || input.value.length < 4) {
      this.isMinLength = false;
    } else {
      this.isMinLength = true;
      this.userManagementService.getUserId(input.value).subscribe({
        next: (response: any) => {
          if (response > 0) {
            this.isDuplicateTag = true;
          }
        },
      });
    }
  }

  checkEmail(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.isEmailCheckVisible = true;
    this.isDuplicate = false;

    // Simple regex, Angular 15 accepts stricter typing
    const emailRegex = /\S+@\S+\.\S+/;

    if (emailRegex.test(input.value)) {
      this.userManagementService.getEmail(input.value).subscribe({
        next: (response: any) => {
          if (response > 0) {
            this.isDuplicate = true;
          }
        },
      });
    }
  }

  saveUser(): void {
    if (
      this.model.name &&
      this.model.email &&
      this.model.firstName &&
      this.model.lastName &&
      this.model.password &&
      this.model.confirmPassword &&
      this.model.companyId &&
      this.model.password === this.model.confirmPassword &&
      /\S+@\S+\.\S+/.test(this.model.email) &&
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/.test(
        this.model.password
      )
    ) {
      if (this.model.isVendor && !this.model.vendorId) {
        this.index = -5;
        window.scroll(0, 0);
        return;
      }

      const req = {
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
        firstName: this.model.firstName || '',
        lastName: this.model.lastName || '',
        jobTitle: this.model.jobTitle || '',
        department: this.model.department || '',
        phone: this.model.phone || '',
        mobilePhone: this.model.mobile || '',
        fax: this.model.fax || '',
        acceptedTerms: true,
        isOwnerAdmin: true,
        sendReceiveRFQ: true,
        topLocationId: null,
        preferredLocationId: null,
        hidePricing: true,
        companyId: this.model.companyId || this.companyId,
        addedBy: this.userName,
        isVendor: this.model.isVendor,
        vendorResource: {
          vendorId: this.model.vendorId,
        },
      };

      this.spinner.show();
      this.userManagementService.saveUser(req, this.companyId).subscribe({
        next: () => {
          window.scroll(0, 0);
          this.index = 1;
          setTimeout(() => {
            this.index = 0;
          }, 7000);
          this.spinner.hide();
          this.router.navigate(['/user/list']);
        },
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
          if (this.model.password !== this.model.confirmPassword) {
            this.index = -2;
          }
        } else {
          this.index = -4;
          if (!this.model.password || !this.model.name) {
            this.index = -1;
          }
        }
      } else {
        this.index = -3;
        if (!this.model.email || !this.model.name) {
          this.index = -1;
        }
      }
    }
  }

  cancelUser(): void {
    this.router.navigate(['/user/list']);
  }

  print(): void {
    this.helpFlag = false;
    window.print();
  }

  help(): void {
    this.helpFlag = !this.helpFlag;
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    this.showPassword[field] = !this.showPassword[field];
  }
}
