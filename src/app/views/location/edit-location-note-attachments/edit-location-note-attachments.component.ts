import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyDocumentsService } from '../../../services/company-documents.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { LocationManagementService } from '../../../services';
import { BroadcasterService } from '../../../services/broadcaster.service';

@Component({
  selector: 'app-edit-location-note-attachments',
  templateUrl: './edit-location-note-attachments.component.html',
  styleUrls: ['./edit-location-note-attachments.component.scss'],
})
export class EditLocationNoteAttachmentsComponent implements OnInit {
  model: any = {};
  index: number = 0;
  date = Date.now();
  itemid: number = 0;
  documentId: any;
  globalCompany: any;
  private sub: any;
  id: number;
  userName: any;
  router: Router;
  companyId: any;
  noteId: any;
  noteName: any;
  locationName: any;
  dismissible = true;

  constructor(
    private companyDocumentsService: CompanyDocumentsService,
    private companyManagementService: CompanyManagementService,
    router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private broadcasterService: BroadcasterService,
    private locationManagementService: LocationManagementService
  ) {
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value.companyid;
    });
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    //var globalCompanyName = sessionStorage.getItem('globalCompany');
    if (this.globalCompany) {
      this.companyId = this.globalCompany.companyid;
    }
    this.documentId = route.snapshot.params['attachmentId'];
    this.noteId = route.snapshot.params['noteId'];
    this.router = router;
  }
  ngOnInit() {
    this.noteName = this.broadcasterService.currentNoteAttachmentTitle;
    this.locationName = this.locationManagementService.currentLocationName;
    this.userName = sessionStorage.getItem('userName');
    this.spinner.show();
    this.companyDocumentsService.getCompanyDocuments(this.documentId).subscribe(
      (response) => {
        this.spinner.hide();
        this.model = response;
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
  updateLocationNoteAttachment() {
    this.spinner.show();
    this.model.moduleType = 'itemnotetype';
    this.model.companyID = this.companyId;
    this.model.attachmentUserLogDTO = {
      noteType: 'locationnoteattachment',
      noteName: this.noteName,
      locationName: this.locationName,
    };
    this.model.updatedBy = this.userName;
    this.companyDocumentsService.updateCompanyDocument(this.model).subscribe(
      (response) => {
        this.spinner.hide();
        window.scroll(0, 0);
        this.index = 1;
        setTimeout(() => {
          this.index = 0;
        }, 7000);
        this.router.navigate([
          '/location/noteAttchments/' + this.noteId + '/' + this.noteId,
        ]);
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  cancel() {
    this.router.navigate([
      '/location/noteAttchments/' + this.noteId + '/' + this.noteId,
    ]);
  }
}
