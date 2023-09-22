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
  noteName: any;
  locationName: any;
  dismissible = true;
  loader = false;
  constructor(
    private itemAttachmentsService: ItemAttachmentsService,
    private companyManagementService: CompanyManagementService,
    private itemManagementService: ItemManagementService,
    router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private broadcasterService: BroadcasterService,
    private locationManagementService: LocationManagementService
  ) {
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyName = value.name;
      this.companyId = value.companyid;
    });

    this.globalCompany = this.companyManagementService.getGlobalCompany();
    //var globalCompanyName = sessionStorage.getItem('globalCompany');
    if (this.globalCompany) {
      this.companyName = this.globalCompany.name;
      this.companyId = this.globalCompany.companyid;
    }

    this.entityId = route.snapshot.params['noteId'];
    console.log('entityId=' + this.entityId);
    this.router = router;
  }

  ngOnInit() {
    this.noteName = this.broadcasterService.currentNoteAttachmentTitle;
    this.locationName = this.locationManagementService.currentLocationName;
    this.userName = sessionStorage.getItem('userName');
    this.addedfiles.push({ file: '', description: '' });
  }

  saveLocationNoteAttachment() {
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
      formdata.append('entityid', JSON.stringify(this.companyId));
      formdata.append(
        'description',
        this.model.description ? this.model.description : ''
      );
      formdata.append('entityid', JSON.stringify(this.entityId));
      formdata.append('moduleType', 'itemtype');
      var jsonArr = this.addedfiles;
      for (var i = 0; i < jsonArr.length; i++) {
        delete jsonArr[i]['file'];
      }
      var req = {
        attachmentResourceList: jsonArr,
        attachmentUserLogDTO: {
          noteType: 'locationnoteattachment',
          noteName: this.noteName,
          locationName: this.locationName,
        },
      };
      this.spinner.show();
      this.loader = true;
      this.itemAttachmentsService.saveItemMultipleDocuments(req).subscribe(
        (response) => {
          this.spinner.hide();
          this.loader = false;
          window.scroll(0, 0);
          this.index = 1;
          setTimeout(() => {
            this.index = 0;
          }, 7000);
          this.router.navigate([
            '/location/noteAttchments/' + this.entityId + '/' + this.entityId,
          ]);
        },
        (error) => {
          this.spinner.hide();
          this.loader = false;
        }
      );
    }
  }

  cancelLocationDocument() {
    this.router.navigate([
      '/location/noteAttchments/' + this.entityId + '/' + this.entityId,
    ]);
  }

  fileChangeListener($event: { target: any }, fileIndex: any): void {
    //console.log(this.addedfiles)
    this.readThis($event.target, fileIndex);
  }

  addNewAttachment() {
    this.index = 0;
    this.addedfiles.push({ file: '', description: '' });
  }

  remove(i: number) {
    this.addedfiles.splice(i, 1);
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
        fileInfo['entityid'] = this.entityId;
        fileInfo['isNew'] = 1;
        fileInfo['moduleType'] = 'itemnotetype';
        //fileInfo['entitytypeid'] = 1;
        fileInfo['filename'] = this.fileName;
        console.log(this.addedfiles);
      };
    }
  }
}
