import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
export class AddItemAttachmentComponent implements OnInit {
  model: any = {};
  index: number = 0;
  date = Date.now();
  companyId: number = 0;
  companyName: string;
  private sub: any;
  id: number;
  public file: File;
  router: Router;
  private fileContent: string = '';
  private fileName: any;
  public fileType: any = '';
  globalCompany: any;
  itemId: any;
  userName: any;
  currentAttachmentId: any;
  itemTag: any;
  itemType: any;
  helpFlag: any = false;
  addedfiles: any = [];
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
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyName = value.name;
      this.companyId = value.companyId;
    });
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany) {
      this.companyName = this.globalCompany.name;
      this.companyId = this.globalCompany.companyId;
    }
    this.itemId = route.snapshot.params['id'];
    this.currentAttachmentId = route.snapshot.params['attachmentId'];
    console.log('itemid=' + this.itemId);
    this.router = router;
  }

  ngOnInit() {
    this.itemTag = this.broadcasterService.currentItemTag;
    this.itemType = this.broadcasterService.currentItemType;
    this.userName = sessionStorage.getItem('userName');
    this.addedfiles.push({ file: '', description: '' });
  }

  saveItemDocument() {
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
      formdata.append('addedBy', this.userName);
      formdata.append('companyId', JSON.stringify(this.companyId));
      formdata.append(
        'description',
        this.model.description ? this.model.description : ''
      );
      formdata.append('entityId', JSON.stringify(this.itemId));
      formdata.append('moduleType', 'itemnotetype');

      var jsonArr = this.addedfiles;
      for (var i = 0; i < jsonArr.length; i++) {
        delete jsonArr[i]['file'];
      }
      var req = {
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

          if (this.setDefault == 'true') {
            var length = response.length;
            this.setAsDefault(response[length - 1]);
          } else {
            this.router.navigate([
              '/items/attachments/' +
                this.itemId +
                '/' +
                this.currentAttachmentId,
            ]);
          }
        },

        (error) => {
          this.spinner.hide();
        }
      );
    }
  }

  cancelItemDocument() {
    this.router.navigate([
      '/items/attachments/' + this.itemId + '/' + this.currentAttachmentId,
    ]);
  }

  setAsDefault(res: { contentType: any; attachmentId: string }) {
    var contentype = res.contentType;
    if (contentype.includes('image')) {
      this.spinner.show();

      this.itemAttachmentsService
        .updateItemDefaultImage(this.itemId, res.attachmentId)
        .subscribe(
          (response) => {
            this.spinner.hide();

            this.currentAttachmentId = res.attachmentId;
            this.router.navigate([
              '/items/attachments/' +
                this.itemId +
                '/' +
                this.currentAttachmentId,
            ]);
          },
          (error) => {
            this.spinner.hide();
          }
        );
    } else {
      this.router.navigate([
        '/items/attachments/' + this.itemId + '/' + this.currentAttachmentId,
      ]);
    }
  }

  print() {
    this.helpFlag = false;
    window.print();
  }

  help() {
    this.helpFlag = !this.helpFlag;
  }

  remove(i: number) {
    this.addedfiles.splice(i, 1);
  }

  addNewAttachment() {
    this.index = 0;
    this.addedfiles.push({ file: '', description: '' });
  }

  fileChangeListener($event: { target: any }, fileIndex: any): void {
    this.readThis($event.target, fileIndex);
  }

  readThis(inputValue: any, fileIndex: string | number): void {
    if (inputValue.files && inputValue.files[0]) {
      this.file = inputValue.files[0];
      this.fileName = this.file.name;

      var myReader: any = new FileReader();
      myReader.readAsDataURL(this.file);
      myReader.onloadend = (e: any) => {
        this.fileContent = myReader.result.split(',')[1];
        this.fileType = myReader.result
          .split(',')[0]
          .split(':')[1]
          .split(';')[0];
        const fileInfo = this.addedfiles[fileIndex];
        fileInfo['addedBy'] = this.userName;
        fileInfo['attachmentFile'] = this.fileContent;
        fileInfo['attachmentId'] = 0;
        fileInfo['contentType'] = this.fileType;
        fileInfo['dateAdded'] = new Date().toISOString();
        fileInfo['companyId'] = this.companyId;
        fileInfo['entityId'] = this.itemId;
        fileInfo['isNew'] = 1;
        fileInfo['moduleType'] = 'itemtype';
        fileInfo['fileName'] = this.fileName;
        console.log(this.addedfiles);
      };
    }
  }
}
