import { Component, OnInit } from '@angular/core';
import { ItemAttachmentsService } from '../../../services/Items/item-attachments.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CompanyManagementService } from '../../../services/company-management.service';
import { BroadcasterService } from '../../../services/broadcaster.service';

@Component({
  selector: 'app-edit-item-attachment',
  templateUrl: './edit-item-attachment.component.html',
  styleUrls: ['./edit-item-attachment.component.scss'],
})
export class EditItemAttachmentComponent implements OnInit {
  model: any = {};
  index: number = 0;
  date = Date.now();
  companyId: number = 0;
  private sub: any;
  id: number;
  router: Router;
  attachmentId: any;
  itemId: any;
  userName: any;
  itemRank: any;
  globalCompany: any;
  companyName: string;
  itemTag: any;
  itemType: any;
  currentAttachmentId: any;
  helpFlag: any = false;
  dismissible = true;
  loader = false;
  constructor(
    private itemAttachmentsService: ItemAttachmentsService,
    router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private companyManagementService: CompanyManagementService,
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

    this.itemId = route.snapshot.params['itemId'];
    this.attachmentId = route.snapshot.params['id'];
    this.currentAttachmentId = route.snapshot.params['attachmentId'];
    console.log('itemId=' + this.itemId);
    this.router = router;
    this.spinner.show();
    this.loader = true;
    this.itemAttachmentsService.getItemDocuments(this.attachmentId).subscribe(
      (response) => {
        this.spinner.hide();
        this.loader = false;
        this.model = response;
        this.model.defaultImage = 'false';
      },
      (error) => {
        this.spinner.hide();
        this.loader = false;
      }
    );
  }

  ngOnInit() {
    this.itemTag = this.broadcasterService.currentItemTag;
    this.itemType = this.broadcasterService.currentItemType;
    this.userName = sessionStorage.getItem('userName');
  }

  updateItemDocument() {
    this.spinner.show();
    this.loader = true;
    this.model.moduleType = 'itemtype';
    this.model.companyID = this.companyId;
    this.model.updatedDate = new Date();
    this.model.itemTag = this.itemTag;
    this.model.attachmentUserLogDTO = {
      itemTag: this.itemTag,
      itemTypeName: this.itemType,
    };
    this.model.updatedBy = this.userName;
    this.itemAttachmentsService.updateItemDocument(this.model).subscribe(
      (response) => {
        this.spinner.hide();
        this.loader = false;
        if (
          this.model.defaultImage == 'true' &&
          this.model.contenttype.includes('image')
        ) {
          this.setAsDefault(this.model);
        } else {
          this.router.navigate([
            '/items/attachments/' +
              this.itemId +
              '/' +
              this.currentAttachmentId,
          ]);
        }
      },
      (error) => {
        this.spinner.hide();
        this.loader = false;
      }
    );
  }

  cancelItemDocument() {
    this.router.navigate([
      '/items/attachments/' + this.itemId + '/' + this.currentAttachmentId,
    ]);
  }

  setAsDefault(res: { attachmentid: any }) {
    this.spinner.show();
    this.loader =true;
    this.itemAttachmentsService
      .updateItemDefaultImage(this.itemId, res.attachmentid)
      .subscribe(
        (response) => {
          this.spinner.hide();
          this.loader = false;
          this.currentAttachmentId = res.attachmentid;
          this.router.navigate([
            '/items/attachments/' +
              this.itemId +
              '/' +
              this.currentAttachmentId,
          ]);
        },
        (error) => {
          this.spinner.hide();
          this.loader = false;
        }
      );
  }

  print() {
    this.helpFlag = false;
    window.print();
  }

  help() {
    this.helpFlag = !this.helpFlag;
  }
}
