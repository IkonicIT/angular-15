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
    width: '100%',
    height: '250px',
    dropZoneHeight: '50px',
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

  index: number = 0;
  types: any[] = [];
  atts: any[] = [];
  message: string = '';
  userName: string | null = null;
  modalRef: BsModalRef | null = null;
  companyName: string = '';
  typeId: number;
  userType: string = '';
  order: string = 'name';
  reverse: string = '';
  itemsForPagination: number = 5;
  attributeTypes: any[] = [];
  searchTypes: any[] = [];
  typeAttributes: any[] = [];
  typeAttributesLength: number = 0;
  listItem: string = '';
  usertypes: any[] = [];
  currentRole: string | null = null;
  highestRank: any;
  selectedAttrType: any = {};
  globalCompany: any;
  addEditFlag: boolean = false;
  typevalue: string | number = '';
  userTypes: any;
  items: TreeviewItem[] = [];
  config = TreeviewConfig.create({
    hasFilter: false,
    hasCollapseExpand: false,
  });
  value: number = 0;
  helpFlag: boolean = false;
  typeName: string = '';
  dismissible: boolean = true;
  loader = false;

  constructor(
    private modalService: BsModalService,
    private companyTypesService: CompanyTypesService,
    private userTypesService: UserTypesService,
    private companyManagementService: CompanyManagementService,
    private broadcasterService: BroadcasterService,
    private userAttributeService: UserAttributesService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private _location: Location
  ) {
    this.typeId = parseInt(this.route.snapshot.params['id'], 10);
    this.companyId = this.route.snapshot.params['cmpId'];
    this.globalCompany = this.companyManagementService.getGlobalCompany();

    if (this.globalCompany) {
      this.companyName = this.globalCompany.name;
      this.companyId = this.globalCompany.companyId;
    }

    this.getAllTypes(this.companyId);
  }

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('userName');
    this.pageLoadCalls(this.companyId);
    this.currentRole = sessionStorage.getItem('currentRole');
    this.highestRank = sessionStorage.getItem('highestRank');
  }

  pageLoadCalls(companyId: string): void {
    this.spinner.show();
    this.userAttributeService.getAllAttributeTypes().subscribe((response) => {
      this.attributeTypes = response;
      this.spinner.hide();
    });
  }

  setTypeName(typeId: any): void {
    this.usertypes.forEach((type: any) => {
      if (type.typeId === typeId) {
        this.typeName = type.name;
      }
    });
  }

  onValueChange(value: any): void {
    this.value = value;
    this.setTypeName(this.value);
    this.getTypeAttributes(this.value);
  }

  getAllTypes(companyId: any): void {
    this.spinner.show();
    this.userTypesService.getAllUserTypesWithHierarchy(companyId).subscribe(
      (response) => {
        this.spinner.hide();
        this.usertypes = response;

        if (this.usertypes && this.usertypes.length > 0) {
          this.items = this.generateHierarchy(this.usertypes);
          this.value = this.typeId;
        }

        this.setTypeName(this.value);
        this.getTypeAttributes(this.value);
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  generateHierarchy(typeList: any[]): TreeviewItem[] {
    const items: TreeviewItem[] = [];
    typeList.forEach((type) => {
      let children: TreeviewItem[] = [];
      if (type.typeList && type.typeList.length > 0) {
        children = this.generateHierarchy(type.typeList);
      }
      items.push(
        new TreeviewItem({
          text: type.name,
          value: type.typeId,
          collapsed: true,
          children,
        })
      );
    });
    return items;
  }

  getTypeAttributes(typeId: any): void {
    this.typevalue = typeId;
    this.index = 0;

    if (typeId !== '0') {
      this.spinner.show();
      this.userAttributeService.getTypeAttributes(typeId).subscribe(
        (response) => {
          this.spinner.hide();
          this.typeAttributes = response;
          this.typeAttributesLength = this.typeAttributes.length;
        },
        () => {
          this.spinner.hide();
        }
      );
    }
  }

  getAttributeTypes(): void {
    this.spinner.show();
    this.userAttributeService.getAllAttributeTypes().subscribe(
      (response) => {
        this.spinner.hide();
        this.attributeTypes = response;
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  getSearchTypes(attributeTypeId: any): void {
    if (attributeTypeId && attributeTypeId !== 0 && attributeTypeId !== 'null') {
      this.spinner.show();
      this.userAttributeService.getAllSearchTypes(attributeTypeId).subscribe(
        (response) => {
          this.spinner.hide();
          this.searchTypes = response;
        },
        () => {
          this.spinner.hide();
        }
      );
    }
  }

  setSelectedAttribute(attribute: { attributeType: any }): void {
    this.model = JSON.parse(JSON.stringify(attribute));
    this.selectedAttrType = JSON.parse(JSON.stringify(attribute.attributeType));
    this.index = 0;
    if (this.model.attributeType?.attributeTypeId) {
      this.getSearchTypes(this.model.attributeType.attributeTypeId);
    }
  }

  saveAttributeListOrder(typeAttributes: any): void {
    this.spinner.show();
    this.userAttributeService.updateTypeAttributesOrder(typeAttributes).subscribe(() => {
      this.spinner.hide();
      this.index = 4;
      setTimeout(() => (this.index = 0), 7000);
      window.scroll(0, 0);
    });
  }

  createAttribute(): void {
    if (this.model.name && this.model.attributeType?.attributeTypeId != null) {
      const request: any = {
        attributeListItemResource: this.model.attributeListItemResource || null,
        attributeNameId: 0,
        attributeType: { attributeTypeId: this.model.attributeType.attributeTypeId },
        displayOrder: this.typeAttributesLength + 1,
        isManufacturer: false,
        isRequired: this.model.isRequired || false,
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
        type: { typeId: this.value, name: this.typeName },
        moduleType: 'User',
      };

      this.spinner.show();
      this.userAttributeService.createNewTypeAttribute(request).subscribe(
        (response) => {
          this.spinner.hide();
          this.index = 1;
          setTimeout(() => (this.index = 0), 7000);
          window.scroll(0, 0);
          this.typeAttributes.push(response);
          this.typeAttributesLength++;
          this.resetModel();
          this.addEditFlag = false;
        },
        () => {
          this.spinner.hide();
        }
      );
    } else {
      this.index = -1;
    }
  }

  addListItem(): void {
    if (this.listItem && this.listItem !== '') {
      if (!this.model.attributeListItemResource) {
        this.model.attributeListItemResource = [];
      }
      this.model.attributeListItemResource.push({ listitem: this.listItem });
      this.listItem = '';
    } else {
      this.index = 0;
    }
  }

  refresh(): void {
    this.atts = [];
    this.ngOnInit();
  }

  editAttribute(): void {
    if (this.model.name && this.model.attributeType?.attributeTypeId !== 0) {
      const request: any = {
        attributeListItemResource: this.model.attributeListItemResource || null,
        attributeNameId: this.model.attributeNameId,
        attributeType: {
          attributeTypeId: this.model.attributeType?.attributeTypeId || 0,
        },
        displayOrder: this.typeAttributesLength + 1,
        isManufacturer: this.model.isManufacturer || false,
        isRequired: this.model.isRequired || false,
        isRequiredForMatch: false,
        name: this.model.name,
        searchModifier: '',
        companyId: this.companyId,
        lastModifiedBy: this.userName,
        searchType: {
          attributeSearchTypeId:
            this.model.searchType?.attributeSearchTypeId !== 'null'
              ? this.model.searchType?.attributeSearchTypeId
              : 0,
        },
        tooltip: this.model.tooltip,
        type: { typeId: this.value, name: this.typeName },
        moduleType: 'User',
      };

      this.spinner.show();
      this.userAttributeService.updateTypeAttributes(request).subscribe(
        () => {
          this.spinner.hide();
          this.getTypeAttributes(this.value);
          this.index = 2;
          setTimeout(() => (this.index = 0), 7000);
          window.scroll(0, 0);
          this.resetModel();
          this.addEditFlag = false;
        },
        () => {
          this.spinner.hide();
        }
      );
    } else {
      this.index = -1;
      window.scroll(0, 0);
    }
  }

  newAttribute(): void {
    this.addEditFlag = false;
    this.resetModel();
    this.getTypeAttributes(this.typevalue);
    this.searchTypes = [];
  }

  closeFirstModal(): void {
    this.modalRef?.hide();
    this.modalRef = null;
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.modalRef?.hide();
    this.spinner.show();

    const moduleType = 'User';
    this.userAttributeService
      .removeUserAttributess(
        this.model.attributeNameId,
        this.companyId,
        this.userName ?? '',
        this.model.name,
        this.typeName,
        moduleType
      )
      .subscribe(
        () => {
          this.spinner.hide();
          this.getTypeAttributes(this.value);
          this.index = 3;
          setTimeout(() => (this.index = 0), 7000);
          this.addEditFlag = false;
          this.resetModel();
          window.scroll(0, 0);
        },
        () => {
          this.spinner.hide();
        }
      );
  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef?.hide();
  }

  setOrder(value: string): void {
    if (this.order === value) {
      this.reverse = this.reverse === '' ? '-' : '';
    }
    this.order = value;
  }

  cancelUserAttributes(): void {
    this._location.back();
  }

  print(): void {
    this.helpFlag = false;
    window.print();
  }

  help(): void {
    this.helpFlag = !this.helpFlag;
  }

  private resetModel(): void {
    this.model = {
      type: {},
      attributeType: { attributeTypeId: null },
      searchType: { attributeSearchTypeId: 0 },
    };
  }
}
