import { Component, OnInit } from '@angular/core';
import { LocationStatusService } from '../../../services/location-status.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ItemStatusService } from '../../../services/Items/item-status.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-item-status',
  templateUrl: './add-item-status.component.html',
  styleUrls: ['./add-item-status.component.scss'],
})
export class AddItemStatusComponent implements OnInit {
  model: any = {};
  index: number = 0;
  date = Date.now();
  companyId: number;
  private sub: any;
  userName: any;
  id: number;
  router: any;
  globalCompany: any = {};
  length: any = 0;
  helpFlag: any = false;
  dismissible = true;

  constructor(
    private itemStatusService: ItemStatusService,
    private companyManagementService: CompanyManagementService,
    router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.router = router;
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = this.globalCompany.companyid;
      console.log('compaanyid=' + this.companyId);
    });
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName');
  }

  saveStatus() {
    if (this.model.status != undefined) {
      this.model.status = this.model.status.trim();
      this.length = this.model.status.length;
      console.log(this.length);
    }
    if (this.model.status == '' || this.model.status === undefined) {
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
        statusid: 0,
        underrepair: this.model.underrepair ? this.model.underrepair : false,
      };
      this.spinner.show();
      this.itemStatusService
        .saveItemStatus(this.model)
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

  cancelAddStatus() {
    this.router.navigate(['/items/status']);
  }

  help() {
    this.helpFlag = !this.helpFlag;
  }
}
