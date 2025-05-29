import { Component, OnInit } from '@angular/core';
import { CompanyDocumentsService } from '../../../services/index';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyManagementService } from '../../../services/index';
import { Company } from '../../..//models';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-addcompanydocuments',
  templateUrl: './addcompanydocuments.component.html',
  styleUrls: ['./addcompanydocuments.component.scss'],
})
export class AddcompanydocumentsComponent implements OnInit {
  model: any = {};
  index: number = 0;
  date = Date.now();
  attachmentMulReq: any = {};
  attachmentsList = [];
  companyId: number = 0;
  companyName: string;
  private sub: any;
  id: number;
  router: Router;
  addedfiles: any = [];
  private fileContent: string = '';
  private fileName: any;
  public fileType: any = '';
  public file: File;
  globalCompany: any;
  userName: any;
  helpFlag: any = false;
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
      this.companyName = value.name;
      this.companyId = value.companyid;
    });
    console.log('compaanyid=' + this.companyId);
    this.router = router;
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName');

    this.sub = this.route.queryParams.subscribe((params) => {
      this.companyId = +params['q'] || 0;
      console.log('Query params ', this.companyId);
    });

    console.log('companyi=' + this.companyId);
    this.addedfiles.push({ file: '', description: '' });
  }
  ngOnChanges() {
    console.log(this.addedfiles + 'addedfiles');
  }

  saveCompanyDocument() {
    var noFileChosen = true;
    var addedFiles = this.addedfiles;
    addedFiles.forEach(function (element: { attachmentFile: undefined }) {
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
        attachmentResourceList: jsonArr,
        attachmentUserLogDTO: {},
      };
      this.spinner.show();

      this.companyDocumentsService.saveCompanyMultipleDocuments(req).subscribe(
        (response) => {
          this.spinner.hide();

          window.scroll(0, 0);
          this.index = 1;
          setTimeout(() => {
            this.index = 0;
          }, 7000);
          this.router.navigate(['/company/documents/']);
        },
        (error) => {
          this.spinner.hide();
        }
      );
    }
  }

  cancelCompanyDocument() {
    this.router.navigate(['/company/documents/' + this.companyId]);
  }

  fileChangeListener(
    $event: { target: any },
    fileIndex: string | number
  ): void {
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

  readThis(inputValue: any, fileIndex: string | number): void {
    if (inputValue.files && inputValue.files[0]) {
      this.file = inputValue.files[0];
      this.fileName = this.file.name;

      var myReader: any = new FileReader();
      myReader.readAsDataURL(this.file);
      myReader.onloadend = (e: any) => {
        console.log(myReader.result);
        this.fileContent = myReader.result.split(',')[1];
        this.fileType = myReader.result
          .split(',')[0]
          .split(':')[1]
          .split(';')[0];
        const fileInfo = this.addedfiles[fileIndex];
        fileInfo['addedby'] = this.userName;
        fileInfo['attachmentFile'] = this.fileContent;
        fileInfo['attachmentid'] = 0;
        fileInfo['companyID'] = this.companyId;
        fileInfo['contenttype'] = this.fileType;
        fileInfo['dateadded'] = new Date().toISOString();
        fileInfo['entityid'] = this.companyId;
        fileInfo['isNew'] = 1;
        fileInfo['moduleType'] = 'companytype';
        fileInfo['filename'] = this.fileName;
        console.log(this.addedfiles);
      };
    }
  }

  print() {
    this.helpFlag = false;
    window.print();
  }

  help() {
    this.helpFlag = !this.helpFlag;
  }
}
