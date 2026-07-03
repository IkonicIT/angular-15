import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ItemAttachmentsService } from '../../../services/Items/item-attachments.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { ItemManagementService } from '../../../services/Items/item-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BroadcasterService } from '../../../services/broadcaster.service';
import { LocationManagementService } from '../../../services';

@Component({
  selector: 'app-add-location-note-attachments',
  templateUrl: './add-location-note-attachments.component.html',
  styleUrls: ['./add-location-note-attachments.component.scss'],
})
export class AddLocationNoteAttachmentsComponent implements OnInit {
  model: any = {};
  index: number = 0;
  date: number = Date.now();
  companyId: number = 0;
  companyName: string = '';
  id: number = 0;
  private fileContent: string = '';
  private fileName: string | null = null;
  public fileType: string = '';
  globalCompany: any;
  entityId: number = 0;
  file!: File;
  userName: string | null = null;
  addedfiles: any[] = [];
  noteName: string = '';
  locationName: string = '';
  dismissible: boolean = true;
  loader: boolean = false;

  constructor(
    private itemAttachmentsService: ItemAttachmentsService,
    private companyManagementService: CompanyManagementService,
    private itemManagementService: ItemManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private broadcasterService: BroadcasterService,
    private locationManagementService: LocationManagementService
  ) {
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyName = value?.name ?? '';
      this.companyId = value?.companyId ?? 0;
    });

    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany) {
      this.companyName = this.globalCompany.name ?? '';
      this.companyId = this.globalCompany.companyId ?? 0;
    }

    this.entityId = +this.route.snapshot.params['noteId'] || 0;
  }

  ngOnInit(): void {
    this.noteName = this.broadcasterService.currentNoteAttachmentTitle ?? '';
    this.locationName = this.locationManagementService.currentLocationName ?? '';
    this.userName = sessionStorage.getItem('userName');
    this.addedfiles.push({ file: '', description: '' });
  }

  saveLocationNoteAttachment(): void {
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
    formdata.append('file', this.file);
    formdata.append('addedBy', this.userName ?? '');
    formdata.append('entityId', JSON.stringify(this.companyId));
    formdata.append('description', this.model.description ?? '');
    formdata.append('entityId', JSON.stringify(this.entityId));
    formdata.append('moduleType', 'itemType');

    const jsonArr = this.addedfiles.map((file) => {
      const { file: _, ...rest } = file;
      return rest;
    });

    const req = {
      attachmentResourceList: jsonArr,
      attachmentUserLogDTO: {
        noteType: 'locationnoteattachment',
        noteName: this.noteName,
        locationName: this.locationName,
      },
    };

    this.spinner.show();

    this.itemAttachmentsService.saveItemMultipleDocuments(req).subscribe(
      () => {
        this.spinner.hide();
        window.scroll(0, 0);
        this.index = 1;
        setTimeout(() => (this.index = 0), 7000);
        this.router.navigate([
          `/location/noteAttchments/${this.entityId}/${this.entityId}`,
        ]);
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  cancelLocationDocument(): void {
    this.router.navigate([
      `/location/noteAttchments/${this.entityId}/${this.entityId}`,
    ]);
  }

  fileChangeListener(event: { target: any }, fileIndex: number): void {
    this.readThis(event.target, fileIndex);
  }

  addNewAttachment(): void {
    this.index = 0;
    this.addedfiles.push({ file: '', description: '' });
  }

  remove(i: number): void {
    this.addedfiles.splice(i, 1);
  }

  readThis(inputValue: any, fileIndex: number): void {
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
        fileInfo['addedBy'] = this.userName ?? '';
        fileInfo['attachmentFile'] = this.fileContent;
        fileInfo['attachmentId'] = 0;
        fileInfo['contentType'] = this.fileType;
        fileInfo['companyId'] = this.companyId;
        fileInfo['dateAdded'] = new Date().toISOString();
        fileInfo['entityId'] = this.entityId;
        fileInfo['isNew'] = 1;
        fileInfo['moduleType'] = 'itemnotetype';
        fileInfo['fileName'] = this.fileName;
      };
    }
  }
}
