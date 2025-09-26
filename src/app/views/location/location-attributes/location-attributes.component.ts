import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LocationAttributeService } from '../../../services/location-attribute.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { ItemAttributeService } from '../../../services/Items/item-attribute.service';
import { CompanyTypesService } from '../../../services/company-types.service';
import { BroadcasterService } from '../../../services/broadcaster.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocationTypesService } from '../../../services/location-types.service';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { Location } from '@angular/common';

@Component({
  selector: 'app-location-attributes',
  templateUrl: './location-attributes.component.html',
  styleUrls: ['./location-attributes.component.scss'],
})
export class LocationAttributesComponent implements OnInit {
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
  index: any = 0;
  types: any[] = [];
  atts: any[] = [];
  message: string;
  modalRef: BsModalRef;
  companyName: string = '';
  typeId: number;
  locationType: string = '';
  order: string = 'name';
  reverse: string = '';
  itemTypeOne: any;
  itemsForPagination: any = 5;
  attributeTypes: any[] = [];
  searchTypes: any[] = [];
  typeAttributes: any[] = [];
  typeAttributesLength: number = 0;
  listItem: any;
  userName: any;
  loctypes: any[] = [];
  dismissible = true;
  selectedAttrType: any = {};
  globalCompany: any;
  addEditFlag: boolean = false;
  currentRole: any;
  highestRank: any;
  value: any;
  items: TreeviewItem[] = [];
  config = TreeviewConfig.create({
    hasFilter: false,
    hasCollapseExpand: false,
  });
  typeList: boolean;
  typeValue: number;
  itemTypes: any;
  helpFlag: boolean = false;
  typeName: any;
  loader = false;

  constructor(
    private modalService: BsModalService,
    private companyTypesService: CompanyTypesService,
    private locationTypesService: LocationTypesService,
    private broadcasterService: BroadcasterService,
    private companyManagementService: CompanyManagementService,
    private itemAttributeService: ItemAttributeService,
    private locationAttributeService: LocationAttributeService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private _location: Location
  ) {
    this.typeId = parseInt(this.route.snapshot.params['id']);
    this.companyId = this.route.snapshot.params['companyId'];
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName');
    this.currentRole = sessionStorage.getItem('currentRole');
    this.highestRank = sessionStorage.getItem('highestRank');
    if (this.companyId == '0') {
      this.globalCompany = this.companyManagementService.getGlobalCompany();
      if (this.globalCompany) {
        this.companyName = this.globalCompany.name;
        this.companyId = this.globalCompany.companyId;
      }
    }
    this.pageLoadCalls(this.companyId);
    this.companyManagementService
      .getCompanyDetails(this.companyId)
      .subscribe((response: any) => {
        this.companyName = response.name;
      });
  }

