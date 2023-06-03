import { Component, OnInit } from '@angular/core';
import { CompanyDocumentsService } from '../../../services/index';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyManagementService } from '../../../services/index';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import { ItemAttachmentsService } from '../../../services/Items/item-attachments.service';
import { TemplateRef, SecurityContext } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BroadcasterService } from '../../../services/broadcaster.service';

@Component({
  selector: 'app-item-changelog-attachments',
  templateUrl: './item-changelog-attachments.component.html',
  styleUrls: ['./item-changelog-attachments.component.scss'],
})
export class ItemChangelogAttachmentsComponent implements OnInit {
  model: any = {};
  editModel: any = {};
  message: string;
  modalRef: BsModalRef;
  index: number = 0;
  date = Date.now();
  companyId: number = 0;
  private sub: any;
  id: number;
  itemRank: any;
  router: Router;
  private fileContent: string = '';
  private fileName: any;
  public fileType: any = '';
  public file: File;
  globalCompany: any;
  journalId: any;
  loggedInuser: any;
  documents: any;
  userName: any;
  authToken: string | null;
  order: string = 'description';
  reverse: string = '';
  documentFilter: any = '';
  itemsForPagination: any = 5;
  deleteId: any;
  EditFlag: any = false;
  editIndex: number;
  itemId: any;
  addedfiles: any = [];
  helpFlag: any = false;
  p: any;
  itemTag: any;
  itemType: any;
  noteAttachmentTitle: any;
  dismissible = true;

