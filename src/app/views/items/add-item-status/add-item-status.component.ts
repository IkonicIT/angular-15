import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ItemStatusService } from '../../../services/Items/item-status.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-item-status',
  templateUrl: './add-item-status.component.html',
  styleUrls: ['./add-item-status.component.scss'],
})
export class AddItemStatusComponent implements OnInit {
  model: any = {};
  index = 0;
  date = Date.now();
  companyId = 0;
  userName: string | null = '';
  globalCompany: any = {};
  length = 0;
  helpFlag = false;
  dismissible = true;
  loader = false;

  constructor(
    private itemStatusService: ItemStatusService,
    private companyManagementService: CompanyManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.globalCompany = this.companyManagementService.getGlobalCompany() ?? {};
    this.companyId = this.globalCompany?.companyId ?? 0;

    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value.companyId;
    });
  }

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('userName');
  }

  saveStatus(): void {
    if (this.model.status != undefined) {
      this.model.status = this.model.status.trim();
      this.length = this.model.status.length;
      
    }

    if (!this.model.status) {
      this.index = -1;
      window.scroll(0, 0);
      return;
    }

    if (this.length > 100) {
      this.index = 2;
      return;
    }

    const payload = {
      companyId: this.companyId,
      lastModifiedBy: this.userName,
      destroyed: !!this.model.destroyed,
      entityTypeId: 0,
      inService: !!this.model.inservice,
      moduleType: 'itemType',
      spare: !!this.model.spare,
      status: this.model.status,
      statusId: 0,
      underRepair: !!this.model.underRepair,
    };

    this.spinner.show();

    this.itemStatusService.saveItemStatus(payload).subscribe(
      (response) => {
        this.spinner.hide();
        window.scroll(0, 0);
        this.index = 1;
        setTimeout(() => (this.index = 0), 7000);
        this.router.navigate(['/items/status']);
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  cancelAddStatus(): void {
    this.router.navigate(['/items/status']);
  }

  help(): void {
    this.helpFlag = !this.helpFlag;
  }
}
