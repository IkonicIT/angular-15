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
  companyId: string = '';
  locationId: string = '';
  model: any = {};
  index: string = 'companydocument';
  notes: any[] = [];
  message: string = '';
  modalRef!: BsModalRef;
  companyName: string = '';
  order: string = 'date';
  reverse: string = '';
  locationNotesFilter: string = '';
  itemsForPagination: number = 5;
  globalCompany: any;
  currentRole: any;
  highestRank: any;
  journalId: number = 0;
  id!: number;
  userName: string = '';
  bsConfig: Partial<BsDatepickerConfig>;
  viewFlag: boolean = false;
  editFlag: boolean = false;
  newFlag: boolean = true;
  locationName: string = '';
  helpFlag: boolean = false;
  index1: number = 0;
  authToken: string | null;
  currentLocationName: string = '';
  dismissible = true;
  p: number = 1;
  loader = false;

  constructor(
    private locationNotesService: LocationNotesService,
    private locationManagementService: LocationManagementService,
    private companyDocumentsService: CompanyDocumentsService,
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
    this.currentLocationName = this.locationManagementService.currentLocationName;
    if (this.globalCompany) {
      this.companyId = this.globalCompany.companyId;
    }
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
    this.userName = sessionStorage.getItem('userName') ?? '';
    this.currentRole = sessionStorage.getItem('currentRole');
    this.highestRank = sessionStorage.getItem('highestRank');
    this.model.date = new Date();
    this.bsConfig = Object.assign({}, { containerClass: 'theme-red' });
    this.model.effectiveOn = new Date();
  }

  getAllNotes(locationId: string) {
    this.spinner.show();
    this.locationNotesService
      .getAllLocationNotes(this.companyId, locationId)
      .subscribe(
        (response: any) => {
          this.spinner.hide();
          this.notes = Array.isArray(response) ? response : [];
        },
        () => {
          this.spinner.hide();
        }
      );
  }

  addNotes() {
    this.newFlag = true;
    this.editFlag = false;
    this.viewFlag = false;
    this.helpFlag = false;
    this.model = {};
    this.model.effectiveOn = new Date();
  }

  saveLocationNote() {
    if (!this.model.entityName || !this.model.effectiveOn) {
      this.index1 = -1;
      window.scroll(0, 0);
    } else {
      this.model = {
        companyId: this.companyId,
        effectiveOn: this.model.effectiveOn,
        enteredBy: this.userName,
        enteredOn: new Date(),
        entityId: this.locationId,
        entityName: this.model.entityName,
        entitytypeId: 0,
        entityXml: '',
        entry: this.model.entry ? this.model.entry : ' ',
        jobNumber: this.model.jobNumber,
        journalId: 0,
        journaltypeId: 0,
        locationId: this.locationId,
        locationName: this.currentLocationName,
        poNumber: this.model.poNumber,
        shippingNumber: '',
        trackingNumber: '',
        moduleType: 'locationtype',
      };
      this.spinner.show();
      this.locationNotesService.saveLocationNotes(this.model).subscribe(
        (response) => {
          this.model = response;
          this.spinner.hide();
          this.model.effectiveOn = this.datepipe.transform(
            this.model.effectiveOn,
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
        () => {
          this.spinner.hide();
        }
      );
    }
  }

  goToAttachments(journalId: string, entityName: string) {
    this.broadcasterService.currentNoteAttachmentTitle = entityName;
    this.router.navigate([
      '/location/noteAttchments/' + journalId + '/' + journalId,
    ]);
  }

  editNote() {
    this.editFlag = true;
    this.viewFlag = false;
    this.newFlag = false;
    this.helpFlag = false;
  }

  updateLocationNotes() {
    if (!this.model.entityName || !this.model.effectiveOn) {
      this.index1 = -1;
      window.scroll(0, 0);
    } else {
      this.spinner.show();
      this.model.moduleType = 'locationtype';
      this.model.locationName = this.currentLocationName;
      this.model.effectiveOn = new Date(this.model.effectiveOn);
      this.locationNotesService.updateLocationNotes(this.model).subscribe(
        (response) => {
          this.model.effectiveOn = this.datepipe.transform(
            this.model.effectiveOn,
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
        () => {
          this.spinner.hide();
        }
      );
    }
  }

  viewLocationNotes(journalId: string | number) {
    this.viewFlag = true;
    this.newFlag = false;
    this.editFlag = false;
    this.helpFlag = false;
    this.spinner.show();
    this.locationNotesService
      .getLocationNotes(journalId, this.locationId)
      .subscribe((response) => {
        this.spinner.hide();
        this.model = response;
        if (this.model.effectiveOn) {
          this.model.effectiveOn = new Date(this.model.effectiveOn);
          this.model.effectiveOn = this.datepipe.transform(
            this.model.effectiveOn,
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
    this.model = {};
    this.model.effectiveOn = new Date();
  }

  backToItem() {
    this.helpFlag = false;
    this.router.navigate(['/location/list']);
  }

  download(companyDocument: any) {
    if (companyDocument.new === false) {
      this.downloadFile(companyDocument);
    } else {
      this.downloadDocumentFromDB(companyDocument);
    }
  }

  downloadDocumentFromDB(document: { attachmentId: number }) {
    this.spinner.show();
    this.companyDocumentsService
      .getCompanyDocuments(document.attachmentId)
      .subscribe(
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

  downloadFile(attachment: any) {
    const index = attachment.fileName.lastIndexOf('.');
    const extension = attachment.fileName.slice(index + 1);
    if (['pdf', 'txt'].includes(extension.toLowerCase())) {
      const wnd = window.open('about:blank');
      const pdfStr = `<div style="text-align:center">
      <h4>Document viewer</h4>
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
          </script>`;
      if (wnd) wnd.document.write(pdfStr);
    } else if (
      ['jpg', 'png', 'jpeg', 'gif'].includes(extension.toLowerCase())
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

  refreshCall() {
    this.getAllNotes(this.locationId);
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = this.reverse === '' ? '-' : '';
    }
    this.order = value;
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();
    this.modalRef.hide();
    this.locationNotesService
      .removeLocationNotes(
        this.model.journalId,
        this.userName,
        this.currentLocationName
      )
      .subscribe(
        () => {
          this.spinner.hide();
          this.modalRef.hide();
          this.index1 = 4;
          this.refreshCall();
          this.model = {};
          this.model.effectiveOn = new Date();
          this.newFlag = true;
          this.editFlag = false;
          this.viewFlag = false;
          this.helpFlag = false;
          setTimeout(() => {
            this.index1 = 0;
          }, 7000);
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

  print() {
    this.helpFlag = false;
    window.print();
  }

  help() {
    this.helpFlag =!this.helpFlag;
  }
}