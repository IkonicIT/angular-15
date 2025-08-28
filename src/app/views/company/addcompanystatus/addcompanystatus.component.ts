import { Component, OnInit, OnDestroy } from '@angular/core';
import { CompanyStatusesService } from '../../../services/index';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyManagementService } from '../../../services/company-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-addcompanystatus',
  templateUrl: './addcompanystatus.component.html',
  styleUrls: ['./addcompanystatus.component.scss'],
})
export class AddcompanystatusComponent implements OnInit, OnDestroy {
  model: any = {};
  index = 0;
  date = Date.now();
  companyId!: number;
  private sub!: Subscription;
  id!: number;
  globalCompany: any = {};
  length = 0;
  userName = '';
  helpFlag = false;
  dismissible = true;
  loader = false;

  constructor(
    private companyStatusesService: CompanyStatusesService,
    private companyManagementService: CompanyManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.sub = this.companyManagementService.globalCompanyChange.subscribe(
      (value) => {
        this.globalCompany = value;
        this.companyId = this.globalCompany.companyId;
        console.log('companyId = ' + this.companyId);
      }
    );
  }

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('userName') ?? '';
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  saveStatus(): void {
    if (this.model.status !== undefined) {
      this.model.status = this.model.status.trim();
      this.length = this.model.status.length;
      console.log(this.length);
    }

    if (this.model.status === undefined || this.model.status === '') {
      this.index = -1;
      window.scroll(0, 0);
    } else if (this.length > 100) {
      this.index = 2;
    } else {
      this.model = {
        companyId: this.globalCompany.companyId,
        lastModifiedBy: this.userName,
        destroyed: true,
        entityTypeId: 0,
        inService: true,
        spare: true,
        status: this.model.status,
        statusId: 0,
        underRepair: true,
        moduleType: 'companytype',
      };
      console.log(JSON.stringify(this.model));
      this.spinner.show();

      this.companyStatusesService.saveCompanyStatus(this.model).subscribe({
        next: () => {
          this.spinner.hide();
          window.scroll(0, 0);
          this.index = 1;
          setTimeout(() => {
            this.index = 0;
            this.router.navigate(['/company/statuses']);
          }, 1000);
        },
        error: () => {
          this.spinner.hide();
        },
      });
    }
  }

  cancelAddStatus(): void {
    this.router.navigate(['/company/statuses']);
  }

  help(): void {
    this.helpFlag = !this.helpFlag;
  }
}
