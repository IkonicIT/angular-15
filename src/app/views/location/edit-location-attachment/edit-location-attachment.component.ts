import { Component, OnInit } from '@angular/core';
import { LocationAttachmentsService } from '../../../services/location-attachments.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CompanyManagementService } from '../../../services/company-management.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-edit-location-attachment',
  templateUrl: './edit-location-attachment.component.html',
  styleUrls: ['./edit-location-attachment.component.scss'],
})
export class EditLocationAttachmentComponent implements OnInit {
  model: any = {};
  index: number = 0;
  date = Date.now();
  companyId: number = 0;
  private sub: any;
  id: number;
  router: Router;
  globalCompany: any;
  attachmentId: any;
  userName: any;
  locationId: any;
  dismissible = true;
  loader = false;
  constructor(
    private locationAttachmentsService: LocationAttachmentsService,
    private companyManagementService: CompanyManagementService,
    router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value.companyId;
    });
    if (this.globalCompany) {
      this.companyId = this.globalCompany.companyId;
    }
    this.locationId = route.snapshot.params['locId'];
    this.attachmentId = route.snapshot.params['id'];
    console.log('compaanyid=' + this.companyId);
    this.router = router;
    this.spinner.show();

    this.locationAttachmentsService
      .getLocationDocuments(this.attachmentId)
      .subscribe(
        (response) => {
          this.spinner.hide();

          this.model = response;
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName');
  }

  updateLocationDocument() {
    this.spinner.show();

    this.model.moduleType = 'locationtype';
    this.model.companyId = this.companyId;
    this.model.adddedby = this.userName;
    this.locationAttachmentsService
      .updateLocationDocument(this.model)
      .subscribe(
        (response) => {
          this.spinner.hide();

          window.scroll(0, 0);
          this.index = 1;
          setTimeout(() => {
            this.index = 0;
          }, 7000);
          this.router.navigate(['/location/attachments/' + this.locationId]);
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }

  cancelLocationDocument() {
    this.router.navigate(['/location/attachments/' + this.locationId]);
  }
}
