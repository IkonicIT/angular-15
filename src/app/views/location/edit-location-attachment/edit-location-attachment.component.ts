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
  index = 0;
  date = Date.now();
  companyId = 0;
  id!: number;
  globalCompany: any;
  attachmentId!: number;
  userName: string | null = null;
  locationId!: number;
  dismissible = true;
  loader = false;

  constructor(
    private locationAttachmentsService: LocationAttachmentsService,
    private companyManagementService: CompanyManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany) {
      this.companyId = this.globalCompany.companyId;
    }

    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value.companyId;
    });

    this.locationId = +this.route.snapshot.params['locId'];
    this.attachmentId = +this.route.snapshot.params['id'];

    this.spinner.show();
    this.locationAttachmentsService
      .getLocationDocuments(String(this.attachmentId))
      .subscribe(
        (response) => {
          this.spinner.hide();
          this.model = response ?? {};
        },
        () => {
          this.spinner.hide();
        }
      );
  }

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('userName');
  }

  updateLocationDocument(): void {
    this.spinner.show();

    this.model = {
      ...this.model,
      moduleType: 'locationtype',
      companyId: this.companyId,
      addedBy: this.userName, 
    };

    this.locationAttachmentsService.updateLocationDocument(this.model).subscribe(
      () => {
        this.spinner.hide();
        window.scroll(0, 0);
        this.index = 1;
        setTimeout(() => (this.index = 0), 7000);
        this.router.navigate([`/location/attachments/${this.locationId}`]);
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  cancelLocationDocument(): void {
    this.router.navigate([`/location/attachments/${this.locationId}`]);
  }
}
