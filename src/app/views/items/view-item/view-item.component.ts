import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  NgIterable,
} from '@angular/core';
import { ModalDirective, ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { LocationManagementService } from '../../../services/location-management.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { ItemManagementService } from '../../../services/Items/item-management.service';
import { WarrantyManagementService } from '../../../services/warranty-management.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from '../../../services/excel-service';
import { ImageViewerConfig } from 'ngx-image-viewer';
import { ItemAttachmentsService } from '../../../services/Items/item-attachments.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BroadcasterService } from '../../../services/broadcaster.service';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-view-item',
  templateUrl: './view-item.component.html',
  styleUrls: ['./view-item.component.scss'],
})
export class ViewItemComponent implements OnInit {
  message: string;
  isOwnerAdmin: any;
  authToken: any;
  model: any = {
    locationid: 0,
    typeId: 0,
    warrantytypeId: 0,
  };
  journals: any[] = [];
  index: number = 0;
  companyId: any;
  globalCompany: any;
  companyName: any;
  warrantyTypes: any;
  bsConfig: Partial<BsDatepickerConfig>;
  itemId: any;
  currentRole: any;
  highestRank: any;
  images = [];
  itemRank: any;
  imageIndexOne = 0;
  imageIndexTwo = 0;
  journalid: any;
  currentAttachmentId: any;
  itemTag: any;
  itemType: any;
  helpFlag: any = false;
  config: ImageViewerConfig = {
    customBtns: [{ name: 'setAsDefault', icon: 'fa fa-sliders' }],
  };
  @ViewChild('myModal') public myModal: ModalDirective;

