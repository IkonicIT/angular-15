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
  dismissible: boolean = true; // Add this line

  vendorName: string;
  private sub: any;
  id: number;
  router: Router;
  private fileContent: string = '';
  private fileName: any;
  public fileType: any = '';
  globalCompany: any;
  helpFlag: any = false;
  addedfiles: any = [];
  public file: File;
  userName: any;
  vendorId: any;
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
      this.userName = sessionStorage.getItem('userName');
    });
    this.router = router;
    this.sub = this.route.queryParams.subscribe((params) => {
      this.vendorId = +params['q'] || 0;
      console.log('Query params ', this.vendorId);
    });
  }

  ngOnInit() {
    console.log('companyi=' + this.companyId);
    this.addedfiles.push({ file: '', description: '' });
  }

  saveCompanyDocument() {
    var noFileChosen = true;
    var addedFiles = this.addedfiles;
    addedFiles.forEach(function (element: any) {
      if (element.attachmentFile === undefined) {
        noFileChosen = false;
      }
    });
    if (!noFileChosen) {
      this.index = -1;
      window.scroll(0, 0);
    } else {
      const formdata: FormData = new FormData();
      formdata.append('file', this.file);
      formdata.append('addedby', this.userName);
      formdata.append('companyID', JSON.stringify(this.companyId));
      formdata.append(
        'description',
        this.model.description ? this.model.description : ''
      );
      formdata.append('entityid', JSON.stringify(this.companyId));
      formdata.append('moduleType', 'companytype');
      var jsonArr = this.addedfiles;
      for (var i = 0; i < jsonArr.length; i++) {
        delete jsonArr[i]['file'];
      }
      console.log(jsonArr);
      var req = {
        vendorAttachmentResourceList: jsonArr,
        attachmentUserLogDTO: {},
      };
      this.spinner.show();
      this.companyDocumentsService.saveVendorMultipleDocuments(req).subscribe(
        (response) => {
          this.spinner.hide();
          window.scroll(0, 0);
          this.index = 1;
          setTimeout(() => {
            this.index = 0;
          }, 3000);
          this.router.navigate(['/vendor/documents/' + this.vendorId]);
        },
        (error) => {
          this.spinner.hide();
        }
      );
    }
  }

  // saveVendorDocument() {
  //   if (!this.fileName) {
  //     this.index = -1;
  //     window.scroll(0, 0);
  //   } else {
  //     let req = {
  //       "createdBy": "Yogi Patel",
  //       "attachmentFile": this.fileContent,
  //       "vendorAttachmentId": 0,
  //       "contenttype": this.fileType,
  //       "description": this.model.description,
  //       "filename": this.fileName,
  //       "moduleType": "vendortype",
  //       "isNew": true,
  //       "createdDate":new Date().toISOString(),
  //     };
  //     this.spinner.show();
  //     this.companyDocumentsService.saveVendorDocument(req).subscribe(response => {
  //       this.spinner.hide();
  //       window.scroll(0, 0);
  //       this.index = 1;
  //     },
  //       error => {
  //         this.spinner.hide();
  //       });
  //   }
  // }

  cancelVendorDocument() {
    this.router.navigate(['/vendor/documents/' + this.vendorId]);
  }

  print() {
    this.helpFlag = false;
    window.print();
  }
  help() {
    this.helpFlag = !this.helpFlag;
  }

  fileChangeListener($event: Event, fileIndex: number): void {
    console.log(this.addedfiles);

    this.readThis($event.target, fileIndex);
  }

  remove(i: number) {
    this.addedfiles.splice(i, 1);
  }

  addNewAttachment() {
    this.index = 0;
    this.addedfiles.push({ file: '', description: '' });
  }
  readThis(inputValue: any, fileIndex: any): void {
    if (inputValue.files && inputValue.files[0]) {
      this.file = inputValue.files[0];
      this.fileName = this.file.name;

      var myReader: FileReader = new FileReader();
      myReader.readAsDataURL(this.file);
      myReader.onloadend = (e) => {
        if (myReader.result) {
          console.log(myReader.result);
          const resultString = myReader.result as string;
          this.fileContent = resultString.split(',')[1];
          this.fileType = resultString
            .split(',')[0]
            .split(':')[1]
            .split(';')[0];
        }
        const fileInfo = this.addedfiles[fileIndex];
        fileInfo['createdBy'] = this.userName;
        fileInfo['vendorId'] = this.vendorId;
        fileInfo['attachmentFile'] = this.fileContent;
        fileInfo['vendorAttachmentId'] = 0;
        fileInfo['contenttype'] = this.fileType;
        fileInfo['isNew'] = 1;
        fileInfo['moduleType'] = 'companytype';
        fileInfo['filename'] = this.fileName;
        fileInfo['createdDate'] = new Date().toISOString();
        console.log(this.addedfiles);
      };
    }
  }
}
