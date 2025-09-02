import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CompanyTypesService } from '../../../services/company-types.service';
import { UserTypesService } from '../../../services/user-types.service';
import { BroadcasterService } from '../../../services/broadcaster.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserAttributesService } from '../../../services/user-attributes.service';
import { Location } from '@angular/common';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';

@Component({
  selector: 'app-user-attributes',
  templateUrl: './user-attributes.component.html',
  styleUrls: ['./user-attributes.component.scss'],
})
export class UserAttributesComponent implements OnInit {
  listStyle = {
    width: '100%', //width of the list defaults to 300,
    height: '250px', //height of the list defaults to 250,
    dropZoneHeight: '50px', // height of the dropzone indicator defaults to 50
  };
  companyId: string = '0';
  model: any = {
    type: {},
    attributeType: {
      attributeTypeId: null,
    },
    searchType: {
      attributeSearchTypeId: 0,
    },
  };
  index: any = 0;
  types: any[] = [];
  atts: any[] = [];
  router: Router;
  message: string;
  userName: any;
  modalRef: BsModalRef | null;
  companyName: string = '';
  typeId: number;
  userType: string = '';
  order: string = 'name';
  reverse: string = '';
  itemsForPagination: any = 5;
  attributeTypes: any = [];
  searchTypes: any = [];
  typeAttributes: any = [];
  typeAttributesLength: any;
  listItem: any;
  usertypes: any = [];
  currentRole: any;
  highestRank: any;
  //dismissible = true;
  selectedAttrType: any = {};
  globalCompany: any;
  addEditFlag: any = false;
  typevalue: string | number;
  userTypes: any;
  items: TreeviewItem[];
  config = TreeviewConfig.create({
    hasFilter: false,
    hasCollapseExpand: false,
  });
  value: number;
  helpFlag: any = false;
  typeName: any;
  dismissible = true;
  loader = false;
  constructor(
    private modalService: BsModalService,
    private companyTypesService: CompanyTypesService,
    private userTypesService: UserTypesService,
    private companyManagementService: CompanyManagementService,
    private broadcasterService: BroadcasterService,
    private userAttributeService: UserAttributesService,
    router: Router,
    route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private _location: Location
  ) {
    this.typeId = parseInt(route.snapshot.params['id']);
    this.companyId = route.snapshot.params['cmpId'];
    this.router = router;
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany) {
      this.companyName = this.globalCompany.name;
      this.companyId = this.globalCompany.companyId;
    }
    this.getAllTypes(this.companyId);
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName');

    this.pageLoadCalls(this.companyId);

