import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ItemAttachmentsService } from '../../../services/Items/item-attachments.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ItemManagementService } from '../../../services/Items/item-management.service';
import { BroadcasterService } from '../../../services/broadcaster.service';

@Component({
  selector: 'app-add-item-attachment',
  templateUrl: './add-item-attachment.component.html',
  styleUrls: ['./add-item-attachment.component.scss'],
})
export class AddItemAttachmentComponent implements OnInit, OnDestroy {
  model: any = {};
  index = 0;
  date = Date.now();
  companyId = 0;
  companyName = '';
  private globalCompanySub: Subscription | null = null;
  id!: number;
  public file!: File;
  router: Router;
  private fileContent = '';
  private fileName: string | null = null;
  public fileType: string = '';
  globalCompany: any;
  itemId: any;
  userName: any;
  currentAttachmentId: any;
  itemTag: any;
  itemType: any;
  helpFlag = false;
  addedfiles: Array<any> = [];
  setDefault: any = 'false';
  dismissible = true;
  loader = false;

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
    this.currentAttachmentId = this.route.snapshot.params['attachmentId'];
  }

  ngOnInit(): void {
    this.itemTag = this.broadcasterService.currentItemTag;
    this.itemType = this.broadcasterService.currentItemType;
    this.userName = sessionStorage.getItem('userName');
    this.addedfiles.push({ file: '', description: '' });
  }

  ngOnDestroy(): void {
    if (this.globalCompanySub) {
      this.globalCompanySub.unsubscribe();
      this.globalCompanySub = null;
    }
  }

  saveItemDocument(): void {
    let noFileChosen = true;
    const addedFiles = this.addedfiles;
    addedFiles.forEach(function (element: { attachmentFile: undefined } & any) {
      if (element.attachmentFile === undefined) {
        noFileChosen = false;
      }
    });

    if (!noFileChosen) {
      this.index = -1;
      window.scroll(0, 0);
    } else {
      const formdata: FormData = new FormData();
      if (this.file) {
        formdata.append('file', this.file);
      }
      formdata.append('addedBy', this.userName ?? '');
      formdata.append('companyId', JSON.stringify(this.companyId));
      formdata.append('description', this.model.description ? this.model.description : '');
      formdata.append('entityId', JSON.stringify(this.itemId));
      formdata.append('moduleType', 'itemnotetype');
      const jsonArr = this.addedfiles;
      for (let i = 0; i < jsonArr.length; i++) {
        delete jsonArr[i]['file'];
      }

      const req = {
        attachmentResourceList: jsonArr,
        attachmentUserLogDTO: {
          itemTag: this.itemTag,
          itemTypeName: this.itemType,
        },
      };

      this.spinner.show();

      this.itemAttachmentsService.saveItemMultipleDocuments(req).subscribe(
        (response: any) => {
          this.spinner.hide();

          if (this.setDefault === 'true') {
            const length = response.length;
            this.setAsDefault(response[length - 1]);
          } else {
            this.router.navigate(['/items/attachments/' + this.itemId + '/' + this.currentAttachmentId]);
          }
        },
        (error: any) => {
          this.spinner.hide();
        }
      );
    }
  }

  cancelItemDocument(): void {
    this.router.navigate(['/items/attachments/' + this.itemId + '/' + this.currentAttachmentId]);
  }

  setAsDefault(res: { contentType: any; attachmentId: string }): void {
    const contentype = res.contentType;
    if (typeof contentype === 'string' && contentype.includes('image')) {
      this.spinner.show();

      this.itemAttachmentsService.updateItemDefaultImage(this.itemId, res.attachmentId).subscribe(
        (response: any) => {
          this.spinner.hide();

          this.currentAttachmentId = res.attachmentId;
          this.router.navigate(['/items/attachments/' + this.itemId + '/' + this.currentAttachmentId]);
        },
        (error: any) => {
          this.spinner.hide();
        }
      );
    } else {
      this.router.navigate(['/items/attachments/' + this.itemId + '/' + this.currentAttachmentId]);
    }
  }

  print(): void {
    this.helpFlag = false;
    window.print();
  }

  help(): void {
    this.helpFlag = !this.helpFlag;
  }

  remove(i: number): void {
    this.addedfiles.splice(i, 1);
  }

  addNewAttachment(): void {
    this.index = 0;
    this.addedfiles.push({ file: '', description: '' });
  }
  fileChangeListener(event: Event, fileIndex: number): void {
    const target = event.target as HTMLInputElement;
    this.readThis(target, fileIndex);
  }

  readThis(inputValue: HTMLInputElement, fileIndex: number): void {
    if (inputValue.files && inputValue.files[0]) {
      this.file = inputValue.files[0];
      this.fileName = this.file.name;

      const myReader = new FileReader();
      myReader.readAsDataURL(this.file);
      myReader.onloadend = () => {
        const result = (myReader.result as string) || '';
        const parts = result.split(',');
        this.fileContent = parts[1] ?? '';
        this.fileType = (parts[0] || '').split(':')[1]?.split(';')[0] ?? '';

        const fileInfo = this.addedfiles[fileIndex];
        fileInfo['addedBy'] = this.userName;
        fileInfo['attachmentFile'] = this.fileContent;
        fileInfo['attachmentId'] = 0;
        fileInfo['contentType'] = this.fileType;
        fileInfo['dateAdded'] = new Date().toISOString();
        fileInfo['companyId'] = this.companyId;
        fileInfo['entityId'] = this.itemId;
        fileInfo['isNew'] = 1;
        fileInfo['moduleType'] = 'itemType';
        fileInfo['fileName'] = this.fileName;
      };
    }
  }
}
