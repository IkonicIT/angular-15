import { Component, OnInit } from '@angular/core';
import { LocationAttachmentsService } from '../../../services/location-attachments.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CompanyManagementService } from '../../../services/company-management.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-location-attachment',
  templateUrl: './add-location-attachment.component.html',
  styleUrls: ['./add-location-attachment.component.scss'],
})
export class AddLocationAttachmentComponent implements OnInit {
  model: any = {};
  index: number = 0;
  date: number = Date.now();
  companyId: number = 0;
  companyName: string = '';
  userName: string | null = null;

  fileContent: string = '';
  fileName: string = '';
  fileType: string = '';
  file: File | null = null;

  globalCompany: any;
  locationId: string = '';

  dismissible: boolean = true;
  loader: boolean = false;

  constructor(
    private locationAttachmentsService: LocationAttachmentsService,
    private companyManagementService: CompanyManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyName = value.name;
      this.companyId = value.companyId;
    });

    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany) {
      this.companyId = this.globalCompany.companyId;
      this.companyName = this.globalCompany.name;
    }

    this.locationId = this.route.snapshot.params['id'] ?? '';
  }

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('userName');
  }

  saveLocationDocument(): void {
    if (!this.fileName) {
      this.index = -1;
      window.scroll(0, 0);
      return;
    }

    const formdata: FormData = new FormData();
    if (this.file) {
      formdata.append('file', this.file);
    }
    formdata.append('addedBy', this.userName ?? '');
    formdata.append('companyId', JSON.stringify(this.companyId));
    formdata.append('description', this.model.description ?? '');
    formdata.append('entityId', this.locationId);
    formdata.append('moduleType', 'locationtype');

    this.spinner.show();
    this.locationAttachmentsService.saveLocationDocument(formdata).subscribe(
      () => {
        this.spinner.hide();
        window.scroll(0, 0);
        this.index = 1;
        setTimeout(() => {
          this.index = 0;
        }, 7000);
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

  fileChangeListener(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      this.readThis(input.files[0]);
    }
  }

  private readThis(file: File): void {
    this.file = file;
    this.fileName = file.name;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      const result = reader.result as string;
      this.fileContent = result?.split(',')[1] ?? '';
      this.fileType = result?.split(',')[0]?.split(':')[1]?.split(';')[0] ?? '';
    };
  }
}
