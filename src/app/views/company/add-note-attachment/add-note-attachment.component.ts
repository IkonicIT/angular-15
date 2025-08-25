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
  companyName: string;
  private sub: any;
  id: number;
  router: Router;
  private fileContent: string = '';
  private fileName: any;
  public fileType: any = '';
  globalCompany: any;
  entityId: any;
  file: File;
  userName: any;
  addedfiles: any = [];
  helpFlag: any = false;
  noteName: any;
  loader = false;

  constructor(
    private itemAttachmentsService: ItemAttachmentsService,
    private companyManagementService: CompanyManagementService,
    private itemManagementService: ItemManagementService,
    private companyDocumentsService: CompanyDocumentsService,
    router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private broadcasterService: BroadcasterService
  ) {
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    var globalCompanyName = sessionStorage.getItem('globalCompany');
    if (this.globalCompany) {
      this.companyName = this.globalCompany.name;
      this.companyId = this.globalCompany.companyId;
    }

    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyName = value.name;
      this.companyId = value.companyId;
    });

    this.entityId = route.snapshot.params['noteId'];
    console.log('entityId=' + this.entityId);
    this.router = router;
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName');
    this.noteName = this.broadcasterService.currentNoteAttachmentTitle;
    this.addedfiles.push({ file: '', description: '' });
  }

  saveNoteDocument() {
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
      formdata.append('entityId', JSON.stringify(this.entityId));
      formdata.append('moduleType', 'itemnotetype');
      var jsonArr = this.addedfiles;
      for (var i = 0; i < jsonArr.length; i++) {
        delete jsonArr[i]['file'];
      }
      console.log(jsonArr);
      var req = {
        attachmentResourceList: jsonArr,
        attachmentUserLogDTO: {
          noteType: 'companynoteattachment',
          noteName: this.noteName,
        },
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
          this.router.navigate([
            '/company/noteAttchments/' + this.entityId + '/' + this.entityId,
          ]);
        },
        (error) => {
          this.spinner.hide();
        }
      );
    }
  }

  cancelCompanyNoteDocument() {
    this.router.navigate([
      '/company/noteAttchments/' + this.entityId + '/' + this.entityId,
    ]);
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
