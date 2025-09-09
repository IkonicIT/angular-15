import { Component, OnInit, OnDestroy } from '@angular/core';
import { CompanyDocumentsService } from '../../../services/company-documents.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import { CranesService } from 'src/app/services/cranes.service';
import { Subscription } from 'rxjs';

interface AttachmentFile {
  file?: string;
  description?: string;
  createdBy?: string;
  craneNoteId?: number | string;
  attachmentFile?: string;
  vendorAttachmentId?: number;
  contentType?: string;
  isNew?: number;
  moduleType?: string;
  fileName?: string;
  createdDate?: string;
}

@Component({
  selector: 'app-add-crane-note-attachment',
  templateUrl: './add-crane-note-attachment.component.html',
  styleUrls: ['./add-crane-note-attachment.component.scss'],
})
export class AddCraneNoteAttachmentComponent implements OnInit, OnDestroy {
  model: any = {};
  index = 0;
  date = Date.now();
  companyId = 0;
  vendorName = '';
  id!: number;
  fileContent = '';
  fileName = '';
  description = '';
  fileType = '';
  globalCompany: any;
  helpFlag = false;
  addedfiles: AttachmentFile[] = [];
  file!: File;
  userName: string | null = '';
  dismissible = true;
  craneNoteId: number | string | null = null;

  private subscriptions: Subscription[] = [];

  constructor(
    private readonly companyDocumentsService: CompanyDocumentsService,
    private readonly companyManagementService: CompanyManagementService,
    private readonly router: Router,
    private readonly location: Location,
    private readonly route: ActivatedRoute,
    private readonly spinner: NgxSpinnerService,
    private readonly cranesService: CranesService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.companyManagementService.globalCompanyChange.subscribe((value) => {
        this.globalCompany = value;
        this.vendorName = value.name;
        this.companyId = value.companyId;
        this.userName = sessionStorage.getItem('userName');
      })
    );

    this.subscriptions.push(
      this.route.queryParams.subscribe((params) => {
        this.craneNoteId = +params['q'] || 0;
      })
    );

    this.subscriptions.push(
      this.route.paramMap.subscribe((params) => {
        this.craneNoteId = params.get('id');
        // console.log('Part ID:', this.craneNoteId);
      })
    );

    this.addedfiles.push({ file: '', description: '' });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  saveCompanyDocument(): void {
    let noFileChosen = true;
    this.addedfiles.forEach((element: AttachmentFile) => {
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
      return;
    }

    const formdata: FormData = new FormData();
    if (this.file) {
      formdata.append('file', this.file);
    }
    formdata.append('createdBy', this.userName || '');
    formdata.append('companyId', JSON.stringify(this.companyId));
    formdata.append('description', this.model.description || '');
    formdata.append('entityId', JSON.stringify(this.companyId));
    formdata.append('moduleType', 'companytype');

    const jsonArr = this.addedfiles.map(({ file, ...rest }) => ({ ...rest }));
    const req = {
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
    });
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

  fileChangeListener(event: Event, fileIndex: number): void {
    const input = event.target as HTMLInputElement;
    this.readThis(input, fileIndex);
  }

  remove(i: number): void {
    this.addedfiles.splice(i, 1);
  }

  addNewAttachment(): void {
    this.index = 0;
    this.addedfiles.push({ file: '', description: '' });
  }

  private readThis(input: HTMLInputElement, fileIndex: number): void {
    if (input.files && input.files[0]) {
      this.file = input.files[0];
      this.fileName = this.file.name;

      const myReader = new FileReader();
      myReader.readAsDataURL(this.file);

      myReader.onloadend = () => {
        if (typeof myReader.result === 'string') {
          this.fileContent = myReader.result.split(',')[1];
          this.fileType = myReader.result.split(',')[0].split(':')[1].split(';')[0];

          const fileInfo = this.addedfiles[fileIndex];
          fileInfo.createdBy = this.userName || '';
          fileInfo.craneNoteId = this.craneNoteId ?? undefined;;
          fileInfo.attachmentFile = this.fileContent;
          fileInfo.vendorAttachmentId = 0;
          fileInfo.contentType = this.fileType;
          fileInfo.isNew = 1;
          fileInfo.moduleType = 'companytype';
          fileInfo.fileName = this.fileName;
          fileInfo.description = this.description;
          fileInfo.createdDate = new Date().toISOString();
        }
      };
    }
  }
}