  pageLoadCalls(companyId: any) {
    this.spinner.show();
    this.locationAttributeService.getAllAttributeTypes().subscribe((response) => {
      this.attributeTypes = Array.isArray(response) ? response : [];
    });
    this.locationTypesService
      .getAllLocationTypesWithHierarchy(companyId)
      .subscribe(
        (response) => {
          this.loctypes = Array.isArray(response) ? response : [];
          if (this.loctypes && this.loctypes.length > 0) {
            this.items = this.generateHierarchy(this.loctypes);
          }
          this.typeValue = this.typeId;
          this.setTypeName(this.typeValue);
          this.getTypeAttributes(this.typeId);
        },
        () => {
          this.spinner.hide();
        }
      );
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
        children: children,
      });
    });
  }

  setTypeName(typeId: any) {
    this.loctypes.forEach((type: any) => {
      if (type.typeId == typeId) {
        this.typeName = type.name;
      }
    });
  }

  closeFirstModal() {}

  onTypesValueChange(value: any) {
    this.typeValue = value;
    this.setTypeName(this.typeValue);
    this.addEditFlag = false;
    this.model = {
      type: {},
      attributeType: { attributeTypeId: null },
      searchType: { attributeSearchTypeId: 0 },
    };
    this.getTypeAttributes(this.typeValue);
  }

  onValueChange(value: any) {
    this.addEditFlag = false;
    this.model = {
      type: {},
      attributeType: { attributeTypeId: null },
      searchType: { attributeSearchTypeId: 0 },
    };
    this.getTypeAttributes(value);
  }

  getAllTypes(companyId: any) {
    this.spinner.show();
    this.locationTypesService
      .getAllLocationTypes(companyId)
      .subscribe((response) => {
        this.loctypes = Array.isArray(response) ? response : [];
        this.loctypes.forEach((type: any) => {
          if (!type.parentId) {
            type.parentId = 'Top Level';
          }
        });
      });
  }

  getTypeAttributes(typeId: any) {
    this.index = 0;
    if (typeId != '0') {
      this.spinner.show();
      this.locationAttributeService.getTypeAttributes(typeId).subscribe(
        (response) => {
          this.spinner.hide();
          this.typeAttributes = Array.isArray(response) ? response : [];
          this.typeAttributesLength = this.typeAttributes.length;
        },
        () => {
          this.spinner.hide();
        }
      );
    }
  }

  getAttributeTypes() {
    this.spinner.show();
    this.locationAttributeService.getAllAttributeTypes().subscribe(
      (response) => {
        this.spinner.hide();
        this.attributeTypes = Array.isArray(response) ? response : [];
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  getSearchTypes(attributeTypeId: any) {
    if (attributeTypeId && attributeTypeId != 0 && attributeTypeId != 'null') {
      this.spinner.show();
      this.locationAttributeService
        .getAllSearchTypes(attributeTypeId)
        .subscribe(
          (response) => {
            this.spinner.hide();
            this.searchTypes = Array.isArray(response) ? response : [];
          },
          () => {
            this.spinner.hide();
          }
        );
    }
  }

  setSelectedAttribute(attribute: any) {
    this.model = JSON.parse(JSON.stringify(attribute));
    this.selectedAttrType = JSON.parse(JSON.stringify(attribute.attributeType));
    this.index = 0;
    if (this.model.attributeType && this.model.attributeType.attributeTypeId) {
      this.getSearchTypes(this.model.attributeType.attributeTypeId);
    }
  }

  saveAttributeListOrder(typeAttributes: any) {
    this.spinner.show();
    this.itemAttributeService
      .updateTypeAttributesOrder(typeAttributes)
      .subscribe(() => {
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
      const request = {
        attributeListItemResource: this.model.attributeListItemResource ?? null,
        attributeNameId: 0,
        attributeType: {
          attributeTypeId: this.model.attributeType.attributeTypeId,
        },
        displayOrder: this.typeAttributesLength + 1,
        isManufacturer: false,
        isRequired: this.model.isRequired ?? false,
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
          typeId: this.typeValue,
          name: this.typeName,
        },
        moduleType: 'Location',
      };
      this.spinner.show();
      this.locationAttributeService.createNewTypeAttribute(request).subscribe(
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
            attributeType: { attributeTypeId: null },
            searchType: { attributeSearchTypeId: 0 },
          };
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

  addAttribute() {
    this.router.navigate(['/company/addCompanyAtrribute/'], {
      queryParams: { q: this.companyId },
    });
  }

  editAttribute() {
    if (
      this.model.name &&
      this.model.attributeType &&
      this.model.attributeType.attributeTypeId != 0
    ) {
      const request = {
        attributeListItemResource: this.model.attributeListItemResource ?? null,
        attributeNameId: this.model.attributeNameId,
        attributeType: {
          attributeTypeId: this.model.attributeType
            ? this.model.attributeType.attributeTypeId
            : 0,
        },
        displayOrder: this.model.displayOrder,
        isManufacturer: this.model.isManufacturer ?? false,
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
        tooltip: this.model.tooltip,
        type: {
          typeId: this.typeValue,
          name: this.typeName,
        },
        moduleType: 'Location',
      };
      this.spinner.show();
      this.locationAttributeService.updateTypeAttributes(request).subscribe(
        () => {
          this.spinner.hide();
          this.getTypeAttributes(this.typeValue);
          this.index = 2;
          setTimeout(() => {
            this.index = 0;
          }, 7000);
          window.scroll(0, 0);
          this.model = {
            type: {},
            attributeType: { attributeTypeId: null },
            searchType: { attributeSearchTypeId: 0 },
          };
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

  newAttribute() {
    this.addEditFlag = false;
    this.model = {
      type: {},
      attributeType: { attributeTypeId: null },
      searchType: { attributeSearchTypeId: 0 },
    };
    this.getTypeAttributes(this.typeValue);
    this.searchTypes = [];
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.modalRef.hide();
    this.spinner.show();
    const moduleType = 'Location';
    this.locationAttributeService
      .removeLocationAttributess(
        this.model.attributeNameId,
        this.companyId,
        this.userName,
        this.model.name,
        this.typeName,
        moduleType
      )
      .subscribe(
        () => {
          this.spinner.hide();
          this.getTypeAttributes(this.typeValue);
          this.index = 3;
          setTimeout(() => {
            this.index = 0;
          }, 7000);
          this.addEditFlag = false;
          this.model = {
            type: {},
            attributeType: { attributeTypeId: null },
            searchType: { attributeSearchTypeId: 0 },
          };
          window.scroll(0, 0);
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

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = this.reverse == '' ? '-' : '';
    }
    this.order = value;
  }

  cancelLocationAttributes() {
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