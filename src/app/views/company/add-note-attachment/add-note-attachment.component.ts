import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ItemAttachmentsService } from '../../../services/Items/item-attachments.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { ItemManagementService } from '../../../services/Items/item-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CompanyDocumentsService } from '../../../services/index';
import { BroadcasterService } from '../../../services/broadcaster.service';

@Component({
  selector: 'app-add-note-attachment',
  templateUrl: './add-note-attachment.component.html',
  styleUrls: ['./add-note-attachment.component.scss'],
})
export class AddNoteAttachmentComponent implements OnInit {
  model: any = {};
  index: number = 0;
  date = Date.now();
  companyId: number = 0;
  companyName: string = '';
  id!: number;
  private fileContent: string = '';
  private fileName: string = '';
  public fileType: string = '';
  globalCompany: any;
  entityId: any;
  file!: File;
  userName: string | null = '';
  addedfiles: any[] = [];
  helpFlag: boolean = false;
  noteName: string = '';
  loader = false;

  constructor(
    private itemAttachmentsService: ItemAttachmentsService,
    private companyManagementService: CompanyManagementService,
    private itemManagementService: ItemManagementService,
    private companyDocumentsService: CompanyDocumentsService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private broadcasterService: BroadcasterService
  ) {
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    const globalCompanyName = sessionStorage.getItem('globalCompany');

    if (this.globalCompany) {
      this.companyName = this.globalCompany.name;
      this.companyId = this.globalCompany.companyId;
    }

    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyName = value.name;
      this.companyId = value.companyId;
    });

    this.entityId = this.route.snapshot.params['noteId'];
  }

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('userName');
    this.noteName = this.broadcasterService.currentNoteAttachmentTitle;
    this.addedfiles.push({ file: '', description: '' });
  }

  saveNoteDocument(): void {
    let noFileChosen = true;
    const addedFiles = this.addedfiles;

    addedFiles.forEach((element: { attachmentFile?: string }) => {
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
      formdata.append('addedBy', this.userName ?? '');
      formdata.append('companyId', JSON.stringify(this.companyId));
      formdata.append(
        'description',
        this.model.description ? this.model.description : ''
      );
      formdata.append('entityId', JSON.stringify(this.entityId));
      formdata.append('moduleType', 'itemnotetype');

      const jsonArr = [...this.addedfiles];
      for (let i = 0; i < jsonArr.length; i++) {
        delete jsonArr[i]['file'];
      }
      const req = {

        attachmentResourceList: jsonArr,
        attachmentUserLogDTO: {
          noteType: 'companynoteattachment',
          noteName: this.noteName,
        },
      };

      this.spinner.show();

      this.companyDocumentsService.saveCompanyMultipleDocuments(req).subscribe(
        () => {
          this.spinner.hide();
          window.scroll(0, 0);
          this.index = 1;
          setTimeout(() => {
            this.index = 0;
          }, 7000);

          this.router.navigate([
            `/company/noteAttchments/${this.entityId}/${this.entityId}`,
          ]);
        },
        () => {
          this.spinner.hide();
        }
      );
    }
  }

  cancelCompanyNoteDocument(): void {
    this.router.navigate([
      `/company/noteAttchments/${this.entityId}/${this.entityId}`,
    ]);
  }

  fileChangeListener(event: Event, fileIndex: number): void {
    const target = event.target as HTMLInputElement;
    if (target?.files?.length) {
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
        if (typeof myReader.result === 'string') {
          this.fileContent = myReader.result.split(',')[1];
          this.fileType = myReader.result
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
          fileInfo['entityId'] = this.entityId;
          fileInfo['isNew'] = 1;
          fileInfo['moduleType'] = 'itemnotetype';
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
