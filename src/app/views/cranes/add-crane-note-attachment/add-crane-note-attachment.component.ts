import { Component, OnInit } from '@angular/core';
import { CompanyDocumentsService } from '../../../services/company-documents.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import { CranesService } from 'src/app/services/cranes.service';

@Component({
  selector: 'app-add-crane-note-attachment',
  templateUrl: './add-crane-note-attachment.component.html',
  styleUrls: ['./add-crane-note-attachment.component.scss'],
})
export class AddCraneNoteAttachmentComponent implements OnInit {
  model: any = {};
  index: number = 0;
  date: number = Date.now();
  companyId: number = 0;
  vendorName: string = '';
  id!: number;
  fileContent: string = '';
  fileName: string = '';
  description: string = '';
  fileType: string = '';
  globalCompany: any;
  helpFlag: boolean = false;
  addedfiles: any[] = [];
  file!: File;
  userName: any;
  dismissible: boolean = true;
  craneNoteId: any;

  constructor(
    private companyDocumentsService: CompanyDocumentsService,
    private companyManagementService: CompanyManagementService,
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private cranesService: CranesService
  ) {
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.vendorName = value.name;
      this.companyId = value.companyId;
      this.userName = sessionStorage.getItem('userName');
    });

    this.route.queryParams.subscribe((params) => {
      this.craneNoteId = +params['q'] || 0;
    });

    this.route.paramMap.subscribe((params) => {
      this.craneNoteId = params.get('id'); // 'id' is the placeholder used in the route
      console.log('Part ID:', this.craneNoteId); // Now you have access to the partId
    });
  }

  ngOnInit() {
    console.log('companyi=' + this.companyId);
    this.addedfiles.push({ file: '', description: '' });
  }

  saveCompanyDocument(): void {
    let noFileChosen = true;
    this.addedfiles.forEach((element: any) => {
      if (element.attachmentFile === undefined) {
        noFileChosen = false;
      }
    });

    if (!noFileChosen) {
      this.index = -1;
      window.scroll(0, 0);
      setTimeout(() => {
        this.index = 0;
      });
    } else {
      const formdata: FormData = new FormData();
      formdata.append('file', this.file);
      formdata.append('createdBy', this.userName);
      formdata.append('companyId', JSON.stringify(this.companyId));
      formdata.append(
        'description',
        this.model.description ? this.model.description : ''
      );
      formdata.append('entityId', JSON.stringify(this.companyId));
      formdata.append('moduleType', 'companytype');

      const jsonArr = [...this.addedfiles];
      for (let i = 0; i < jsonArr.length; i++) {
        delete jsonArr[i]['file'];
      }
      console.log(jsonArr);
      var req = {
        craneAttachmentsList: jsonArr,
      };

      this.spinner.show();
      this.cranesService.addCraneNoteAttachment(req).subscribe({
        next: () => {
          this.spinner.hide();
          window.scroll(0, 0);
          this.index = 1;
          setTimeout(() => {
            this.index = 0;
            this.cancelVendorDocument();
          }, 3000);
        },
        error: () => {
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
  //       "contentType": this.fileType,
  //       "description": this.model.description,
  //       "fileName": this.fileName,
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
    this.location.back();
  }

  print(): void {
    this.helpFlag = false;
    window.print();
  }

  help(): void {
    this.helpFlag = !this.helpFlag;
  }

  fileChangeListener($event: any, fileIndex: any): void {
    console.log(this.addedfiles);

    this.readThis($event.target, fileIndex);
  }

  remove(i: number): void {
    this.addedfiles.splice(i, 1);
  }

  addNewAttachment(): void {
    this.index = 0;
    this.addedfiles.push({ file: '', description: '' });
  }

  private readThis(inputValue: any, fileIndex: number): void {
    if (inputValue.files && inputValue.files[0]) {
      this.file = inputValue.files[0];
      this.fileName = this.file.name;

      const myReader: FileReader = new FileReader();
      myReader.readAsDataURL(this.file);

      myReader.onloadend = () => {
        if (typeof myReader.result === 'string') {
          this.fileContent = myReader.result.split(',')[1];
          this.fileType = myReader.result
            .split(',')[0]
            .split(':')[1]
            .split(';')[0];

          const fileInfo = this.addedfiles[fileIndex];
          fileInfo['createdBy'] = this.userName;
          fileInfo['craneNoteId'] = this.craneNoteId;
          fileInfo['attachmentFile'] = this.fileContent;
          fileInfo['vendorAttachmentId'] = 0;
          fileInfo['contentType'] = this.fileType;
          fileInfo['isNew'] = 1;
          fileInfo['moduleType'] = 'companytype';
          fileInfo['fileName'] = this.fileName;
          fileInfo['description'] = this.description;
          fileInfo['createdDate'] = new Date().toISOString();
        }
      };
    }
  }
}
