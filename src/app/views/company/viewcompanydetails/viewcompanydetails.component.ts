import { Component, OnInit } from '@angular/core';
import { CompanyManagementService } from '../../../services/index';
import { ActivatedRoute, Router } from '@angular/router';
import { Company } from '../../../models/index';
import { NgxSpinnerService } from 'ngx-spinner';
import { CompanyStatusesService } from '../../../services/company-statuses.service';
import { CompanyTypesService } from '../../../services/company-types.service';
import { Location } from '@angular/common';
import { BroadcasterService } from '../../../services/broadcaster.service';
@Component({
  selector: 'app-viewcompanydetails',
  templateUrl: './viewcompanydetails.component.html',
  styleUrls: ['./viewcompanydetails.component.scss'],
})
export class ViewcompanydetailsComponent implements OnInit {
  companyId: string;
  model: any = {
    announcement: {
      announcementtext: '',
    },
    type: {},
  };
  index: number = 0;
  router: Router;
  statuses: any[] = [];
  companyTypes: any = [];
  isOwnerAdmin: any;
  helpFlag: any = false;
  constructor(
    private companyManagementService: CompanyManagementService,
    route: ActivatedRoute,
    router: Router,
    private companyStatusesService: CompanyStatusesService,
    private companyTypesService: CompanyTypesService,
    private spinner: NgxSpinnerService,
    private _location: Location,
    private broadcasterService: BroadcasterService
  ) {
    this.companyId = route.snapshot.params['id'];
    this.router = router;
  }

  ngOnInit() {
    this.isOwnerAdmin = sessionStorage.getItem('IsOwnerAdmin');
    this.spinner.show();
    this.companyManagementService.getCompanyDetails(this.companyId).subscribe(
      (response) => {
        this.model = response;
        if (this.isOwnerAdmin == 'true') {
          this.model.tracratAnnouncements =
            this.broadcasterService.tracratAnnouncement;
        }
        this.companyStatusesService
          .getAllCompanyStatuses(this.companyId)
          .subscribe((response: any) => {
            this.statuses = response;
            this.getAllTypes(this.companyId);
          });
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  getAllTypes(companyId: string) {
    this.companyTypesService.getAllCompanyTypes(companyId).subscribe(
      (response) => {
        this.companyTypes = response;
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
  saveMessage() {
    var req = {
      announcementdate: new Date().toISOString(),
      announcementid: 3,
      announcementtext: this.model.tracratAnnouncements
        ? this.model.tracratAnnouncements
        : '',
      companyid: -1,
    };
    this.spinner.show();
    this.companyManagementService
      .saveTracratAnnouncements(req)
      .subscribe((response) => {
        this.spinner.hide();
      });
  }
  cancelCompanyDetails() {
    this._location.back();
  }
  print() {
    this.helpFlag = false;
    window.print();
  }
  help() {
    this.helpFlag = !this.helpFlag;
  }
}
