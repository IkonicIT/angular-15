import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocationNotesService } from '../../../services/location-notes.service';
import { LocationManagementService } from '../../../services/location-management.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BroadcasterService } from '../../../services/broadcaster.service';
import { Location } from '@angular/common';
import { CompanyDocumentsService } from '../../../services/index';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
})
export class NotesComponent implements OnInit {
  companyId: string;
  locationId: string;
  model: any = {};
  index: string = 'companydocument';
  notes: any[] = [];
  message: string;
  modalRef: BsModalRef;
  companyName: string = '';
  order: string = 'date';
  reverse: string = '';
  locationNotesFilter: any = '';
  itemsForPagination: any = 5;
  globalCompany: any;
  currentRole: any;
  highestRank: any;
  journalid: number = 0;
  private sub: any;
  id: number;
  userName: any;
  bsConfig: Partial<BsDatepickerConfig>;
  viewFlag: any = false;
  editFlag: any = false;
  newFlag: any = true;
  locationName: any;
  helpFlag: any = false;
  index1: number = 0;
  authToken: any;
  currentLocationName: any;
  dismissible = true;
  p: any;
  loader = false;
  constructor(
    private locationNotesService: LocationNotesService,
    private locationManagementService: LocationManagementService,
    private companyDocumentsService: CompanyDocumentsService,
    private locationNoteService: LocationNotesService,
    private router: Router,
    private companyManagementService: CompanyManagementService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    public datepipe: DatePipe,
    private modalService: BsModalService,
    private broadcasterService: BroadcasterService,
    private _location: Location
  ) {
    this.locationId = route.snapshot.params['locationId'];
    this.authToken = sessionStorage.getItem('auth_token');
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.currentLocationName =
      this.locationManagementService.currentLocationName;
    if (this.globalCompany) {
      this.companyId = this.globalCompany.companyId;
    }
    console.log('locationId=' + this.locationId);
    if (this.companyId) {
      this.getAllNotes(this.locationId);
    }
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyName = value.name;
      this.companyId = value.companyId;
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

  getAllNotes(locationId: string) {
    this.spinner.show();

    this.locationNotesService
      .getAllLocationNotes(this.companyId, locationId)
      .subscribe(
        (response: any) => {
          this.spinner.hide();

          console.log(response);
          this.notes = response;
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
  saveLocationNote() {
    if (!this.model.entityname || !this.model.effectiveon) {
      this.index1 = -1;
      window.scroll(0, 0);
    } else {
      this.model = {
        companyId: this.companyId,
        effectiveon: this.model.effectiveon,
        enteredby: this.userName,
        enteredon: new Date(),
        entityId: this.locationId,
        entityname: this.model.entityname,
        entitytypeId: 0,
        entityxml: '',
        entry: this.model.entry ? this.model.entry : ' ',
        jobnumber: this.model.jobnumber,
        journalid: 0,
        journaltypeId: 0,
        locationid: this.locationId,
        locationname: this.currentLocationName,
        ponumber: this.model.ponumber,
        shippingnumber: '',
        trackingnumber: '',
        moduleType: 'locationtype',
      };
      console.log(JSON.stringify(this.model));
      this.spinner.show();

      this.locationNoteService.saveLocationNotes(this.model).subscribe(
        (response) => {
          this.model = response;
          this.spinner.hide();

          this.model.effectiveon = this.datepipe.transform(
            this.model.effectiveon,
            'MM/dd/yyyy'
          );
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
        (error) => {
          this.spinner.hide();
        }
      );
    }
  }

  goToAttachments(journalid: string, entityname: any) {
    this.broadcasterService.currentNoteAttachmentTitle = entityname;
    this.router.navigate([
      '/location/noteAttchments/' + journalid + '/' + journalid,
    ]);
  }
  editNote() {
    this.editFlag = true;
    this.viewFlag = false;
    this.newFlag = false;
    this.helpFlag = false;
  }
  updateLocationNotes() {
    if (!this.model.entityname || !this.model.effectiveon) {
      this.index1 = -1;
      window.scroll(0, 0);
    } else {
      this.spinner.show();

      this.model.moduleType = 'locationtype';
      this.model.locationname = this.currentLocationName;
      this.model.effectiveon = new Date(this.model.effectiveon);
      this.locationNotesService.updateLocationNotes(this.model).subscribe(
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
          this.index1 = 2;
          setTimeout(() => {
            this.index1 = 0;
          }, 7000);
        },
        (error) => {
          this.spinner.hide();
        }
      );
    }
  }

  viewLocationNotes(journalid: string | number) {
    this.viewFlag = true;
    this.newFlag = false;
    this.editFlag = false;
    this.helpFlag = false;
    this.spinner.show();

    this.locationNotesService
      .getLocationNotes(journalid, this.locationId)
      .subscribe((response) => {
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
  cancelLocationNotes() {
    this.newFlag = true;
    this.editFlag = false;
    this.viewFlag = false;
    this.helpFlag = false;
    this.model = [];
    this.model.effectiveon = new Date();
  }
  backToItem() {
    this.helpFlag = false;
    this.router.navigate(['/location/list']);
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
      companyDocument.contentType
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
  refreshCall() {
    this.getAllNotes(this.locationId);
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
    console.log(
      'removeLocationnotess journalId=' +
        this.companyId +
        ',index==' +
        this.index
    );
    this.spinner.show();

    this.locationNotesService
      .removeLocationNotes(
        this.model.journalid,
        this.userName,
        this.currentLocationName
      )
      .subscribe(
        (response) => {
          this.spinner.hide();

          this.modalRef.hide();
          this.index1 = 4;
          this.refreshCall();
          this.model = [];
          this.model.effectiveon = new Date();
          this.newFlag = true;
          this.editFlag = false;
          this.viewFlag = false;
          this.helpFlag = false;
          setTimeout(() => {
            this.index1 = 0;
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
    this.helpFlag = true;
  }
}
