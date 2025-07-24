import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ItemNotesService } from '../../../services/Items/item-notes.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BroadcasterService } from '../../../services/broadcaster.service';
import { CompanyDocumentsService } from '../../../services/index';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
})
export class NotesComponent implements OnInit {
  model: any = {};
  index: number = 0;
  date = Date.now();
  itemId: number = 0;
  showAll: number;
  private sub: any;
  currentRole: any;
  highestRank: any;
  id: number;
  globalCompany: any;
  message: string;
  modalRef: BsModalRef;
  companyId: string;
  notes: any[] = [];
  companyName: string = '';
  itemRank: any;
  itemNotesFilter: any = '';
  itemsForPagination: any = 5;
  order: string = 'date';
  reverse: string = '';
  authToken: any;
  userName: any;
  journalId: any;
  bsConfig: Partial<BsDatepickerConfig>;
  viewFlag: any = false;
  editFlag: any = false;
  newFlag: any = true;
  itemTag: any;
  itemType: any;
  helpFlag: any = false;
  entityname: any;
  dismissible = true;
  p: any;
  loader = false;
  constructor(
    private itemNoteService: ItemNotesService,
    private itemNotesService: ItemNotesService,
    private router: Router,
    private companyManagementService: CompanyManagementService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    public datepipe: DatePipe,
    private modalService: BsModalService,
    private broadcasterService: BroadcasterService,
    private companyDocumentsService: CompanyDocumentsService
  ) {
    this.itemId = route.snapshot.params['itemId'];
    this.journalId = route.snapshot.params['journalId'];
    this.authToken = sessionStorage.getItem('auth_token');
    this.router = router;
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany) {
      this.companyId = this.globalCompany.companyid;
    }

