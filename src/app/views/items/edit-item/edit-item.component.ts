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
import { faL } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss'],
})
export class EditItemComponent implements OnInit {
  model: any = {
    locationid: 0,
    typeId: 0,
    warrantytypeid: 0,
  };
  message: string;
  index: number = 0;
  itemTypes: any;
  statuses: any;
  companyId: any;
  userName: any;
  typeAttributes: any;
  item: any = {};
  locations: any;
  globalCompany: any;
  companyName: any;
  warrantyTypes: any;
  bsConfig: Partial<BsDatepickerConfig>;
  itemId: any;
  responseAttributes: any = [];
  authToken: any;
  itemRank: any;
  isReqdAttr: any;
  reqAttrName: any;
  reqAttrValue: any;
  reqAttrValidate: any;
  dateNow: Date = new Date();
  locationValue: any;
  locationItems: TreeviewItem[];
  itemTypeItems: TreeviewItem[];
  config = TreeviewConfig.create({
    hasFilter: false,
    hasCollapseExpand: false,
  });
  images = [];
  imageIndexOne = 0;
  imageIndexTwo = 0;
  journals: any[] = [];
  imageSource: any;
  itemAttachments: any = [];
  iamgeconfig: ImageViewerConfig = {
    customBtns: [{ name: 'setAsDefault', icon: 'fa fa-sliders' }],
  };
  @ViewChild('myModal') public myModal: ModalDirective;
  loggedInuser: string;
  modalRef: BsModalRef;
  currentAttachmentId: any;
  itemTag: any;
  any: any;
  itemType: any;
  isDuplicateTag = false;
  currentItemTag: any;
  helpFlag: any = false;
  dismissible = true;
  loader = false;
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
    private sanitizer: DomSanitizer
  ) {
    this.itemId = route.snapshot.params['id'];
    this.authToken = sessionStorage.getItem('auth_token');
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany) {
      this.companyName = this.globalCompany.name;
      this.companyId = this.globalCompany.companyid;
      this.userName = sessionStorage.getItem('userName');
    }
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value.companyid;
      this.companyName = this.globalCompany.name;
      this.userName = sessionStorage.getItem('userName');
    });
  }

  ngOnInit() {
    this.itemTag = this.broadcasterService.currentItemTag;
    this.itemType = this.broadcasterService.currentItemType;
    this.itemRank = this.broadcasterService.itemRank;
    if (this.itemId) {
      this.getAllLocationsWithHierarchy();
      this.getJournalLog();
    }
  }

  getAllLocationsWithHierarchy() {
    this.locations = this.broadcasterService.locations;
    if (this.locations && this.locations.length > 0) {
      this.locationItems = [];
      this.locationItems = this.generateHierarchy(this.locations);
    }
    this.getItemDetails();
  }

  generateHierarchy(locList: any[]) {
    var items: TreeviewItem[] = [];
    locList.forEach((loc) => {
      var children: TreeviewItem[] = [];
      if (
        loc.parentLocationResourceList &&
        loc.parentLocationResourceList.length > 0
      ) {
        children = this.generateHierarchy(loc.parentLocationResourceList);
      }
      items.push(
        new TreeviewItem({
          text: loc.name,
          value: loc.locationid,
          collapsed: true,
          children: children,
        })
      );
    });
    return items;
  }

  getItemDetails() {
    this.spinner.show();
    this.loader = true;
    this.itemManagementService.getItemById(this.itemId).subscribe(
      (response) => {
        this.spinner.hide();
        this.loader = false;
        this.model = response;
        this.currentItemTag = this.model.tag;
        this.currentAttachmentId = this.model.defaultImageAttachmentId;
        if (this.currentAttachmentId != 0) this.getItemDefaultImage();
        if (this.model.purchaseDate) {
          this.model.purchaseDate = new Date(this.model.purchaseDate);
        }
        if (this.model.warrantyExpiration) {
          this.model.warrantyExpiration = new Date(
            this.model.warrantyExpiration
          );
        }

        this.getAllItemTypes();
        this.getItemTypeAttributes(this.model.typeId);
      },
      (error) => {
        this.spinner.hide();
        this.loader = false;
      }
    );
  }

  generateHierarchyForItemTypes(typeList: any[]) {
    var items: TreeviewItem[] = [];
    typeList.forEach((type) => {
      var children: TreeviewItem[] = [];
      if (type.typeList && type.typeList.length > 0) {
        children = this.generateHierarchyForItemTypes(type.typeList);
      }
      items.push(
        new TreeviewItem({
          text: type.name,
          value: type.typeid,
          collapsed: true,
          children: children,
        })
      );
    });
    return items;
  }

  checkItemTag() {
    this.modalRef.hide();
    this.itemManagementService
      .checkTag(this.model.tag, this.model.typeId)
      .subscribe(
        (response: any) => {
          this.isDuplicateTag = response.length > 0 ? true : false;
        },
        (error) => {}
      );
  }

  CancelItemTagChange() {
    this.model.tag = this.currentItemTag;
    this.modalRef.hide();
  }

  getAllItemTypes() {
    this.itemTypes = this.broadcasterService.itemTypeHierarchy;
    if (this.itemTypes && this.itemTypes.length > 0) {
      this.itemTypeItems = this.generateHierarchyForItemTypes(this.itemTypes);
    }
    this.getItemStatus();
  }

  getTypeName(typeId: any) {
    let typeName;
    this.itemTypes.forEach(
      (type: { typeid: any; name: any; typeList: any[] }) => {
        if (type.typeid == typeId) {
          typeName = type.name;
        } else if (type.typeList.length >= 1) {
          type.typeList.forEach((type) => {
            if (type.typeid == typeId) {
              typeName = type.name;
            }
          });
        }
      }
    );
    return typeName;
  }

  getItemStatus() {
    this.itemStatusService.getAllItemStatuses(this.companyId).subscribe(
      (response) => {
        this.statuses = response;
        this.getWarrantyTypes();
      },
      (error) => {
        this.spinner.hide();
        this.loader = false;
      }
    );
  }

  getWarrantyTypes() {
    this.spinner.show();
    this.loader = true;
    this.warrantyManagementService
      .getAllWarrantyTypes(this.companyId)
      .subscribe(
        (response) => {
          this.spinner.hide();
          this.loader = false;
          this.warrantyTypes = response;
        },
        (error) => {
          this.spinner.hide();
          this.loader = false;
        }
      );
  }

  getJournalLog() {
    this.itemManagementService.getJournalLog(this.itemId).subscribe(
      (response: any) => {
        this.journals = response;
        console.log('journallist=' + this.journals);
      },
      (error) => {
        this.spinner.hide();
        this.loader = false;
      }
    );
  }

  getItemTypeAttributes(typeId: string) {
    // this.getTypeName(typeId);
    if (typeId && typeId != '0') {
      this.spinner.show();
      this.loader = true;
      this.itemAttributeService.getTypeAttributes(typeId).subscribe(
        (response) => {
          this.typeAttributes = response;
          if (
            this.model.attributeValues &&
            this.model.attributeValues.length > 0
          ) {
            this.typeAttributes.forEach((attr: { name: any; value: any }) => {
              this.model.attributeValues.forEach(
                (ansAttr: { name: any; value: any }) => {
                  if (attr.name == ansAttr.name) {
                    attr.value = ansAttr.value;
                  }
                }
              );
            });
          }
          this.spinner.hide();
          this.loader = false;
        },
        (error) => {
          this.spinner.hide();
          this.loader = false;
        }
      );
    }
  }

  updateItem() {
    if (
      this.model.typeId &&
      this.model.typeId != 0 &&
      this.model.tag &&
      this.model.tag != '' &&
      !this.isDuplicateTag
    ) {
      this.item.attributevalues = [];
      this.typeAttributes.forEach(
        (attr: { type: { entitytypeid: any }; value: null }) => {
          this.item.attributevalues.push({
            attributename: attr,
            entityid: this.itemId,
            entitytypeid: attr.type.entitytypeid,
            lastmodifiedby: this.userName,
            value: attr.value != null ? attr.value : '',
          });
        }
      );

      this.reqAttrValidate = false;
      this.item.attributevalues.forEach(
        (attr: {
          attributename: { isrequired: any; name: any };
          value: any;
        }) => {
          this.isReqdAttr = attr.attributename.isrequired;
          this.reqAttrName = attr.attributename.name;
          this.reqAttrValue = attr.value;
          if (
            this.isReqdAttr == true &&
            (isUndefined(this.reqAttrValue) ||
              isNull(this.reqAttrValue) ||
              this.reqAttrValue == '')
          ) {
            this.reqAttrValidate = true;
            console.log('attribute check is' + this.index);
            return;
          }
          console.log('attribute isrequired value is' + this.isReqdAttr);
          console.log('attribute name is' + this.reqAttrName);
          console.log('attribute name value is' + this.reqAttrValue);
          console.log('validate' + this.reqAttrValidate);
        }
      );
      var req = {
        attributevalues: this.item.attributevalues
          ? this.item.attributevalues
          : null,
        defaultimageattachmentid: this.model.defaultImageAttachmentId,
        description: this.model.description ? this.model.description : '',
        desiredspareratio: this.model.desiredSpareRatio
          ? this.model.desiredSpareRatio
          : 0,
        inserviceon: this.model.inServiceOn,
        isinrepair: false,
        isstale: false,
        itemid: this.itemId,
        lastmodifiedby: this.userName,
        locationid: this.model.locationId ? this.model.locationId : 0,
        manufacturerid: null,
        meantimebetweenservice: this.model.meanTimeBetweenService
          ? this.model.meanTimeBetweenService
          : 0,
        modelnumber: 'string',
        name: this.model.name ? this.model.name : '',
        purchasedate: this.model.purchaseDate ? this.model.purchaseDate : '',
        purchaseprice: this.model.purchasePrice ? this.model.purchasePrice : 0,
        repairqual: 0,
        serialnumber: '',
        statusid: this.model.statusId ? this.model.statusId : 0,
        statusname: this.model.status ? this.model.status : 0,
        companyid: this.companyId,
        tag: this.model.tag ? this.model.tag : '',
        typeId: this.model.typeId ? this.model.typeId : 0,
        warrantyexpiration: this.model.warrantyExpiration
          ? this.model.warrantyExpiration
          : '',
        warrantytypeid: this.model.warrantyTypeId
          ? this.model.warrantyTypeId
          : 0,
        userid: sessionStorage.getItem('userId'),
        typeName: this.model.typeName,
        locationName: this.model.locationName,
        updatedDate: new Date().toISOString(),
      };
      if (this.reqAttrValidate == false) {
        this.spinner.show();
        this.loader = true;
        this.itemManagementService.updateItem(req).subscribe(
          (response) => {
            this.spinner.hide();
            this.loader = false;
            this.index = 1;
            if (this.model.tag != this.currentItemTag) {
              this.broadcasterService.currentItemTag = this.model.tag;
            }
            this.itemManagementService.setItemSearchResults([]);
            setTimeout(() => {
              this.index = 0;
            }, 7000);
            this.router.navigate(['/items/viewItem/' + req.itemid]);
            window.scroll(0, 0);
          },
          (error) => {
            this.spinner.hide();
            this.loader = false;
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

  openImage() {
    this.getAttachments();
  }

  handleEvent(event: any) {
    console.log('run print logic');
    let image: any = this.images[event.imageIndex];

    this.itemAttachmentsService
      .updateItemDefaultImage(
        this.itemId,
        image.substring(image.lastIndexOf('/') + 1, image.lastIndexOf('?'))
      )
      .subscribe(
        (response) => {
          alert('Image successfully updated ');
          this.refreshCall();
        },
        (error) => {}
      );
    this.myModal.hide();
  }

  refreshCall() {
    this.spinner.show();
    this.loader = true;
    this.itemManagementService
      .getItemById(this.itemId)
      .subscribe((response) => {
        this.spinner.hide();
        this.loader = false;

        this.model = response;

        if (this.model.purchaseDate) {
          this.model.purchaseDate = new Date(this.model.purchaseDate);
        }
        if (this.model.warrantyExpiration) {
          this.model.warrantyExpiration = new Date(
            this.model.warrantyExpiration
          );
        }
      });
  }

  back() {
    this._location.back();
  }

  openModal(template: TemplateRef<any>, id: any) {
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  openModalForChangeTag(template: TemplateRef<any>) {
    if (this.model.tag != this.currentItemTag) {
      this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
    } else {
      this.isDuplicateTag = false;
    }
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();
    this.loader = true;
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
          this.loader = false;
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
          this.loader = false;
        }
      );
  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef.hide();
  }

  openMoreChanges() {
    this.router.navigate(['/items/changeLog/' + this.itemId + '/' + 0]);
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

  getAttachments() {
    this.spinner.show();
    this.loader = true;
    this.itemAttachmentsService.getAllItemPictures(this.itemId).subscribe(
      (response: any) => {
        this.itemAttachments = response;
        this.images = response
          .filter((e: { contenttype: string | string[] }) =>
            e.contenttype.includes('image')
          )
          .map(
            (e: { isNew: any; attachmentFile: any; attachmentid: string }) => {
              if (e.isNew)
                return this.sanitizer.bypassSecurityTrustResourceUrl(
                  `data:image/png;base64, ${e.attachmentFile}`
                );
              else
                return (
                  'https://gotracrat.com:8088/api/attachment/downloadaudiofile/' +
                  e.attachmentid +
                  '?access_token=' +
                  this.authToken
                );
            }
          );
        this.spinner.hide();
        this.loader = false;
        this.myModal.show();
      },
      (error) => {
        this.spinner.hide();
        this.loader = false;
      }
    );
  }

  getItemDefaultImage() {
    this.spinner.show();
    this.loader = true;
    this.itemAttachmentsService
      .getItemDocuments(this.currentAttachmentId)
      .subscribe(
        (response: any) => {
          this.spinner.hide();
          this.loader = false;
          if (response.isNew)
            this.imageSource = this.sanitizer.bypassSecurityTrustResourceUrl(
              `data:image/png;base64, ${response.attachmentFile}`
            );
          else
            this.imageSource =
              'https://gotracrat.com:8088/api/attachment/downloadaudiofile/' +
              response.attachmentid +
              '?access_token=' +
              this.authToken;
        },
        (error) => {
          this.spinner.hide();
          this.loader = false;
        }
      );
  }

  goToItemService() {
    this.itemManagementService.item = this.model;
    this.router.navigate(['/items/itemService/' + this.itemId]);
  }
}
