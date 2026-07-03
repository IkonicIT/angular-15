import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';

import { CompanyManagementService } from '../../../services/index';
import { CompanyStatusesService } from '../../../services/company-statuses.service';
import { CompanyTypesService } from '../../../services/company-types.service';
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
      announcementText: '',
    },
    type: {},
  };
  index: number = 0;
  statuses: any[] = [];
  companyTypes: any[] = [];
  isOwnerAdmin: string | null = null;
  loader: boolean = false;
  helpFlag: boolean = false;

  constructor(
    private companyManagementService: CompanyManagementService,
    private route: ActivatedRoute,
    private router: Router,
    private companyStatusesService: CompanyStatusesService,
    private companyTypesService: CompanyTypesService,
    private spinner: NgxSpinnerService,
    private location: Location,
    private broadcasterService: BroadcasterService
  ) {
    this.companyId = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.isOwnerAdmin = sessionStorage.getItem('IsOwnerAdmin');
    this.spinner.show();

    this.companyManagementService.getCompanyDetails(this.companyId).subscribe(
      (response: any) => {
        this.model = response;

        if (this.isOwnerAdmin === 'true') {
          this.model.tracratAnnouncements = this.broadcasterService.tracratAnnouncement;
        }

        this.companyStatusesService.getAllCompanyStatuses(this.companyId).subscribe(
          (statuses: any) => {
            this.statuses = statuses;
            this.getAllTypes(this.companyId);
          },
          () => {
            this.spinner.hide();
          }
        );
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  getAllTypes(companyId: string): void {
    this.companyTypesService.getAllCompanyTypes(companyId).subscribe(
      (response: any) => {
        this.companyTypes = response;
        this.spinner.hide();
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  saveMessage(): void {
    const req = {
      announcementDate: new Date().toISOString(),
      announcementId: 3,
      announcementText: this.model.tracratAnnouncements || '',
      companyId: -1,
    };

    this.spinner.show();

    this.companyManagementService.saveTracratAnnouncements(req).subscribe(
      () => {
        this.spinner.hide();
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  cancelCompanyDetails(): void {
    this.location.back();
  }

  print(): void {
    this.helpFlag = false;
    window.print();
  }

  help(): void {
    this.helpFlag = !this.helpFlag;
  }
}
