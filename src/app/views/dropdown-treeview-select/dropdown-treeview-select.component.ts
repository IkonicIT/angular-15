import { Component, Input, Output, EventEmitter, ViewChild, OnChanges } from '@angular/core';
import { TreeviewConfig, TreeviewItem, DropdownTreeviewComponent, TreeviewI18n, TreeviewHelper, 
         DropdownDirective} from 'ngx-treeview';
import { DropdownTreeviewSelectI18n } from './dropdown-treeview-select-i18n';
import { isNil } from 'lodash';

@Component({
  selector: 'app-dropdown-treeview-select',
  templateUrl: './dropdown-treeview-select.component.html',
  styleUrls: ['./dropdown-treeview-select.component.scss'],
  providers: [{ provide: TreeviewI18n, useClass: DropdownTreeviewSelectI18n }],
})
export class DropdownTreeviewSelectComponent implements OnChanges {
  @Input() config: TreeviewConfig;
  @Input() items: TreeviewItem[];
  @Input() value: any;
  @Output() valueChange = new EventEmitter<any>();

  @ViewChild(DropdownTreeviewComponent, { static: false }) dropdownTreeviewComponent: DropdownTreeviewComponent;
  dropdownDirective: DropdownDirective;
  filterText: string;
  private dropdownTreeviewSelectI18n: DropdownTreeviewSelectI18n;

  constructor(public i18n: TreeviewI18n) {
    this.config = TreeviewConfig.create({
      hasAllCheckBox: true,
      hasCollapseExpand: true,
      hasFilter: true,
      maxHeight: 200,
    });
    this.dropdownTreeviewSelectI18n = i18n as DropdownTreeviewSelectI18n;
  }

  ngOnInit() {
    console.log(`tree view ngonit()`, this.items);
    if (this.items && this.items.length > 0) {
    }
  }

  ngOnChanges(): void {
    this.updateSelectedItem();
  }

  select(item: TreeviewItem): void {
    this.selectItem(item);
  }

  private updateSelectedItem() {
    if (!isNil(this.items)) {
      const selectedItem = TreeviewHelper.findItemInList(this.items, this.value);
      if (selectedItem) {
        this.selectItem(selectedItem);
      } else {
        this.selectAll();
      }
    }
  }

  private selectItem(item: TreeviewItem): void {
    if (this.dropdownTreeviewSelectI18n.selectedItem !== item) {
      this.dropdownTreeviewSelectI18n.selectedItem = item;
      if (this.dropdownTreeviewComponent) {
        this.dropdownTreeviewComponent.onSelectedChange([item]);
      }

      if (item) {
        if (this.value !== item.value) {
          this.value = item.value;
          this.valueChange.emit(item.value);
        }
      }
    }
  }

  private selectAll() {
    if (this.dropdownTreeviewComponent) {
      const allItem = this.dropdownTreeviewComponent.treeviewComponent.allItem;
      this.selectItem(allItem);
    }
  }
}
