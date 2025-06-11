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
    width: '100%', //width of the list defaults to 300,
    height: '250px', //height of the list defaults to 250,
    dropZoneHeight: '50px', // height of the dropzone indicator defaults to 50
  };
  companyId: string = '0';
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
  message: string;
  modalRef: BsModalRef;
  companyName: string = '';
  typeId: number;
  locationType: string = '';
  order: string = 'name';
  reverse: string = '';
  itemTypeOne: any;
  itemsForPagination: any = 5;
  attributeTypes: any = [];
  searchTypes: any = [];
  typeAttributes: any = [];
  typeAttributesLength: any;
  listItem: any;
  username: any;
  loctypes: any = [];
  dismissible = true;
  selectedAttrType: any = {};
  globalCompany: any;
  addEditFlag: any = false;
  currentRole: any;
  highestRank: any;
  value: any;
  items: TreeviewItem[];
  config = TreeviewConfig.create({
    hasFilter: false,
    hasCollapseExpand: false,
  });
  typeList: boolean;
  typeValue: number;
  itemTypes: any;
  helpFlag: any = false;
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
    router: Router,
    route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private _location: Location
  ) {
    this.typeId = parseInt(route.snapshot.params['id']);
    this.companyId = route.snapshot.params['companyId'];
    this.router = router;
  }

  ngOnInit() {
    this.username = sessionStorage.getItem('userName');
    this.currentRole = sessionStorage.getItem('currentRole');
    this.highestRank = sessionStorage.getItem('highestRank');
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

  pageLoadCalls(companyId: any) {
    this.spinner.show();

    this.locationAttributeService
      .getAllAttributeTypes()
      .subscribe((response) => {
        this.attributeTypes = response;
      });
    this.locationTypesService
      .getAllLocationTypesWithHierarchy(companyId)
      .subscribe(
        (response) => {
          this.loctypes = response;

          var self = this;
          if (this.loctypes && this.loctypes.length > 0) {
            self.items = this.generateHierarchy(this.loctypes);
          }

          this.typeValue = this.typeId;
          this.setTypeName(this.typeValue);
          this.getTypeAttributes(this.typeId);
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }

  generateHierarchy(typeList: any) {
    var items: any = [];
    typeList.forEach((type: any) => {
      var children = [];
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

  setTypeName(typeId: any) {
    this.loctypes.forEach((type: any) => {
      if (type.typeid == typeId) {
        this.typeName = type.name;
      }
    });
  }

  closeFirstModal() {}

  onTypesValueChange(value: any) {
    this.typeValue = value;
    this.setTypeName(this.typeValue);
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
    this.getTypeAttributes(this.typeValue);
  }

  onValueChange(value: any) {
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
  }

  getAllTypes(companyId: any) {
    this.spinner.show();

    this.locationTypesService
      .getAllLocationTypes(companyId)
      .subscribe((response) => {
        this.loctypes = response;

        this.loctypes.forEach((type: any) => {
          if (!type.parentid) {
            type.parentid = 'Top Level';
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

    this.locationAttributeService.getAllAttributeTypes().subscribe(
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

      this.locationAttributeService
        .getAllSearchTypes(attributeTypeId)
        .subscribe(
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

  setSelectedAttribute(attribute: any) {
    this.model = JSON.parse(JSON.stringify(attribute));
    this.selectedAttrType = JSON.parse(JSON.stringify(attribute.attributetype));
    this.index = 0;
    if (this.model.attributetype && this.model.attributetype.attributetypeid) {
      this.getSearchTypes(this.model.attributetype.attributetypeid);
    }
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
        isrequiredformatch: false,
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
        type: {
          typeid: this.typeValue,
          name: this.typeName,
        },
        moduleType: 'Location',
      };
      if (this.model.attributelistitemResource) {
        request.attributelistitemResource =
          this.model.attributelistitemResource;
      }
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
            attributetype: {
              attributetypeid: null,
            },
            searchtype: {
              attributesearchtypeid: 0,
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

  addAttribute() {
    this.router.navigate(['/company/addCompanyAtrribute/'], {
      queryParams: { q: this.companyId },
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
        ismanufacturer: this.model.ismanufacturer
          ? this.model.ismanufacturer
          : false,
        isrequired: this.model.isrequired ? this.model.isrequired : false,
        isrequiredformatch: false,
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
        type: {
          typeid: this.typeValue,
          name: this.typeName,
        },
        moduleType: 'Location',
      };
      this.spinner.show();

      if (this.model.attributelistitemResource) {
        request.attributelistitemResource =
          this.model.attributelistitemResource;
      }
      this.locationAttributeService.updateTypeAttributes(request).subscribe(
        (response) => {
          this.spinner.hide();

          this.getTypeAttributes(this.typeValue);
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
        },
        (error) => {
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
    this.modalRef.hide();
    this.spinner.show();

    var moduleType = 'Location';
    this.locationAttributeService
      .removeLocationAttributess(
        this.model.attributenameid,
        this.companyId,
        this.username,
        this.model.name,
        this.typeName,
        moduleType
      )
      .subscribe(
        (response) => {
          this.spinner.hide();

          this.getTypeAttributes(this.typeValue);
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
    this.modalRef.hide();
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
