import { Component, OnInit, TemplateRef } from '@angular/core';
import { ItemTypesService } from '../../../services/Items/item-types.service';
import { ItemAttributeService } from '../../../services/Items/item-attribute.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CompanyTypesService } from '../../../services/company-types.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { BroadcasterService } from '../../../services/broadcaster.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { Location } from '@angular/common';

@Component({
  selector: 'app-item-attributes',
  templateUrl: './item-attributes.component.html',
  styleUrls: ['./item-attributes.component.scss'],
})
export class ItemAttributesComponent implements OnInit {
  listStyle = {
    width: '100%',
    height: '250px',
    dropZoneHeight: '50px',
  };
  companyId: string = '0';
  type: any = {};
  model: any = {
    type: {},
    attributetype: {
      attributetypeid: null,
    },
    searchtype: {
      attributesearchtypeid: 0,
    },
  };
  index: any = 0;
  types: any[] = [];
  atts: any[] = [];
  router: Router;
  username: any;
  message: string;
  modalRef: BsModalRef | null;
  modalRef2: BsModalRef | null;
  companyName: string = '';
  typeId: number;
  itemType: string = '';
  itemTypeOne: any;
  order: string = 'name';
  reverse: string = '';
  itemsForPagination: any = 5;
  attributeTypes: any = [];
  searchTypes: any = [];
  typeAttributes: any = [];
  typeAttributesLength: any;
  listItem: any;
  itemTypes: any = [];
  selectedAttrType: any = {};
  globalCompany: any;
  addEditFlag: any = false;
  currentRole: any;
  highestRank: any;
  dismissible = true;
  value: any;
  items: TreeviewItem[];
  config = TreeviewConfig.create({
    hasFilter: false,
    hasCollapseExpand: false,
  });
  typeValue: number;
  typeList: boolean;
  itemType1: any;
  helpFlag: any = false;
  loader = false;
  constructor(
    private modalService: BsModalService,
    private companyTypesService: CompanyTypesService,
    private itemTypesService: ItemTypesService,
    private companyManagementService: CompanyManagementService,
    private broadcasterService: BroadcasterService,
    private itemAttributeService: ItemAttributeService,
    router: Router,
    route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private _location: Location
  ) {
    this.typeId = parseInt(route.snapshot.params['id']);
    this.companyId = route.snapshot.params['companyId'];

    this.router = router;
    this.getItemType(this.typeId);
  }

  ngOnInit() {
    this.username = sessionStorage.getItem('userName');
    if (this.companyId == '0') {
      this.globalCompany = this.companyManagementService.getGlobalCompany();
      if (this.globalCompany) {
        this.companyName = this.globalCompany.name;
        this.companyId = this.globalCompany.companyid;
      }
    }
    this.pageLoadCalls(this.companyId);
    this.companyManagementService
      .getCompanyDetails(this.companyId)
      .subscribe((response: any) => {
        this.companyName = response.name;
      });
  }

  pageLoadCalls(companyId: string) {
    this.spinner.show();

    this.itemAttributeService.getAllAttributeTypes().subscribe((response) => {
      this.attributeTypes = response;
    });
    this.itemTypesService
      .getAllItemTypesWithHierarchy(companyId)
      .subscribe((response) => {
        this.itemTypes = response;
        var self = this;
        if (this.itemTypes && this.itemTypes.length > 0) {
          self.items = this.generateHierarchy(this.itemTypes);
        }
        if (this.typeId == 0) {
          this.typeId = this.itemTypes[0].typeid;
          this.value = this.typeId;
        } else {
          this.typeValue = this.typeId;
        }
        this.getTypeAttributes(this.typeId);
      });
  }