    if (this.companyId) {
      this.getAllNotes(this.companyId);
    }
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyName = value.name;
      this.companyId = value.companyid;
    });
  }

  ngOnInit() {
    if (this.journalId != 0) {
      this.viewItemNotes(this.journalId);
    }
    this.itemTag = this.broadcasterService.currentItemTag;
    this.itemType = this.broadcasterService.currentItemType;
    this.itemRank = this.broadcasterService.itemRank;
    this.userName = sessionStorage.getItem('userName');
    this.currentRole = sessionStorage.getItem('currentRole');
    this.highestRank = sessionStorage.getItem('highestRank');
    console.log('currentRole is' + this.currentRole);
    console.log('highestRank is' + this.highestRank);
    this.model.date = new Date();
    this.bsConfig = Object.assign({}, { containerClass: 'theme-red' });

    console.log('itemId=' + this.itemId);
    this.model.effectiveon = new Date();
  }

  getAllNotes(companyId: string) {
    this.spinner.show();

    this.itemNotesService.getAllItemNotes(companyId, this.itemId).subscribe(
      (response: any) => {
        this.spinner.hide();

        console.log(response);
        this.notes = response;
        this.showAll = this.notes.length;
        const totalWarrantyTypesCount = this.notes.length;
        const maxPageAvailable = Math.ceil(
          totalWarrantyTypesCount / this.itemsForPagination
        );

        // Check if the current page exceeds the maximum available page
        if (this.p > maxPageAvailable) {
          this.p = maxPageAvailable;
        }
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  addNotes() {
    this.newFlag = true;
    this.editFlag = false;
    this.viewFlag = false;
    this.helpFlag = false;
    this.model = [];
    this.model.effectiveon = new Date();
  }

  saveItemNote() {
    if (!this.model.entityname || !this.model.effectiveon) {
      this.index = -1;
      window.scroll(0, 0);
    } else {
      this.model = {
        companyid: this.companyId,
        effectiveon: this.model.effectiveon,
        enteredby: this.userName,
        enteredon: new Date(),
        entityid: this.itemId,
        entityname: this.model.entityname,
        entitytypeid: 0,
        entityxml: '',
        entry: this.model.entry ? this.model.entry : ' ',
        jobnumber: this.model.jobnumber,
        journalid: 0,
        journaltypeid: 0,
        locationid: 0,
        locationname: '',
        ponumber: this.model.ponumber,
        shippingnumber: '',
        trackingnumber: '',
        moduleType: 'itemtype',
        itemTypeName: this.itemType,
        itemTag: this.itemTag,
      };
      console.log(JSON.stringify(this.model));
      this.spinner.show();

      this.itemNoteService.saveItemNote(this.model).subscribe(
        (response) => {
          this.model = response;
          this.model.effectiveon = this.datepipe.transform(
            this.model.effectiveon,
            'MM/dd/yyyy'
          );
          this.spinner.hide();

          window.scroll(0, 0);
          this.viewFlag = true;
          this.newFlag = false;
          this.editFlag = false;
          this.helpFlag = false;
          this.refreshCall();
          this.index = 1;
          setTimeout(() => {
            this.index = 0;
          }, 7000);
        },
        (error) => {
          this.spinner.hide();
        }
      );
    }
  }

  editNote() {
    this.editFlag = true;
    this.viewFlag = false;
    this.newFlag = false;
    this.helpFlag = false;
  }

  updateItemNotes() {
    if (!this.model.entityname || !this.model.effectiveon) {
      this.index = -1;
      window.scroll(0, 0);
    } else {
      this.spinner.show();

      this.model.moduleType = 'itemtype';
      this.model.effectiveon = new Date(this.model.effectiveon);
      this.model.itemTypeName = this.itemType;
      this.model.itemTag = this.itemTag;
      this.itemNotesService.updateItemNotes(this.model).subscribe(
        (response) => {
          this.model.effectiveon = this.datepipe.transform(
            this.model.effectiveon,
            'MM/dd/yyyy'
          );
          this.spinner.hide();

          window.scroll(0, 0);
          this.viewFlag = true;
          this.newFlag = false;
          this.editFlag = false;
          this.helpFlag = false;
          this.refreshCall();
          this.index = 2;
          setTimeout(() => {
            this.index = 0;
          }, 7000);
        },
        (error) => {
          this.spinner.hide();
        }
      );
    }
  }

  goToAttachments(journalid: string, entityname: any) {
    this.broadcasterService.currentNoteAttachmentTitle = entityname;
    this.router.navigate([
      '/items/noteAttachments/' + journalid + '/' + this.itemId,
    ]);
  }

  viewItemNotes(journalid: number) {
    this.viewFlag = true;
    this.newFlag = false;
    this.editFlag = false;
    this.helpFlag = false;
    this.spinner.show();

    this.itemNotesService.getItemNotes(journalid).subscribe((response) => {
      this.spinner.hide();

      this.model = response;
      if (this.model.effectiveon) {
        this.model.effectiveon = new Date(this.model.effectiveon);
        this.model.effectiveon = this.datepipe.transform(
          this.model.effectiveon,
          'MM/dd/yyyy'
        );
      }
    });
    window.scroll(0, 0);
  }

  cancelItemNotes() {
    this.newFlag = true;
    this.editFlag = false;
    this.viewFlag = false;
    this.helpFlag = false;
    this.model = [];
    this.model.effectiveon = new Date();
  }

  backToItem() {
    this.helpFlag = false;
    this.router.navigate(['/items/viewItem/' + this.itemId]);
  }

  download(companyDocument: any) {
    if (companyDocument.new == false) {
      this.downloadFile(companyDocument);
    } else {
      this.downloadDocumentFromDB(companyDocument);
    }
  }

  downloadDocumentFromDB(document: { attachmentID: number }) {
    this.spinner.show();

    this.companyDocumentsService
      .getCompanyDocuments(document.attachmentID)
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

  downloadFile(attachment: any) {
    var index = attachment.fileName.lastIndexOf('.');
    var extension = attachment.fileName.slice(index + 1);
    if (extension.toLowerCase() == 'pdf' || extension.toLowerCase() == 'txt') {
      var wnd = window.open('about:blank');
      var pdfStr = `<div style="text-align:center">
      <h4>Pdf viewer</h4>
      <iframe id="iFrame" src="https://docs.google.com/viewer?url=https://gotracrat.com:8088/api/attachment/downloadaudiofile/${
        attachment.attachmentID + '?access_token=' + this.authToken
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
          </script>`;

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
        attachment.attachmentID + '?access_token=' + this.authToken
      }&embedded=true" >
        </div>`;

      var wnd = window.open('about:blank');
      if (wnd) wnd.document.write(pdfStr);
    } else {
      window.open(
        'https://gotracrat.com:8088/api/attachment/downloadaudiofile/' +
          attachment.attachmentID +
          '?access_token=' +
          this.authToken
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

  refreshCall() {
    this.getAllNotes(this.companyId);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  confirm(): void {
    this.message = 'Confirmed!';
    console.log(
      'removeLocationnotess journalId=' +
        this.companyId +
        ',index==' +
        this.index
    );
    this.spinner.show();

    this.itemNotesService
      .removeItemNotes(
        this.model.journalid,
        this.userName,
        this.itemTag,
        this.itemType
      )
      .subscribe(
        (response) => {
          this.spinner.hide();

          this.modalRef.hide();
          this.index = 4;
          this.refreshCall();
          this.model = [];
          this.model.effectiveon = new Date();
          this.newFlag = true;
          this.editFlag = false;
          this.viewFlag = false;
          this.helpFlag = false;
          setTimeout(() => {
            this.index = 0;
          }, 7000);
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

  print() {
    this.helpFlag = false;
    window.print();
  }

  help() {
    this.helpFlag = !this.helpFlag;
  }
  onChange(e: any) {
    const totalWarrantyTypesCount = this.notes.length;
    const maxPageAvailable = Math.ceil(
      totalWarrantyTypesCount / this.itemsForPagination
    );
    // Check if the current page exceeds the maximum available page
    if (this.p > maxPageAvailable) {
      this.p = maxPageAvailable;
    }
  }
}
