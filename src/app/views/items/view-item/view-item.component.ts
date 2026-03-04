import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  NgIterable,
} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
// import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'; // no longer using drag-drop component
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
import { HttpClient } from '@angular/common/http';

import { AppConfiguration } from 'src/app/configuration';
@Component({
  selector: 'app-view-item',
  templateUrl: './view-item.component.html',
  styleUrls: ['./view-item.component.scss'],
})
export class ViewItemComponent implements OnInit {
  message: string = '';
  isOwnerAdmin: any;
  authToken: string | null = null;
  model: any = {
    locationId: 0,
    typeId: 0,
    warrantyTypeId: 0,
  };
  itemMMS: boolean = false;
  mmsData: any = {};
  journals: any[] = [];
  index: number = 0;
  companyId: number = 0;
  globalCompany: any;
  companyName: string = '';
  warrantyTypes: any[] = [];
  bsConfig: Partial<BsDatepickerConfig>;
  itemId: any;
  currentRole: string | null = null;
  highestRank: string | null = null;
  showMMSData: boolean = false;
  mmsItemsOrder: any[] = [];
  editingOrder: boolean = false; 
  get highestRankNum(): number {
    return Number(this.highestRank ?? 0);
  }
  images: any[] = [];
  itemRank: any;
  imageIndexOne: number = 0;
  imageIndexTwo: number = 0;
  journalId: any;
  currentAttachmentId: any;
  itemTag: any;
  itemType: any;
  helpFlag: boolean = false;
  config: ImageViewerConfig = {
    customBtns: [{ name: 'setAsDefault', icon: 'fa fa-sliders' }],
  };
  @ViewChild('myModal') public myModal!: ModalDirective;
  modalRef!: BsModalRef;
  userName: string | null = null;
  imageSource: any;
  itemAttachments: any[] = [];
  loader: boolean = false;

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
    private sanitizer: DomSanitizer,
    private http: HttpClient
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
      this.showMMSData = false;
    });
  }

  ngOnInit(): void {
    this.itemTag = this.broadcasterService.currentItemTag;
    this.itemType = this.broadcasterService.currentItemType;
    this.itemRank = this.broadcasterService.itemRank;
    this.userName = sessionStorage.getItem('userName');
    const itemMMSValue = sessionStorage.getItem('itemMMS');
    this.itemMMS = itemMMSValue === 'true' || itemMMSValue === '1';
    console.log('itemMMS:', this.itemMMS);
    if (this.itemId) {
      
      this.getItemDetails();
      this.getJournalLog();
      if (this.itemMMS) {
          this.getItemMMS();
          this.getMMSOrder();
        }
    }
    this.currentRole = sessionStorage.getItem('currentRole');
    this.highestRank = sessionStorage.getItem('highestRank');
  }

  getItemDetails(): void {
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
      () => {
        this.spinner.hide();
      }
    );
  }

  changeAttributes(): void {
    if (this.model.attributeValues && this.model.attributeValues.length > 0) {
      this.model.attributeValues.forEach((attr: { value: string }) => {
        if (attr.value == 'True') attr.value = 'Yes';
        else if (attr.value == 'False') attr.value = 'No';
      });
    }
  }
  getMMSOrder(): void {
    this.spinner.show();
    this.http.get(AppConfiguration.locationRestURL + `item/getMmsDataOrder/${this.companyId}`).subscribe(
      (response: any) => {
        this.spinner.hide();
        this.mmsItemsOrder = response.mmsDataArray !== null ? response.mmsDataArray : null;
        console.log('MMS response:', response);
      },
      (error) => {
        this.spinner.hide();
        console.error('MMS error:', error);
        
      }
    );
  }
   getItemMMS(): void {
    this.spinner.show();
    this.http.get(AppConfiguration.locationRestURL + `item/getItemMMS/${this.itemId}`).subscribe(
      (response: any) => {
        this.spinner.hide();
        this.mmsData = response !== null ? response : null;
        console.log('MMS response:', response);
      },
      (error) => {
        this.spinner.hide();
        console.error('MMS error:', error);
        
        this.mmsData = null;
      }
    );
  }
  getLabel(field: string): string {
  return field
    .replace(/^./, str => str.toUpperCase()) 
    .trim();
}

