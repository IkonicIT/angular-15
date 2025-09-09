import { Component, OnInit } from '@angular/core';
import { ItemTypesService } from '../../../services/Items/item-types.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { BroadcasterService } from '../../../services/broadcaster.service';

interface ItemTypeModel {
  typeId: number;
  name: string;
  description?: string;
  attributeSearchDisplay?: number;
  typeList?: any[];
  parentId?: { typeId: number };
  entityTypeId?: number;
  hostingFee?: number;
  typeMtbs?: number;
  typeSpareRatio?: number;
}

@Component({
  selector: 'app-edit-item-type',
  templateUrl: './edit-item-type.component.html',
  styleUrls: ['./edit-item-type.component.scss'],
})
export class EditItemTypeComponent implements OnInit {
  model: ItemTypeModel = {
    typeId: 0,
    name: '',
    parentId: { typeId: 0 },
  };

  itemTypeId: number;
  index: number = 0;
  companyId: number;
  globalCompany: any;
  companyName: string;
  itemTypes: any;

  value: number | null = null;
  items: TreeviewItem[] = [];
  config = TreeviewConfig.create({
    hasFilter: false,
    hasCollapseExpand: false,
  });

  userName: string | null;
  helpFlag: boolean = false;
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
    this.itemTypeId = Number(this.route.snapshot.params['id']);
    this.companyId = Number(this.route.snapshot.params['cmpId']);
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

  getItemType(typeId: number) {
    this.spinner.show();
    this.itemTypesService.getItemTypeDetails(String(typeId)).subscribe((response: any) => {
  this.spinner.hide();
  this.model = response as ItemTypeModel;
  if (!this.model.parentId) {
    this.model.parentId = { typeId: 0 };
  } else {
    this.value = this.model.parentId.typeId;
  }
});
  }

  getAllItemTypes() {
    this.itemTypes = this.broadcasterService.itemTypeHierarchy;
    if (this.itemTypes?.length > 0) {
      this.items = this.generateHierarchy(this.itemTypes);
    }
    this.getItemType(this.itemTypeId);
  }

  generateHierarchy(typeList: any[]): TreeviewItem[] {
    return typeList.map(
      (type) =>
        new TreeviewItem({
          text: type.name,
          value: type.typeId,
          collapsed: true,
          children: type.typeList?.length
            ? this.generateHierarchy(type.typeList)
            : [],
        })
    );
  }

  updateItemType() {
    if (this.model.name && this.value !== this.itemTypeId) {
      const request = {
        attributeSearchDisplay: this.model.attributeSearchDisplay ?? 0,
        description: this.model.description,
        entityTypeId: this.model.entityTypeId,
        hostingFee: this.model.hostingFee,
        isHidden: true,
        lastModifiedBy: this.userName,
        moduleType: 'itemType',
        name: this.model.name,
        parentId: { typeId: this.value ?? 0 },
        company: { companyId: this.companyId },
        typeList: this.model.typeList,
        typeId: this.itemTypeId,
        typeMtbs: this.model.typeMtbs ?? 0,
        typeSpareRatio: this.model.typeSpareRatio ?? 0.2,
      };

      this.spinner.show();
      this.itemTypesService.updateItemType(request).subscribe(() => {
        this.spinner.hide();
        this.index = 1;
        setTimeout(() => (this.index = 0), 7000);
        window.scroll(0, 0);
        this.getAllItemTypesWithHierarchy();
        this.router.navigate(['/items/types']);
      });
    } else {
      this.index = this.value === this.itemTypeId ? -2 : -1;
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

  onValueChange(value: number) {
    this.value = value;
  }

  print() {
    this.helpFlag = false;
    window.print();
  }

  help() {
    this.helpFlag = !this.helpFlag;
  }
}