  constructor(
    private companyDocumentsService: CompanyDocumentsService,
    private companyManagementService: CompanyManagementService,
    router: Router,
    private _location: Location,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private itemAttachmentsService: ItemAttachmentsService,
    private modalService: BsModalService,
    private broadcasterService: BroadcasterService
  ) {
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value.companyid;
    });
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany) {
      this.companyId = this.globalCompany.companyid;
    }
    this.loggedInuser = sessionStorage.getItem('userId');
    this.journalId = route.snapshot.params['journalId'];
    this.itemId = route.snapshot.params['itemId'];
    this.router = router;
    this.getAllAttachments(this.journalId);
  }

  ngOnInit() {
    this.itemRank = this.broadcasterService.itemRank;
    this.itemTag = this.broadcasterService.currentItemTag;
    this.itemType = this.broadcasterService.currentItemType;
    this.noteAttachmentTitle =
      this.broadcasterService.currentNoteAttachmentTitle;
    this.authToken = sessionStorage.getItem('auth_token');
    this.userName = sessionStorage.getItem('userName');
    this.addedfiles.push({ file: '', description: '' });
  }

  getAllAttachments(journalId: any) {
    if (journalId != 0) {
      this.spinner.show();
      this.itemAttachmentsService.getAllItemNoteDocuments(journalId).subscribe(
        (response) => {
          this.spinner.hide();
          console.log(response);
          this.documents = response;
        },
        (error) => {
          this.spinner.hide();
        }
      );
    }
  }

  saveChangeLogAttachment() {
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
          noteType: 'itemchangelogattachment',
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
            '/items/changeLog/' + this.itemId + '/' + this.journalId,
          ]);
          this.getAllAttachments(this.journalId);
        },

        (error) => {
          this.spinner.hide();
        }
      );
    }
  }

  setOrder(value: string) {
    if (this.order === value) {
      if (this.reverse == '') {
        this.reverse = '-';
      } else {
        this.reverse = '';
      }
    }
    this.order = value;
  }

  fileChangeListener(
    $event: { target: any },
    fileIndex: string | number
  ): void {
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
        fileInfo['dateadded'] = new Date().toISOString();
        fileInfo['entityid'] = this.journalId;
        fileInfo['isNew'] = 1;
        fileInfo['moduleType'] = 'itemnotetype';
        fileInfo['companyID'] = this.companyId;
        fileInfo['filename'] = this.fileName;
        console.log(this.addedfiles);
      };
    }
  }

  cancel() {
    this._location.back();
  }

  download(changeLogDocument: { isNew: boolean }) {
    if (changeLogDocument.isNew == false) {
      this.downloadFile(changeLogDocument);
    } else {
      this.downloadDocumentFromDB(changeLogDocument);
    }
  }

  downloadDocumentFromDB(document: { isNew?: boolean; attachmentid?: any }) {
    this.spinner.show();
    this.itemAttachmentsService
      .getItemDocuments(document.attachmentid)
      .subscribe(
        (response) => {
          this.spinner.hide();
          this.downloadDocument(response);
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }

  downloadDocument(companyDocument: any) {
    var blob = this.companyDocumentsService.b64toBlob(
      companyDocument.attachmentFile,
      companyDocument.contenttype
    );
    var fileURL = URL.createObjectURL(blob);
    window.open(fileURL);
  }

  downloadFile(attachment: {
    isNew?: boolean;
    filename?: any;
    attachmentid?: any;
  }) {
    var index = attachment.filename.lastIndexOf('.');
    var extension = attachment.filename.slice(index + 1);
    if (extension.toLowerCase() == 'pdf' || extension.toLowerCase() == 'txt') {
      var wnd = window.open('about:blank');
      var pdfStr = `<div style="text-align:center">
  <h4>Pdf viewer</h4>
  <iframe  id="iFrame" src="https://docs.google.com/viewer?url=https://gotracrat.com:8088/api/attachment/downloadaudiofile/${
    attachment.attachmentid + '?access_token=' + this.authToken
  }&embedded=true" frameborder="0" height="650px" width="100%"></iframe>
    </div>
    <script>
        function reloadIFrame() {
          var iframe = document.getElementById("iFrame");
            console.log(iframe); //work control
            console.log(iframe.contentDocument); //work control
            if(iframe.contentDocument.URL == "about:blank"){
              console.log("loaded");
              iframe.src =  iframe.src;
            }
          }
          var timerId = setInterval("reloadIFrame();", 1300);
          setTimeout(() => {
            clearInterval(timerId);
            console.log("Finally Loaded");
            }, 25000);

          $( document ).ready(function() {
              $('#menuiFrame').on('load', function() {
                  clearInterval(timerId);
                  console.log("Finally Loaded"); //work control
              });
          });
        </script>
    `;

      if (wnd) wnd.document.write(pdfStr);
    } else if (
      extension.toLowerCase() == 'jpg' ||
      extension.toLowerCase() == 'png' ||
      extension.toLowerCase() == 'jpeg' ||
      extension.toLowerCase() == 'gif'
    ) {
      var pdfStr = `<div style="text-align:center">
    <h4>Image Viewer</h4>
    <img src="https://gotracrat.com:8088/api/attachment/downloadaudiofile/${
      attachment.attachmentid + '?access_token=' + this.authToken
    }&embedded=true" >
      </div>`;
      var wnd = window.open('about:blank');
      if (wnd) wnd.document.write(pdfStr);
    } else {
      window.open(
        'https://gotracrat.com:8088/api/attachment/downloadaudiofile/' +
          attachment.attachmentid +
          '?access_token=' +
          this.authToken
      );
    }
  }
  openModal(template: TemplateRef<any>, id: any) {
    this.deleteId = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  editNoteDocument(document: { attachmentid: number }) {
    this.EditFlag = true;
    this.spinner.show();
    this.companyDocumentsService
      .getCompanyDocuments(document.attachmentid)
      .subscribe(
        (response) => {
          this.spinner.hide();
          this.editModel = response;
        },
        (error) => {
          this.spinner.hide();
        }
      );
    window.scroll(0, 0);
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();
    let userLog = {
      noteType: 'itemchangelogattachment',
      noteName: this.noteAttachmentTitle,
      itemTag: this.itemTag,
      itemTypeName: this.itemType,
    };

    this.itemAttachmentsService
      .removeItemNoteDocuments(
        this.deleteId,
        this.companyId,
        this.userName,
        userLog
      )
      .subscribe(
        (response) => {
          this.spinner.hide();
          this.modalRef.hide();
          this.refresh();
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef.hide();
  }
  refresh() {
    this.documents = [];
    this.getAllAttachments(this.journalId);
  }

  cancelEditDocument() {
    this.editIndex = 0;
    this.EditFlag = false;
  }
  updateCompanyDocument() {
    this.spinner.show();
    this.editModel.moduleType = 'itemnotetype';
    this.editModel.companyID = this.companyId;
    this.editModel.updatedBy = this.userName;
    this.editModel.attachmentUserLogDTO = {
      noteType: 'itemchangelogattachment',
      noteName: this.noteAttachmentTitle,
      itemTag: this.itemTag,
      itemTypeName: this.itemType,
    };
    this.companyDocumentsService
      .updateCompanyDocument(this.editModel)
      .subscribe(
        (response) => {
          this.spinner.hide();
          window.scroll(0, 0);
          this.editIndex = 1;
          setTimeout(() => {
            this.index = 0;
          }, 7000);
          this.getAllAttachments(this.journalId);
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }
  print() {
    this.helpFlag = false;
    window.print();
  }
  help() {
    this.helpFlag = !this.helpFlag;
  }
}
