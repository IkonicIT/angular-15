import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CompanyManagementService } from '../../../services/company-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ItemStatusService } from '../../../services/Items/item-status.service';

@Component({
  selector: 'app-edit-item-status',
  templateUrl: './edit-item-status.component.html',
  styleUrls: ['./edit-item-status.component.scss'],
})
export class EditItemStatusComponent implements OnInit {
  model: any = {};
  index: number = 0;
  date = Date.now();
  statusId: number = 0;
  private sub: any;
  userName: any;
  id: number;
  router: Router;
  globalCompany: any = {};
  companyId: number;
  helpFlag: any = false;
  oldStatus: any;
  length: number;
  dismissible = true;
  loader = false;
  constructor(
    private itemStatusService: ItemStatusService,
    private companyManagementService: CompanyManagementService,
    router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.statusId = route.snapshot.params['id'];
    console.log('companyid=' + this.statusId);
    this.router = router;
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyId = this.globalCompany.companyid;
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = this.globalCompany.companyid;
      console.log('compaanyid=' + this.companyId);
    });
    this.spinner.show();

    this.itemStatusService
      .getItemStatus(this.statusId)
      .subscribe((response) => {
        this.spinner.hide();

        this.model = response;
        this.oldStatus = this.model.status;
      });
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName');
  }

  updateStatus() {
    if (this.model.status != undefined) {
      this.model.status = this.model.status.trim();
      this.length = this.model.status.length;
      console.log(this.length);
    }
    if (this.model.status == '' || this.model.status == undefined) {
      this.index = -1;
      window.scroll(0, 0);
    } else if (this.length > 100) {
      this.index = 2;
    } else {
      this.model = {
        companyid: this.globalCompany.companyid,
        lastmodifiedby: this.userName,
        destroyed: this.model.destroyed ? this.model.destroyed : false,
        entitytypeid: 0,
        inservice: this.model.inservice ? this.model.inservice : false,
        moduleType: 'itemtype',
        spare: this.model.spare ? this.model.spare : false,
        status: this.model.status,
        statusid: this.model.statusid,
        underrepair: this.model.underrepair ? this.model.underrepair : false,
        oldStatus: this.oldStatus,
      };
      this.spinner.show();

      this.itemStatusService
        .updateItemStatus(this.model)
        .subscribe((response) => {
          this.spinner.hide();

          window.scroll(0, 0);
          this.index = 1;
          setTimeout(() => {
            this.index = 0;
          }, 7000);
          this.router.navigate(['/items/status']);
        });
    }
  }
  cancelUpdateStatus() {
    this.router.navigate(['/items/status']);
  }

  help() {
    this.helpFlag = !this.helpFlag;
  }
}
