import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CompanyStatusesService } from '../../../services/company-statuses.service';
import { CompanyManagementService } from '../../../services/company-management.service';

@Component({
  selector: 'app-edit-status',
  templateUrl: './edit-status.component.html',
  styleUrls: ['./edit-status.component.scss'],
})
export class EditStatusComponent implements OnInit {
  model: any = {};
  index: number = 0;
  date = Date.now();
  companyId: number = 0;
  documentId: number = 0;
  private sub: any;
  id: number;
  router: Router;
  globalCompany: any = {};
  dismissible = true;

  constructor(
    private companyStatusesService: CompanyStatusesService,
    private companyManagementService: CompanyManagementService,
    router: Router,
    private route: ActivatedRoute
  ) {
    this.companyId = route.snapshot.params['q'];
    console.log('companyId=' + this.companyId);
    this.router = router;
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = this.globalCompany.companyId;
      console.log('compaanyid=' + this.companyId);
    });
  }

  ngOnInit() {
    this.sub = this.route.queryParams.subscribe((params) => {
      this.companyId = +params['q'] || 0;
      console.log('Query params ', this.companyId);
    });

    console.log('companyi=' + this.companyId);

    this.companyStatusesService
      .getCompanyStatus(this.companyId)
      .subscribe((response) => {
        this.model = response;
      });
  }
  updateStatus() {
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
    this.companyStatusesService
      .updateCompanyStatus(this.model)
      .subscribe((response) => {
        window.scroll(0, 0);
        this.index = 1;
      });
  }
  cancelUpdateStatus() {
    this.router.navigate(['/status/list']);
  }
}
