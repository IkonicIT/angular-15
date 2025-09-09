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
  documentId!: number;
  id!: number;
  companyId!: number;
  userName: string | null = '';
  companyName: string = '';
  globalCompany: any;
  noteId!: number;
  helpFlag: boolean = false;
  noteName: string = '';
  dismissible = true;
  loader = false;

  constructor(
    private companyDocumentsService: CompanyDocumentsService,
    private companyManagementService: CompanyManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private broadcasterService: BroadcasterService
  ) {
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyName = value?.name ?? '';
      this.companyId = value?.companyId ?? 0;
    });

    this.globalCompany = this.companyManagementService.getGlobalCompany();
    const globalCompanyName = sessionStorage.getItem('globalCompany');

    if (this.globalCompany) {
      this.companyName = this.globalCompany.name;
      this.companyId = this.globalCompany.companyId;
    }
    this.documentId = +this.route.snapshot.params['attachmentId'];
    this.noteId = +this.route.snapshot.params['noteId'];
  }

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('userName');
    this.noteName = this.broadcasterService.currentNoteAttachmentTitle;

    this.spinner.show();
    this.companyDocumentsService.getCompanyDocuments(this.documentId).subscribe(
      (response: any) => {
        this.spinner.hide();
        this.model = response;
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  updateCompanyNoteAttachment(): void {
    this.spinner.show();

    this.model.moduleType = 'itemnotetype';
    this.model.companyId = this.companyId;
    this.model.attachmentUserLogDTO = {
      noteType: 'companynoteattachment',
      noteName: this.noteName,
    };
    this.model.updatedBy = this.userName;

    this.companyDocumentsService.updateCompanyDocument(this.model).subscribe(
      () => {
        this.spinner.hide();
        window.scroll(0, 0);
        this.index = 1;
        setTimeout(() => {
          this.index = 0;
        }, 7000);

        this.router.navigate([
          `/company/noteAttchments/${this.noteId}/${this.noteId}`,
        ]);
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  cancel(): void {
    this.router.navigate([
      `/company/noteAttchments/${this.noteId}/${this.noteId}`,
    ]);
  }

  print(): void {
    this.helpFlag = false;
    window.print();
  }

  help(): void {
    this.helpFlag = !this.helpFlag;
  }
}
