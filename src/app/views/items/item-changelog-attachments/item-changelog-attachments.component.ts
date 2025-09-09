import { Component, OnInit, TemplateRef } from '@angular/core';
import { CompanyDocumentsService } from '../../../services/index';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyManagementService } from '../../../services/index';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import { ItemAttachmentsService } from '../../../services/Items/item-attachments.service';
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
  modalRef!: BsModalRef;
  index: number = 0;
  date = Date.now();
  companyId: number = 0;
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
  addedfiles: any[] = [];
  helpFlag: any = false;
  p: any;
  itemTag: any;
  itemType: any;
  noteAttachmentTitle: any;
  dismissible = true;
  loader = false;

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
      this.companyId = value.companyId;
    });
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany) {
      this.companyId = this.globalCompany.companyId;
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
    this.noteAttachmentTitle = this.broadcasterService.currentNoteAttachmentTitle;
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
          this.documents = response;
        },
        () => {
          this.spinner.hide();
        }
      );
    }
  }

  saveChangeLogAttachment() {
    let noFileChosen = true;
    this.addedfiles.forEach((element: { attachmentFile: undefined }) => {
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
          noteType: 'itemchangelogattachment',
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
          this.router.navigate([
            '/items/changeLog/' + this.itemId + '/' + this.journalId,
          ]);
          this.getAllAttachments(this.journalId);
        },
        () => {
          this.spinner.hide();
        }
      );
    }
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = this.reverse === '' ? '-' : '';
    }
    this.order = value;
  }

  fileChangeListener($event: { target: any }, fileIndex: string | number): void {
    this.readThis($event.target, Number(fileIndex));
  }

  remove(i: number) {
    this.addedfiles.splice(i, 1);
  }

  addNewAttachment() {
    this.index = 0;
    this.addedfiles.push({ file: '', description: '' });
  }

  help() {
    this.helpFlag = !this.helpFlag;
  }

  readThis(inputValue: any, fileIndex: number): void {
    if (inputValue.files && inputValue.files[0]) {
      this.file = inputValue.files[0];
      this.fileName = this.file.name;
      const myReader = new FileReader();
      myReader.readAsDataURL(this.file);
      myReader.onloadend = () => {
        this.fileContent = (myReader.result as string).split(',')[1];
        this.fileType = (myReader.result as string)
          .split(',')[0]
          .split(':')[1]
          .split(';')[0];
        const fileInfo = this.addedfiles[fileIndex];
        fileInfo['addedBy'] = this.userName;
        fileInfo['attachmentFile'] = this.fileContent;
        fileInfo['attachmentId'] = 0;
        fileInfo['contentType'] = this.fileType;
        fileInfo['dateAdded'] = new Date().toISOString();
        fileInfo['entityId'] = this.journalId;
        fileInfo['isNew'] = 1;
        fileInfo['moduleType'] = 'itemnotetype';
        fileInfo['companyId'] = this.companyId;
        fileInfo['fileName'] = this.fileName;
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

  downloadDocumentFromDB(document: { isNew?: boolean; attachmentId?: any }) {
    this.spinner.show();
    this.itemAttachmentsService.getItemDocuments(document.attachmentId).subscribe(
      (response) => {
        this.spinner.hide();
        this.downloadDocument(response);
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  downloadDocument(companyDocument: any) {
    const blob = this.companyDocumentsService.b64toBlob(
      companyDocument.attachmentFile,
      companyDocument.contentType
    );
    const fileURL = URL.createObjectURL(blob);
    window.open(fileURL);
  }

  downloadFile(attachment: {
    isNew?: boolean;
    fileName?: any;
    attachmentId?: any;
  }) {
    const index = attachment.fileName.lastIndexOf('.');
    const extension = attachment.fileName.slice(index + 1);
    if (extension.toLowerCase() == 'pdf' || extension.toLowerCase() == 'txt') {
      const wnd = window.open('about:blank');
      const pdfStr = `<div style="text-align:center">
  <h4>Pdf viewer</h4>
  <iframe id="iFrame" src="https://docs.google.com/viewer?url=https://gotracrat.com:8088/api/attachment/downloadaudiofile/${
    attachment.attachmentId + '?access_token=' + this.authToken
  }&embedded=true" frameborder="0" height="650px" width="100%"></iframe>
    </div>
    <script>
        function reloadIFrame() {
          var iframe = document.getElementById("iFrame");
            if(iframe.contentDocument.URL == "about:blank"){
              iframe.src =  iframe.src;
            }
          }
          var timerId = setInterval("reloadIFrame();", 1300);
          setTimeout(() => {
            clearInterval(timerId);
            }, 25000);

          $( document ).ready(function() {
              $('#menuiFrame').on('load', function() {
                  clearInterval(timerId);
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
      const pdfStr = `<div style="text-align:center">
    <h4>Image Viewer</h4>
    <img src="https://gotracrat.com:8088/api/attachment/downloadaudiofile/${
      attachment.attachmentId + '?access_token=' + this.authToken
    }&embedded=true" >
      </div>`;
      const wnd = window.open('about:blank');
      if (wnd) wnd.document.write(pdfStr);
    } else {
      window.open(
        'https://gotracrat.com:8088/api/attachment/downloadaudiofile/' +
          attachment.attachmentId +
          '?access_token=' +
          this.authToken
      );
    }
  }

  openModal(template: TemplateRef<any>, id: any) {
    this.deleteId = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  editNoteDocument(document: { attachmentId: number }) {
    this.EditFlag = true;
    this.spinner.show();
    this.companyDocumentsService.getCompanyDocuments(document.attachmentId).subscribe(
      (response) => {
        this.spinner.hide();
        this.editModel = response;
      },
      () => {
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
        () => {
          this.spinner.hide();
          this.modalRef.hide();
          this.refresh();
        },
        () => {
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
    this.editModel.companyId = this.companyId;
    this.editModel.updatedBy = this.userName;
    this.editModel.attachmentUserLogDTO = {
      noteType: 'itemchangelogattachment',
      noteName: this.noteAttachmentTitle,
      itemTag: this.itemTag,
      itemTypeName: this.itemType,
    };
    this.companyDocumentsService.updateCompanyDocument(this.editModel).subscribe(
      () => {
        this.spinner.hide();
        window.scroll(0, 0);
        this.editIndex = 1;
        setTimeout(() => {
          this.index = 0;
        }, 7000);
        this.getAllAttachments(this.journalId);
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  print() {
    this.helpFlag = false;
    window.print();
  }
}