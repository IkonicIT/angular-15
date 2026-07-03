import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ItemAttachmentsService } from '../../../services/Items/item-attachments.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { ItemManagementService } from '../../../services/Items/item-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BroadcasterService } from '../../../services/broadcaster.service';

@Component({
  selector: 'app-add-item-note-attachement',
  templateUrl: './add-item-note-attachement.component.html',
  styleUrls: ['./add-item-note-attachement.component.scss'],
})
export class AddItemNoteAttachementComponent implements OnInit, OnDestroy {
  model: any = {};
  index = 0;
  date = Date.now();

  companyId = 0;
  companyName = '';
  globalCompany: any;

  id!: number;
  router: Router;

  private fileContent = '';
  private fileName: string | null = null;
  public fileType = '';
  public file!: File;

  itemId: any;
  currentItemId: any;
  itemRank: any;
  highestRank: any;

  userName: any;
  dismissible = true;
  addedfiles: Array<any> = [];
  noteAttachmentTitle: any;
  helpFlag = false;

  itemTag: any;
  itemType: any;
  loader = false;

  private globalCompanySub?: Subscription;

  constructor(
    private itemAttachmentsService: ItemAttachmentsService,
    private companyManagementService: CompanyManagementService,
    private itemManagementService: ItemManagementService,
    router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private broadcasterService: BroadcasterService
  ) {
    this.router = router;

    this.globalCompanySub = this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyName = value?.name ?? '';
      this.companyId = value?.companyId ?? 0;
    });

    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany) {
      this.companyName = this.globalCompany.name;
      this.companyId = this.globalCompany.companyId;
    }

    this.itemId = this.route.snapshot.params['id'];
    this.currentItemId = this.route.snapshot.params['itemId'];
  }

  ngOnInit(): void {
    this.noteAttachmentTitle = this.broadcasterService.currentNoteAttachmentTitle;
    this.itemTag = this.broadcasterService.currentItemTag;
    this.itemType = this.broadcasterService.currentItemType;

    this.highestRank = sessionStorage.getItem('highestRank');
    this.userName = sessionStorage.getItem('userName');

    this.addedfiles.push({ file: '', description: '' });
  }

  ngOnDestroy(): void {
    this.globalCompanySub?.unsubscribe();
  }

  saveItemDocument(): void {
    let noFileChosen = true;
    this.addedfiles.forEach((element: any) => {
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
    formdata.append('addedBy', this.userName ?? '');
    formdata.append('companyId', JSON.stringify(this.companyId));
    formdata.append('description', this.model.description ?? '');
    formdata.append('entityId', JSON.stringify(this.itemId));
    formdata.append('moduleType', 'itemnotetype');

    const jsonArr = this.addedfiles;
    for (let i = 0; i < jsonArr.length; i++) {
      delete jsonArr[i]['file'];
    }

    const req = {
      attachmentResourceList: jsonArr,
      attachmentUserLogDTO: {
        noteType: 'itemnoteattachment',
        noteName: this.noteAttachmentTitle,
        itemTag: this.itemTag,
        itemTypeName: this.itemType,
      },
    };

    this.spinner.show();

    this.itemAttachmentsService.saveItemMultipleDocuments(req).subscribe(
      () => {
        this.spinner.hide();
        window.scroll(0, 0);
        this.index = 1;
        setTimeout(() => {
          this.index = 0;
        }, 7000);

        this.router.navigate(['/items/noteAttachments/' + this.itemId + '/' + this.currentItemId]);
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  cancelItemDocument(): void {
    this.router.navigate(['/items/noteAttachments/' + this.itemId + '/' + this.currentItemId]);
  }

  fileChangeListener(event: Event, fileIndex: number): void {
    const target = event.target as HTMLInputElement;
    this.readThis(target, fileIndex);
  }

  remove(i: number): void {
    this.addedfiles.splice(i, 1);
  }

  addNewAttachment(): void {
    this.index = 0;
    this.addedfiles.push({ file: '', description: '' });
  }

  readThis(inputValue: HTMLInputElement, fileIndex: number): void {
    if (inputValue.files && inputValue.files[0]) {
      this.file = inputValue.files[0];
      this.fileName = this.file.name;

      const myReader = new FileReader();
      myReader.readAsDataURL(this.file);
      myReader.onloadend = () => {
        const result = (myReader.result as string) ?? '';
        this.fileContent = result.split(',')[1] ?? '';
        this.fileType = result.split(',')[0]?.split(':')[1]?.split(';')[0] ?? '';

        const fileInfo = this.addedfiles[fileIndex];
        fileInfo['addedBy'] = this.userName;
        fileInfo['attachmentFile'] = this.fileContent;
        fileInfo['attachmentId'] = 0;
        fileInfo['contentType'] = this.fileType;
        fileInfo['companyId'] = this.companyId;
        fileInfo['dateAdded'] = new Date().toISOString();
        fileInfo['entityId'] = this.itemId;
        fileInfo['isNew'] = 1;
        fileInfo['moduleType'] = 'itemnotetype';
        fileInfo['fileName'] = this.fileName;
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
