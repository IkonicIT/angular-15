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
  date = Date.now();
  companyId: number = 0;
  companyName: string;
  userName: any;
  private sub: any;
  id: number;
  router: Router;
  private fileContent: string = '';
  private fileName: any;
  public fileType: any = '';
  globalCompany: any;
  locationId: any;
  file: File;
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
      this.companyName = value.name;
      this.companyId = value.companyid;
    });
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany) {
      this.companyId = this.globalCompany.companyid;
      this.companyName = this.globalCompany.name;
    }
    this.locationId = route.snapshot.params['id'];
    console.log('compaanyid=' + this.companyId);
    this.router = router;
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName');
    console.log('companyi=' + this.companyId);
  }

  saveLocationDocument() {
    if (!this.fileName) {
      this.index = -1;
      window.scroll(0, 0);
    } else {
      let req = {
        addedby: 'Yogi Patel',
        attachmentFile: this.fileContent,
        attachmentid: 0,
        contenttype: this.fileType,
        dateadded: new Date().toISOString(),
        description: this.model.description,
        entityid: this.locationId,
        entitytypeid: 0,
        filename: this.fileName,
        companyid: this.companyId,
        moduleType: 'locationtype',
      };
      const formdata: FormData = new FormData();
      formdata.append('file', this.file);
      formdata.append('addedby', this.userName);
      formdata.append('companyID', JSON.stringify(this.companyId));
      formdata.append(
        'description',
        this.model.description ? this.model.description : ''
      );
      formdata.append('entityid', this.locationId);
      formdata.append('moduleType', 'locationtype');

      console.log(req);
      this.spinner.show();
      this.loader = true;
      this.locationAttachmentsService.saveLocationDocument(formdata).subscribe(
        (response) => {
          this.spinner.hide();
          this.loader = false;
          window.scroll(0, 0);
          this.index = 1;
          setTimeout(() => {
            this.index = 0;
          }, 7000);
          this.router.navigate(['/location/attachments/' + this.locationId]);
        },
        (error) => {
          this.spinner.hide();
          this.loader = false;
        }
      );
    }
  }

  cancelLocationDocument() {
    this.router.navigate(['/location/attachments/' + this.locationId]);
  }

  fileChangeListener($event: { target: any }): void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    this.file = inputValue.files[0];
    this.fileName = this.file.name;

    var myReader: any = new FileReader();
    myReader.readAsDataURL(this.file);
    let self = this;
    myReader.onloadend = function (e: any) {
      console.log(myReader.result);
      self.fileContent = myReader.result?.split(',')[1];
      self.fileType = myReader.result
        ?.split(',')[0]
        .split(':')[1]
        .split(';')[0];
    };
  }
}
