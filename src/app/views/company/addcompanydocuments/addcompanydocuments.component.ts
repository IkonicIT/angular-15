import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CompanyDocumentsService } from '../../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyManagementService } from '../../../services';
import { Company } from '../../../models';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-addcompanydocuments',
  templateUrl: './addcompanydocuments.component.html',
  styleUrls: ['./addcompanydocuments.component.scss'],
})
export class AddcompanydocumentsComponent implements OnInit, OnChanges {
  model: any = {};
  index = 0;
  date = Date.now();
  attachmentMulReq: any = {};
  attachmentsList: any[] = [];
  companyId = 0;
  companyName = '';
  private sub?: Subscription;
  id = 0;
  addedfiles: any[] = [];
  private fileContent = '';
  private fileName = '';
  public fileType = '';
  public file?: File;
  globalCompany: any;
  userName: string | null = null;
  helpFlag = false;
  loader = false;

  constructor(
    private companyDocumentsService: CompanyDocumentsService,
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
    console.log('compaanyid=' + this.companyId);
  }

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('userName');

    this.sub = this.route.queryParams.subscribe((params) => {
      this.companyId = +params['q'] || 0;
      console.log('Query params ', this.companyId);
    });

    console.log('companyi=' + this.companyId);
    this.addedfiles.push({ file: '', description: '' });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.addedfiles, 'addedfiles');
  }

  saveCompanyDocument(): void {
    let noFileChosen = true;
    this.addedfiles.forEach((element) => {
      if (element.attachmentFile === undefined) {
        noFileChosen = false;
      }
    });

    if (!noFileChosen) {
      this.index = -1;
      window.scroll(0, 0);
      return;
    }

    const formdata: FormData = new FormData();
    if (this.file) {
      formdata.append('file', this.file);
    }
    formdata.append('addedBy', this.userName || '');
    formdata.append('companyId', JSON.stringify(this.companyId));
    formdata.append(
      'description',
      this.model.description ? this.model.description : ''
    );
    formdata.append('entityId', JSON.stringify(this.companyId));
    formdata.append('moduleType', 'companyType');

    const jsonArr = this.addedfiles.map((f) => {
      const { file, ...rest } = f; // remove 'file' key
      return rest;
    });

    const req = {
      attachmentResourceList: jsonArr,
      attachmentUserLogDTO: {},
    };

    this.spinner.show();
    this.companyDocumentsService.saveCompanyMultipleDocuments(req).subscribe(
      (response: any) => {
        this.spinner.hide();
        window.scroll(0, 0);
        this.index = 1;
        setTimeout(() => (this.index = 0), 7000);
        this.router.navigate(['/company/documents/']);
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  cancelCompanyDocument(): void {
    this.router.navigate(['/company/documents/' + this.companyId]);
  }

  fileChangeListener($event: Event, fileIndex: number): void {
    const input = $event.target as HTMLInputElement;
    if (input) {
      this.readThis(input, fileIndex);
    }
  }

  remove(i: number): void {
    this.addedfiles.splice(i, 1);
  }

  addNewAttachment(): void {
    this.index = 0;
    this.addedfiles.push({ file: '', description: '' });
  }

  private readThis(inputValue: HTMLInputElement, fileIndex: number): void {
    if (inputValue.files && inputValue.files[0]) {
      this.file = inputValue.files[0];
      this.fileName = this.file.name;

      const myReader = new FileReader();
      myReader.readAsDataURL(this.file);
      myReader.onloadend = () => {
        if (myReader.result) {
          this.fileContent = (myReader.result as string).split(',')[1];
          this.fileType = (myReader.result as string)
            .split(',')[0]
            .split(':')[1]
            .split(';')[0];

          const fileInfo = this.addedfiles[fileIndex];
          fileInfo['addedBy'] = this.userName;
          fileInfo['attachmentFile'] = this.fileContent;
          fileInfo['attachmentId'] = 0;
          fileInfo['companyId'] = this.companyId;
          fileInfo['contentType'] = this.fileType;
          fileInfo['dateAdded'] = new Date().toISOString();
          fileInfo['entityId'] = this.companyId;
          fileInfo['isNew'] = 1;
          fileInfo['moduleType'] = 'companytype';
          fileInfo['fileName'] = this.fileName;
        }
      };
    }
  }

  print(): void {
    this.helpFlag = false;
    window.print();
  }

  help(): void {
    this.helpFlag = !this.helpFlag;
  }
}