    this.currentRole = sessionStorage.getItem('currentRole');
    this.highestRank = sessionStorage.getItem('highestRank');
  }

  pageLoadCalls(companyId: string) {
    this.spinner.show();

    this.userAttributeService.getAllAttributeTypes().subscribe((response) => {
      this.attributeTypes = response;
    });
  }

  setTypeName(typeId: any) {
    this.usertypes.forEach((type: any) => {
      if (type.typeId == typeId) {
        this.typeName = type.name;
      }
    });
  }

  onValueChange(value: any) {
    this.value = value;
    this.setTypeName(this.value);
    this.getTypeAttributes(this.value);
  }

  getAllTypes(companyId: any) {
    this.spinner.show();

    this.userTypesService.getAllUserTypesWithHierarchy(companyId).subscribe(
      (response) => {
        this.spinner.hide();

        this.usertypes = response;

        var self = this;
        if (this.usertypes && this.usertypes.length > 0) {
          self.items = [];

          self.items = this.generateHierarchy(this.usertypes);
          this.value = this.typeId;
        }
        this.setTypeName(this.value);
        this.getTypeAttributes(this.value);
      },
      (error) => {
        this.spinner.hide();
      }
    );
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
          value: type.typeId,
          collapsed: true,
          children: children,
        })
      );
    });
    return items;
  }

  getTypeAttributes(typeId: any) {
    this.typevalue = typeId;
    this.index = 0;
    if (typeId != '0') {
      this.spinner.show();

      this.userAttributeService.getTypeAttributes(typeId).subscribe(
        (response) => {
          this.spinner.hide();

          this.typeAttributes = response;
          this.typeAttributesLength = this.typeAttributes.length;
        },
        (error) => {
          this.spinner.hide();
        }
      );
    }
  }

  getAttributeTypes() {
    this.spinner.show();

    this.userAttributeService.getAllAttributeTypes().subscribe(
      (response) => {
        this.spinner.hide();

        this.attributeTypes = response;
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  getSearchTypes(attributeTypeId: any) {
    if (attributeTypeId && attributeTypeId != 0 && attributeTypeId != 'null') {
      this.spinner.show();

      this.userAttributeService.getAllSearchTypes(attributeTypeId).subscribe(
        (response) => {
          this.spinner.hide();

          this.searchTypes = response;
        },
        (error) => {
          this.spinner.hide();
        }
      );
    }
  }

  setSelectedAttribute(attribute: { attributeType: any }) {
    this.model = JSON.parse(JSON.stringify(attribute));
    this.selectedAttrType = JSON.parse(JSON.stringify(attribute.attributeType));
    this.index = 0;
    if (this.model.attributeType && this.model.attributeType.attributeTypeId) {
      this.getSearchTypes(this.model.attributeType.attributeTypeId);
    }
  }

  saveAttributeListOrder(typeAttributes: any) {
    this.spinner.show();

    this.userAttributeService
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

  createAttribute() {
    if (
      this.model.name &&
      this.model.attributeType &&
      this.model.attributeType.attributeTypeId != null
    ) {
      var request = {
        attributeListItemResource: null,
        attributeNameId: 0,
        attributeType: {
          attributeTypeId: this.model.attributeType.attributeTypeId,
        },
        displayOrder: this.typeAttributesLength + 1,
        isManufacturer: false,
        isRequired: this.model.isRequired ? this.model.isRequired : false,
        isRequiredForMatch: false,
        name: this.model.name,
        searchModifier: '',
        companyId: this.companyId,
        lastModifiedBy: this.userName,
        searchType: {
          attributeSearchTypeId: this.model.searchType
            ? this.model.searchType.attributeSearchTypeId
            : 0,
        },
        tooltip: this.model.tooltip,
        type: {
          typeId: this.value,
          name: this.typeName,
        },
        moduleType: 'User',
      };
      if (this.model.attributeListItemResource) {
        request.attributeListItemResource =
          this.model.attributeListItemResource;
      }
      this.spinner.show();

      this.userAttributeService.createNewTypeAttribute(request).subscribe(
        (response) => {
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
            attributeType: {
              attributeTypeId: null,
            },
            searchType: {
              attributeSearchTypeId: 0,
            },
          };
          this.addEditFlag = false;
        },
        (error) => {
          this.spinner.hide();
        }
      );
    } else {
      this.index = -1;
    }
  }

  addListItem() {
    if (this.listItem && this.listItem != '') {
      if (!this.model.attributeListItemResource) {
        this.model.attributeListItemResource = [];
      }
      this.model.attributeListItemResource.push({ listItem: this.listItem });
      this.listItem = '';
    } else {
      this.index = 0;
    }
  }

  refresh() {
    this.atts = [];
    this.ngOnInit();
  }

  editAttribute() {
    if (
      this.model.name &&
      this.model.attributeType &&
      this.model.attributeType.attributeTypeId != 0
    ) {
      this.spinner.show();

      var request = {
        attributeListItemResource: null,
        attributeNameId: this.model.attributeNameId,
        attributeType: {
          attributeTypeId: this.model.attributeType
            ? this.model.attributeType.attributeTypeId
            : 0,
        },
        displayOrder: this.typeAttributesLength + 1,
        isManufacturer: this.model.isManufacturer
          ? this.model.isManufacturer
          : false,
        isRequired: this.model.isRequired ? this.model.isRequired : false,
        isRequiredForMatch: false,
        name: this.model.name,
        searchModifier: '',
        companyId: this.companyId,
        lastModifiedBy: this.userName,
        searchType: {
          attributeSearchTypeId:
            this.model.searchType &&
            this.model.searchType.attributeSearchTypeId != 'null'
              ? this.model.searchType.attributeSearchTypeId
              : 0,
        },
        tooltip: this.model.tooltip,
        type: {
          typeId: this.value,
          name: this.typeName,
        },
        moduleType: 'User',
      };
      this.spinner.show();

      if (this.model.attributeListItemResource) {
        request.attributeListItemResource =
          this.model.attributeListItemResource;
      }
      this.userAttributeService.updateTypeAttributes(request).subscribe(
        (response) => {
          this.spinner.hide();

          this.getTypeAttributes(this.value);
          this.index = 2;
          setTimeout(() => {
            this.index = 0;
          }, 7000);
          window.scroll(0, 0);
          this.model = {
            type: {},
            attributeType: {
              attributeTypeId: null,
            },
            searchType: {
              attributeSearchTypeId: 0,
            },
          };
          this.addEditFlag = false;
        },
        (error) => {
          this.spinner.hide();
        }
      );
    } else {
      this.index = -1;
      window.scroll(0, 0);
    }
  }

  newAttribute() {
    this.addEditFlag = false;
    this.model = {
      type: {},
      attributeType: {
        attributeTypeId: null,
      },
      searchType: {
        attributeSearchTypeId: 0,
      },
    };
    this.getTypeAttributes(this.typevalue);
    this.searchTypes = [];
  }

  closeFirstModal() {
    this.modalRef?.hide();
    this.modalRef = null;
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.modalRef?.hide();
    this.spinner.show();

    var moduleType = 'User';
    this.userAttributeService
      .removeUserAttributess(
        this.model.attributeNameId,
        this.companyId,
        this.userName,
        this.model.name,
        this.typeName,
        moduleType
      )
      .subscribe(
        (response) => {
          this.spinner.hide();

          this.getTypeAttributes(this.value);
          this.index = 3;
          setTimeout(() => {
            this.index = 0;
          }, 7000);
          this.addEditFlag = false;
          this.model = {
            type: {},
            attributeType: {
              attributeTypeId: null,
            },
            searchType: {
              attributeSearchTypeId: 0,
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

  cancelUserAttributes() {
    this._location.back();
  }

  print() {
    this.helpFlag = false;
    window.print();
  }

  help() {
    this.helpFlag = !this.helpFlag;
  }
}
