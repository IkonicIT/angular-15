import { Component, OnInit } from '@angular/core';
import { CompanyDocumentsService } from '../../../services/company-documents.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-vendor-attachment',
  templateUrl: './add-vendor-attachment.component.html',
  styleUrls: ['./add-vendor-attachment.component.scss'],
})
export class AddVendorAttachmentComponent implements OnInit {
  model: any = {};
  index: number = 0;
  date = Date.now();
  companyId: number = 0;
  vendorName: string;
  private sub: any;
  id: number;
  router: Router;
  private fileContent: string = '';
  private fileName: any;
  public fileType: any = '';
  globalCompany: any;
  helpFlag: any = false;
  dismissible = true;
  loader = false;

  constructor(
    private companyDocumentsService: CompanyDocumentsService,
    private companyManagementService: CompanyManagementService,
    router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.vendorName = value.name;
      this.companyId = value.companyid;
    });
    this.router = router;
    this.sub = this.route.queryParams.subscribe((params) => {
      this.companyId = +params['q'] || 0;
      console.log('Query params ', this.companyId);
    });
  }

  ngOnInit() {
    console.log('companyi=' + this.companyId);
  }

  saveVendorDocument() {
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
        entityid: this.companyId,
        entitytypeid: 0,
        filename: this.fileName,
        moduleType: 'vendortype',
      };
      this.spinner.show();

      this.companyDocumentsService.saveCompanyDocument(req).subscribe(
        (response) => {
          this.spinner.hide();

          window.scroll(0, 0);
          this.index = 1;
        },
        (error) => {
          this.spinner.hide();
        }
      );
    }
  }

  cancelVendorDocument() {
    this.router.navigate(['/vendor/documents/' + this.companyId]);
  }

  fileChangeListener($event: any): void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    var file: File = inputValue.files[0];
    this.fileName = file.name;
    var myReader: any = new FileReader();
    myReader.readAsDataURL(file);
    let self = this;
    myReader.onloadend = function (e: any) {
      console.log(myReader.result);
      self.fileContent = myReader.result.split(',')[1];
      self.fileType = myReader.result.split(',')[0].split(':')[1].split(';')[0];
    };
  }

  print() {
    this.helpFlag = false;
    window.print();
  }

  help() {
    this.helpFlag = !this.helpFlag;
  }
}
