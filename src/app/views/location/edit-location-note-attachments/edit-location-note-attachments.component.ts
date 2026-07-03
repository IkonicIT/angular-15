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
  index = 0;
  date = Date.now();

  itemId = 0;
  documentId!: number;
  globalCompany: any;
  companyId!: number;
  noteId!: number;
  noteName!: string;
  locationName!: string;
  userName!: string | null;

  dismissible = true;
  loader = false;

  constructor(
    private companyDocumentsService: CompanyDocumentsService,
    private companyManagementService: CompanyManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private broadcasterService: BroadcasterService,
    private locationManagementService: LocationManagementService
  ) {
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value?.companyId;
    });

    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany) {
      this.companyId = this.globalCompany.companyId;
    }

    this.documentId = Number(this.route.snapshot.params['attachmentId']);
    this.noteId = Number(this.route.snapshot.params['noteId']);
  }

  ngOnInit(): void {
    this.noteName = this.broadcasterService.currentNoteAttachmentTitle;
    this.locationName = this.locationManagementService.currentLocationName;
    this.userName = sessionStorage.getItem('userName');

    this.spinner.show();
    this.companyDocumentsService.getCompanyDocuments(this.documentId).subscribe(
      (response) => {
        this.spinner.hide();
        this.model = response;
      },
      () => this.spinner.hide()
    );
  }

  updateLocationNoteAttachment(): void {
    this.spinner.show();

    this.model.moduleType = 'itemnotetype';
    this.model.companyId = this.companyId;
    this.model.attachmentUserLogDTO = {
      noteType: 'locationnoteattachment',
      noteName: this.noteName,
      locationName: this.locationName,
    };
    this.model.updatedBy = this.userName;

    this.companyDocumentsService.updateCompanyDocument(this.model).subscribe(
      () => {
        this.spinner.hide();
        window.scroll(0, 0);
        this.index = 1;
        setTimeout(() => (this.index = 0), 7000);

        this.router.navigate([
          `/location/noteAttchments/${this.noteId}/${this.noteId}`,
        ]);
      },
      () => this.spinner.hide()
    );
  }

  cancel(): void {
    this.router.navigate([`/location/noteAttchments/${this.noteId}/${this.noteId}`]);
  }
}
