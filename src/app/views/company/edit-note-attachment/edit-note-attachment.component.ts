import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyDocumentsService } from '../../../services';
import { CompanyManagementService } from '../../../services/company-management.service';
import { BroadcasterService } from '../../../services/broadcaster.service';
@Component({
  selector: 'app-edit-note-attachment',
  templateUrl: './edit-note-attachment.component.html',
  styleUrls: ['./edit-note-attachment.component.scss'],
})
export class EditNoteAttachmentComponent implements OnInit {
  model: any = {};
  index: number = 0;
  date = Date.now();
  itemId: number = 0;
  documentId: any;
  private sub: any;
  id: number;
  router: Router;
  companyId: any;
  userName: any;
  companyName: string;
  globalCompany: any;
  noteId: any;
  helpFlag: any = false;
  noteName: any;
  dismissible = true;
  loader = false;
  constructor(
    private companyDocumentsService: CompanyDocumentsService,
    private companyManagementService: CompanyManagementService,
    router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private broadcasterService: BroadcasterService
  ) {
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyName = value.name;
      this.companyId = value.companyid;
    });
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    var globalCompanyName = sessionStorage.getItem('globalCompany');
    if (this.globalCompany) {
      this.companyName = this.globalCompany.name;
      this.companyId = this.globalCompany.companyid;
    }
    this.documentId = route.snapshot.params['attachmentId'];
    this.noteId = route.snapshot.params['noteId'];
    this.router = router;
  }
  ngOnInit() {
    this.userName = sessionStorage.getItem('userName');
    this.noteName = this.broadcasterService.currentNoteAttachmentTitle;
    this.spinner.show();

    this.companyDocumentsService.getCompanyDocuments(this.documentId).subscribe(
      (response: any) => {
        this.spinner.hide();

        this.model = response;
      },
      (error: any) => {
        this.spinner.hide();
      }
    );
  }
  updateCompanyNoteAttachment() {
    this.spinner.show();

    this.model.moduleType = 'itemnotetype';
    this.model.companyID = this.companyId;
    this.model.attachmentUserLogDTO = {
      noteType: 'companynoteattachment',
      noteName: this.noteName,
    };
    this.model.updatedBy = this.userName;
    this.companyDocumentsService.updateCompanyDocument(this.model).subscribe(
      (response: any) => {
        this.spinner.hide();
        window.scroll(0, 0);
        this.index = 1;
        setTimeout(() => {
          this.index = 0;
        }, 7000);
        this.router.navigate([
          '/company/noteAttchments/' + this.noteId + '/' + this.noteId,
        ]);
      },
      (error: any) => {
        this.spinner.hide();
      }
    );
  }

  cancel() {
    this.router.navigate([
      '/company/noteAttchments/' + this.noteId + '/' + this.noteId,
    ]);
  }
  print() {
    this.helpFlag = false;
    window.print();
  }
  help() {
    this.helpFlag = !this.helpFlag;
  }
}
