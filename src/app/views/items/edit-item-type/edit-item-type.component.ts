import { Component, OnInit } from '@angular/core';
import { ItemTypesService } from '../../../services/Items/item-types.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { BroadcasterService } from '../../../services/broadcaster.service';

@Component({
  selector: 'app-edit-item-type',
  templateUrl: './edit-item-type.component.html',
  styleUrls: ['./edit-item-type.component.scss'],
})
export class EditItemTypeComponent implements OnInit {
  model: any = {
    parentId: {
      typeId: 0,
    },
  };
  itemTypeId: any;
  index: number;
  companyId: any;
  globalCompany: any;
  companyName: any;
  itemTypes: any;

  value: any;
  items: TreeviewItem[];
  config = TreeviewConfig.create({
    hasFilter: false,
    hasCollapseExpand: false,
  });
  userName: any;
  helpFlag: any = false;
  dismissible = true;
  loader = false;
  constructor(
    private itemTypesService: ItemTypesService,
    private companyManagementService: CompanyManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private broadcasterService: BroadcasterService
  ) {
    this.itemTypeId = route.snapshot.params['id'];
    this.companyId = route.snapshot.params['cmpId'];
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyName = this.globalCompany.name;
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value.companyId;
      this.companyName = this.globalCompany.name;
    });
    this.getAllItemTypes();
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName');
  }

  getItemType(typeId: string) {
    this.spinner.show();

    this.itemTypesService.getItemTypeDetails(typeId).subscribe((response) => {
      this.spinner.hide();

      console.log(response);
      this.model = response;
      if (!this.model.parentId) {
        this.model.parentId = {
          typeId: 0,
        };
      } else {
        this.value = this.model.parentId.typeId;
      }
    });
  }

  getAllItemTypes() {
    this.itemTypes = this.broadcasterService.itemTypeHierarchy;
    var self = this;
    if (this.itemTypes && this.itemTypes.length > 0) {
      self.items = this.generateHierarchy(this.itemTypes);
    }

    this.getItemType(this.itemTypeId);
  }

  generateHierarchy(typeList: any[]) {
    var items: TreeviewItem[] = [];
    typeList.forEach((type) => {
      var children: TreeviewItem[] = [];
      if (type.typeList && type.typeList.length > 0) {
        children = this.generateHierarchy(type.typeList); //children.push({text : childLoc.name, value: childLoc.locationId})
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

  updateItemType() {
    if (this.model.name && this.value != this.itemTypeId) {
      var request = {
        attributeSearchDisplay: this.model.attributeSearchDisplay
          ? this.model.attributeSearchDisplay
          : 0,
        description: this.model.description,
        entityTypeId: this.model.entityTypeId,
        hostingFee: this.model.hostingFee,
        isHidden: true,
        lastModifiedBy: this.userName,
        moduleType: 'itemType',
        name: this.model.name,
        parentId: {
          typeId: this.value ? this.value : 0,
        },
        company: {
          companyId: this.companyId,
        },
        typeList: this.model.typeList,
        typeId: this.itemTypeId,
        typeMtbs: this.model.typemtbs ? this.model.typemtbs : 0,
        typeSpareRatio: this.model.typeSpareRatio
          ? this.model.typeSpareRatio
          : 0.2,
      };
      this.spinner.show();

      this.itemTypesService.updateItemType(request).subscribe((response) => {
        this.spinner.hide();

        this.index = 1;
        setTimeout(() => {
          this.index = 0;
        }, 7000);
        window.scroll(0, 0);
        this.getAllItemTypesWithHierarchy();
        this.router.navigate(['/items/types']);
      });
    } else {
      this.index = -1;
      if (this.value == this.itemTypeId) {
        this.index = -2;
      }
      window.scroll(0, 0);
    }
  }

  getAllItemTypesWithHierarchy() {
    this.spinner.show();

    this.itemTypesService
      .getAllItemTypesWithHierarchy(this.companyId)
      .subscribe((response) => {
        this.spinner.hide();

        this.broadcasterService.itemTypeHierarchy = response;
      });
  }

  onValueChange(value: any) {
    this.value = value;
    console.log(value);
  }

  print() {
    this.helpFlag = false;
    window.print();
  }

  help() {
    this.helpFlag = !this.helpFlag;
  }
}