toggleEditOrder(): void {
  this.editingOrder = !this.editingOrder;
  
  if (!this.editingOrder) {
    this.getMMSOrder();
  }
}
columns = 3; 

private swap(i: number, j: number): void {
  const temp = this.mmsItemsOrder[i];
  this.mmsItemsOrder[i] = this.mmsItemsOrder[j];
  this.mmsItemsOrder[j] = temp;
}

moveLeft(index: number): void {
  if (index % this.columns !== 0) {
    this.swap(index, index - 1);
  }
}

moveRight(index: number): void {
  if ((index % this.columns) !== this.columns - 1 &&
      index < this.mmsItemsOrder.length - 1) {
    this.swap(index, index + 1);
  }
}

moveTop(index: number): void {
  if (index - this.columns >= 0) {
    this.swap(index, index - this.columns);
  }
}

moveBottom(index: number): void {
  if (index + this.columns < this.mmsItemsOrder.length) {
    this.swap(index, index + this.columns);
  }
}
saveMmsOrder(): void {
  this.spinner.show();
  this.http.post(AppConfiguration.locationRestURL + `item/MmsDataOrder`, {
    companyId: this.companyId,
    mmsDataArray: this.mmsItemsOrder
  }).subscribe(
    () => {
      this.spinner.hide();
      this.editingOrder = false;
    },
    () => {
      this.spinner.hide();
    }
  );
}
  getItemDefaultImage(): void {
    this.spinner.show();
    this.itemAttachmentsService.getItemDocuments(this.currentAttachmentId).subscribe(
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
      () => {
        this.spinner.hide();
      }
    );
  }

  getAttachments(): void {
    this.spinner.show();
    this.itemAttachmentsService.getAllItemPictures(this.itemId).subscribe(
      (response: any) => {
        this.itemAttachments = Array.isArray(response) ? response : [];
        this.images = this.itemAttachments
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
      () => {
        this.spinner.hide();
      }
    );
  }

  getWarrantyTypes(): void {
    this.warrantyManagementService.getAllWarrantyTypes(this.companyId).subscribe(
      (response: any) => {
        this.warrantyTypes = Array.isArray(response) ? response : [];
        this.setWarrantyType(this.warrantyTypes);
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  setWarrantyType(response: any[]): void {
    response.forEach((element: any) => {
      if (element.warrantyTypeId == this.model.warrantyTypeId)
        this.model.warrantyType = element.warrantyType;
    });
  }

  getJournalLog(): void {
    this.itemManagementService.getJournalLog(this.itemId).subscribe(
      (response: any) => {
        this.journals = Array.isArray(response) ? response : [];
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  openImage(): void {
    this.getAttachments();
  }

  handleEvent(event: any): void {
    let image: any = this.images[event.imageIndex];
    this.itemAttachmentsService
      .updateItemDefaultImage(
        this.itemId,
        image.substring(image.lastIndexOf('/') + 1, image.lastIndexOf('?'))
      )
      .subscribe(
        () => {
          this.refreshCall();
        }
      );
    this.myModal.hide();
  }

  refreshCall(): void {
    this.spinner.show();
    this.itemManagementService.getItemById(this.itemId).subscribe((response: any) => {
      this.currentAttachmentId = response.defaultImageAttachmentId;
      this.spinner.hide();
      this.model = response;
    });
  }

  back(): void {
    this._location.back();
  }

  openMoreChanges(): void {
    this.router.navigate(['/items/changeLog/' + this.itemId + '/' + 0]);
  }

  openModal(template: TemplateRef<any>, id: number): void {
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
        this.userName ?? '',
        this.itemTag,
        this.itemType
      )
      .subscribe(
        () => {
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
        () => {
          this.spinner.hide();
        }
      );
  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef.hide();
  }

  GoToWareHousetag(): void {
    this.itemManagementService.item = this.model;
    this.router.navigate(['/items/warehousetag/' + this.itemId]);
  }

  print(): void {
    this.helpFlag = false;
    window.print();
  }

  help(): void {
    this.helpFlag = !this.helpFlag;
  }

  goToItemService(): void {
    this.itemManagementService.item = this.model;
    this.router.navigate(['/items/itemService/' + this.itemId]);
  }
}