import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';

import { CompanyTypesService } from '../../../services/index';
import { CompanyManagementService } from '../../../services/index';
import { CompanyAttributesServiceService } from '../../../services/index';
import { ItemAttributeService } from '../../../services/Items/item-attribute.service';
import { BroadcasterService } from '../../../services/broadcaster.service';

@Component({
  selector: 'app-companyattributes',
  templateUrl: './companyattributes.component.html',
  styleUrls: ['./companyattributes.component.scss'],
})
export class CompanyattributesComponent implements OnInit {
  listStyle = {
    width: '100%',
    height: '250px',
    dropZoneHeight: '50px',
  };

  companyId: string = '0';
  model: any = {
    type: {},
    attributeType: { attributeTypeId: null },
    searchType: { attributeSearchTypeId: 0 },
  };

  index = 0;
  types: any[] = [];
  atts: any[] = [];
  typeValue!: number;
  message = '';
  modalRef?: BsModalRef;
  companyName = '';
  userName: string | null = null;
  typeId = 0;
  itemTypeOne!: number;
  companyType = 0;
  order = 'name';
  reverse = '';
  companyAttrFilter: any = '';
  itemsForPagination = 5;
  attributeTypes: any[] = [];
  searchTypes: any[] = [];
  typeAttributes: any[] = [];
  typeAttributesLength = 0;
  listItem = '';
  cmptypes: any[] = [];
  selectedAttrType: any = {};
  globalCompany: any;
  addEditFlag = false;
  currentRole: string | null = null;
  highestRank: any;
  value: any;
  items: TreeviewItem[] = [];
  config = TreeviewConfig.create({
    hasFilter: false,
    hasCollapseExpand: false,
  });
  typeName: any;
  typeList!: boolean;
  helpFlag = false;
  dismissible = true;
  loader = false;

