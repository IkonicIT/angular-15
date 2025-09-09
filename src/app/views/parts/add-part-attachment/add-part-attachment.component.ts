import { Component, OnInit, OnDestroy } from '@angular/core';
import { CompanyDocumentsService } from '../../../services/company-documents.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { PartsService } from 'src/app/services/parts.service';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-part-attachment',
  templateUrl: './add-part-attachment.component.html',
  styleUrls: ['./add-part-attachment.component.scss'],
})
export class AddPartAttachmentComponent implements OnInit, OnDestroy {
  model: any = {};
  index: number = 0;
  date = Date.now();
  companyId: number = 0;
  vendorName: string = '';
  id!: number | null;
  dismissible: boolean = true;
  private fileContent: string = '';
  private fileName: string = '';
  private description: string = '';
  public fileType: string = '';
  globalCompany: any;
  helpFlag: boolean = false;
  addedfiles: any[] = [];
  public file!: File;
  userName: string | null = '';
  partNoteId: any;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private companyDocumentsService: CompanyDocumentsService,
    private companyManagementService: CompanyManagementService,
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private partService: PartsService
  ) {
    const companySub = this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.vendorName = value?.name || '';
      this.companyId = value?.companyId || 0;
      this.userName = sessionStorage.getItem('userName');
    });
    this.subscriptions.add(companySub);

    const querySub = this.route.queryParams.subscribe((params) => {
      this.partNoteId = +params['q'] || 0;
    });
    this.subscriptions.add(querySub);

    const routeSub = this.route.paramMap.subscribe((params) => {
      this.partNoteId = params.get('id');
    });
    this.subscriptions.add(routeSub);
  }

  ngOnInit(): void {
    this.addedfiles.push({ file: '', description: '' });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
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
    } else {
      const formdata: FormData = new FormData();
      formdata.append('file', this.file);
      formdata.append('addedBy', this.userName || '');
      formdata.append('companyId', JSON.stringify(this.companyId));
      formdata.append('description', this.model.description ? this.model.description : '');
      formdata.append('entityId', JSON.stringify(this.companyId));
      formdata.append('moduleType', 'companytype');

      const jsonArr = [...this.addedfiles];
      for (let i = 0; i < jsonArr.length; i++) {
        delete jsonArr[i]['file'];
      }

      const req = { partAttachmentsList: jsonArr };

      this.spinner.show();
      this.partService.addPartAttachment(req).subscribe({
        next: () => {
          this.spinner.hide();
          window.scroll(0, 0);
          this.index = 1;
          setTimeout(() => {
            this.index = 0;
            this.cancelVendorDocument();
          }, 5000);
        },
        error: () => {
          this.spinner.hide();
        },
      });
    }
  }



  cancelVendorDocument(): void {
    this.location.back();
  }

  print(): void {
    this.helpFlag = false;
    window.print();
  }

  help(): void {
    this.helpFlag = !this.helpFlag;
  }

  fileChangeListener($event: Event, fileIndex: number): void {
    const target = $event.target as HTMLInputElement;
    if (target?.files) {
      this.readThis(target, fileIndex);
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
        const result = myReader.result as string;
        this.fileContent = result.split(',')[1];
        this.fileType = result.split(',')[0].split(':')[1].split(';')[0];

        const fileInfo = this.addedfiles[fileIndex];
        fileInfo['createdBy'] = this.userName;
        fileInfo['partNoteId'] = this.partNoteId;
        fileInfo['attachmentFile'] = this.fileContent;
        fileInfo['vendorAttachmentId'] = 0;
        fileInfo['contentType'] = this.fileType;
        fileInfo['isNew'] = 1;
        fileInfo['moduleType'] = 'companytype';
        fileInfo['fileName'] = this.fileName;
        fileInfo['description'] = this.description;
        fileInfo['createdDate'] = new Date().toISOString();
      };
    }
  }
}
