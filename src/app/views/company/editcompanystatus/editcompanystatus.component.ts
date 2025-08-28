import { Component, OnInit, OnDestroy } from '@angular/core';
import { CompanyStatusesService } from '../../../services/index';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyManagementService } from '../../../services/company-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-editcompanystatus',
  templateUrl: './editcompanystatus.component.html',
  styleUrls: ['./editcompanystatus.component.scss'],
})
export class EditcompanystatusComponent implements OnInit, OnDestroy {
  model: any = {};
  index = 0;
  date = Date.now();
  companyId = 0;
  documentId = 0;
  id = 0;

  private sub?: Subscription;
  private globalCompanySub?: Subscription;

  userName: string | null = '';
  globalCompany: any = {};
  helpFlag = false;
  oldStatus: any;
  length: number = 0;
  dismissible = true;
  loader = false;

  constructor(
    private companyStatusesService: CompanyStatusesService,
    private companyManagementService: CompanyManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.companyId = Number(this.route.snapshot.params['q']);
    console.log('companyId=', this.companyId);

    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.globalCompanySub = this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = this.globalCompany.companyId;
      console.log('companyId=', this.companyId);
    });
  }

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('userName');

    this.sub = this.route.queryParams.subscribe((params) => {
      this.companyId = +params['q'] || 0;
    });

    console.log('companyId=', this.companyId);
    this.spinner.show();

    this.companyStatusesService.getCompanyStatus(this.companyId).subscribe({
      next: (response) => {
        this.spinner.hide();
        this.model = response;
        this.oldStatus = this.model.status;
      },
      error: () => {
        this.spinner.hide();
      },
    });
  }

  updateStatus(): void {
    if (this.model.status !== undefined) {
      this.model.status = this.model.status.trim();
      this.length = this.model.status.length;
      console.log(this.length);
    }

    if (
      this.model.status === '' ||
      this.model.status === this.oldStatus ||
      this.model.status === undefined
    ) {
      this.index = -1;
      window.scroll(0, 0);
    } else if (this.length > 100) {
      this.index = 2;
    } else {
      this.model = {
        companyId: this.globalCompany.companyId,
        lastModifiedBy: this.userName,
        destroyed: false,
        entityTypeId: 0,
        inService: false,
        spare: false,
        status: this.model.status,
        statusId: this.model.statusId,
        underRepair: false,
        moduleType: 'companytype',
        oldStatus: this.oldStatus,
      };
      this.spinner.show();

      this.companyStatusesService.updateCompanyStatus(this.model).subscribe({
        next: () => {
          this.spinner.hide();
          window.scroll(0, 0);
          this.index = 1;
          setTimeout(() => {
            this.index = 0;
          }, 7000);
          this.router.navigate(['/company/statuses']);
        },
        error: () => {
          this.spinner.hide();
        },
      });
    }
  }

  cancelUpdateStatus(): void {
    this.router.navigate(['/company/statuses']);
  }

  help(): void {
    this.helpFlag = !this.helpFlag;
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.globalCompanySub?.unsubscribe();
  }
}
