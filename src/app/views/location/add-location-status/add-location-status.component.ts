import { Component, OnInit } from '@angular/core';
import { CompanyManagementService } from '../../../services/company-management.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LocationStatusService } from '../../../services/location-status.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-location-status',
  templateUrl: './add-location-status.component.html',
  styleUrls: ['./add-location-status.component.scss'],
})
export class AddLocationStatusComponent implements OnInit {
  model: any = {};
  index: number = 0;
  date: number = Date.now();
  companyId: number = 0;
  id: number = 0;
  userName: string | null = null;
  globalCompany: any = {};
  length: number = 0;
  helpFlag: boolean = false;
  dismissible: boolean = true;
  loader: boolean = false;

  constructor(
    private locationStatusService: LocationStatusService,
    private companyManagementService: CompanyManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.globalCompany = this.companyManagementService.getGlobalCompany();

    if (this.globalCompany) {
      this.companyId = this.globalCompany.companyId ?? 0;
    }

    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value?.companyId ?? 0;
    });
  }

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('userName');
  }

  saveStatus(): void {
    if (this.model.status !== undefined) {
      this.model.status = this.model.status.trim();
      this.length = this.model.status.length;
    }

    if (!this.model.status) {
      this.index = -1;
      window.scroll(0, 0);
    } else if (this.length > 100) {
      this.index = 2;
    } else {
      const payload = {
        companyId: this.globalCompany?.companyId ?? 0,
        lastModifiedBy: this.userName,
        destroyed: true,
        entityTypeId: 0,
        inService: true,
        moduleType: 'locationtype',
        spare: true,
        status: this.model.status,
        statusId: 0,
        underRepair: true,
      };
      this.spinner.show();

      this.locationStatusService.saveLocationStatus(payload).subscribe(
        () => {
          this.spinner.hide();
          window.scroll(0, 0);
          this.index = 1;
          setTimeout(() => (this.index = 0), 7000);
          this.router.navigate(['/location/status']);
        },
        () => {
          this.spinner.hide();
        }
      );
    }
  }

  cancelAddStatus(): void {
    this.router.navigate(['/location/status']);
  }

  print(): void {
    this.helpFlag = false;
    window.print();
  }

  help(): void {
    this.helpFlag = !this.helpFlag;
  }
}
