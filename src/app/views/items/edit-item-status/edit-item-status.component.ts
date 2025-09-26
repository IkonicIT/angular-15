import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CompanyManagementService } from '../../../services/company-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ItemStatusService } from '../../../services/Items/item-status.service';

export interface ItemStatusModel {
  statusId: number | string;
  status: string;
  destroyed: boolean;
  inService: boolean;
  spare: boolean;
  underRepair: boolean;
  companyId: number;

  added?: string;
  by?: string;
  _id?: string;
  lastModifiedBy?: string;
  oldStatus?: string;
}

@Component({
  selector: 'app-edit-item-status',
  templateUrl: './edit-item-status.component.html',
  styleUrls: ['./edit-item-status.component.scss'],
})
export class EditItemStatusComponent implements OnInit {
  model: ItemStatusModel = {
    statusId: 0,
    status: '',
    destroyed: false,
    inService: false,
    spare: false,
    underRepair: false,
    companyId: 0,
  };

  index: number = 0;
  statusId: number = 0;
  userName: string | null = '';
  globalCompany: any = {};
  companyId: number = 0;
  helpFlag: boolean = false;
  oldStatus: string = '';
  length: number = 0;

  dismissible: boolean = true;
  loader: boolean = false;

  constructor(
    private itemStatusService: ItemStatusService,
    private companyManagementService: CompanyManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.statusId = +this.route.snapshot.params['id'];
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyId = this.globalCompany.companyId;

    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = this.globalCompany.companyId;
    });

    this.spinner.show();
    this.itemStatusService.getItemStatus(this.statusId).subscribe((response: any) => {
      this.spinner.hide();
      this.model = response as ItemStatusModel;
      this.oldStatus = this.model.status;
    });
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName');
  }

  updateStatus() {
    if (this.model.status) {
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

    const request: ItemStatusModel & { oldStatus: string } = {
      ...this.model,
      statusId: String(this.model.statusId),
      companyId: this.globalCompany.companyId,
      lastModifiedBy: this.userName || '',
      oldStatus: this.oldStatus,
    };

    this.spinner.show();
    this.itemStatusService
  .updateItemStatus(this.model as { statusId: string | number } & any)
  .subscribe(() => {
    this.spinner.hide();
    this.index = 1;
    setTimeout(() => (this.index = 0), 7000);
    this.router.navigate(['/items/status']);
  });
  }

  cancelUpdateStatus() {
    this.router.navigate(['/items/status']);
  }

  help() {
    this.helpFlag = !this.helpFlag;
  }
}
