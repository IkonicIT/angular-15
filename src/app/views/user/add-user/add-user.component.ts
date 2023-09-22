import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CompanyManagementService } from '../../../services/company-management.service';
import { UserManagementService } from '../../../services/user-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent implements OnInit {
  model: any = {};
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
  loader = false;
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
    this.loader = true;
    this.globalCompany = this.companyManagementService.getGlobalCompany();

    if (this.globalCompany) {
      this.companyId = this.globalCompany.companyid;
    }
    this.isOwnerAdmin = sessionStorage.getItem('IsOwnerAdmin');
    if (this.isOwnerAdmin == 'true') {
      this.companyManagementService.getAllCompaniesForOwnerAdmin().subscribe(
        (response) => {
          this.spinner.hide();
          this.loader = false;
          console.log(response);
          this.allCompanies = response;
        },
        (error) => {
          this.spinner.hide();
          this.loader = false;
        }
      );
      console.log('all  companies for owner Admin' + this.allCompanies);
    } else {
      this.companyManagementService
        .getAllVendorDetails(this.companyId)
        .subscribe(
          (response) => {
            this.spinner.hide();
            this.loader = false;
            console.log(response);
            this.allCompanies = response;
          },
          (error) => {
            this.spinner.hide();
            this.loader = false;
          }
        );
      console.log('all vendor companies' + this.allCompanies);
    }
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
    console.log(JSON.stringify(this.model));
    console.log('user name is' + this.model.name);
    if (
      this.model.name &&
      this.model.email &&
      this.model.firstname &&
      this.model.lastname &&
      this.model.password &&
      this.model.confirmPassword &&
      this.model.companyid &&
      this.model.password == this.model.confirmPassword &&
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.model.email) &&
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/.test(
        this.model.password
      )
    ) {
      var req = {
        applicationid: '2E8DCDA9-84CE-4A7F-B8EB-CBD5E815656B',
        username: this.model.name,
        loweredusername: 'y',
        mobilealias: null,
        isanonymous: true,
        lastactivitydate: new Date(),
        password: this.model.password,
        passwordformat: null,
        passwordsalt: null,
        mobilepin: null,
        email: this.model.email,
        loweredemail: null,
        passwordquestion: null,
        passwordanswer: null,
        isapproved: true,
        islockedout: false,
        createdate: new Date(),
        lastlogindate: new Date(),
        lastpasswordchangeddate: new Date(),
        lastlockoutdate: new Date(),
        failedpasswordattemptcount: 2,
        failedpasswordattemptwindowstart: new Date(),
        failedpasswordanswerattemptcount: 2,
        failedpasswordanswerattemptwindowstart: new Date(),
        comment: null,
        profileid: '',
        firstname: this.model.firstname ? this.model.firstname : '',
        lastname: this.model.lastname ? this.model.lastname : '',
        jobtitle: this.model.jobtitle ? this.model.jobtitle : '',
        department: this.model.department ? this.model.department : '',
        phone: this.model.phone ? this.model.phone : '',
        mobilephone: this.model.mobile ? this.model.mobile : '',
        fax: this.model.fax ? this.model.fax : '',
        acceptedterms: true,
        isowneradmin: true,
        sendreceiverfq: true,
        toplocationid: null,
        preferredlocationid: null,
        hidepricing: true,
        companyid: this.model.companyid ? this.model.companyid : this.companyId,
        addedBy: this.userName,
      };
      this.spinner.show();
      this.loader = true;
      this.userManagementService
        .saveUser(req, this.companyId)
        .subscribe((response) => {
          window.scroll(0, 0);
          this.index = 1;
          setTimeout(() => {
            this.index = 0;
          }, 7000);
          this.spinner.hide();
          this.loader = false;
          this.router.navigate(['/user/list']);
        });
    } else {
      window.scroll(0, 0);
      this.index = -1;
      if (
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.model.email)
      ) {
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
}
