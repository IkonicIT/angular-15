import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { CompanyStatusesService } from "../../../services/company-statuses.service";
import { CompanyManagementService } from "../../../services/company-management.service";

@Component({
  selector: 'app-add-status',
  templateUrl: './add-status.component.html',
  styleUrls: ['./add-status.component.scss']
})
export class AddStatusComponent implements OnInit {
  model: any = {};
  index: number = 0;
  date = Date.now();
  companyId: number;
  private sub: any;
  id: number;
  router: Router;
  globalCompany: any = {};

  constructor(private companyStatusesService: CompanyStatusesService, private companyManagementService: CompanyManagementService, router: Router, private route: ActivatedRoute) {
    this.router = router;
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = this.globalCompany.companyid;
      console.log('compaanyid=' + this.companyId);
    });

  }

  ngOnInit() {

  }

  saveStatus() {
    if (this.model.status === undefined) {
      this.index = -1;
    } else {
      this.model = {
        "companyid": this.globalCompany.companyid,
        "destroyed": true,
        "entitytypeid": 0,
        "inservice": true,
        "spare": true,
        "status": this.model.status,
        "statusid": 0,
        "underrepair": true
      };
      console.log(JSON.stringify(this.model));
      this.companyStatusesService.saveCompanyStatus(this.model).subscribe(response => {
        window.scroll(0, 0);
        this.index = 1;
      });
    }
  }

  cancelAddStatus() {
    this.router.navigate(['/status/list']);
  }

}
