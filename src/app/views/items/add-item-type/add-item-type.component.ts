import { Component, OnInit } from '@angular/core';
import { ItemTypesService } from '../../../services/Items/item-types.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { BroadcasterService } from '../../../services/broadcaster.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-item-type',
  templateUrl: './add-item-type.component.html',
  styleUrls: ['./add-item-type.component.scss'],
})
export class AddItemTypeComponent implements OnInit {
  model: any = {
    parentid: {
      typeid: 0,
    },
    typespareratio: 0.2,
  };
  index: number = 0;
  companyId: number;
  globalCompany: any = {};
  itemTypes: any;
  companyName: any;

  value: any;
  items: TreeviewItem[];
  config = TreeviewConfig.create({
    hasFilter: false,
    hasCollapseExpand: false,
  });
  userName: any;
  router: Router;
  helpFlag: any = false;
  dismissible = true;

  constructor(
    private itemTypesService: ItemTypesService,
    private companyManagementService: CompanyManagementService,
    private spinner: NgxSpinnerService,
    private broadcasterService: BroadcasterService,
    router: Router
  ) {
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyId = this.globalCompany.companyid;
    this.companyName = this.globalCompany.name;
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value.companyid;
      this.companyName = this.globalCompany.name;
    });
    this.router = router;
    this.getAllLocTypes();
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName');
  }

  getAllLocTypes() {
    this.itemTypes = this.broadcasterService.itemTypeHierarchy;
    var self = this;
    if (this.itemTypes && this.itemTypes.length > 0) {
      self.items = this.generateHierarchy(this.itemTypes);
    }
  }

  generateHierarchy(typeList: any[]) {
    var items: TreeviewItem[] = [];
    typeList.forEach((type) => {
      var children: TreeviewItem[] = [];
      if (type.typeList && type.typeList.length > 0) {
        children = this.generateHierarchy(type.typeList); //children.push({text : childLoc.name, value: childLoc.locationid})
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
  }

  saveItemType() {
    if (this.model.name) {
      var request = {
        attributesearchdisplay: this.model.attributesearchdisplay
          ? this.model.attributesearchdisplay
          : 0,
        company: {
          companyid: this.companyId,
        },
        description: this.model.description,
        entitytypeid: 0,
        hostingfee: this.model.hostingFee ? this.model.hostingFee : 0,
        ishidden: true,
        lastmodifiedby: this.userName,
        moduleType: 'itemtype',
        name: this.model.name,
        parentid: {
          typeid: this.value ? this.value : 0,
        },
        typeid: 0,
        typemtbs: this.model.typemtbs ? this.model.typemtbs : 0,
        typespareratio: this.model.typespareratio
          ? this.model.typespareratio
          : 0.2,
      };
      this.spinner.show();
      this.itemTypesService.saveItemType(request).subscribe((response) => {
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

  print() {
    this.helpFlag = false;
    window.print();
  }

  help() {
    this.helpFlag = !this.helpFlag;
  }
}
