import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { LocationManagementService } from '../../../services/location-management.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { ItemManagementService } from '../../../services/Items/item-management.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ItemStatusService } from '../../../services/Items/item-status.service';
import { ItemTypesService } from '../../../services/Items/item-types.service';
import { ItemAttributeService } from '../../../services/Items/item-attribute.service';
import { WarrantyManagementService } from '../../../services/warranty-management.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ItemRepairItemsService } from '../../../services/Items/item-repair-items.service';
import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';
import { ImageViewerConfig } from 'ngx-image-viewer';
import { ItemAttachmentsService } from '../../../services';
import { BroadcasterService } from '../../../services/broadcaster.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Location } from '@angular/common';
import { isUndefined, isNull } from 'is-what';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { AppConfiguration } from 'src/app/configuration';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss'],
})
export class EditItemComponent implements OnInit {
  model: any = {
    locationId: 0,
    typeId: 0,
    warrantyTypeId: 0,
  };
  message: string = '';
  index: number = 0;
  itemTypes: any[] = [];
  statuses: any[] = [];
  companyId: number = 0;
  userName: string | null = null;
  typeAttributes: any[] = [];
  item: any = {};
  locations: any[] = [];
  globalCompany: any;
  companyName: string = '';
  warrantyTypes: any[] = [];
  bsConfig: Partial<BsDatepickerConfig>;
  itemId: any;
  responseAttributes: any[] = [];
  authToken: string | null = null;
  itemRank: any;
  isReqdAttr: any;
  reqAttrName: any;
  reqAttrValue: any;
  reqAttrValidate: boolean = false;
  dateNow: Date = new Date();
  locationValue: any;
  locationItems: TreeviewItem[] = [];
  itemTypeItems: TreeviewItem[] = [];
  config: TreeviewConfig = TreeviewConfig.create({
    hasFilter: false,
    hasCollapseExpand: false,
  });
  images: any[] = [];
  imageIndexOne: number = 0;
  imageIndexTwo: number = 0;
  journals: any[] = [];
  imageSource: any;
   itemMMS: boolean = false;
  mmsData: any = {};
  itemAttachments: any[] = [];
  iamgeconfig: ImageViewerConfig = {
    customBtns: [{ name: 'setAsDefault', icon: 'fa fa-sliders' }],
  };
  @ViewChild('myModal') public myModal!: ModalDirective;
  loggedInuser: string = '';
  modalRef!: BsModalRef;
  currentAttachmentId: any;
  itemTag: any;
  itemType: any;
  isDuplicateTag: boolean = false;
  currentItemTag: any;
  helpFlag: boolean = false;
  dismissible: boolean = true;
  loader: boolean = false;
  highestRank: string | null = null;
  get highestRankNum(): number {
    return Number(this.highestRank ?? 0);
  }