  generateHierarchy(typeList: any[]) {
    var items: TreeviewItem[] = [];
    typeList.forEach((type) => {
      var children: TreeviewItem[] = [];
      if (type.typeList && type.typeList.length > 0) {
        children = this.generateHierarchy(type.typeList);
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

  onValueChange(value: any) {
    this.value = value;
    console.log(value);
    this.addEditFlag = false;
    this.model = {
      type: {},
      attributetype: {
        attributetypeid: null,
      },
      searchtype: {
        attributesearchtypeid: 0,
      },
    };
    this.getTypeAttributes(value);
    this.getItemType(value);
  }

  getTypeAttributes(typeId: any) {
    this.index = 0;
    if (typeId != '0') {
      this.spinner.show();

      this.itemAttributeService
        .getTypeAttributes(typeId)
        .subscribe((response) => {
          this.spinner.hide();

          this.typeId = typeId;
          this.typeAttributes = response;
          this.typeAttributesLength = this.typeAttributes.length;
        });
    }
  }

  getSearchTypes(attributeTypeId: any) {
    if (attributeTypeId && attributeTypeId != 0 && attributeTypeId != 'null') {
      this.spinner.show();

      this.itemAttributeService
        .getAllSearchTypes(attributeTypeId)
        .subscribe((response) => {
          this.spinner.hide();

          this.searchTypes = response;
        });
    }
  }

  setSelectedAttribute(attribute: { attributetype: any }) {
    this.model = JSON.parse(JSON.stringify(attribute));
    this.selectedAttrType = JSON.parse(JSON.stringify(attribute.attributetype));
    this.index = 0;
    if (this.model.attributetype && this.model.attributetype.attributetypeid) {
      this.getSearchTypes(this.model.attributetype.attributetypeid);
    }
  }

  getItemType(typeId: any) {
    this.spinner.show();

    this.itemTypesService.getItemTypeDetails(typeId).subscribe((response) => {
      this.spinner.hide();

      console.log(response);
      this.itemType1 = response;
      if (!this.itemType1.parentid) {
        this.itemType1.parentid = {
          typeid: 0,
        };
      } else {
        this.value = this.itemType1.parentid.typeid;
      }
    });
  }

  createAttribute() {
    if (
      this.model.name &&
      this.model.attributetype &&
      this.model.attributetype.attributetypeid != null
    ) {
      var request = {
        attributelistitemResource: null,
        attributenameid: 0,
        attributetype: {
          attributetypeid: this.model.attributetype.attributetypeid,
        },
        displayorder: this.typeAttributesLength + 1,
        ismanufacturer: false,
        isrequired: this.model.isrequired ? this.model.isrequired : false,
        isrequiredformatch: this.model.isrequiredformatch
          ? this.model.isrequiredformatch
          : false,
        name: this.model.name,
        searchmodifier: '',
        companyId: this.companyId,
        lastmodifiedby: this.username,
        searchtype: {
          attributesearchtypeid: this.model.searchtype
            ? this.model.searchtype.attributesearchtypeid
            : 0,
        },
        tooltip: this.model.tooltip,
        type: this.itemType1,
        moduleType: 'Item',
      };
      if (this.model.attributelistitemResource) {
        request.attributelistitemResource =
          this.model.attributelistitemResource;
      }
      this.spinner.show();

      this.itemAttributeService
        .createNewTypeAttribute(request)
        .subscribe((response) => {
          this.spinner.hide();

          this.index = 1;
          setTimeout(() => {
            this.index = 0;
          }, 7000);
          window.scroll(0, 0);
          this.typeAttributes.push(response);
          this.typeAttributesLength = this.typeAttributesLength + 1;
          this.model = {
            type: {},
            attributetype: {
              attributetypeid: null,
            },
            searchtype: {
              attributesearchtypeid: 0,
            },
          };
          this.addEditFlag = false;
        });
    } else {
      this.index = -1;
    }
  }

  addListItem() {
    if (this.listItem && this.listItem != '') {
      if (!this.model.attributelistitemResource) {
        this.model.attributelistitemResource = [];
      }
      this.model.attributelistitemResource.push({ listitem: this.listItem });
      this.listItem = '';
    } else {
      this.index = 0;
    }
  }

  refresh() {
    this.atts = [];
    this.ngOnInit();
  }

  saveAttributeListOrder(typeAttributes: any) {
    this.spinner.show();

    this.itemAttributeService
      .updateTypeAttributesOrder(typeAttributes)
      .subscribe((response) => {
        this.spinner.hide();

        this.index = 4;
        setTimeout(() => {
          this.index = 0;
        }, 7000);
        window.scroll(0, 0);
      });
  }

  editAttribute() {
    if (
      this.model.name &&
      this.model.attributetype &&
      this.model.attributetype.attributetypeid != 0
    ) {
      this.spinner.show();

      var request = {
        attributelistitemResource: null,
        attributenameid: this.model.attributenameid,
        attributetype: {
          attributetypeid: this.model.attributetype
            ? this.model.attributetype.attributetypeid
            : 0,
        },
        displayorder: this.model.displayorder,
        displayorderlist: this.typeAttributes,
        ismanufacturer: this.model.ismanufacturer
          ? this.model.ismanufacturer
          : false,
        isrequired: this.model.isrequired ? this.model.isrequired : false,
        isrequiredformatch: this.model.isrequiredformatch
          ? this.model.isrequiredformatch
          : false,
        name: this.model.name,
        searchmodifier: '',
        companyId: this.companyId,
        lastmodifiedby: this.username,
        searchtype: {
          attributesearchtypeid:
            this.model.searchtype &&
            this.model.searchtype.attributesearchtypeid != 'null'
              ? this.model.searchtype.attributesearchtypeid
              : 0,
        },
        tooltip: this.model.tooltip,
        type: this.itemType1,
        moduleType: 'Item',
      };
      this.spinner.show();

      if (this.model.attributelistitemResource) {
        request.attributelistitemResource =
          this.model.attributelistitemResource;
      }
      this.itemAttributeService
        .updateTypeAttributes(request)
        .subscribe((response) => {
          this.spinner.hide();

          this.getTypeAttributes(this.typeId);

          this.index = 2;
          setTimeout(() => {
            this.index = 0;
          }, 7000);
          window.scroll(0, 0);
          this.model = {
            type: {},
            attributetype: {
              attributetypeid: null,
            },
            searchtype: {
              attributesearchtypeid: 0,
            },
          };
          this.addEditFlag = false;
        });
    } else {
      this.index = -1;
      window.scroll(0, 0);
    }
  }

  newAttribute() {
    this.addEditFlag = false;
    this.model = {
      type: {},
      attributetype: {
        attributetypeid: null,
      },
      searchtype: {
        attributesearchtypeid: 0,
      },
    };
    this.getTypeAttributes(this.typeValue);
    this.searchTypes = [];
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();
    this.modalRef?.hide();

    var moduleType = 'Item';
    this.itemAttributeService
      .removeItemAttributess(
        this.model.attributenameid,
        this.companyId,
        this.username,
        this.model.name,
        this.itemType1.name,
        moduleType
      )
      .subscribe(
        (response) => {
          this.spinner.hide();

          this.getTypeAttributes(this.typeId);
          this.index = 3;
          setTimeout(() => {
            this.index = 0;
          }, 7000);
          this.addEditFlag = false;
          this.model = {
            type: {},
            attributetype: {
              attributetypeid: null,
            },
            searchtype: {
              attributesearchtypeid: 0,
            },
          };
          window.scroll(0, 0);
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef?.hide();
  }

  setOrder(value: string) {
    if (this.order === value) {
      if (this.reverse == '') {
        this.reverse = '-';
      } else {
        this.reverse = '';
      }
    }
    this.order = value;
  }

  cancelItemAttributes() {
    this._location.back();
  }

  closeFirstModal() {
    this.modalRef?.hide();
    this.modalRef = null;
  }

  print() {
    this.helpFlag = false;
    window.print();
  }

  help() {
    this.helpFlag = !this.helpFlag;
  }
}
