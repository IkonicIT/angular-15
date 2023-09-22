import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemAttachmentsService } from '../../../services/Items/item-attachments.service';
import { BroadcasterService } from '../../../services/broadcaster.service';
import { CompanyManagementService } from '../../../services/company-management.service';

@Component({
  selector: 'app-edit-item-note-attachement',
  templateUrl: './edit-item-note-attachement.component.html',
  styleUrls: ['./edit-item-note-attachement.component.scss'],
})
export class EditItemNoteAttachementComponent implements OnInit {
  model: any = {};
  index: number = 0;
  companyId: number = 0;
  companyName: string;
  globalCompany: any;
  date = Date.now();
  itemid: number = 0;
  documentId: number = 0;
  private sub: any;
  userName: any;
  id: number;
  router: Router;
  noteAttachmentTitle: any;
  helpFlag: any = false;
  itemTag: any;
  itemType: any;
  dismissible = true;
  loader = false;
  constructor(
    private itemAttachmentsService: ItemAttachmentsService,
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
    if (this.globalCompany) {
      this.companyName = this.globalCompany.name;
      this.companyId = this.globalCompany.companyid;
    }
    this.id = route.snapshot.params['id'];
    this.itemid = route.snapshot.params['journalId'];
    this.documentId = route.snapshot.params['itemId'];
    this.router = router;
  }

  ngOnInit() {
    this.noteAttachmentTitle =
      this.broadcasterService.currentNoteAttachmentTitle;
    this.itemTag = this.broadcasterService.currentItemTag;
    this.itemType = this.broadcasterService.currentItemType;
    this.userName = sessionStorage.getItem('userName');
    this.spinner.show();
    this.loader = true;
    this.itemAttachmentsService.getItemDocuments(this.id).subscribe(
      (response) => {
        this.spinner.hide();
        this.loader = false;
        this.model = response;
      },
      (error) => {
        this.spinner.hide();
        this.loader = false;
      }
    );
  }

  updateItemNoteAttachment() {
    this.spinner.show();
    this.loader = true;
    this.model.moduleType = 'itemnotetype';
    this.model.companyID = this.companyId;
    this.model.attachmentUserLogDTO = {
      noteType: 'itemnoteattachment',
      noteName: this.noteAttachmentTitle,
      itemTag: this.itemTag,
      itemTypeName: this.itemType,
    };
    this.model.updatedBy = this.userName;
    this.itemAttachmentsService.updateItemDocument(this.model).subscribe(
      (response) => {
        this.spinner.hide();
        this.loader = false;
        window.scroll(0, 0);
        this.index = 1;
        setTimeout(() => {
          this.index = 0;
        }, 7000);
        this.router.navigate([
          '/items/noteAttachments/' + this.documentId + '/' + this.itemid,
        ]);
      },
      (error) => {
        this.spinner.hide();
        this.loader = false;
      }
    );
  }

  cancelItemNoteAttachment() {
    this.router.navigate([
      '/items/noteAttachments/' + this.documentId + '/' + this.itemid,
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
