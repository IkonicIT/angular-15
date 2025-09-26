import { Component, OnInit } from '@angular/core';
import { ItemTypesService } from '../../../services/Items/item-types.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { BroadcasterService } from '../../../services/broadcaster.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-item-type',
  templateUrl: './add-item-type.component.html',
  styleUrls: ['./add-item-type.component.scss'],
})
export class AddItemTypeComponent implements OnInit {
  model: any = {
    parentId: { typeId: 0 },
    typeSpareRatio: 0.2,
  };
  index = 0;
  companyId = 0;
  globalCompany: any = {};
  itemTypes: any;
  companyName = '';
  value: number = 0;
  items: TreeviewItem[] = [];
  config = TreeviewConfig.create({ hasFilter: false, hasCollapseExpand: false });
  userName: string | null = '';
  helpFlag = false;
  dismissible = true;

  constructor(
    private itemTypesService: ItemTypesService,
    private companyManagementService: CompanyManagementService,
    private spinner: NgxSpinnerService,
    private broadcasterService: BroadcasterService,
    private router: Router
  ) {
    this.globalCompany = this.companyManagementService.getGlobalCompany() ?? {};
    this.companyId = this.globalCompany?.companyId ?? 0;
    this.companyName = this.globalCompany?.name ?? '';

    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value?.companyId ?? 0;
      this.companyName = value?.name ?? '';
    });

    this.getAllLocTypes();
  }

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('userName');
  }

  getAllLocTypes(): void {
    this.itemTypes = this.broadcasterService.itemTypeHierarchy ?? [];
    if (this.itemTypes.length > 0) {
      this.items = this.generateHierarchy(this.itemTypes);
    }
  }

  generateHierarchy(typeList: any[]): TreeviewItem[] {
    return typeList.map((type) => {
      const children = type.typeList?.length > 0 ? this.generateHierarchy(type.typeList) : [];
      return new TreeviewItem({
        text: type.name,
        value: type.typeId,
        collapsed: true,
        children,
      });
    });
  }

  onValueChange(value: number): void {
    this.value = value;
  }

  saveItemType(): void {
    if (!this.model.name?.trim()) {
      this.index = -1;
      window.scroll(0, 0);
      return;
    }

    const request = {
      attributeSearchDisplay: this.model.attributeSearchDisplay ?? 0,
      company: { companyId: this.companyId },
      description: this.model.description ?? '',
      entityTypeId: 0,
      hostingFee: this.model.hostingFee ?? 0,
      isHidden: true,
      lastModifiedBy: this.userName ?? '',
      moduleType: 'itemType',
      name: this.model.name,
      parentId: { typeId: this.value ?? 0 },
      typeId: 0,
      typeMtbs: this.model.typeMtbs ?? 0,
      typeSpareRatio: this.model.typeSpareRatio ?? 0.2,
    };

    this.spinner.show();
    this.itemTypesService.saveItemType(request).subscribe(() => {
      this.spinner.hide();
      this.index = 1;
      setTimeout(() => (this.index = 0), 7000);
      window.scroll(0, 0);
      this.getAllItemTypesWithHierarchy();
      this.router.navigate(['/items/types']);
    });
  }

  getAllItemTypesWithHierarchy(): void {
    this.spinner.show();
    this.itemTypesService.getAllItemTypesWithHierarchy(this.companyId).subscribe((response) => {
      this.spinner.hide();
      this.broadcasterService.itemTypeHierarchy = response ?? [];
    });
  }

  print(): void {
    this.helpFlag = false;
    window.print();
  }

  help(): void {
    this.helpFlag = !this.helpFlag;
  }
}
