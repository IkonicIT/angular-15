import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CompanyManagementService } from '../../../services/company-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BroadcasterService } from '../../../services/broadcaster.service';
import { Location } from '@angular/common';
import { CompanynotesService } from '../../../services';
import { CompanyDocumentsService } from '../../../services';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss'],
})
export class ManageComponent implements OnInit {
  companyId: any;
  locationId: string;
  model: any = {};
  index: string = 'companydocument';
  notes: any[] = [];
  message: string;
  modalRef: BsModalRef;
  companyName: string = '';
  order: string = 'date';
  reverse: string = '';
  companyNotesFilter: any = '';
  itemsForPagination: any = 5;
  globalCompany: any;
  currentRole: any;
  highestRank: any;
  dismissible = true;
  journalid: number = 0;
  private sub: any;
  id: number;
  router: Router;
  userName: any;
  bsConfig: Partial<BsDatepickerConfig>;
  viewFlag: any = false;
  editFlag: any = false;
  newFlag: any = true;
  locationName: any;
  helpFlag: any = false;
  index1: number = 0;
  authToken: any;
  currentCompanyName: any;
  entityname: any;
  p: any;
  loader = false;

  constructor(
    private modalService: BsModalService,
    private companyDocumentsService: CompanyDocumentsService,
    private companyManagementService: CompanyManagementService,
    private companynotesService: CompanynotesService,
    router: Router,
    route: ActivatedRoute,
    public datepipe: DatePipe,
    private broadcasterService: BroadcasterService,
    private spinner: NgxSpinnerService,
    private _location: Location
  ) {
    this.companyId = route.snapshot.params['id'];
    this.authToken = sessionStorage.getItem('auth_token');
    this.router = router;
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyName = this.globalCompany.name;
    this.currentCompanyName = this.companyManagementService.currentCompanyName;

    console.log('companuyid=' + this.companyId);
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
    this.userName = sessionStorage.getItem('userName');
    this.currentRole = sessionStorage.getItem('currentRole');
    this.highestRank = sessionStorage.getItem('highestRank');
    console.log('currentRole is' + this.currentRole);
    console.log('highestRank is' + this.highestRank);
    this.model.date = new Date();
    this.bsConfig = Object.assign({}, { containerClass: 'theme-red' });
    this.model.effectiveon = new Date();
  }

