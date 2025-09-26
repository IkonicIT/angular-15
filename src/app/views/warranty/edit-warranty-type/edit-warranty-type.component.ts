import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { WarrantyManagementService } from '../../../services/warranty-management.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CompanyManagementService } from '../../../services/company-management.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-warranty-type',
  templateUrl: './edit-warranty-type.component.html',
  styleUrls: ['./edit-warranty-type.component.scss'],
})
export class EditWarrantyTypeComponent implements OnInit, OnDestroy {
  globalCompany: any;
  companyName = '';
  companyId: number | null = null;
  warrantyType: any;
  index = 0;
  warrantyTypeId!: number;
  helpFlag = false;
  userName: string | null = null;
  dismissible = true;
  loader = false;

  private subscription!: Subscription;

  constructor(
    private companyManagementService: CompanyManagementService,
    private warrantyManagementService: WarrantyManagementService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany) {
      this.companyName = this.globalCompany.name;
      this.companyId = this.globalCompany.companyId;
    }

    this.subscription = this.companyManagementService.globalCompanyChange.subscribe(
      (value) => {
        this.globalCompany = value;
        this.companyName = value?.name ?? '';
        this.companyId = value?.companyId ?? null;
      }
    );
  }

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('userName');

    const warrantyIdParam = this.route.snapshot.paramMap.get('warrantyId');
    this.warrantyTypeId = warrantyIdParam ? Number(warrantyIdParam) : 0;

    this.spinner.show();
    this.warrantyManagementService.getWarrantyType(this.warrantyTypeId).subscribe({
      next: (response: any) => {
        this.spinner.hide();
        this.warrantyType = response.warrantyType;
      },
      error: () => {
        this.spinner.hide();
      },
    });
  }

  updateWarrantyType(): void {
    if (!this.warrantyType) {
      this.index = -1;
      window.scroll(0, 0);
      return;
    }

    const req = {
      companyId: this.companyId,
      warrantyType: this.warrantyType,
      warrantyTypeId: 0,
      userName: this.userName,
    };

    this.spinner.show();
    this.warrantyManagementService.updateWarrantyType(req, this.warrantyTypeId).subscribe({
      next: () => {
        this.spinner.hide();
        this.index = 1;
        setTimeout(() => (this.index = 0), 7000);
        window.scroll(0, 0);
        this.router.navigate(['/warranty/list']);
      },
      error: () => {
        this.spinner.hide();
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/warranty/list']);
  }

  help(): void {
    this.helpFlag = !this.helpFlag;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
