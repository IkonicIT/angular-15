import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CompanyStatusesService } from '../../../services/company-statuses.service';
import { CompanyManagementService } from '../../../services/company-management.service';

@Component({
  selector: 'app-edit-status',
  templateUrl: './edit-status.component.html',
  styleUrls: ['./edit-status.component.scss'],
})
export class EditStatusComponent implements OnInit, OnDestroy {
  model: any = {};
  index = 0;
  date = Date.now();
  companyId = 0;
  documentId = 0;
  private sub!: Subscription;
  id!: number;
  globalCompany: any = {};
  dismissible = true;

  constructor(
    private companyStatusesService: CompanyStatusesService,
    private companyManagementService: CompanyManagementService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.companyId = Number(route.snapshot.params['q']) || 0;

    this.globalCompany = this.companyManagementService.getGlobalCompany();

    this.companyManagementService.globalCompanyChange.subscribe((value: any) => {
      this.globalCompany = value;
      this.companyId = this.globalCompany.companyId;
    });
  }

  ngOnInit(): void {
    this.sub = this.route.queryParams.subscribe((params) => {
      this.companyId = +params['q'] || 0;
    });


    this.companyStatusesService.getCompanyStatus(this.companyId).subscribe({
      next: (response: any) => {
        this.model = response;
      },
      error: (err) => {
      },
    });
  }

  updateStatus(): void {
    this.model = {
      companyId: this.globalCompany.companyId,
      destroyed: true,
      entityTypeId: 0,
      inService: true,
      spare: true,
      status: this.model.status,
      statusId: this.model.statusId,
      underRepair: true,
    };

    this.companyStatusesService.updateCompanyStatus(this.model).subscribe({
      next: () => {
        window.scroll(0, 0);
        this.index = 1;
      },
      error: (err) => {
      },
    });
  }

  cancelUpdateStatus(): void {
    this.router.navigate(['/status/list']);
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}