  constructor(
    private locationManagementService: LocationManagementService,
    private companyManagementService: CompanyManagementService,
    private itemManagementService: ItemManagementService,
    private itemStatusService: ItemStatusService,
    private itemTypesService: ItemTypesService,
    private itemAttributeService: ItemAttributeService,
    private warrantyManagementService: WarrantyManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private itemAttachmentsService: ItemAttachmentsService,
    private _location: Location,
    private modalService: BsModalService,
    private spinner: NgxSpinnerService,
    private itemRepairItemsService: ItemRepairItemsService,
    private broadcasterService: BroadcasterService,
    private sanitizer: DomSanitizer,
    private http: HttpClient
  ) {
    this.itemId = route.snapshot.params['id'];
    this.authToken = sessionStorage.getItem('auth_token');
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany) {
      this.companyName = this.globalCompany.name;
      this.companyId = this.globalCompany.companyId;
      this.userName = sessionStorage.getItem('userName');
    }
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value.companyId;
      this.companyName = this.globalCompany.name;
      this.userName = sessionStorage.getItem('userName');
    });
  }

  ngOnInit(): void {
    this.itemTag = this.broadcasterService.currentItemTag;
    this.itemType = this.broadcasterService.currentItemType;
    this.itemRank = this.broadcasterService.itemRank;
    this.highestRank = sessionStorage.getItem('highestRank');
    if (this.itemId) {
      this.getAllLocationsWithHierarchy();
      this.getJournalLog();
    }
  }

  getAllLocationsWithHierarchy(): void {
    this.locations = Array.isArray(this.broadcasterService.locations) ? this.broadcasterService.locations : [];
    if (this.locations.length > 0) {
      this.locationItems = this.generateHierarchy(this.locations);
    }
    this.getItemDetails();
  }

  generateHierarchy(locList: any[]): TreeviewItem[] {
    return locList.map((loc) => {
      const children = loc.parentResourceList && loc.parentResourceList.length > 0
        ? this.generateHierarchy(loc.parentResourceList)
        : [];
      return new TreeviewItem({
        text: loc.name,
        value: loc.locationId,
        collapsed: true,
        children,
      });
    });
  }

  getItemDetails(): void {
    this.spinner.show();
    this.itemManagementService.getItemById(this.itemId).subscribe(
      (response) => {
        this.spinner.hide();
        this.model = response;
        this.currentItemTag = this.model.tag;
        this.currentAttachmentId = this.model.defaultImageAttachmentId;
        if (this.currentAttachmentId != 0) this.getItemDefaultImage();
        if (this.model.purchaseDate) {
          this.model.purchaseDate = new Date(this.model.purchaseDate);
        }
        if (this.model.warrantyExpiration) {
          this.model.warrantyExpiration = new Date(this.model.warrantyExpiration);
        }
        this.getAllItemTypes();
        this.getItemTypeAttributes(this.model.typeId);
        this.getItemMMS();
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  generateHierarchyForItemTypes(typeList: any[]): TreeviewItem[] {
    return typeList.map((type) => {
      const children = type.typeList && type.typeList.length > 0
        ? this.generateHierarchyForItemTypes(type.typeList)
        : [];
      return new TreeviewItem({
        text: type.name,
        value: type.typeId,
        collapsed: true,
        children,
      });
    });
  }
   getItemMMS(): void {
    this.spinner.show();
    this.http.get(AppConfiguration.locationRestURL + `item/getItemMMS/${this.itemId}`).subscribe(
      (response: any) => {
        this.spinner.hide();
        this.mmsData = response || {};
        console.log('MMS Response:', response);
      },
      (error) => {
        this.spinner.hide();
        console.log('MMS Error:', error);
        this.mmsData = {};
      }
    );
  }
  checkItemTag(): void {
    this.modalRef.hide();
    this.itemManagementService.checkTag(this.model.tag, this.model.typeId).subscribe(
      (response: any) => {
        this.isDuplicateTag = Array.isArray(response) && response.length > 0;
      }
    );
  }

  CancelItemTagChange(): void {
    this.model.tag = this.currentItemTag;
    this.modalRef.hide();
  }

  getAllItemTypes(): void {
    this.itemTypes = Array.isArray(this.broadcasterService.itemTypeHierarchy) ? this.broadcasterService.itemTypeHierarchy : [];
    if (this.itemTypes.length > 0) {
      this.itemTypeItems = this.generateHierarchyForItemTypes(this.itemTypes);
    }
    this.getItemStatus();
  }

  getTypeName(typeId: any): string | undefined {
    let typeName: string | undefined;
    this.itemTypes.forEach((type: any) => {
      if (type.typeId == typeId) {
        typeName = type.name;
      } else if (type.typeList && type.typeList.length >= 1) {
        type.typeList.forEach((subType: any) => {
          if (subType.typeId == typeId) {
            typeName = subType.name;
          }
        });
      }
    });
    return typeName;
  }

  getItemStatus(): void {
    this.itemStatusService.getAllItemStatuses(String(this.companyId)).subscribe(
      (response) => {
        this.statuses = Array.isArray(response) ? response : [];
        this.getWarrantyTypes();
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  getWarrantyTypes(): void {
    this.spinner.show();
    this.warrantyManagementService.getAllWarrantyTypes(this.companyId).subscribe(
      (response) => {
        this.spinner.hide();
        this.warrantyTypes = Array.isArray(response) ? response : [];
      },
      () => {
        this.spinner.hide();
      }
    );
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

  getItemTypeAttributes(typeId: string): void {
    if (typeId && typeId != '0') {
      this.spinner.show();
      this.itemAttributeService.getTypeAttributes(typeId).subscribe(
        (response) => {
          this.typeAttributes = Array.isArray(response) ? response : [];
          if (this.model.attributeValues && this.model.attributeValues.length > 0) {
            this.typeAttributes.forEach((attr: { name: any; value: any }) => {
              this.model.attributeValues.forEach((ansAttr: { name: any; value: any }) => {
                if (attr.name == ansAttr.name) {
                  attr.value = ansAttr.value;
                }
              });
            });
          }
          this.spinner.hide();
        },
        () => {
          this.spinner.hide();
        }
      );
    }
  }

  updateItem(): void {
    if (
      this.model.typeId &&
      this.model.typeId != 0 &&
      this.model.tag &&
      this.model.tag != '' &&
      !this.isDuplicateTag
    ) {
      this.item.attributeValues = [];
      this.typeAttributes.forEach((attr: any) => {
        this.item.attributeValues.push({
          attributeName: attr,
          entityId: this.itemId,
          entitytypeId: attr.type.entitytypeId,
          lastModifiedBy: this.userName ?? '',
          value: attr.value != null ? attr.value : '',
        });
      });

      this.reqAttrValidate = false;
      this.item.attributeValues.forEach(
        (attr: { attributeName: { isRequired: any; name: any }; value: any }) => {
          this.isReqdAttr = attr.attributeName.isRequired;
          this.reqAttrName = attr.attributeName.name;
          this.reqAttrValue = attr.value;
          if (
            this.isReqdAttr === true &&
            (isUndefined(this.reqAttrValue) ||
              isNull(this.reqAttrValue) ||
              this.reqAttrValue === '')
          ) {
            this.reqAttrValidate = true;
            return;
          }
        }
      );
      const req = {
        attributeValues: this.item.attributeValues ?? null,
        defaultImageAttachmentId: this.model.defaultImageAttachmentId,
        description: this.model.description ?? '',
        desiredSpareRatio: this.model.desiredSpareRatio ?? 0,
        inServiceOn: this.model.inServiceOn,
        isInRepair: false,
        isStale: false,
        itemId: this.itemId,
        lastModifiedBy: this.userName ?? '',
        locationId: this.model.locationId ?? 0,
        manufacturerId: null,
        meanTimeBetweenService: this.model.meanTimeBetweenService ?? 0,
        modelNumber: 'string',
        name: this.model.name ?? '',
        purchaseDate: this.model.purchaseDate ?? '',
        purchasePrice: this.model.purchasePrice ?? 0,
        repairQual: 0,
        serialNumber: '',
        statusId: this.model.statusId ?? 0,
        statusName: this.model.status ?? 0,
        companyId: this.companyId,
        tag: this.model.tag ?? '',
        typeId: this.model.typeId ?? 0,
        warrantyExpiration: this.model.warrantyExpiration ?? '',
        warrantyTypeId: this.model.warrantyTypeId ?? 0,
        userId: sessionStorage.getItem('userId'),
        typeName: this.model.typeName,
        locationName: this.model.locationName,
        updatedDate: new Date().toISOString(),
      };
      if (!this.reqAttrValidate) {
        this.spinner.show();
        this.itemManagementService.updateItem(req).subscribe(
          (response) => {
            this.spinner.hide();
            this.index = 1;
            if (this.model.tag != this.currentItemTag) {
              this.broadcasterService.currentItemTag = this.model.tag;
            }
            this.itemManagementService.setItemSearchResults([]);
            setTimeout(() => {
              this.index = 0;
            }, 7000);
            this.router.navigate(['/items/viewItem/' + req.itemId]);
            window.scroll(0, 0);
          },
          () => {
            this.spinner.hide();
          }
        );
      } else {
        this.index = -2;
        window.scroll(0, 0);
      }
    } else {
      this.index = -1;
      window.scroll(0, 0);
    }
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
          alert('Image successfully updated');
          this.refreshCall();
        }
      );
    this.myModal.hide();
  }

  refreshCall(): void {
    this.spinner.show();
    this.itemManagementService.getItemById(this.itemId).subscribe((response) => {
      this.spinner.hide();
      this.model = response;
      if (this.model.purchaseDate) {
        this.model.purchaseDate = new Date(this.model.purchaseDate);
      }
      if (this.model.warrantyExpiration) {
        this.model.warrantyExpiration = new Date(this.model.warrantyExpiration);
      }
    });
  }

  back(): void {
    this._location.back();
  }

  openModal(template: TemplateRef<any>, id: any): void {
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  openModalForChangeTag(template: TemplateRef<any>): void {
    if (this.model.tag != this.currentItemTag) {
      this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
    } else {
      this.isDuplicateTag = false;
    }
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();
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

  openMoreChanges(): void {
    this.router.navigate(['/items/changeLog/' + this.itemId + '/' + 0]);
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

  goToItemService(): void {
    this.itemManagementService.item = this.model;
    this.router.navigate(['/items/itemService/' + this.itemId]);
  }
}