  modalRef: BsModalRef;
  userName: any;
  imageSource: any;
  itemAttachments: any = [];
  loader = false;
  constructor(
    private locationManagementService: LocationManagementService,
    private companyManagementService: CompanyManagementService,
    private itemManagementService: ItemManagementService,
    private warrantyManagementService: WarrantyManagementService,
    private itemAttachmentsService: ItemAttachmentsService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private excelService: ExcelService,
    private modalService: BsModalService,
    private broadcasterService: BroadcasterService,
    private _location: Location,
    private sanitizer: DomSanitizer
  ) {
    this.itemId = route.snapshot.params['id'];
    this.authToken = sessionStorage.getItem('auth_token');
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany) {
      this.companyName = this.globalCompany.name;
      this.companyId = this.globalCompany.companyId;
    }
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value.companyId;
      this.companyName = this.globalCompany.name;
    });
  }

  ngOnInit() {
    this.itemTag = this.broadcasterService.currentItemTag;
    this.itemType = this.broadcasterService.currentItemType;
    this.itemRank = this.broadcasterService.itemRank;
    this.userName = sessionStorage.getItem('userName');
    if (this.itemId) {
      this.getItemDetails();
      this.getJournalLog();
    }
    this.currentRole = sessionStorage.getItem('currentRole');
    this.highestRank = sessionStorage.getItem('highestRank');
  }

  getItemDetails() {
    this.spinner.show();

    this.itemManagementService.getItemById(this.itemId).subscribe(
      (response) => {
        this.spinner.hide();

        this.model = response;
        this.currentAttachmentId = this.model.defaultImageAttachmentId;
        if (this.currentAttachmentId != 0) this.getItemDefaultImage();
        this.broadcasterService.currentItemTag = this.model.tag;
        this.broadcasterService.currentItemType = this.model.typeName;
        this.changeAttributes();
        this.getWarrantyTypes();
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  changeAttributes() {
    if (this.model.attributeValues && this.model.attributeValues.length > 0) {
      this.model.attributeValues.forEach((attr: { value: string }) => {
        if (attr.value == 'True') attr.value = 'Yes';
        else if (attr.value == 'False') attr.value = 'No';
      });
    }
  }

  getItemDefaultImage() {
    this.spinner.show();

    this.itemAttachmentsService
      .getItemDocuments(this.currentAttachmentId)
      .subscribe(
        (response: any) => {
          this.spinner.hide();

          if (response.isNew)
            this.imageSource = this.sanitizer.bypassSecurityTrustResourceUrl(
              `data:image/png;base64, ${response.attachmentFile}`
            );
          else
            this.imageSource =
              'https://gotracrat.com:8088/api/attachment/downloadaudiofile/' +
              response.attachmentId +
              '?access_token=' +
              this.authToken;
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }

  getAttachments() {
    this.spinner.show();

    this.itemAttachmentsService.getAllItemPictures(this.itemId).subscribe(
      (response: any) => {
        this.itemAttachments = response;
        this.images = response
          .filter((e: { contentType: string | string[] }) =>
            e.contentType.includes('image')
          )
          .map(
            (e: { isNew: any; attachmentFile: any; attachmentId: string }) => {
              if (e.isNew)
                return this.sanitizer.bypassSecurityTrustResourceUrl(
                  `data:image/png;base64, ${e.attachmentFile}`
                );
              else
                return (
                  'https://gotracrat.com:8088/api/attachment/downloadaudiofile/' +
                  e.attachmentId +
                  '?access_token=' +
                  this.authToken
                );
            }
          );
        this.spinner.hide();

        this.myModal.show();
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  getWarrantyTypes() {
    this.warrantyManagementService
      .getAllWarrantyTypes(this.companyId)
      .subscribe(
        (response) => {
          this.warrantyTypes = response;
          this.setWarrantyType(response);
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }

  setWarrantyType(response: any) {
    response.forEach((element: any) => {
      if (element.warrantytypeId == this.model.warrantyTypeId)
        this.model.warrantytype = element.warrantytype;
    });
  }

  getJournalLog() {
    this.itemManagementService.getJournalLog(this.itemId).subscribe(
      (response: any) => {
        this.journals = response;
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  openImage() {
    this.getAttachments();
  }
  handleEvent(event: any) {
    let image: any = this.images[event.imageIndex];
    this.itemAttachmentsService
      .updateItemDefaultImage(
        this.itemId,
        image.substring(image.lastIndexOf('/') + 1, image.lastIndexOf('?'))
      )
      .subscribe(
        (response) => {
          this.refreshCall();
        },
        (error) => {}
      );
    this.myModal.hide();
  }

  refreshCall() {
    this.spinner.show();

    this.itemManagementService
      .getItemById(this.itemId)
      .subscribe((response: any) => {
        this.currentAttachmentId = response.defaultImageAttachmentId;
        this.spinner.hide();

        this.model = response;
      });
  }

  back() {
    this._location.back();
  }

  openMoreChanges() {
    this.router.navigate(['/items/changeLog/' + this.itemId + '/' + 0]);
  }

  openModal(template: TemplateRef<any>, id: number) {
    this.index = id;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();

    this.isOwnerAdmin = sessionStorage.getItem('IsOwnerAdmin');
    this.itemManagementService
      .removeItem(
        this.itemId,
        this.companyId,
        this.userName,
        this.itemTag,
        this.itemType
      )
      .subscribe(
        (response) => {
          this.spinner.hide();

          this.modalRef.hide();
          this.itemManagementService.deleteFlag = 1;
          this.itemManagementService.itemSearchResults = [];
          this.itemManagementService.setSearchedItemTag('');
          this.itemManagementService.setSearchedItemTypeId(0);
          this.itemManagementService.setSearchedItemLocationId(0);
          this.itemManagementService.setSearchedItemStatusId(0);
          this.router.navigate(['/items/lists/all']);
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

  GoToWareHousetag() {
    this.itemManagementService.item = this.model;
    this.router.navigate(['/items/warehousetag/' + this.itemId]);
  }

  print() {
    this.helpFlag = false;
    window.print();
  }

  help() {
    this.helpFlag = !this.helpFlag;
  }

  goToItemService() {
    this.itemManagementService.item = this.model;
    this.router.navigate(['/items/itemService/' + this.itemId]);
  }
}