  constructor(
    private modalService: BsModalService,
    private companyTypesService: CompanyTypesService,
    private companyManagementService: CompanyManagementService,
    private broadcasterService: BroadcasterService,
    private companyAttributesServiceService: CompanyAttributesServiceService,
    private itemAttributeService: ItemAttributeService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private _location: Location
  ) {
    this.typeId = Number(this.route.snapshot.params['id']);
    this.companyType = this.typeId;
    this.companyId = this.route.snapshot.params['cmpId'];

    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyName = value.name;
      this.companyId = value.companyId;
    });
  }

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('userName');
    if (this.companyId === '0') {
      this.globalCompany = this.companyManagementService.getGlobalCompany();
      if (this.globalCompany) {
        this.companyName = this.globalCompany.name;
        this.companyId = this.globalCompany.companyId;
      }
    }

    this.pageLoadCalls(this.companyId);

    this.companyManagementService.getCompanyDetails(this.companyId).subscribe({
      next: (response: any) => {
        this.companyName = response.name;
      },
    });

    this.currentRole = sessionStorage.getItem('currentRole');
    this.highestRank = sessionStorage.getItem('highestRank');
  }

  pageLoadCalls(companyId: string): void {
    this.spinner.show();
    this.companyAttributesServiceService.getAllAttributeTypes().subscribe({
      next: (response) => {
        this.attributeTypes = response;
        this.companyTypesService
          .getAllCompanyTypesWithHierarchy(companyId)
          .subscribe({
            next: (resp) => {
              this.cmptypes = resp;
              this.items = [];

              if (this.cmptypes?.length > 0) {
                this.items = this.generateHierarchy(this.cmptypes);

                if (this.typeId === 0) {
                  if (
                    this.cmptypes.length === 1 &&
                    this.cmptypes[0].typeList.length < 1
                  ) {
                    this.value = this.cmptypes[0].typeId;
                    this.setTypeName(this.value);
                  } else if (this.cmptypes.length >= 1) {
                    this.value = 0;
                  }
                } else {
                  this.value = this.typeId;
                  this.setTypeName(this.value);
                }

                this.getTypeAttributes(this.value);
              }
              this.spinner.hide();
            },
            error: () => this.spinner.hide(),
          });
      },
      error: () => this.spinner.hide(),
    });
  }

  generateHierarchy(typeList: any[]): TreeviewItem[] {
    return typeList.map((type: any) => {
      const children =
        type.typeList && type.typeList.length > 0
          ? this.generateHierarchy(type.typeList)
          : [];
      return new TreeviewItem({
        text: type.name,
        value: type.typeId,
        collapsed: true,
        children,
      });
    });
  }

  setTypeName(typeId: any): void {
    this.cmptypes.forEach((type: any) => {
      if (type.typeId === typeId) {
        this.typeName = type.name;
      }
    });
  }

  onValueChange(value: any): void {
    this.typeId = value;
    this.setTypeName(value);
    this.value = value;
    this.addEditFlag = false;
    this.model = {
      type: {},
      attributeType: { attributeTypeId: null },
      searchType: { attributeSearchTypeId: 0 },
    };
    this.getTypeAttributes(value);
  }

  getAllTypes(companyId: string): void {
    this.spinner.show();
    this.companyTypesService.getAllCompanyTypes(companyId).subscribe({
      next: (resp) => {
        this.cmptypes = resp;
        this.companyType = this.typeId;
        this.cmptypes.forEach((type: any) => {
          if (!type.parentId) {
            type.parentId = 'Top Level';
          }
        });
        this.spinner.hide();
      },
      error: () => this.spinner.hide(),
    });
  }

  getTypeAttributes(typeId: any): void {
    this.typeId = Number(typeId);
    this.index = 0;
    if (typeId !== 0) {
      this.spinner.show();
      this.companyAttributesServiceService.getTypeAttributes(typeId).subscribe({
        next: (resp) => {
          this.spinner.hide();
          this.typeAttributes = resp;
          this.typeAttributesLength = this.typeAttributes.length;
        },
        error: () => this.spinner.hide(),
      });
    }
  }

  getAttributeTypes(): void {
    this.spinner.show();
    this.companyAttributesServiceService.getAllAttributeTypes().subscribe({
      next: (resp) => {
        this.spinner.hide();
        this.attributeTypes = resp;
      },
      error: () => this.spinner.hide(),
    });
  }

  getSearchTypes(attributeTypeId: any): void {
    if (attributeTypeId && attributeTypeId !== 0 && attributeTypeId !== 'null') {
      this.spinner.show();
      this.companyAttributesServiceService.getAllSearchTypes(attributeTypeId).subscribe({
        next: (resp) => {
          this.spinner.hide();
          this.searchTypes = resp;
        },
        error: () => this.spinner.hide(),
      });
    }
  }

  setSelectedAttribute(attribute: { attributeType: any }): void {
    this.model = JSON.parse(JSON.stringify(attribute));
    this.selectedAttrType = JSON.parse(
      JSON.stringify(attribute.attributeType)
    );
    this.index = 0;
    if (this.model.attributeType?.attributeTypeId) {
      this.getSearchTypes(this.model.attributeType.attributeTypeId);
    }
  }

  saveAttributeListOrder(typeAttributes: any): void {
    this.spinner.show();
    this.itemAttributeService.updateTypeAttributesOrder(typeAttributes).subscribe({
      next: () => {
        this.spinner.hide();
        this.index = 4;
        setTimeout(() => (this.index = 0), 7000);
        window.scroll(0, 0);
      },
      error: () => this.spinner.hide(),
    });
  }

  createAttribute(): void {
    if (
      this.model.name &&
      this.model.attributeType &&
      this.model.attributeType.attributeTypeId != null
    ) {
      const request: any = {
        attributeListItemResource: this.model.attributeListItemResource ?? null,
        attributeNameId: 0,
        attributeType: { attributeTypeId: this.model.attributeType.attributeTypeId },
        displayOrder: this.typeAttributesLength + 1,
        isManufacturer: false,
        isRequired: this.model.isRequired ?? false,
        isRequiredForMatch: false,
        name: this.model.name,
        searchModifier: '',
        searchType: this.model.searchType
          ? { attributeSearchTypeId: this.model.searchType.attributeSearchTypeId }
          : null,
        toolTip: this.model.toolTip,
        companyId: this.companyId,
        lastModifiedBy: this.userName,
        type: { typeId: this.value, name: this.typeName },
        moduleType: 'Company',
      };

      this.spinner.show();
      this.companyAttributesServiceService.createNewTypeAttribute(request).subscribe({
        next: (resp) => {
          this.spinner.hide();
          this.index = 1;
          setTimeout(() => (this.index = 0), 7000);
          window.scroll(0, 0);
          this.typeAttributes.push(resp);
          this.model = {
            type: {},
            attributeType: { attributeTypeId: null },
            searchType: { attributeSearchTypeId: 0 },
          };
          this.typeAttributesLength++;
        },
        error: () => this.spinner.hide(),
      });
    } else {
      this.index = -1;
      window.scroll(0, 0);
    }
  }

  addListItem(): void {
    if (this.listItem && this.listItem !== '') {
      if (!this.model.attributeListItemResource) {
        this.model.attributeListItemResource = [];
      }
      this.model.attributeListItemResource.push({ listItem: this.listItem });
      this.listItem = '';
    } else {
      this.index = 0;
    }
  }

  onChange(newValue: number): void {
    this.atts = [];
    this.companyType = newValue;
    this.typeId = newValue;
    for (let i = 1; i < 20; i++) {
      const compa = this.companyAttributesServiceService.getCompanyAttributess(
        i,
        this.companyId,
        this.typeId
      );
      if (compa) {
        this.atts.push(compa);
      }
    }
  }

  refresh(): void {
    this.atts = [];
    this.ngOnInit();
  }

  addAttribute(): void {
    this.router.navigate(['/company/addCompanyAtrribute/'], {
      queryParams: { q: this.companyId },
    });
  }

  editAttribute(): void {
    const request: any = {
      attributeListItemResource: this.model.attributeListItemResource ?? null,
      attributeNameId: this.model.attributeNameId,
      attributeType: {
        attributeTypeId: this.model.attributeType
          ? this.model.attributeType.attributeTypeId
          : 0,
      },
      displayOrder: this.model.displayOrder,
      isManufacturer: false,
      isRequired: this.model.isRequired ?? false,
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
      toolTip: this.model.toolTip,
      type: { typeId: this.value, name: this.typeName },
      moduleType: 'Company',
    };

    if (this.model.name && this.model.attributeType) {
      this.spinner.show();
      this.companyAttributesServiceService.updateTypeAttributes(request).subscribe({
        next: () => {
          this.spinner.hide();
          this.getTypeAttributes(this.typeId);
          this.index = 2;
          setTimeout(() => (this.index = 0), 7000);
          window.scroll(0, 0);
          this.addEditFlag = false;
          this.model = {
            type: {},
            attributeType: { attributeTypeId: null },
            searchType: { attributeSearchTypeId: 0 },
          };
        },
        error: () => this.spinner.hide(),
      });
    } else {
      this.index = -1;
    }
  }

  newAttribute(): void {
    this.addEditFlag = false;
    this.model = {
      type: {},
      attributeType: { attributeTypeId: null },
      searchType: { attributeSearchTypeId: 0 },
    };
    this.getTypeAttributes(this.typeId);
    this.searchTypes = [];
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  closeFirstModal(): void {
    this.modalRef?.hide();

  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();
    const moduleType = 'company';

    this.companyAttributesServiceService
      .removeCompanyAttributess(
        this.model.attributeNameId,
        this.companyId,
        this.userName ?? '',
        this.model.name,
        this.typeName,
        moduleType
      )
      .subscribe({
        next: () => {
          this.spinner.hide();
          this.modalRef?.hide();
          this.getTypeAttributes(this.typeId);
          this.index = 3;
          setTimeout(() => (this.index = 0), 7000);
          this.addEditFlag = false;
          this.model = {
            type: {},
            attributeType: { attributeTypeId: null },
            searchType: { attributeSearchTypeId: 0 },
          };
          window.scroll(0, 0);
        },
        error: () => this.spinner.hide(),
      });
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

  cancelCompanyAttributes(): void {
    this._location.back();
  }

  print(): void {
    this.helpFlag = false;
    window.print();
  }

  help(): void {
    this.helpFlag = !this.helpFlag;
  }
}