  getAllNotes(companyId: string) {
    this.spinner.show();
    this.loader = true;
    this.companynotesService.getAllCompanyNotess(companyId).subscribe(
      (response: any) => {
        this.spinner.hide();
        this.loader = false;
        console.log(response);
        this.notes = response;
      },
      (error: any) => {
        this.spinner.hide();
        this.loader = false;
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

  saveCompanyNote() {
    if (!this.model.entityname || !this.model.effectiveon) {
      this.index1 = -1;
      window.scroll(0, 0);
    } else {
      this.model = {
        companyid: this.companyId,
        effectiveon: this.model.effectiveon,
        enteredby: this.userName,
        enteredon: new Date(),
        entityid: this.companyId,
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
        moduleType: 'companytype',
      };
      console.log(JSON.stringify(this.model));
      this.spinner.show();
      this.loader = true;
      this.companynotesService.saveCompanynotes(this.model).subscribe(
        (response: any) => {
          this.model = response;
          this.model.effectiveon = this.datepipe.transform(
            this.model.effectiveon,
            'MM/dd/yyyy'
          );
          this.spinner.hide();
          this.loader = false;
          window.scroll(0, 0);
          this.viewFlag = true;
          this.newFlag = false;
          this.editFlag = false;
          this.helpFlag = false;
          this.refreshCall();
          this.index1 = 1;
          setTimeout(() => {
            this.index1 = 0;
          }, 7000);
        },
        (error: any) => {
          this.spinner.hide();
          this.loader = false;
        }
      );
    }
  }

  goToAttachments(journalid: string, entityname: any) {
    this.broadcasterService.currentNoteAttachmentTitle = entityname;
    this.router.navigate([
      '/company/noteAttchments/' + journalid + '/' + journalid,
    ]);
  }

  editNote() {
    this.editFlag = true;
    this.viewFlag = false;
    this.newFlag = false;
    this.helpFlag = false;
  }

  updateCompanyNotes() {
    if (!this.model.entityname || !this.model.effectiveon) {
      this.index1 = -1;
      window.scroll(0, 0);
    } else {
      this.spinner.show();
      this.loader = true;
      this.model.moduleType = 'companytype';
      this.model.effectiveon = new Date(this.model.effectiveon);
      this.companynotesService.updateCompanynotes(this.model).subscribe(
        (response: any) => {
          this.model.effectiveon = this.datepipe.transform(
            this.model.effectiveon,
            'MM/dd/yyyy'
          );
          this.spinner.hide();
          this.loader = false;
          window.scroll(0, 0);
          this.viewFlag = true;
          this.newFlag = false;
          this.editFlag = false;
          this.helpFlag = false;

          this.refreshCall();
          this.index1 = 2;
          setTimeout(() => {
            this.index1 = 0;
          }, 7000);
        },
        (error: any) => {
          this.spinner.hide();
          this.loader = false;
        }
      );
    }
  }

  viewCompanyNotes(journalid: any) {
    this.viewFlag = true;
    this.newFlag = false;
    this.editFlag = false;
    this.helpFlag = false;

    this.spinner.show();
    this.loader = true;
    this.companynotesService
      .getCompanynotess(journalid, this.companyId)
      .subscribe((response: any) => {
        this.spinner.hide();
        this.loader = false;
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

  cancelCompanyNotes() {
    this.newFlag = true;
    this.editFlag = false;
    this.viewFlag = false;
    this.helpFlag = false;
    this.model = [];
    this.model.effectiveon = new Date();
  }

  backToItem() {
    this.helpFlag = false;
    this.router.navigate(['/company/list']);
  }

  download(companyDocument: any) {
    if (companyDocument.new == false) {
      this.downloadFile(companyDocument);
    } else {
      this.downloadDocumentFromDB(companyDocument);
    }
  }

  downloadDocumentFromDB(document: { attachmentID: any }) {
    this.spinner.show();
    this.loader = true;
    this.companyDocumentsService
      .getCompanyDocuments(document.attachmentID)
      .subscribe(
        (response: any) => {
          this.spinner.hide();
          this.loader = false;
          this.downloadDocument(response);
        },
        (error: any) => {
          this.spinner.hide();
          this.loader = false;
        }
      );
  }

  downloadDocument(companyDocument: { attachmentFile: any; contenttype: any }) {
    var blob = this.companyDocumentsService.b64toBlob(
      companyDocument.attachmentFile,
      companyDocument.contenttype
    );
    var fileURL = URL.createObjectURL(blob);

    window.open(fileURL);
  }

  downloadFile(attachment: { fileName: any; attachmentID: string }) {
    var index = attachment.fileName.lastIndexOf('.');
    var extension = attachment.fileName.slice(index + 1);
    if (extension.toLowerCase() == 'pdf' || extension.toLowerCase() == 'txt') {
      var wnd = window.open('about:blank');
      var pdfStr = `<div style="text-align:center">
    <h4>Document viewer</h4>
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

  refreshCall() {
    this.getAllNotes(this.companyId);
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

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  confirm(): void {
    this.message = 'Confirmed!';
    console.log('Deleting note with journalid:', this.model.journalid);
    this.modalRef.hide();
    this.spinner.show();
    this.loader = true;
    this.companynotesService
      .removeCompanynotess(this.model.journalid, this.userName)
      .subscribe(
        (response: any) => {
          console.log('Delete response:', response);
          this.spinner.hide();
          this.loader = false;
          this.getAllNotes(this.companyId);
          this.model = {};
          this.model.effectiveon = new Date();
          this.newFlag = true;
          this.editFlag = false;
          this.viewFlag = false;
          this.helpFlag = false;
          this.index1 = 4;
          setTimeout(() => {
            this.index1 = 0;
          }, 7000);
        },
        (error: any) => {
          console.error('Delete error:', error);
          this.spinner.hide();
          this.loader = false;
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
}
