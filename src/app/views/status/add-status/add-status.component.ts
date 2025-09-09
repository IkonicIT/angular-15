import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CompanyStatusesService } from '../../../services/company-statuses.service';
import { CompanyManagementService } from '../../../services/company-management.service';

@Component({
  selector: 'app-add-status',
  templateUrl: './add-status.component.html',
  styleUrls: ['./add-status.component.scss'],
})
export class AddStatusComponent implements OnInit {
  model: any = {};
  index = 0;
  date = Date.now();
  companyId!: number;
  id!: number;
  globalCompany: any = {};
  dismissible = true;

  constructor(
    private companyStatusesService: CompanyStatusesService,
    private companyManagementService: CompanyManagementService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.globalCompany = this.companyManagementService.getGlobalCompany();

    this.companyManagementService.globalCompanyChange.subscribe((value: any) => {
      this.globalCompany = value;
      this.companyId = this.globalCompany.companyId;
    });
  }

  ngOnInit(): void {}

  saveStatus(): void {
    if (this.model.status === undefined) {
      this.index = -1;
    } else {
      this.model = {
        companyId: this.globalCompany.companyId,
        destroyed: true,
        entityTypeId: 0,
        inService: true,
        spare: true,
        status: this.model.status,
        statusId: 0,
        underRepair: true,
      };

      this.companyStatusesService.saveCompanyStatus(this.model).subscribe({
        next: () => {
          window.scroll(0, 0);
          this.index = 1;
        },
        error: (err) => {
        },
      });
    }
  }

  cancelAddStatus(): void {
    this.router.navigate(['/status/list']);
  }
}
