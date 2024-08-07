import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyTypesService } from '../../../services/index';
import { TemplateRef, SecurityContext } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { CompanyManagementService } from '../../../services/index';
import { CompanyAttributesServiceService } from '../../../services/index';
import { Company } from '../../../models/index';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { ItemAttributeService } from '../../../services/Items/item-attribute.service';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { BroadcasterService } from '../../../services/broadcaster.service';
import { Location } from '@angular/common';

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
  typeValue: number;
  router: Router;
  message: string;
  modalRef: BsModalRef;
  companyName: string = '';
  username: any;
  typeId: number;
  itemTypeOne: number;
  companyType: number;
  order: string = 'name';
  reverse: string = '';
  companyAttrFilter: any = '';
  itemsForPagination: any = 5;
  attributeTypes: any = [];
  searchTypes: any = [];
  typeAttributes: any = [];
  typeAttributesLength: any;
  listItem: any;
  cmptypes: any = [];
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
  typeName: any;
  typeList: boolean;
  helpFlag: any = false;
  dismissible = true;
  loader = false;

  constructor(
    private modalService: BsModalService,
    private companyTypesService: CompanyTypesService,
    private companyManagementService: CompanyManagementService,
    private broadcasterService: BroadcasterService,
    private companyAttributesServiceService: CompanyAttributesServiceService,
    private itemAttributeService: ItemAttributeService,
    router: Router,
    route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private _location: Location
  ) {
    this.typeId = parseInt(route.snapshot.params['id']);
    this.companyType = this.typeId;
    this.companyId = route.snapshot.params['cmpId'];
    //this.username = this.broadcasterService.username;
    this.router = router;
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyName = value.name;
      this.companyId = value.companyid;
    });
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
    this.currentRole = sessionStorage.getItem('currentRole');
    this.highestRank = sessionStorage.getItem('highestRank');
  }

  

  pageLoadCalls(companyId: string) {
    this.spinner.show();
    this.loader = true; 
    this.companyAttributesServiceService
      .getAllAttributeTypes()
      .subscribe((response) => {
        this.attributeTypes = response;
        this.companyTypesService
          .getAllCompanyTypesWithHierarchy(companyId)
          .subscribe((response) => {
            this.cmptypes = response;

            this.items = [];
            if (this.cmptypes && this.cmptypes.length > 0) {
              this.items = this.generateHierarchy(this.cmptypes);

              if (this.typeId == 0) {
                if (
                  this.cmptypes.length == 1 &&
                  this.cmptypes[0].typeList.length < 1
                ) {
                  this.value = this.cmptypes[0].typeid;
                  this.setTypeName(this.value);
                } else if (this.cmptypes.length >= 1) {
                  this.value = 0;
                }
              } else {
                this.value = this.typeId;
                this.setTypeName(this.value);
              }

              this.getTypeAttributes(this.value);
              this.spinner.hide();
              this.loader = false;

            } else {
              this.spinner.hide();
              this.loader = false;
            }
          });
      });
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
      }
    );
    return items;
  }

  setTypeName(typeId: any) {
    this.cmptypes.forEach((type: any) => {
      if ((type.typeid = typeId)) {
        this.typeName = type.name;
      }
    });
  }

  onValueChange(value: any) {
    this.typeId = value;
    this.setTypeName(value);
    console.log('companytype in companyattributes component2 is' + this.typeId);
    this.value = value;
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

  getAllTypes(companyId: string) {
    this.spinner.show();
    this.loader = true;
    this.companyTypesService.getAllCompanyTypes(companyId).subscribe(
      (response) => {
        this.cmptypes = response;
        this.companyType = this.typeId;
        this.cmptypes.forEach((type: any) => {
          if (!type.parentid) {
            type.parentid = 'Top Level';
          }
        });
      },
      (error) => {
        this.spinner.hide();
        this.loader = false;
      }
    );
  }

  getTypeAttributes(typeId: any) {
    this.typeId = parseInt(typeId);
    this.index = 0;
    if (typeId != 0) {
      this.spinner.show();
      this.loader = true;
      this.companyAttributesServiceService.getTypeAttributes(typeId).subscribe(
        (response) => {
          this.spinner.hide();
          this.loader = false;
          this.typeAttributes = response;
          console.log(this.typeAttributes);
          this.typeAttributesLength = this.typeAttributes.length;
        },
        (error) => {
          this.spinner.hide();
          this.loader = false;
        }
      );
    }
  }

  getAttributeTypes() {
    this.spinner.show();
    this.loader = true;
    this.companyAttributesServiceService.getAllAttributeTypes().subscribe(
      (response) => {
        this.spinner.hide();
        this.loader = false;
        this.attributeTypes = response;
      },
      (error) => {
        this.spinner.hide();
        this.loader = false;
      }
    );
  }

  getSearchTypes(attributeTypeId: any) {
    if (attributeTypeId && attributeTypeId != 0 && attributeTypeId != 'null') {
      this.spinner.show();
      this.loader = true;
      this.companyAttributesServiceService
        .getAllSearchTypes(attributeTypeId)
        .subscribe(
          (response) => {
            this.spinner.hide();
            this.loader = false;
            this.searchTypes = response;
          },
          (error) => {
            this.spinner.hide();
            this.loader = false;
          }
        );
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

  saveAttributeListOrder(typeAttributes: any) {
    this.spinner.show();
    this.loader = true;
    this.itemAttributeService
      .updateTypeAttributesOrder(typeAttributes)
      .subscribe((response: any) => {
        this.spinner.hide();
        this.loader = false;
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
        searchtype: {
          attributesearchtypeid: this.model.searchtype ? this.model.searchtype.attributesearchtypeid : 0,
        },
        tooltip: this.model.tooltip,
        companyId: this.companyId,
        lastmodifiedby: this.username,
        type: {
          typeid: this.value,
          name: this.typeName,
        },
        moduleType: 'Company',
      };
      if (this.model.attributelistitemResource) {
        request.attributelistitemResource =
          this.model.attributelistitemResource;
      }
      this.spinner.show();
      this.loader = true;
      this.companyAttributesServiceService
        .createNewTypeAttribute(request)
        .subscribe(
          (response) => {
            this.spinner.hide();
            this.loader = false;
            this.index = 1;
            setTimeout(() => {
              this.index = 0;
            }, 7000);
            window.scroll(0, 0);
            this.typeAttributes.push(response);
            this.model = {
              type: {},
              attributetype: {
                attributetypeid: null,
              },
              searchtype: {
                attributesearchtypeid: 0,
              },
            };
            this.typeAttributesLength = this.typeAttributesLength + 1;
          },
          (error) => {
            this.spinner.hide();
            this.loader = false;
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

  onChange(newValue: number) {
    this.atts = [];
    console.log(newValue);
    this.companyType = newValue;
    this.typeId = newValue;
    for (let i = 1; i < 20; i++) {
      let compa = this.companyAttributesServiceService.getCompanyAttributess(
        i,
        this.companyId,
        this.typeId
      );
      if (compa === undefined || compa === null) {
        continue;
      }
      this.atts.push(compa);
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
    this.spinner.show();
    this.loader = true;
    var request = {
      attributelistitemResource: null,
      attributenameid: this.model.attributenameid,
      attributetype: {
        attributetypeid: this.model.attributetype ? this.model.attributetype.attributetypeid : 0,
      },
      displayorder: this.model.displayorder,
      ismanufacturer: false,
      isrequired: this.model.isrequired ? this.model.isrequired : false,
      isrequiredformatch: false,
      name: this.model.name,
      searchmodifier: '',
      companyId: this.companyId,
      lastmodifiedby: this.username,
      searchtype: {
        attributesearchtypeid:
          this.model.searchtype && this.model.searchtype.attributesearchtypeid != 'null'
            ? this.model.searchtype.attributesearchtypeid
            : 0,
      },
      tooltip: this.model.tooltip,
      type: {
        typeid: this.value,
        name: this.typeName,
      },
      moduleType: 'Company',
    };
    this.spinner.show();
    this.loader = true;
    if (this.model.attributelistitemResource) {
      request.attributelistitemResource = this.model.attributelistitemResource;
    }
    if (this.model.name && this.model.attributetype) {
      this.companyAttributesServiceService
        .updateTypeAttributes(request)
        .subscribe(
          (response) => {
            this.spinner.hide();
            this.loader = false;
            this.getTypeAttributes(this.typeId);
            this.index = 2;
            setTimeout(() => {
              this.index = 0;
            }, 7000);
            window.scroll(0, 0);
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
          },
          (error) => {
            this.spinner.hide();
            this.loader = false;
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
    this.getTypeAttributes(this.typeId);
    this.searchTypes = [];
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  closeFirstModal() {
    this.modalRef.hide();
    // this.modalRef = null;
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.spinner.show();
    this.loader = true;
    var moduleType = 'company';
    this.companyAttributesServiceService
      .removeCompanyAttributess(
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
          this.loader = false;
          this.modalRef.hide();
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
          this.loader = false;
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

  cancelCompanyAttributes() {
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
