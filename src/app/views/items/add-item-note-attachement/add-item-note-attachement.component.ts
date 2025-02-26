import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
export class AddItemNoteAttachementComponent implements OnInit {
  model: any = {};
  index: number = 0;
  date = Date.now();
  companyId: number = 0;
  companyName: string;
  private sub: any;
  id: number;
  router: Router;
  private fileContent: string = '';
  private fileName: any;
  public fileType: any = '';
  globalCompany: any;
  itemId: any;
  file: File;
  itemRank: any;
  userName: any;
  dismissible = true;
  addedfiles: any = [];
  currentItemId: any;
  noteAttachmentTitle: any;
  helpFlag: any = false;
  itemTag: any;
  itemType: any;
  loader = false;
  highestRank : any;
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
      this.companyId = value.companyid;
    });

    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany) {
      this.companyName = this.globalCompany.name;
      this.companyId = this.globalCompany.companyid;
    }
    this.itemId = route.snapshot.params['id'];
    this.currentItemId = route.snapshot.params['itemId'];
    console.log('itemid=' + this.itemId);
    this.router = router;
  }

  ngOnInit() {
    this.noteAttachmentTitle =
      this.broadcasterService.currentNoteAttachmentTitle;
    this.itemTag = this.broadcasterService.currentItemTag;
    this.itemType = this.broadcasterService.currentItemType;
    this.highestRank = sessionStorage.getItem('highestRank');
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
      formdata.append('addedby', this.userName);
      formdata.append('companyID', JSON.stringify(this.companyId));
      formdata.append(
        'description',
        this.model.description ? this.model.description : ''
      );
      formdata.append('entityid', JSON.stringify(this.itemId));
      formdata.append('moduleType', 'itemnotetype');

      var jsonArr = this.addedfiles;
      for (var i = 0; i < jsonArr.length; i++) {
        delete jsonArr[i]['file'];
      }
      var req = {
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
        (response) => {
          this.spinner.hide();

          window.scroll(0, 0);
          this.index = 1;
          setTimeout(() => {
            this.index = 0;
          }, 7000);
          this.router.navigate([
            '/items/noteAttachments/' + this.itemId + '/' + this.currentItemId,
          ]);
        },

        (error) => {
          this.spinner.hide();
        }
      );
    }
  }

  cancelItemDocument() {
    this.router.navigate([
      '/items/noteAttachments/' + this.itemId + '/' + this.currentItemId,
    ]);
  }

  fileChangeListener($event: { target: any }, fileIndex: any): void {
    //console.log(this.addedfiles)
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
        this.fileContent = myReader.result.split(',')[1];
        this.fileType = myReader.result
          .split(',')[0]
          .split(':')[1]
          .split(';')[0];
        const fileInfo = this.addedfiles[fileIndex];
        fileInfo['addedby'] = this.userName;
        fileInfo['attachmentFile'] = this.fileContent;
        fileInfo['attachmentid'] = 0;
        fileInfo['contenttype'] = this.fileType;
        fileInfo['companyID'] = this.companyId;
        fileInfo['dateadded'] = new Date().toISOString();
        fileInfo['entityid'] = this.itemId;
        fileInfo['isNew'] = 1;
        fileInfo['moduleType'] = 'itemnotetype';
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
