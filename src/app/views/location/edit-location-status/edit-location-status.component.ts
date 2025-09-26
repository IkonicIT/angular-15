import { Component, OnInit } from '@angular/core';
import { LocationStatusService } from '../../../services/location-status.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CompanyManagementService } from '../../../services/company-management.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-edit-location-status',
  templateUrl: './edit-location-status.component.html',
  styleUrls: ['./edit-location-status.component.scss'],
})
export class EditLocationStatusComponent implements OnInit {
  index = 0;
  date = Date.now();

  statusId!: number;
  companyId!: number;
  userName!: string | null;

  globalCompany: any;
  model: any = {};
  oldStatus!: string;
  helpFlag = false;

  dismissible = true;
  loader = false;

  constructor(
    private locationStatusService: LocationStatusService,
    private companyManagementService: CompanyManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.statusId = Number(this.route.snapshot.params['id']);
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyId = this.globalCompany?.companyId;

    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value?.companyId;
    });

    this.spinner.show();
    this.locationStatusService.getLocationStatus(this.statusId).subscribe(
      (response) => {
        this.spinner.hide();
        this.model = response;
        this.oldStatus = this.model.status;
      },
      () => this.spinner.hide()
    );
  }

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('userName');
  }

  updateStatus(): void {
    const status = this.model?.status?.trim();

    if (!status || status === this.oldStatus) {
      this.index = -1;
      window.scroll(0, 0);
      return;
    }

    if (status.length > 100) {
      this.index = 2;
      return;
    }

    const payload = {
      companyId: this.companyId,
      lastModifiedBy: this.userName,
      destroyed: false,
      entityTypeId: 0,
      inService: false,
      moduleType: 'locationtype',
      spare: false,
      status,
      statusId: this.model.statusId,
      underRepair: false,
      oldStatus: this.oldStatus,
    };

    this.spinner.show();
    this.locationStatusService.updateLocationStatus(payload).subscribe(
      () => {
        this.spinner.hide();
        window.scroll(0, 0);
        this.index = 1;
        setTimeout(() => (this.index = 0), 7000);
        this.router.navigate(['/location/status']);
      },
      () => this.spinner.hide()
    );
  }

  cancelUpdateStatus(): void {
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
